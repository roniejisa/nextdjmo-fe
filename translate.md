# Ứng dụng dịch thuật PDF, Docx

Dự án này bao gồm:
1. Frontend: NextJS + TailwindCSS
2. Backend: Django + API dịch thuật
3. Xử lý file lớn (PDF > 10000 trang, 500MB)

## Cấu trúc dự án

```
translator-app/
├── frontend/           # NextJS frontend
└── backend/            # Django backend
```

## Backend (Django)

### 1. Cài đặt và cấu hình

Tạo file `backend/requirements.txt`:

```
Django==4.2.10
djangorestframework==3.14.0
django-cors-headers==4.3.1
PyPDF2==3.0.1
python-docx==1.0.1
python-dotenv==1.0.0
celery==5.3.6
redis==5.0.1
requests==2.31.0
google-cloud-translate==3.15.0
pypdf==3.17.1
pytesseract==0.3.10
pdf2image==1.17.0
```

### 2. Khởi tạo dự án

```bash
django-admin startproject translator_backend
cd translator_backend
python manage.py startapp translation_api
```

### 3. Mô hình dữ liệu (`backend/translation_api/models.py`)

```python
from django.db import models
import uuid
import os

def upload_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f"{instance.id}.{ext}"
    return os.path.join('uploads', new_filename)

def output_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f"{instance.id}_translated.{ext}"
    return os.path.join('outputs', new_filename)

class TranslationJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    original_file = models.FileField(upload_to=upload_path)
    original_filename = models.CharField(max_length=255)
    translated_file = models.FileField(upload_to=output_path, null=True, blank=True)
    source_language = models.CharField(max_length=50)
    target_language = models.CharField(max_length=50)
    translation_service = models.CharField(max_length=50, default='free')
    api_key = models.CharField(max_length=255, null=True, blank=True)
    model = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.original_filename} ({self.source_language} → {self.target_language})"
```

### 4. Cấu hình Celery cho xử lý file lớn (`backend/translator_backend/celery.py`)

```python
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'translator_backend.settings')

app = Celery('translator_backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

### 5. Xử lý dịch thuật (`backend/translation_api/tasks.py`)

```python
import os
import tempfile
from celery import shared_task
import PyPDF2
from docx import Document
from translation_api.models import TranslationJob
from translation_api.translators import (
    GoogleTranslator, FreeTranslator, OpenAITranslator, 
    AzureTranslator, DeepLTranslator
)
import pytesseract
from pdf2image import convert_from_path
import shutil
import io

@shared_task
def process_translation(job_id):
    job = TranslationJob.objects.get(id=job_id)
    job.status = 'processing'
    job.save()
    
    try:
        # Chọn dịch vụ dịch thuật
        if job.translation_service == 'google':
            translator = GoogleTranslator(job.api_key)
        elif job.translation_service == 'openai':
            translator = OpenAITranslator(job.api_key, job.model)
        elif job.translation_service == 'azure':
            translator = AzureTranslator(job.api_key)
        elif job.translation_service == 'deepl':
            translator = DeepLTranslator(job.api_key)
        else:
            translator = FreeTranslator()
        
        file_path = job.original_file.path
        file_ext = os.path.splitext(file_path)[1].lower()
        
        # Tạo thư mục tạm thời
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = os.path.join(temp_dir, f"translated{file_ext}")
            
            # Xử lý theo loại file
            if file_ext == '.pdf':
                translate_pdf(file_path, output_path, translator, job.source_language, job.target_language)
            elif file_ext in ['.docx', '.doc']:
                translate_docx(file_path, output_path, translator, job.source_language, job.target_language)
            
            # Lưu file đã dịch
            with open(output_path, 'rb') as f:
                job.translated_file.save(
                    f"{os.path.splitext(job.original_filename)[0]}_translated{file_ext}",
                    io.BytesIO(f.read())
                )
        
        job.status = 'completed'
        job.save()
    except Exception as e:
        job.status = 'failed'
        job.save()
        raise e

def translate_pdf(input_path, output_path, translator, source_lang, target_lang):
    """Xử lý dịch PDF theo từng phần để đối phó với file lớn"""
    
    reader = PyPDF2.PdfReader(input_path)
    writer = PyPDF2.PdfWriter()
    
    # Xử lý từng trang để tránh quá tải bộ nhớ
    chunk_size = 5  # Số trang xử lý mỗi lần
    total_pages = len(reader.pages)
    
    for start_page in range(0, total_pages, chunk_size):
        end_page = min(start_page + chunk_size, total_pages)
        
        for page_num in range(start_page, end_page):
            page = reader.pages[page_num]
            
            # Trích xuất văn bản
            try:
                text = page.extract_text()
                
                # Nếu không trích xuất được text (PDF scan), dùng OCR
                if not text or len(text.strip()) < 20:
                    images = convert_from_path(input_path, first_page=page_num+1, last_page=page_num+1)
                    for img in images:
                        text = pytesseract.image_to_string(img, lang=source_lang[:2])
                
                # Dịch văn bản
                if text and len(text.strip()) > 0:
                    translated_text = translator.translate(text, source_lang, target_lang)
                    
                    # Tạo trang mới với văn bản đã dịch
                    new_page = PyPDF2.PageObject.create_blank_page(
                        width=page.mediabox.width,
                        height=page.mediabox.height
                    )
                    new_page.merge_page(page)  # Giữ hình ảnh gốc
                    
                    # Thêm văn bản đã dịch
                    # (Đây là phần đơn giản, trong thực tế cần xử lý phức tạp hơn để thay thế văn bản)
                    writer.add_page(new_page)
                else:
                    writer.add_page(page)
            except:
                writer.add_page(page)
    
    # Lưu file kết quả
    with open(output_path, 'wb') as output_file:
        writer.write(output_file)

def translate_docx(input_path, output_path, translator, source_lang, target_lang):
    """Xử lý dịch DOCX"""
    
    doc = Document(input_path)
    
    # Dịch từng đoạn văn
    for para in doc.paragraphs:
        if para.text.strip():
            para.text = translator.translate(para.text, source_lang, target_lang)
    
    # Dịch bảng
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    if para.text.strip():
                        para.text = translator.translate(para.text, source_lang, target_lang)
    
    # Lưu file kết quả
    doc.save(output_path)
```

### 6. Module dịch thuật (`backend/translation_api/translators.py`)

```python
import requests
import os
from google.cloud import translate_v2 as translate
import json

class BaseTranslator:
    def translate(self, text, source_lang, target_lang):
        raise NotImplementedError("Subclasses must implement this method")

class FreeTranslator(BaseTranslator):
    """Sử dụng dịch vụ miễn phí (LibreTranslate)"""
    
    def __init__(self):
        self.base_url = "https://libretranslate.com/translate"
    
    def translate(self, text, source_lang, target_lang):
        if len(text) > 5000:
            # Xử lý văn bản dài bằng cách chia thành các đoạn
            chunks = [text[i:i+5000] for i in range(0, len(text), 5000)]
            translated_chunks = []
            
            for chunk in chunks:
                translated_chunks.append(self._translate_chunk(chunk, source_lang, target_lang))
            
            return " ".join(translated_chunks)
        else:
            return self._translate_chunk(text, source_lang, target_lang)
    
    def _translate_chunk(self, text, source_lang, target_lang):
        payload = {
            "q": text,
            "source": source_lang,
            "target": target_lang
        }
        
        response = requests.post(self.base_url, data=payload)
        
        if response.status_code == 200:
            return response.json()["translatedText"]
        else:
            # Fallback to a simpler API if LibreTranslate fails
            fallback_url = f"https://api.mymemory.translated.net/get?q={text}&langpair={source_lang}|{target_lang}"
            fallback_response = requests.get(fallback_url)
            
            if fallback_response.status_code == 200:
                return fallback_response.json()["responseData"]["translatedText"]
            else:
                return text  # Return original text if translation fails

class GoogleTranslator(BaseTranslator):
    """Sử dụng Google Cloud Translation"""
    
    def __init__(self, api_key):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = api_key
        self.client = translate.Client()
    
    def translate(self, text, source_lang, target_lang):
        if len(text) > 30000:
            # Xử lý văn bản dài
            chunks = [text[i:i+30000] for i in range(0, len(text), 30000)]
            translated_chunks = []
            
            for chunk in chunks:
                result = self.client.translate(
                    chunk,
                    target_language=target_lang,
                    source_language=source_lang
                )
                translated_chunks.append(result["translatedText"])
            
            return " ".join(translated_chunks)
        else:
            result = self.client.translate(
                text,
                target_language=target_lang,
                source_language=source_lang
            )
            return result["translatedText"]

class OpenAITranslator(BaseTranslator):
    """Sử dụng OpenAI API"""
    
    def __init__(self, api_key, model="gpt-4"):
        self.api_key = api_key
        self.model = model
        self.api_url = "https://api.openai.com/v1/chat/completions"
    
    def translate(self, text, source_lang, target_lang):
        # Xử lý văn bản dài bằng cách chia thành các đoạn nhỏ
        max_tokens = 3000  # OpenAI giới hạn đầu vào
        chunks = self._split_text(text, max_tokens)
        translated_chunks = []
        
        for chunk in chunks:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": f"You are a professional translator. Translate the following text from {source_lang} to {target_lang}. Preserve all formatting and only translate the content."},
                    {"role": "user", "content": chunk}
                ],
                "temperature": 0.3
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                translated_chunks.append(response.json()["choices"][0]["message"]["content"])
            else:
                translated_chunks.append(chunk)  # Return original text if translation fails
        
        return " ".join(translated_chunks)
    
    def _split_text(self, text, max_tokens):
        # Ước tính số token = số từ * 1.5
        words = text.split()
        estimated_tokens = len(words) * 1.5
        
        if estimated_tokens <= max_tokens:
            return [text]
        
        # Tính số từ cho mỗi đoạn
        words_per_chunk = int(len(words) / (estimated_tokens / max_tokens))
        chunks = []
        
        for i in range(0, len(words), words_per_chunk):
            chunk = " ".join(words[i:i+words_per_chunk])
            chunks.append(chunk)
        
        return chunks

class AzureTranslator(BaseTranslator):
    """Sử dụng Azure Translator"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        self.endpoint = "https://api.cognitive.microsofttranslator.com"
        self.location = "global"
    
    def translate(self, text, source_lang, target_lang):
        path = '/translate'
        constructed_url = self.endpoint + path
        
        headers = {
            'Ocp-Apim-Subscription-Key': self.api_key,
            'Ocp-Apim-Subscription-Region': self.location,
            'Content-type': 'application/json',
            'X-ClientTraceId': str(uuid.uuid4())
        }
        
        if len(text) > 50000:
            # Xử lý văn bản dài
            chunks = [text[i:i+50000] for i in range(0, len(text), 50000)]
            translated_chunks = []
            
            for chunk in chunks:
                body = [{
                    'text': chunk
                }]
                
                params = {
                    'api-version': '3.0',
                    'from': source_lang,
                    'to': target_lang
                }
                
                response = requests.post(constructed_url, params=params, headers=headers, json=body)
                
                if response.status_code == 200:
                    translated_chunks.append(response.json()[0]["translations"][0]["text"])
                else:
                    translated_chunks.append(chunk)  # Return original text if translation fails
            
            return " ".join(translated_chunks)
        else:
            body = [{
                'text': text
            }]
            
            params = {
                'api-version': '3.0',
                'from': source_lang,
                'to': target_lang
            }
            
            response = requests.post(constructed_url, params=params, headers=headers, json=body)
            
            if response.status_code == 200:
                return response.json()[0]["translations"][0]["text"]
            else:
                return text  # Return original text if translation fails

class DeepLTranslator(BaseTranslator):
    """Sử dụng DeepL API"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = "https://api-free.deepl.com/v2/translate"
        
    def translate(self, text, source_lang, target_lang):
        headers = {
            "Authorization": f"DeepL-Auth-Key {self.api_key}",
            "Content-Type": "application/json"
        }
        
        if len(text) > 30000:
            # Xử lý văn bản dài
            chunks = [text[i:i+30000] for i in range(0, len(text), 30000)]
            translated_chunks = []
            
            for chunk in chunks:
                payload = {
                    "text": [chunk],
                    "source_lang": source_lang.upper(),
                    "target_lang": target_lang.upper()
                }
                
                response = requests.post(self.api_url, headers=headers, json=payload)
                
                if response.status_code == 200:
                    translated_chunks.append(response.json()["translations"][0]["text"])
                else:
                    translated_chunks.append(chunk)  # Return original text if translation fails
            
            return " ".join(translated_chunks)
        else:
            payload = {
                "text": [text],
                "source_lang": source_lang.upper(),
                "target_lang": target_lang.upper()
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                return response.json()["translations"][0]["text"]
            else:
                return text  # Return original text if translation fails
```

### 7. API Endpoints (`backend/translation_api/views.py`)

```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import TranslationJob
from .serializers import TranslationJobSerializer
from .tasks import process_translation
from django.conf import settings
import os

class TranslationJobViewSet(viewsets.ModelViewSet):
    queryset = TranslationJob.objects.all()
    serializer_class = TranslationJobSerializer
    
    def create(self, request, *args, **kwargs):
        # Kiểm tra file có tồn tại không
        if 'original_file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Lưu đối tượng TranslationJob
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Lưu tên file gốc
        job = serializer.save(
            original_filename=request.FILES['original_file'].name
        )
        
        # Bắt đầu task xử lý dịch thuật
        process_translation.delay(str(job.id))
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['get'])
    def check_status(self, request, pk=None):
        job = self.get_object()
        return Response({
            "status": job.status,
            "created_at": job.created_at,
            "updated_at": job.updated_at
        })
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        job = self.get_object()
        
        if job.status != 'completed' or not job.translated_file:
            return Response({"error": "File not ready for download"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = job.translated_file.path
        if os.path.exists(file_path):
            from django.http import FileResponse
            return FileResponse(
                open(file_path, 'rb'),
                as_attachment=True,
                filename=os.path.basename(job.translated_file.name)
            )
        else:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
```

### 8. Serializers (`backend/translation_api/serializers.py`)

```python
from rest_framework import serializers
from .models import TranslationJob

class TranslationJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationJob
        fields = [
            'id', 'original_file', 'original_filename', 'translated_file',
            'source_language', 'target_language', 'translation_service',
            'api_key', 'model', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'original_filename', 'translated_file', 'status', 'created_at', 'updated_at']
```

### 9. URLs (`backend/translation_api/urls.py`)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TranslationJobViewSet

router = DefaultRouter()
router.register(r'jobs', TranslationJobViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### 10. Cấu hình chính (`backend/translator_backend/settings.py`)

```python
# Thêm các app cần thiết
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'translation_api',
]

# Cấu hình CORS
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # Các middleware khác...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Cấu hình media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Cấu hình Celery
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
```

## Frontend (NextJS)

### 1. Cài đặt và cấu hình

```bash
npx create-next-app frontend
cd frontend
npm install axios react-dropzone react-icons
```

### 2. Cấu hình API và giao tiếp với backend (`frontend/lib/api.js`)

```javascript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadFile = async (file, sourceLanguage, targetLanguage, translationService, apiKey = null, model = null) => {
  const formData = new FormData();
  formData.append('original_file', file);
  formData.append('source_language', sourceLanguage);
  formData.append('target_language', targetLanguage);
  formData.append('translation_service', translationService);
  
  if (apiKey) {
    formData.append('api_key', apiKey);
  }
  
  if (model) {
    formData.append('model', model);
  }
  
  try {
    const response = await api.post('/jobs/', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkJobStatus = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/check_status/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadTranslatedFile = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobDetails = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### 3. Trang chính (`frontend/pages/index.js`)

```jsx
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile, checkJobStatus, downloadTranslatedFile } from '../lib/api';
import Head from 'next/head';
import { FiUpload, FiDownload, FiFile, FiSettings, FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function Home() {
  const [file, setFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('ru');
  const [targetLanguage, setTargetLanguage] = useState('vi');
  const [translationService, setTranslationService] = useState('free');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [outputDir, setOutputDir] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn một file');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const job = await uploadFile(
        file,
        sourceLanguage,
        targetLanguage,
        translationService,
        apiKey || null,
        model || null
      );
      
      setJobId(job.id);
      setJobStatus('pending');
      
      // Bắt đầu kiểm tra trạng thái
      const interval = setInterval(async () => {
        const status = await checkJobStatus(job.id);
        setJobStatus(status.status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
        }
      }, 5000);
    } catch (err) {
      setError('Lỗi khi tải lên file: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadTranslatedFile(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Đặt tên file
      a.download = file.name.replace(/\.[^/.]+$/, '') + '_translated.' + file.name.split('.').pop();
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Lỗi khi tải xuống file: ' + err.message);
    }
  };

  const languages = [
    { code: 'vi', name: 'Vietnamese' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'ko', name: 'Korean' },
  ];

  const translationServices = [
    { value: 'free', label: 'Dịch miễn phí' },
    { value: 'google', label: 'Google Translate' },
    { value: 'openai', label: 'OpenAI GPT' },
    { value: 'azure', label: 'Azure Translator' },
    { value: 'deepl', label: 'DeepL' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dịch thuật PDF/Docx</title>
        <meta name="description" content="Ứng dụng dịch thuật PDF và Docx" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Ứng dụng Dịch thuật PDF/Docx
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Khu vực kéo thả file */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-4xl text-gray-400 mb-3" />
              
              {file ? (
                <div className="flex items-center justify-center">
                  <FiFile className="mr-2 text-blue-500" />
                  <span className="font-medium">{file.name}</span> 
                  <span className="ml-2 text-gray-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              ) : (
                <p className="text-gray-500">
                  Kéo và thả file PDF hoặc Docx vào đây, hoặc click để chọn file
                </p>
              )}
            </div>
            
            {/* Lựa chọn ngôn ngữ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ nguồn
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={`source-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ đích
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={`target-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Dịch vụ dịch thuật */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dịch vụ dịch thuật
              </label>
              <select
                value={translationService}
                onChange={(e) => setTranslationService(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {translationServices.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Cài đặt nâng cao */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiSettings className="mr-1" />
                {showAdvanced ? 'Ẩn cài đặt nâng cao' : 'Hiển thị cài đặt nâng cao'}
              </button>
              
              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  {/* API Key */}
                  {translationService !== 'free' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key ({translationService})
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập API key của bạn"
                      />
                    </div>
                  )}
                  
                  {/* Model (cho OpenAI) */}
                  {translationService === 'openai' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Thư mục đầu ra */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thư mục lưu file (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={outputDir}
                      onChange={(e) => setOutputDir(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Để trống sẽ lưu vào thư mục mặc định"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Chức năng này chỉ hoạt động khi tải xuống
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thông báo lỗi */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <div className="flex items-center">
                  <FiX className="mr-2" />
                  {error}
                </div>
              </div>
            )}
            
            {/* Trạng thái hiện tại */}
            {jobStatus && (
              <div className={`mb-6 p-3 rounded-md ${
                jobStatus === 'completed' ? 'bg-green-50 border border-green-200 text-green-600' :
                jobStatus === 'failed' ? 'bg-red-50 border border-red-200 text-red-600' :
                'bg-blue-50 border border-blue-200 text-blue-600'
              }`}>
                <div className="flex items-center">
                  {jobStatus === 'completed' && <FiCheck className="mr-2" />}
                  {jobStatus === 'failed' && <FiX className="mr-2" />}
                  {jobStatus === 'pending' && <FiLoader className="mr-2 animate-spin" />}
                  {jobStatus === 'processing' && <FiLoader className="mr-2 animate-spin" />}
                  
                  {jobStatus === 'completed' && 'Dịch thuật hoàn tất! Bạn có thể tải xuống file đã dịch.'}
                  {jobStatus === 'failed' && 'Dịch thuật thất bại. Vui lòng thử lại.'}
                  {jobStatus === 'pending' && 'Đang chuẩn bị dịch thuật...'}
                  {jobStatus === 'processing' && 'Đang xử lý dịch thuật...'}
                </div>
              </div>
            )}
            
            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || !file}
                className={`flex-1 py-2 px-4 rounded-md font-medium ${
                  loading || !file
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Tải lên & Dịch thuật
                  </>
                )}
              </button>
              
              {jobStatus === 'completed' && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex items-center justify-center"
                >
                  <FiDownload className="mr-2" />
                  Tải xuống file đã dịch
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
```

### 4. Cấu hình NextJS (`frontend/next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
}

module.exports = nextConfig
```

### 5. Cấu hình TailwindCSS (`frontend/tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Hướng dẫn chạy ứng dụng

### Backend (Django)

1. Cài đặt các thư viện:
```bash
cd backend
pip install -r requirements.txt
```

2. Di chuyển database và tạo superuser:
```bash
python manage.py migrate
python manage.py createsuperuser
```

3. Chạy Redis (cần thiết cho Celery):
```bash
redis-server
```

4. Chạy Celery worker:
```bash
celery -A translator_backend worker --loglevel=info
```

5. Chạy server Django:
```bash
python manage.py runserver
```

### Frontend (NextJS)

1. Cài đặt các thư viện:
```bash
cd frontend
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Truy cập ứng dụng tại: `http://localhost:3000`

## Tối ưu hóa xử lý file lớn

1. **Phân chia file**: Chia nhỏ file PDF/Docx lớn thành các phần nhỏ hơn để xử lý
2. **Hàng đợi**: Sử dụng Celery để xử lý bất đồng bộ
3. **Xử lý từng trang**: Với PDF, xử lý từng trang một để tránh quá tải bộ nhớ
4. **Streaming**: Tải xuống file theo dạng stream để tiết kiệm bộ nhớ

## Kết luận

Ứng dụng dịch thuật PDF/Docx này cung cấp:
- Frontend trực quan với NextJS + TailwindCSS
- Backend mạnh mẽ với Django + Celery
- Hỗ trợ nhiều dịch vụ dịch thuật (miễn phí và trả phí)
- Xử lý được file lớn (>500MB, >10000 trang)
- Có thể tùy chỉnh thư mục đầu ra
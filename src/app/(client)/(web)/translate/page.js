"use client"
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile, checkJobStatus, downloadTranslatedFile } from './action';
import Head from 'next/head';
import { FiUpload, FiDownload, FiFile, FiSettings, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import './style.css'
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

  const handleSubmit = async (form) => {
    if (!file) {
      setError('Vui lòng chọn một file');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const job = await uploadFile(
        form,
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
          <form action={handleSubmit}>
            {/* Khu vực kéo thả file */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} name='original_file' />
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
                  name='source_language'
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
                  name="target_language"
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
                name="translation_service"
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
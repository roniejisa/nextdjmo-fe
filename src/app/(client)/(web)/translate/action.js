"use server"
import { httpClient } from "@/utils/http";

export const uploadFile = async (formData, sourceLanguage, targetLanguage, translationService, apiKey = null, model = null) => {
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
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL+'jobs/',{}, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkJobStatus = async (jobId) => {
  try {
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL+`jobs/${jobId}/check_status/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadTranslatedFile = async (jobId) => {
  try {
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL+`jobs/${jobId}/download/`,{}, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobDetails = async (jobId) => {
  try {
    const response = await httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL+`jobs/${jobId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
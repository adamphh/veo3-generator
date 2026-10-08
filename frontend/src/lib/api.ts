import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductData {
  title: string;
  price_original?: string;
  price_sale?: string;
  discount_percentage?: string;
  sold_count?: string;
  rating_star?: string;
  rating_count?: string;
  description: string;
  image_urls: string[];
  freeship_tag?: boolean;
  flash_sale_tag?: boolean;
}

export interface VideoScript {
  video_id: number;
  angle_title: string;
  angle_type: string;
  hook_text_overlay: string;
  voiceover_script: string;
  voice_gender: string;
  voice_accent: string;
  veo_prompts: any[];
  seo_title: string;
  seo_description: string;
  seo_tags: string[];
}

export interface BatchScriptResponse {
  product_title: string;
  niche: string;
  scripts: VideoScript[];
}

export const scrapeProduct = async (url: string, niche: string = 'gia_dung') => {
  const resp = await apiClient.post('/scrape-product', { url, niche });
  return resp.data;
};

export const generateScripts = async (product: ProductData, niche: string) => {
  const resp = await apiClient.post('/generate-scripts', product, { params: { niche } });
  return resp.data;
};

export const renderBatchVideos = async (data: {
  product_title: string;
  image_url?: string;
  scripts: VideoScript[];
  social_proof_text?: string;
}) => {
  const resp = await apiClient.post('/render-batch-videos', data);
  return resp.data;
};

export const getRenderStatus = async (taskId: string) => {
  const resp = await apiClient.get(`/render-status/${taskId}`);
  return resp.data;
};

export const getDownloadZipUrl = (taskId: string) => {
  return `${API_BASE_URL}/download-zip/${taskId}`;
};

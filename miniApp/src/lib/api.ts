
// 留言类型
export interface MessagePayload {
  content: string;
  contact: string;
}

// 发布留言 API
export async function postMessage(payload: MessagePayload): Promise<any> {
  return await fetchFromAPI('/messages', {
    method: 'POST',
    data: payload,
  });
}
import type { Job } from '@/lib/types';
import { mockJobs } from './data';
import Taro from '@tarojs/taro';

function getAPIBaseURL(): string {
  return 'https://recruitment.takeanything.store';
}

async function fetchFromAPI(endpoint: string, options: Taro.request.Option = { method: 'GET' }): Promise<any> {
  const url = `${getAPIBaseURL()}${endpoint}`;
  try {
    const response = await Taro.request({
      ...options,
      url,
      header: {
        'Content-Type': 'application/json',
        ...(options.header || {}),
      },
    });
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data;
    } else {
      throw new Error(`API Error: ${response.statusCode} ${response.errMsg}`);
    }
  } catch (error) {
    console.error(`Fetch from API failed: ${url}`, error);
    // 审核/开发环境下，接口失败时返回 mock 数据
    if (endpoint === '/jobs') {
      return mockJobs;
    }
    throw error;
  }
}

export async function getJobs(): Promise<Job[]> {
  return await fetchFromAPI('/jobs');
}

export async function createJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
  const result = await fetchFromAPI('/jobs', {
    method: 'POST',
    data: job,
  });
  return result;
}


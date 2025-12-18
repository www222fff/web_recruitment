import type { Job } from '@/lib/types';
import { mockJobs } from './data';
import Taro from '@tarojs/taro';

// 留言类型
export interface MessagePayload {
  content: string;
  contact: string;
}

// 发布留言 API
export async function postMessage(payload: MessagePayload): Promise<any> {
  const result = await fetchFromAPI('/messages', {
    method: 'POST',
    data: payload,
  });
  return result;
}


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
    if (process.env.NODE_ENV !== 'production' && endpoint === '/jobs') {
      console.warn('Returning mock data for /jobs endpoint.');
      return mockJobs;
    }
    throw error;
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const jobs = await fetchFromAPI('/jobs');
    return jobs.map(job => ({ ...job, createdAt: job.createdAt || new Date(0).toISOString() }));
  } catch (error) {
    console.error('getJobs failed, returning mock data:', error);
    return mockJobs;
  }
}

export async function createJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
  const result = await fetchFromAPI('/jobs', {
    method: 'POST',
    data: job,
  });
  return result;
}

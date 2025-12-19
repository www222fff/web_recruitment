import type { Job } from '@/lib/types';
import { mockJobs } from '@/lib/data';

interface Message {
  id: string;
  content: string;
  contact: string;
  createdAt: string;
}

function getAPIBaseURL(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
}

async function fetchFromAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
  const baseURL = getAPIBaseURL();
  // Ensure the URL is correctly formed, especially for server-side rendering
  const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getJobs(): Promise<Job[]> {
  try {
    const jobs = await fetchFromAPI('/jobs');
    // The API returns jobs sorted by createdAt desc, so no extra sorting needed here.
    return jobs;
  } catch (error) {
    console.warn('Failed to fetch jobs from API, falling back to local mock data:', error);
    // Sort mock jobs to be consistent with API response
    return mockJobs.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}


export async function createJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    try {
      const jobWithDate = { ...job, createdAt: new Date().toISOString() };
      const result = await fetchFromAPI('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobWithDate),
      });
      return {
        ...jobWithDate,
        id: result.id,
      };
    } catch (error) {
      console.error('Failed to create job via API. Using local mock creation:', error);
      // Fallback for local development if API is down
      const newId = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      const newJob = {
        ...job,
        id: newId,
        createdAt: new Date().toISOString(),
      };
      // Note: This won't persist, it's just for UI feedback during fallback.
      mockJobs.unshift(newJob);
      return newJob;
    }
}

export async function getMessages(): Promise<Message[]> {
    try {
        return await fetchFromAPI('/messages');
    } catch (error) {
        console.warn('Failed to fetch messages from API, returning empty array:', error);
        return []; // In case of error, return empty array as there's no mock for messages
    }
}

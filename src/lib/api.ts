import type { Job } from '@/lib/types';
import { mockJobs } from '@/lib/data';
import { getMode } from '@/lib/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchFromAPI(endpoint: string): Promise<Job[]> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getJobs(): Promise<Job[]> {
  const mode = getMode();

  if (mode === 'api') {
    try {
      return await fetchFromAPI('/jobs');
    } catch (error) {
      console.error('Failed to fetch jobs from API, falling back to local data:', error);
      return mockJobs;
    }
  }

  return mockJobs;
}

export async function createJob(job: Omit<Job, 'id'>): Promise<Job> {
  const mode = getMode();

  if (mode === 'api') {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        ...job,
        id: result.id,
      };
    } catch (error) {
      console.error('Failed to create job via API:', error);
      throw error;
    }
  }

  const id = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  return {
    ...job,
    id,
  };
}

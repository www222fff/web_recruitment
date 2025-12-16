import Taro from '@tarojs/taro';
import type { Job } from '~/index';
import { mockJobs, jobTypes as mockJobTypes, locations as mockLocations } from '@/data/mockData';

// --- Configuration ---
// In MiniApp, we can't easily use process.env. We'll default to DEMO_MODE unless a global flag is set.
// You could set this flag in app.ts globalData for example. For now, we hardcode it.
const DEMO_MODE = true; 
const API_BASE = 'http://localhost:8080'; // Replace with your actual API endpoint

// --- Local Service (Mock Data) ---
const localService = {
  getJobs: async (): Promise<Job[]> => {
    console.log('Using local data for getJobs');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(mockJobs);
  },
  getJobTypes: async (): Promise<string[]> => {
    console.log('Using local data for getJobTypes');
    return Promise.resolve(mockJobTypes);
  },
  getLocations: async (): Promise<string[]> => {
    console.log('Using local data for getLocations');
    return Promise.resolve(mockLocations);
  },
  postJob: async (jobData: Omit<Job, 'id'>): Promise<Job> => {
    console.log('Simulating postJob with local data:', jobData);
    const newJob: Job = {
      id: `mock-${Date.now()}`,
      ...jobData,
    };
    // In a real local implementation, you might add this to the mockJobs array in memory
    // For this example, we just simulate a successful response
    mockJobs.unshift(newJob); // Add to the top of the list for demo purposes
    return Promise.resolve(newJob);
  },
};

// --- Remote Service (Real API) ---
const remoteService = {
  getJobs: async (): Promise<Job[]> => {
    const res = await Taro.request<Job[]>({
      url: `${API_BASE}/jobs`,
      method: 'GET'
    });
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(`API Error: ${res.statusCode} ${res.errMsg}`);
  },
  getJobTypes: async (): Promise<string[]> => {
    const res = await Taro.request<string[]>({
      url: `${API_BASE}/job-types`,
       method: 'GET'
    });
     if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(`API Error: ${res.statusCode} ${res.errMsg}`);
  },
  getLocations: async (): Promise<string[]> => {
    const res = await Taro.request<string[]>({
      url: `${API_BASE}/locations`,
       method: 'GET'
    });
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(`API Error: ${res.statusCode} ${res.errMsg}`);
  },
  postJob: async (jobData: Omit<Job, 'id'>): Promise<Job> => {
     const res = await Taro.request<Job>({
      url: `${API_BASE}/jobs`,
      method: 'POST',
      data: jobData,
    });
     if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(`API Error: ${res.statusCode} ${res.errMsg}`);
  },
};

// --- Exported Data Service ---
export const dataService = DEMO_MODE ? localService : remoteService;

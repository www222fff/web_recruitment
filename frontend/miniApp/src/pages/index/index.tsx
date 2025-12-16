import { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import Taro from '@tarojs/taro';
import { JobCard } from '@/components/job-card';
import { Header } from '@/components/header';
import { JobSearchFilters } from '@/components/job-search-filters';
import { dataService } from '@/services/data';
import type { Job } from '~/index';
import styles from './index.module.scss';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    location: 'all',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [jobsData, typesData, locationsData] = await Promise.all([
        dataService.getJobs(),
        dataService.getJobTypes(),
        dataService.getLocations(),
      ]);
      setJobs(jobsData);
      setJobTypes(typesData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      Taro.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000,
      });
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Support pull-down refresh
  Taro.usePullDownRefresh(() => {
    loadData().then(() => {
      Taro.stopPullDownRefresh();
    });
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const keywordMatch =
        filters.keyword === '' ||
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase());

      const typeMatch = filters.type === 'all' || job.type === filters.type;
      const locationMatch = filters.location === 'all' || job.location === filters.location;

      return keywordMatch && typeMatch && locationMatch;
    });
  }, [jobs, filters]);

  return (
    <View className={styles.pageContainer}>
      <Header onJobPosted={loadData} />
      
      <View className={styles.header}>
        <Text className={styles.title}>寻找最适合您的工作</Text>
        <Text className={styles.subtitle}>数千个蓝领职位等着您，马上开始搜索。</Text>
      </View>

      <JobSearchFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        jobTypes={jobTypes}
        locations={locations}
      />

      <ScrollView scrollY className={styles.jobList}>
        {isLoading ? (
          <View className={styles.loading}>
            <AtActivityIndicator mode='center' content='加载中...'></AtActivityIndicator>
          </View>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <View className={styles.noResults}>
            <Text className={styles.noResultsTitle}>没有找到匹配的职位</Text>
            <Text>请尝试调整您的搜索条件。</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

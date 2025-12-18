
import { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, Button } from '@tarojs/components';
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import { JobCard } from '@/components/job-card';
import type { Job } from '@/lib/types';
import { getJobs } from '@/lib/api';
import { JobSearchFilters } from '@/components/job-search-filters';

import { PostMessageDialog } from '@/components/post-message-dialog';
import './index.scss';

function NoResults() {
  return (
    <View className='no-results'>
      <Text className='no-results__title'>没有找到匹配的职位</Text>
      <Text className='no-results__subtitle'>请尝试调整您的搜索条件。</Text>
    </View>
  );
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    location: 'all',
  });

  const [isPostMessageOpen, setIsPostMessageOpen] = useState(false);
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Share to friends (分享给朋友)
  useShareAppMessage(() => {
    return {
      title: '一起干',
      desc: '实时发布工作机会',
      path: '/pages/index/index',
    };
  });

  // Share to Moments/Timeline (分享到朋友圈)
  useShareTimeline(() => {
    return {
      title: '一起干',
      query: 'from=timeline',
      imageUrl: '/images/job.jpg',
    };
  });

  useEffect(() => {
    loadJobs();
    
    // Listen for events to refresh data
    const handleRefresh = () => loadJobs();
    Taro.eventCenter.on('jobPosted', handleRefresh);
    Taro.eventCenter.on('modeSwitched', handleRefresh);

    return () => {
      Taro.eventCenter.off('jobPosted', handleRefresh);
      Taro.eventCenter.off('modeSwitched', handleRefresh);
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .filter(job => {
        const keywordMatch =
          !filters.keyword ||
          job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.keyword.toLowerCase());

        const typeMatch = filters.type === 'all' || job.type === filters.type;
        const locationMatch = filters.location === 'all' || job.location === filters.location;

        return keywordMatch && typeMatch && locationMatch;
      });
  }, [jobs, filters]);

  // 分页后的职位
  const pagedJobs = useMemo(() => {
    return filteredJobs.slice(0, currentPage * pageSize);
  }, [filteredJobs, currentPage, pageSize]);


  return (
    <View className='index-page'>
      {/* 右上角按钮栏 */}
      <View className='top-right-actions' style={{ position: 'absolute', top: 10, right: 16, zIndex: 10 }}>
        <Button size='mini' onClick={() => setIsPostMessageOpen(true)}>
          发布留言
        </Button>
      </View>
      <ScrollView
        scrollY
        className='scroll-view'
      >
        <View className='page-container'>
          <JobSearchFilters filters={filters} onFiltersChange={setFilters} />
          {isLoading ? (
             <View className='loading-container'>
                <Text>加载中...</Text>
             </View>
            ) : filteredJobs.length > 0 ? (
            <>
              <View className='job-list'>
                {pagedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </View>
              {pagedJobs.length < filteredJobs.length ? (
                <View className='load-more-container'>
                  <Text className='load-more-btn' onClick={() => setCurrentPage(p => p + 1)}>加载更多</Text>
                </View>
              ) : filteredJobs.length > 0 ? (
                <View className='no-more-jobs'>没有更多职位了</View>
              ) : null}
            </>
          ) : (
            <NoResults />
          )}
        </View>
      </ScrollView>

      <PostMessageDialog
        isOpen={isPostMessageOpen}
        onClose={() => setIsPostMessageOpen(false)}
      />
    </View>
  );
}

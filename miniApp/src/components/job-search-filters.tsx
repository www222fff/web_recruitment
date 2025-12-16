import { View, Text } from '@tarojs/components';
import { AtInput, AtTag } from 'taro-ui';
import { useState } from 'react';
import type { Job } from '@/lib/types';
import { jobTypes, locations } from '@/lib/data';

import './job-search-filters.scss';

type JobSearchFiltersProps = {
  filters: {
    keyword: string;
    type: string;
    location: string;
  };
  onFiltersChange: (filters: JobSearchFiltersProps['filters']) => void;
};

export function JobSearchFilters({ filters, onFiltersChange }: JobSearchFiltersProps) {

  const handleKeywordChange = (value: string) => {
    onFiltersChange({ ...filters, keyword: value });
    return value;
  };

  const handleTypeChange = (name: string) => {
    const newType = filters.type === name ? 'all' : name;
    onFiltersChange({ ...filters, type: newType });
  };

  const handleLocationChange = (name: string) => {
    const newLocation = filters.location === name ? 'all' : name;
    onFiltersChange({ ...filters, location: newLocation });
  };

  return (
    <View className='search-filters'>
      <AtInput
        name='keyword'
        type='text'
        placeholder='搜索职位、公司...'
        value={filters.keyword}
        onChange={handleKeywordChange}
        className='search-filters__input'
      />
      <View className='search-filters__tags-section'>
        <Text className='search-filters__tags-label'>工种:</Text>
        <View className='search-filters__tags-container'>
          <AtTag
            name='all'
            onClick={() => handleTypeChange('all')}
            active={filters.type === 'all'}
            circle
            size='small'
          >
            全部
          </AtTag>
          {jobTypes.map(type => (
            <AtTag
              key={type}
              name={type}
              onClick={() => handleTypeChange(type)}
              active={filters.type === type}
              circle
              size='small'
            >
              {type}
            </AtTag>
          ))}
        </View>
      </View>
      <View className='search-filters__tags-section'>
        <Text className='search-filters__tags-label'>地区:</Text>
        <View className='search-filters__tags-container'>
          <AtTag
            name='all'
            onClick={() => handleLocationChange('all')}
            active={filters.location === 'all'}
            circle
            size='small'
          >
            全部
          </AtTag>
          {locations.map(location => (
            <AtTag
              key={location}
              name={location}
              onClick={() => handleLocationChange(location)}
              active={filters.location === location}
              circle
              size='small'
            >
              {location}
            </AtTag>
          ))}
        </View>
      </View>
    </View>
  );
}

import { View, Text, Input } from '@tarojs/components';
import { jobTypes, locations } from '../lib/data';
import { Tag } from './tag';

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

  const handleKeywordChange = (e: any) => {
    onFiltersChange({ ...filters, keyword: e.detail.value });
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
      <Input
        name='keyword'
        type='text'
        placeholder='搜索职位、公司...'
        value={filters.keyword}
        onInput={handleKeywordChange}
        className='search-filters__input'
      />
      <View className='search-filters__tags-section'>
        <Text className='search-filters__tags-label'>工种:</Text>
        <View className='search-filters__tags-container'>
          <Tag
            onClick={() => handleTypeChange('all')}
            active={filters.type === 'all'}
          >
            全部
          </Tag>
          {jobTypes.map(type => (
            <Tag
              key={type}
              onClick={() => handleTypeChange(type)}
              active={filters.type === type}
            >
              {type}
            </Tag>
          ))}
        </View>
      </View>
      <View className='search-filters__tags-section'>
        <Text className='search-filters__tags-label'>地区:</Text>
        <View className='search-filters__tags-container'>
           <Tag
            onClick={() => handleLocationChange('all')}
            active={filters.location === 'all'}
          >
            全部
          </Tag>
          {locations.map(location => (
            <Tag
              key={location}
              onClick={() => handleLocationChange(location)}
              active={filters.location === location}
            >
              {location}
            </Tag>
          ))}
        </View>
      </View>
    </View>
  );
}

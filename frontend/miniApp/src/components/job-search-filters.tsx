import { View, Text, Picker } from '@tarojs/components';
import { AtInput } from 'taro-ui';
import styles from './job-search-filters.module.scss';
import { useMemo } from 'react';

type JobSearchFiltersProps = {
  filters: {
    keyword: string;
    type: string;
    location: string;
  };
  onFiltersChange: (filters: JobSearchFiltersProps['filters']) => void;
  jobTypes: string[];
  locations: string[];
};

export function JobSearchFilters({ filters, onFiltersChange, jobTypes, locations }: JobSearchFiltersProps) {

  const allTypes = useMemo(() => ['所有工种', ...jobTypes], [jobTypes]);
  const allLocations = useMemo(() => ['所有地区', ...locations], [locations]);

  const handleInputChange = (value: string) => {
    onFiltersChange({ ...filters, keyword: value });
  };

  const handleTypeChange = (e) => {
    const selectedType = allTypes[e.detail.value];
    onFiltersChange({ ...filters, type: selectedType === '所有工种' ? 'all' : selectedType });
  };

  const handleLocationChange = (e) => {
    const selectedLocation = allLocations[e.detail.value];
    onFiltersChange({ ...filters, location: selectedLocation === '所有地区' ? 'all' : selectedLocation });
  };

  return (
    <View className={styles.filters}>
      <View className={styles.grid}>
        <AtInput
          name='keyword'
          type='text'
          placeholder='搜索职位、公司...'
          value={filters.keyword}
          onChange={handleInputChange}
        />
        <Picker mode='selector' range={allTypes} onChange={handleTypeChange}>
          <View className={styles.picker}>
            <Text className={filters.type === 'all' ? styles.pickerPlaceholder : ''}>
              {filters.type === 'all' ? '所有工种' : filters.type}
            </Text>
            <Text>▼</Text>
          </View>
        </Picker>
        <Picker mode='selector' range={allLocations} onChange={handleLocationChange}>
          <View className={styles.picker}>
            <Text className={filters.location === 'all' ? styles.pickerPlaceholder : ''}>
              {filters.location === 'all' ? '所有地区' : filters.location}
            </Text>
            <Text>▼</Text>
          </View>
        </Picker>
      </View>
    </View>
  );
}

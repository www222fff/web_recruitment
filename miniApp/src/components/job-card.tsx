import { View, Text, Button } from '@tarojs/components';
import type { Job } from '@/lib/types';
import { MapPin, JapaneseYen, CalendarDays, Clock, Copy, Phone } from 'lucide-react';
import Taro from '@tarojs/taro';
import { Tag } from './tag';
import { ensureLoggedIn } from '@/lib/user';

import './job-card.scss';


type JobCardProps = {
  job: Job;
};


export function JobCard({ job }: JobCardProps) {
  
  // 格式化时间戳或ISO字符串为 YYYY-MM-DD
  const formatDate = (date?: number | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  return (
    <View className='job-card'>
      <View className='job-card__header'>
        <View>
          <Text className='job-card__title'>{job.title}</Text>
        </View>
        <Tag active>{job.type}</Tag>
      </View>

      <View className='job-card__body'>
        <View className='job-card__info-item'>
          <MapPin className='job-card__icon' size={16} />
          <Text>{job.location}: {job.company}</Text>
        </View>
        <View className='job-card__info-item'>
          <JapaneseYen className='job-card__icon' size={16} />
          <Text className='job-card__salary'>待遇: {job.salary}</Text>
        </View>
        <View className='job-card__info-item'>
          <CalendarDays className='job-card__icon' size={16} />
          <Text>工期: {job.duration}</Text>
        </View>
        {job.workingPeriod && (
          <View className='job-card__info-item'>
            <Clock className='job-card__icon' size={16} />
            <Text>时段: {job.workingPeriod}</Text>
          </View>
        )}
        {job.createdAt && (
        <View className='job-card__info-item'>
          <CalendarDays className='job-card__icon' size={16} />
          <Text>发布时间: {formatDate(job.createdAt)}</Text>
        </View>
        )}
      </View>

      <Text className='job-card__description'>{job.description}</Text>
    </View>
  );
}

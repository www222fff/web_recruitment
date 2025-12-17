import { View, Text } from '@tarojs/components';
import type { Job } from '@/lib/types';
import { MapPin, JapaneseYen, CalendarDays, Clock } from 'lucide-react';
import Taro from '@tarojs/taro';
import { Tag } from './tag';

import './job-card.scss';


type JobCardProps = {
  job: Job;
};


export function JobCard({ job }: JobCardProps) {
  const handleCommunicate = () => {
    // 这里可集成 wx.login 并跳转到站内聊天页面
    Taro.showToast({
      title: '进入站内沟通',
      icon: 'success',
      duration: 1200,
    });
  };
  return (
    <View className='job-card'>
      <View className='job-card__header'>
        <View>
          <Text className='job-card__title'>{job.title}</Text>
          <Text className='job-card__company'>{job.company}</Text>
        </View>
        <Tag active>{job.type}</Tag>
      </View>

      <View className='job-card__body'>
        <View className='job-card__info-item'>
          <MapPin className='job-card__icon' size={16} />
          <Text>{job.location}</Text>
        </View>
        <View className='job-card__info-item'>
          <JapaneseYen className='job-card__icon' size={16} />
          <Text className='job-card__salary'>{job.salary}</Text>
        </View>
        <View className='job-card__info-item'>
          <CalendarDays className='job-card__icon' size={16} />
          <Text>用工天数: {job.duration}</Text>
        </View>
        {job.workingPeriod && (
          <View className='job-card__info-item'>
            <Clock className='job-card__icon' size={16} />
            <Text>用工时段: {job.workingPeriod}</Text>
          </View>
        )}
      </View>
      
      <Text className='job-card__description'>{job.description}</Text>

      <View className='job-card__footer'>
        <View className='job-card__contact'>
          <Text className='job-card__contact-text'>
            <View>
              <Text></Text>
              <Text></Text>
            </View>
            <View>
              <Text></Text>
            </View>
            <View>
              <Text></Text>
            </View>
          </Text>
          <View>
            <button className='job-card__contact' onClick={handleCommunicate}>
              立即沟通
            </button>
          </View>
        </View>
      </View>
    </View>
  );
}

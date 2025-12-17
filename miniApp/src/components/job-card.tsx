import { View, Text, Button } from '@tarojs/components';
import type { Job } from '@/lib/types';
import { MapPin, JapaneseYen, CalendarDays, Clock, Copy, Phone } from 'lucide-react';
import Taro from '@tarojs/taro';
import { Tag } from './tag';

import './job-card.scss';


type JobCardProps = {
  job: Job;
};


export function JobCard({ job }: JobCardProps) {
  
  const handleCopy = (e: any) => {
    e.stopPropagation();
    if (!job.contactPhone) return;
    Taro.setClipboardData({
      data: job.contactPhone,
      success: () => {
        Taro.showToast({ title: '已复制微信号/电话', icon: 'none' });
      }
    })
  };

  const handleCommunicate = () => {
    if (job.contactPhone) {
      Taro.makePhoneCall({
        phoneNumber: job.contactPhone,
        fail: () => {
          Taro.showToast({
            title: '拨号失败，请复制后拨打',
            icon: 'none'
          })
        }
      });
    } else {
       Taro.showToast({
        title: '该职位未提供联系电话',
        icon: 'none'
      });
    }
  };
  // 格式化时间戳为 YYYY-MM-DD
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
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
        {job.createdAt && (
        <View className='job-card__info-item'>
          <CalendarDays className='job-card__icon' size={16} />
          <Text>发布时间: {formatDate(job.createdAt)}</Text>
        </View>
        )}
        {job.contactPhone && (
          <View className='job-card__info-item' onClick={handleCopy}>
            <Phone className='job-card__icon' size={16} />
            <Text>联系方式(点击复制): {job.contactPhone}</Text>
            <Copy className='job-card__icon job-card__icon--copy' size={14} />
          </View>
        )}
      </View>

      <Text className='job-card__description'>{job.description}</Text>

      <View className='job-card__footer'>
        <Button className='job-card__contact-btn' onClick={handleCommunicate}>
          立即沟通
        </Button>
      </View>
    </View>
  );
}

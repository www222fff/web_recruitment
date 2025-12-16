import { View, Picker } from '@tarojs/components';
import { AtFloatLayout, AtForm, AtInput, AtButton, AtTextarea } from 'taro-ui';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { createJob } from '@/lib/api';
import { jobTypes, locations } from '@/lib/data';
import type { Job } from '@/lib/types';

import './post-job-dialog.scss';

type PostJobDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = Omit<Job, 'id'>;

export function PostJobDialog({ isOpen, onClose }: PostJobDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    duration: '',
    description: '',
    workingPeriod: '',
    contactPhone: ''
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = e => {
    const index = e.detail.value;
    handleChange('location', locations[index]);
  };

  const handleTypeChange = e => {
    const index = e.detail.value;
    handleChange('type', jobTypes[index]);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请填写职位名称', icon: 'none' });
      return false;
    }
    if (!formData.company.trim()) {
      Taro.showToast({ title: '请填写公司名称', icon: 'none' });
      return false;
    }
    if (!formData.location) {
      Taro.showToast({ title: '请选择工作地点', icon: 'none' });
      return false;
    }
    if (!formData.type) {
      Taro.showToast({ title: '请选择工作类型', icon: 'none' });
      return false;
    }
     if (!formData.salary) {
      Taro.showToast({ title: '请填写薪资范围', icon: 'none' });
      return false;
    }
     if (!formData.duration) {
      Taro.showToast({ title: '请填写用工天数', icon: 'none' });
      return false;
    }
    if (formData.description.length < 10) {
      Taro.showToast({ title: '职位描述至少10个字符', icon: 'none' });
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      Taro.showLoading({ title: '发布中...' });
      await createJob(formData);
      Taro.hideLoading();
      Taro.showToast({
        title: '发布成功',
        icon: 'success',
      });
      onClose(); // Close the dialog
      // Use Taro's event center to notify the index page to refresh
      Taro.eventCenter.trigger('jobPosted');
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '发布失败，请重试',
        icon: 'none',
      });
    }
  };

  return (
    <AtFloatLayout isOpened={isOpen} title="发布新的用工需求" onClose={onClose}>
      <AtForm>
        <AtInput name='title' title='职位名称' type='text' placeholder='例如：电焊工' value={formData.title} onChange={(v: string) => handleChange('title', v)} />
        <AtInput name='company' title='公司名称' type='text' placeholder='您的公司或团队名称' value={formData.company} onChange={(v: string) => handleChange('company', v)} />
        
        <Picker mode='selector' range={locations} onChange={handleLocationChange}>
          <View className='picker'>
            <View className='picker__label'>工作地点</View>
            <View className='picker__value'>{formData.location || '请选择'}</View>
          </View>
        </Picker>
        
        <Picker mode='selector' range={jobTypes} onChange={handleTypeChange}>
           <View className='picker'>
            <View className='picker__label'>工作类型</View>
            <View className='picker__value'>{formData.type || '请选择'}</View>
          </View>
        </Picker>

        <AtInput name='salary' title='薪资范围' type='text' placeholder='例如：300-500元/天' value={formData.salary} onChange={(v: string) => handleChange('salary', v)} />
        <AtInput name='duration' title='用工天数' type='text' placeholder='例如：90天 或 长期' value={formData.duration} onChange={(v: string) => handleChange('duration', v)} />
        <AtInput name='workingPeriod' title='用工时段' type='text' placeholder='(选填) 例如：8月-12月' value={formData.workingPeriod || ''} onChange={(v: string) => handleChange('workingPeriod', v)} />
        <AtInput name='contactPhone' title='联系电话' type='text' placeholder='(选填) 请填写电话或微信号' value={formData.contactPhone || ''} onChange={(v: string) => handleChange('contactPhone', v)} />
        
        <View className='textarea-form-item'>
          <Text className='textarea-label'>职位描述</Text>
          <AtTextarea
            value={formData.description}
            onChange={(e) => handleChange('description', e)}
            maxLength={300}
            placeholder='详细描述工作内容、要求等...'
          />
        </View>

        <View className='form-footer'>
          <AtButton type='primary' onClick={handleSubmit}>确认发布</AtButton>
        </View>
      </AtForm>
    </AtFloatLayout>
  );
}

import { useState, useEffect } from 'react';
import { View, Text, Form, Picker, Textarea } from '@tarojs/components';
import { AtFloatLayout, AtInput, AtButton, AtToast } from 'taro-ui';
import { dataService } from '@/services/data';
import styles from './post-job-dialog.module.scss';
import type { Job } from '~/index';

type PostJobDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: () => void;
};

const initialFormState = {
  title: '',
  company: '',
  location: '',
  type: '',
  salary: '',
  duration: '',
  contactPhone: '',
  workingPeriod: '',
  description: '',
};

export function PostJobDialog({ isOpen, onClose, onJobPosted }: PostJobDialogProps) {
  const [formState, setFormState] = useState(initialFormState);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastStatus, setToastStatus] = useState<'success' | 'error'>('success');


  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const [types, locs] = await Promise.all([
          dataService.getJobTypes(),
          dataService.getLocations(),
        ]);
        setJobTypes(types);
        setLocations(locs);
      };
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handlePickerChange = (field: 'location' | 'type', e) => {
    const list = field === 'location' ? locations : jobTypes;
    handleInputChange(field, list[e.detail.value]);
  };

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields: (keyof typeof formState)[] = ['title', 'company', 'location', 'type', 'salary', 'duration', 'description'];
    for (const key of requiredFields) {
        if (!formState[key]) {
            setToastText('请填写所有必填项');
            setToastStatus('error');
            setIsToastOpen(true);
            return;
        }
    }

    try {
      await dataService.postJob(formState as Omit<Job, 'id'>);
      setToastText('发布成功');
      setToastStatus('success');
      setIsToastOpen(true);
      
      setFormState(initialFormState); // Reset form
      onJobPosted(); // Notify parent to refresh job list
      onClose(); // Close the dialog
    } catch (error) {
      setToastText('发布失败，请稍后重试');
      setToastStatus('error');
      setIsToastOpen(true);
    }
  };

  return (
    <>
      <AtFloatLayout isOpened={isOpen} title="发布新的用工需求" onClose={onClose}>
        <View className={styles.form}>
          <Form onSubmit={handleSubmit}>
            <View className={styles.formItem}>
              <AtInput
                required
                name='title'
                title='职位名称'
                type='text'
                placeholder='例如：电焊工'
                value={formState.title}
                onChange={(value) => handleInputChange('title', String(value))}
              />
            </View>
            <View className={styles.formItem}>
              <AtInput
                required
                name='company'
                title='公司名称'
                type='text'
                placeholder='您的公司或团队名称'
                value={formState.company}
                onChange={(value) => handleInputChange('company', String(value))}
              />
            </View>
            <View className={styles.formItem}>
                <Text className='at-input__title'>工作地点 *</Text>
                <Picker mode='selector' range={locations} onChange={(e) => handlePickerChange('location', e)}>
                    <View className={styles.picker}>
                    {formState.location || <Text className={styles.pickerPlaceholder}>选择工作地点</Text>}
                    </View>
                </Picker>
            </View>
             <View className={styles.formItem}>
                <Text className='at-input__title'>工作类型 *</Text>
                <Picker mode='selector' range={jobTypes} onChange={(e) => handlePickerChange('type', e)}>
                    <View className={styles.picker}>
                    {formState.type || <Text className={styles.pickerPlaceholder}>选择工作类型</Text>}
                    </View>
                </Picker>
            </View>
            <View className={styles.formItem}>
              <AtInput
                required
                name='salary'
                title='薪资范围'
                type='text'
                placeholder='例如：300-500元/天'
                value={formState.salary}
                onChange={(value) => handleInputChange('salary', String(value))}
              />
            </View>
             <View className={styles.formItem}>
              <AtInput
                required
                name='duration'
                title='用工天数'
                type='text'
                placeholder='例如：90天 或 长期'
                value={formState.duration}
                onChange={(value) => handleInputChange('duration', String(value))}
              />
            </View>
             <View className={styles.formItem}>
              <AtInput
                name='workingPeriod'
                title='用工时段 (可选)'
                type='text'
                placeholder='例如：8月-12月'
                value={formState.workingPeriod}
                onChange={(value) => handleInputChange('workingPeriod', String(value))}
              />
            </View>
             <View className={styles.formItem}>
              <AtInput
                name='contactPhone'
                title='联系电话 (可选)'
                type='phone'
                placeholder='请填写电话或微信号'
                value={formState.contactPhone}
                onChange={(value) => handleInputChange('contactPhone', String(value))}
              />
            </View>
            <View className={styles.formItem}>
                <Text className='at-input__title'>职位描述 *</Text>
                <Textarea
                    className={styles.textarea}
                    value={formState.description}
                    onInput={(e) => handleInputChange('description', e.detail.value)}
                    placeholder='详细描述工作内容、要求等...'
                    maxlength={500}
                />
            </View>
            <View className={styles.footer}>
                <AtButton type='primary' formType='submit'>确认发布</AtButton>
            </View>
          </Form>
        </View>
      </AtFloatLayout>
      <AtToast 
        isOpened={isToastOpen} 
        text={toastText}
        status={toastStatus}
        duration={2000}
        onClose={() => setIsToastOpen(false)}
      />
    </>
  );
}

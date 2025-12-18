import { View, Input, Button, Text, Textarea } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { postMessage } from '@/lib/api';

type PostMessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PostMessageDialog({ isOpen, onClose }: PostMessageDialogProps) {
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请填写留言内容', icon: 'none' });
      return;
    }
    if (!contact.trim()) {
      Taro.showToast({ title: '请填写联系方式', icon: 'none' });
      return;
    }
    try {
      Taro.showLoading({ title: '发布中...' });
      await postMessage({ content, contact });
      Taro.hideLoading();
      Taro.showToast({ title: '留言已发布', icon: 'success' });
      setContent('');
      setContact('');
      onClose();
    } catch (e) {
      Taro.hideLoading();
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' });
    }
  };

  return (
    <View className='float-layout'>
      <View className='float-layout__overlay' onClick={onClose} />
      <View className='float-layout__container'>
        <View className='float-layout__header'>
          <Text className='float-layout__title'>发布留言</Text>
          <View onClick={onClose} className='float-layout__close'>
            ×
          </View>
        </View>
        <View className='form-content'>
          <View className='form-item'>
            <Text className='form-item__label'>留言内容</Text>
            <Textarea
              className='form-item__textarea'
              value={content}
              onInput={e => setContent(e.detail.value)}
              maxlength={300}
              placeholder='简单描述你要发布的职位...'
            />
          </View>
          <View className='form-item'>
            <Text className='form-item__label'>联系方式</Text>
            <Input
              name='contact'
              type='text'
              value={contact}
              onInput={e => setContact(e.detail.value)}
              placeholder='务必请留步'
            />
          </View>
          
          <View className='form-footer'>
            <Button className='primary-button' onClick={handleSubmit}>确认发布</Button>
          </View>
        </View>
      </View>
    </View>
  );
}

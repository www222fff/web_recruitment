import { View, Input, Button, Text, Textarea, CoverView, CoverImage } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { postMessage } from '@/lib/api';
import './post-message-dialog.scss';

type PostMessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Base64 encoded close icon (white 'X')
const closeIconBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgiPjxwYXRoIGQ9Ik1NMTggNmwtMTIgMTJNNiA2bDEyIDEyIi8+PC9zdmc+';


export function PostMessageDialog({ isOpen, onClose }: PostMessageDialogProps) {
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');

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
      Taro.showToast({ title: '等待审核上架提醒', icon: 'success' });
      setContent('');
      setContact('');
      onClose(); // Close dialog on success
      Taro.eventCenter.trigger('jobPosted'); // 触发刷新事件
    } catch (e) {
      Taro.hideLoading();
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' });
    }
  };

  // 阻止事件冒泡的空函数
  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <View className='float-layout'>
      {/* 背景遮罩层，点击关闭 */}
      <View className='float-layout__overlay' onClick={onClose} />
      
      {/* 弹窗内容区域，点击这里不会关闭 */}
      <View className='float-layout__container' onClick={stopPropagation}>
        <View className='float-layout__header'>
          <Text className='float-layout__title'>发布信息</Text>
          {/* 右上角关闭按钮 */}
          <View className='float-layout__close' onClick={onClose}>
            <CoverImage src={closeIconBase64} className='float-layout__close-icon' />
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
              placeholder='简单描述...'
              placeholderClass='textarea-placeholder'
              disableDefaultPadding={false}
            />
          </View>
          <View className='form-item'>
            <Text className='form-item__label'>联系方式</Text>
            <Input
              className='form-item__input'
              name='contact'
              type='text'
              value={contact}
              onInput={e => setContact(e.detail.value)}
              placeholder='请留下您的电话或微信号'
              placeholderClass='input-placeholder'
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

import { View, Button, Text, CoverView, CoverImage } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './post-message-dialog.scss';
import { stopPropagation } from '@/lib/utils';

type PostMessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Base64 encoded close icon (white 'X')
const closeIconBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgiPjxwYXRoIGQ9Ik1NMTggNmwtMTIgMTJNNiA2bDEyIDEyIi8+PC9zdmc+';

// 客服微信号
const ADMIN_WECHAT_ID = 'longxingtianxia_2026';

export function PostMessageDialog({ isOpen, onClose }: PostMessageDialogProps) {
  
  const handleCopy = () => {
    Taro.setClipboardData({
      data: ADMIN_WECHAT_ID,
      success: () => {
        Taro.showToast({
          title: '微信号已复制',
          icon: 'success',
          duration: 2000
        });
      },
      fail: (res) => {
        console.log('Clipboard fail:', res)
        Taro.showToast({
          title: '复制失败，请重试',
          icon: 'none'
        });
      }
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <View className='float-layout' onClick={onClose}>
      {/* 弹窗内容区域 - catchMove 阻止事件穿透 */}
      <View className='float-layout__container' catchMove onClick={stopPropagation}>
        <View className='float-layout__header'>
          <Text className='float-layout__title'>联系管理员发布</Text>
          {/* CoverView is needed for buttons on top of native components like maps, but here a simple View is better for event handling */}
          <View className='float-layout__close' onClick={onClose}>
            <CoverImage src={closeIconBase64} style={{width: '24rpx', height: '24rpx'}} />
          </View>
        </View>

        <View className='dialog-content'>
          <Text className='dialog-content__description'>
            请添加下方客服微信，并告知您的用工需求，管理员将为您审核并发布信息。
          </Text>
          <View className='dialog-content__wechat-id'>
            {/* Text is not selectable, so user must use the button */}
            <Text className='dialog-content__wechat-text'>{ADMIN_WECHAT_ID}</Text>
          </View>
          <View className='dialog-footer'>
            <Button className='primary-button' onClick={handleCopy}>
              点击复制微信号
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

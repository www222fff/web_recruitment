import { View, Text, Button } from '@tarojs/components';
import { Building2 } from 'lucide-react';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { getMode, setMode, DataSourceMode } from '@/lib/config';

import './header.scss';

type HeaderProps = {
  onPostJobClick: () => void;
};

export function Header({ onPostJobClick }: HeaderProps) {
  const [mode, setCurrentMode] = useState<DataSourceMode>('local');
  const [statusBarHeight, setStatusBarHeight] = useState(20);

  useEffect(() => {
    setCurrentMode(getMode());
    const sysInfo = Taro.getSystemInfoSync();
    setStatusBarHeight(sysInfo.statusBarHeight || 20);

    // Mini-app event listeners are different from web.
    // We'll rely on parent component to pass down state or re-fetch.
  }, []);

  const handleModeSwitch = () => {
    const newMode: DataSourceMode = mode === 'local' ? 'api' : 'local';
    setMode(newMode);
    setCurrentMode(newMode);
    Taro.showToast({
      title: `已切换到 ${newMode === 'api' ? 'API' : '本地'} 模式`,
      icon: 'none',
      duration: 1500
    });
    // Trigger a refresh on the index page
    Taro.eventCenter.trigger('modeSwitched');
  };

  return (
    <View className='header' style={{ paddingTop: `${statusBarHeight}px` }}>
      <View className='header__left'>
        <Building2 color='#90A4E8' size={24} />
        <Text className='header__title'>蓝领快聘</Text>
      </View>
      <View className='header__right'>
        <Button
          className='header__mode-btn'
          size='mini'
          onClick={handleModeSwitch}
        >
          {mode === 'local' ? '本地' : 'API'}模式
        </Button>
        <Button className='header__post-btn' size='mini' type='primary' onClick={onPostJobClick}>
          发布职位
        </Button>
      </View>
    </View>
  );
}

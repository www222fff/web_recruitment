import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Building2 } from 'lucide-react';
import './header.scss';

type HeaderProps = {
  title: string;
};

// 在组件外部获取一次即可
const { statusBarHeight } = Taro.getSystemInfoSync();

export function Header({ title }: HeaderProps) {

  return (
    <View className='header' style={{ paddingTop: `${statusBarHeight}px` }}>
      <View className='header__content'>
        <View className='header__left'>
          <Building2 className='header__logo' size={22} color='#E2E8F0' />
          <Text className='header__title'>{title}</Text>
        </View>
        <View className='header__right'>
          {/* 可以在这里添加右侧按钮，如果需要 */}
        </View>
      </View>
    </View>
  );
}

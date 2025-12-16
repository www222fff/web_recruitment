import { View, Text } from '@tarojs/components';
import clsx from 'clsx';
import './tag.scss';

type TagProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function Tag({ children, active = false, onClick }: TagProps) {
  const tagClass = clsx('custom-tag', {
    'custom-tag--active': active,
  });

  return (
    <View className={tagClass} onClick={onClick}>
      <Text className='custom-tag__text'>{children}</Text>
    </View>
  );
}

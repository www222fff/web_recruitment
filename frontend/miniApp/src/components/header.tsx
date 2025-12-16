import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { useState } from 'react';
import { PostJobDialog } from './post-job-dialog';
import styles from './header.module.scss';
import { Building2 } from 'lucide-react';

export function Header({ onJobPosted }: { onJobPosted: () => void }) {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  return (
    <>
      <View className={styles.header}>
        <View className={styles.logo}>
          <Building2 color="var(--at-color-primary, #1890ff)" size={24} />
          <Text className={styles.logoText}>蓝领快聘</Text>
        </View>
        <AtButton type="primary" size="small" onClick={() => setIsPostJobOpen(true)}>
          发布职位
        </AtButton>
      </View>
      <PostJobDialog
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobPosted={onJobPosted}
      />
    </>
  );
}

import { useState, useEffect } from 'react';
import { View, ScrollView, Text, Input, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { User, MessageCircle } from 'lucide-react';
import { getChatHistory, saveMessage, onMessage, offMessage, Message } from '@/lib/chat';
import { getUser, UserInfo } from '@/lib/user';
import './index.scss';

const CurrentUserAvatar = ({ user }: { user: UserInfo | null }) => (
  <View className='avatar'>
    {user?.avatarUrl ? (
      <Image src={user.avatarUrl} style={{ width: '100%', height: '100%' }} />
    ) : (
      <User size={24} color='#666' />
    )}
  </View>
);

const RecruiterAvatar = () => (
  <View className='avatar'>
    <MessageCircle size={24} color='#666' />
  </View>
);

export default function ChatPage() {
  const router = useRouter();
  const { jobId, jobTitle } = router.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [scrollViewId, setScrollViewId] = useState('');

  useEffect(() => {
    // 设置导航栏标题
    if (jobTitle) {
      Taro.setNavigationBarTitle({ title: `与“${jobTitle}”沟通` });
    }

    // 获取当前用户信息
    const currentUser = getUser();
    setUser(currentUser);

    // 加载历史消息
    if (jobId && currentUser?.userId) {
      const history = getChatHistory(jobId);
      setMessages(history);
      // 模拟 recruiter 回复
      if (history.length === 0) {
           const welcomeMessage: Message = {
            id: Date.now(),
            chatId: jobId,
            senderId: 'recruiter',
            content: `你好！我对你的背景很感兴趣，我们可以聊聊关于“${jobTitle}”这个职位吗？`,
            timestamp: Date.now(),
        };
        setTimeout(() => {
            saveMessage(jobId, welcomeMessage);
        }, 1000);
      }
    }

    // 监听新消息
    const handleNewMessage = (newMessage: Message) => {
        if (newMessage.chatId === jobId) {
            setMessages(prev => [...prev, newMessage]);
        }
    };
    
    onMessage(handleNewMessage);

    // 组件卸载时取消监听
    return () => {
      offMessage(handleNewMessage);
    };
  }, [jobId, jobTitle]);


  useEffect(() => {
    // 滚动到底部
    if (messages.length > 0) {
      const lastMessageId = `msg-${messages[messages.length - 1].id}`;
      setScrollViewId(lastMessageId);
    }
  }, [messages]);


  const handleSend = () => {
    if (!inputValue.trim() || !jobId || !user?.userId) return;

    const newMessage: Message = {
      id: Date.now(),
      chatId: jobId,
      senderId: user.userId,
      content: inputValue,
      timestamp: Date.now(),
    };

    saveMessage(jobId, newMessage);
    setInputValue('');
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <View className='chat-page'>
      <ScrollView
        scrollY
        className='scroll-view'
        scrollIntoView={scrollViewId}
        scrollWithAnimation
      >
        <View className='message-list'>
          {messages.map(msg => {
            const isSent = msg.senderId === user?.userId;
            return (
              <View
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`message-item ${isSent ? 'message-item--sent' : 'message-item--received'}`}
              >
                {isSent ? <CurrentUserAvatar user={user} /> : <RecruiterAvatar />}
                <View className='message-content'>
                  <Text className='message-text'>{msg.content}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View className='input-bar'>
        <Input
          className='input-field'
          value={inputValue}
          onInput={e => setInputValue(e.detail.value)}
          onConfirm={handleSend}
          confirmType='send'
          adjustPosition={false}
          maxlength={300}
          placeholder='输入消息...'
        />
        <Button
          className='send-btn'
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          发送
        </Button>
      </View>
    </View>
  );
}

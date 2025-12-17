import Taro from '@tarojs/taro';

// 在真实应用中，这些 ID 和用户标识应由后端和登录会话管理
// 这里为了模拟，我们使用固定的 senderId
const MOCK_RECRUITER_ID = 'recruiter';

export interface Message {
  id: number;
  chatId: string; // 使用 jobId 作为 chatId
  senderId: string; // 'recruiter' 或 当前登录用户的 ID
  content: string;
  timestamp: number;
}

type MessageListener = (message: Message) => void;

// 模拟的事件总线，用于实时消息传递
const listeners = new Set<MessageListener>();

export function onMessage(listener: MessageListener) {
  listeners.add(listener);
}

export function offMessage(listener: MessageListener) {
  listeners.delete(listener);
}

function emitMessage(message: Message) {
  listeners.forEach(listener => listener(message));
}

// 模拟从本地存储获取聊天记录
export function getChatHistory(chatId: string): Message[] {
  try {
    const allChats = Taro.getStorageSync('chat_histories') || {};
    return allChats[chatId] || [];
  } catch (e) {
    console.error('Failed to get chat history from storage', e);
    return [];
  }
}

// 模拟保存消息到本地存储
export function saveMessage(chatId: string, message: Message) {
  try {
    const allChats = Taro.getStorageSync('chat_histories') || {};
    const chatHistory = allChats[chatId] || [];
    
    // 确保不重复添加消息
    if (!chatHistory.some(m => m.id === message.id)) {
      chatHistory.push(message);
      allChats[chatId] = chatHistory;
      Taro.setStorageSync('chat_histories', allChats);
      
      // 触发新消息事件
      emitMessage(message);

      // 如果是用户发送的消息，模拟一个招聘者的自动回复
      if (message.senderId !== MOCK_RECRUITER_ID) {
        simulateRecruiterReply(chatId, message.content);
      }
    }
  } catch (e) {
    console.error('Failed to save message to storage', e);
  }
}

// 模拟招聘者回复
function simulateRecruiterReply(chatId: string, userMessage: string) {
  setTimeout(() => {
    let replyContent = '已收到您的消息，我会尽快回复您。';
    if (userMessage.includes('你好') || userMessage.toLowerCase().includes('hello')) {
      replyContent = '你好，很高兴和你沟通！';
    } else if (userMessage.includes('薪资') || userMessage.includes('工资')) {
      replyContent = '关于薪资待遇，我们可以在面试时详细沟通。';
    }

    const replyMessage: Message = {
      id: Date.now(),
      chatId: chatId,
      senderId: MOCK_RECRUITER_ID,
      content: replyContent,
      timestamp: Date.now(),
    };
    saveMessage(chatId, replyMessage);
  }, 1500 + Math.random() * 1000); // 模拟网络延迟和输入时间
}

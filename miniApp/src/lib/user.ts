import Taro from '@tarojs/taro';

const USER_INFO_KEY = 'current_user_info';

export interface UserInfo {
  userId: string;
  nickName: string;
  avatarUrl: string;
}

// 获取当前缓存的用户信息
export function getUser(): UserInfo | null {
  try {
    return Taro.getStorageSync(USER_INFO_KEY) || null;
  } catch (e) {
    console.error('Failed to get user from storage', e);
    return null;
  }
}

// 保存用户信息到缓存
function setUser(userInfo: UserInfo) {
  try {
    Taro.setStorageSync(USER_INFO_KEY, userInfo);
  } catch (e) {
    console.error('Failed to set user to storage', e);
  }
}

// 确保用户已登录
export async function ensureLoggedIn(): Promise<boolean> {
  const cachedUser = getUser();
  if (cachedUser?.userId) {
    return true; // 已登录
  }

  try {
    Taro.showLoading({ title: '登录中...', mask: true });

    // 1. 调用 wx.login 获取 code
    const loginRes = await Taro.login();
    if (!loginRes.code) {
      throw new Error('wx.login 失败，无法获取 code');
    }
    
    // 2. 在真实应用中，将 code 发送到后端换取 openid/unionid 和 session_key
    // 这里我们模拟这个过程，并生成一个模拟的用户 ID
    console.log('Login code:', loginRes.code);
    const mockUserId = `user_${Date.now()}`;
    console.log('Mock server responded with userId:', mockUserId);

    // 3. 获取用户公开信息（头像、昵称）
    // 小程序新规定，获取用户信息需要通过按钮授权
    const profile = await new Promise<Taro.getUserProfile.SuccessCallbackResult>((resolve, reject) => {
        Taro.getUserProfile({
            desc: '用于完善会员资料',
            success: resolve,
            fail: reject,
        });
    });

    const newUserInfo: UserInfo = {
      userId: mockUserId,
      nickName: profile.userInfo.nickName,
      avatarUrl: profile.userInfo.avatarUrl,
    };
    
    setUser(newUserInfo);
    Taro.hideLoading();
    Taro.showToast({ title: '登录成功', icon: 'success' });
    return true;

  } catch (error) {
    Taro.hideLoading();
    console.error('登录或获取用户信息失败', error);
    Taro.showToast({
      title: '登录失败，请允许授权',
      icon: 'none',
      duration: 2000
    });
    return false;
  }
}

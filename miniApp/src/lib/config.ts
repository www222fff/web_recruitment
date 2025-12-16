import Taro from '@tarojs/taro';

export type DataSourceMode = 'local' | 'api';

export const DEFAULT_MODE: DataSourceMode = 'local';
const MODE_STORAGE_KEY = 'job_data_source_mode';

export function getMode(): DataSourceMode {
  try {
    const stored = Taro.getStorageSync(MODE_STORAGE_KEY) as DataSourceMode | '';
    return stored === 'api' ? 'api' : 'local';
  } catch (e) {
    console.error('Failed to get mode from storage, defaulting to local.', e);
    return DEFAULT_MODE;
  }
}

export function setMode(mode: DataSourceMode): void {
  try {
    Taro.setStorageSync(MODE_STORAGE_KEY, mode);
  } catch (e) {
    console.error('Failed to set mode to storage.', e);
  }
}

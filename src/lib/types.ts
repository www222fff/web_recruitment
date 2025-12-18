export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  duration: string;
  workingPeriod?: string;
  contactPhone?: string;
  createdAt: string; // 发布日期，ISO 字符串
}

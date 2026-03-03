export interface Message {
  id: string;
  name: string;
  content: string;
  ip: string;
  createdAt: number;
  avatar?: string;
}

export interface Visitor {
  id: string;
  ip: string;
  userAgent: string;
  visitedAt: number;
  compatibilityScore?: number;
}

export interface SiteConfig {
  title: string;
  avatar: string;
  intro: string;
  about: {
    who: string;
    traits: string;
    dream: string;
  };
  hobbies: string[];
  contact: {
    wechat?: string;
    weibo?: string;
    email?: string;
    xiaohongshu?: string;
    douyin?: string;
  };
}

export interface QuizAnswers {
  [key: string]: string;
}

export interface QuizResult {
  score: number;
  message: string;
}

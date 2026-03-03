import { kv } from '@vercel/kv';

// 检查是否配置了 Vercel KV 环境变量
const isConfigured = process.env.KV_URL || process.env.KV_REST_API_URL;

// 模拟 KV 存储（用于本地开发无 KV 环境时）
let mockStorage: Record<string, any> = {};

export const db = {
  // 通用方法
  async get<T>(key: string): Promise<T | null> {
    if (!isConfigured) {
      return mockStorage[key] || null;
    }
    return await kv.get<T>(key);
  },

  async set(key: string, value: any, options?: { ex?: number }) {
    if (!isConfigured) {
      mockStorage[key] = value;
      return;
    }
    return await kv.set(key, value, options as any);
  },

  async del(key: string) {
    if (!isConfigured) {
      delete mockStorage[key];
      return;
    }
    return await kv.del(key);
  },

  // List 操作 - 留言等
  async lpush(key: string, value: any) {
    if (!isConfigured) {
      if (!mockStorage[key]) mockStorage[key] = [];
      mockStorage[key].unshift(value);
      return;
    }
    return await kv.lpush(key, value);
  },

  async rpush(key: string, value: any) {
    if (!isConfigured) {
      if (!mockStorage[key]) mockStorage[key] = [];
      mockStorage[key].push(value);
      return;
    }
    return await kv.rpush(key, value);
  },

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    if (!isConfigured) {
      const list = mockStorage[key] || [];
      return list.slice(start, stop + 1);
    }
    return await kv.lrange<T>(key, start, stop);
  },

  async lrem(key: string, count: number, value: any) {
    if (!isConfigured) {
      const list = mockStorage[key] || [];
      let removed = 0;
      for (let i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) === JSON.stringify(value)) {
          list.splice(i, 1);
          removed++;
          if (count !== 0 && removed >= Math.abs(count)) break;
        }
      }
      mockStorage[key] = list;
      return removed;
    }
    return await kv.lrem(key, count, value);
  },

  // Set 操作 - IP 封禁等
  async sadd(key: string, value: any) {
    if (!isConfigured) {
      if (!mockStorage[key]) mockStorage[key] = new Set();
      mockStorage[key].add(value);
      return;
    }
    return await kv.sadd(key, value);
  },

  async srem(key: string, value: any) {
    if (!isConfigured) {
      if (mockStorage[key]) mockStorage[key].delete(value);
      return;
    }
    return await kv.srem(key, value);
  },

  async smembers<T>(key: string): Promise<T[]> {
    if (!isConfigured) {
      return mockStorage[key] ? Array.from(mockStorage[key]) : [];
    }
    const result = await kv.smembers(key);
    return result as T[];
  },

  async sismember<T>(key: string, value: T): Promise<boolean> {
    if (!isConfigured) {
      return mockStorage[key] ? mockStorage[key].has(value) : false;
    }
    const result = await kv.sismember(key, value);
    return !!result;
  },

  // Hash 操作 - 配置等
  async hset(key: string, field: string | Record<string, any>, value?: any) {
    if (!isConfigured) {
      if (!mockStorage[key]) mockStorage[key] = {};
      if (typeof field === 'object') {
        Object.assign(mockStorage[key], field);
      } else {
        mockStorage[key][field] = value;
      }
      return;
    }
    if (typeof field === 'object') {
      return await kv.hset(key, field as Record<string, any>);
    } else {
      // 使用 HSET 命令设置单个字段
      return await (kv as any).call('HSET', key, field, value);
    }
  },

  async hget<T>(key: string, field: string): Promise<T | null> {
    if (!isConfigured) {
      return mockStorage[key]?.[field] || null;
    }
    return await kv.hget<T>(key, field);
  },

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    if (!isConfigured) {
      return mockStorage[key] || null;
    }
    const result = await kv.hgetall(key);
    return result as Record<string, T> | null;
  },

  // 计数操作 - IP 防刷
  async incr(key: string) {
    if (!isConfigured) {
      if (!mockStorage[key]) mockStorage[key] = 0;
      mockStorage[key]++;
      return mockStorage[key];
    }
    return await kv.incr(key);
  },

  async expire(key: string, seconds: number) {
    if (!isConfigured) {
      // 模拟过期，实际不会过期
      return 1;
    }
    return await kv.expire(key, seconds);
  },
};

export { isConfigured };

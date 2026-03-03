import { headers } from 'next/headers';

export function getClientIp(): string {
  const headersList = headers();

  // 尝试多种 header 获取真实 IP
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip');

  if (forwarded) {
    // x-forwarded-for 可能包含多个 IP，取第一个
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return '127.0.0.1';
}

export function isValidIp(ip: string): boolean {
  // 简单的 IP 格式验证
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

export function getIpHash(ip: string): string {
  // 生成 IP 的 hash 用于计数
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

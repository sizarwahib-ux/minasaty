/**
 * Helper utilities for Algerian school system
 * Compliance with Algerian Law 18-07 (حماية المعطيات ذات الطابع الشخصي)
 */

export function maskNIN(nin: string): string {
  if (!nin) return '';
  const clean = nin.replace(/\s+/g, '');
  if (clean.length < 8) return '****' + clean.slice(-4);
  const start = clean.slice(0, 4);
  const end = clean.slice(-3);
  const maskedMiddle = '******';
  return `${start}${maskedMiddle}${end}`;
}

export function formatDateAr(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTimeAr(timeStr: string): string {
  return timeStr;
}

export function generateRefCode(prefix: string = 'T'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
}

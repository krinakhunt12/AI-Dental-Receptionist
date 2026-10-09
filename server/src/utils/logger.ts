export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...meta);
  },
  error: (message: string, ...meta: any[]) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...meta);
  },
  // Sanitizes object to avoid logging sensitive PII like passwords or full phone numbers
  sanitize: (data: Record<string, any>) => {
    if (!data) return data;
    const sanitized = { ...data };
    if (sanitized.password) sanitized.password = '***REDACTED***';
    if (sanitized.passwordHash) sanitized.passwordHash = '***REDACTED***';
    if (sanitized.refreshToken) sanitized.refreshToken = '***REDACTED***';
    return sanitized;
  }
};

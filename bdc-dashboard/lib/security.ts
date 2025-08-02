import { headers } from 'next/headers'

// Security headers configuration
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://accounts.google.com; " +
    "frame-src 'self' https://accounts.google.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)')
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password123',
    '123456789012',
    'qwertyuiopas',
    'admin1234567',
  ]
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password contains common patterns and is not secure')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"']/g, '') // Remove HTML/script injection chars
    .replace(/[{}]/g, '') // Remove object injection chars
    .trim()
    .substring(0, 1000) // Limit length
}

export function validateName(name: string): boolean {
  const sanitized = sanitizeInput(name)
  return sanitized.length >= 1 && sanitized.length <= 100 && /^[a-zA-Z\s\-\.]+$/.test(sanitized)
}

// Security monitoring
export function detectSuspiciousActivity(request: {
  ip?: string
  userAgent?: string
  path: string
  method: string
}): {
  isSuspicious: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  
  // Check for suspicious user agents
  const suspiciousAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'gobuster',
    'dirb',
    'wget',
    'curl',
  ]
  
  if (request.userAgent) {
    const userAgent = request.userAgent.toLowerCase()
    if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
      reasons.push('Suspicious user agent detected')
    }
    
    if (userAgent.length > 500) {
      reasons.push('Unusually long user agent')
    }
  }
  
  // Check for suspicious paths
  const suspiciousPaths = [
    '/wp-admin',
    '/admin',
    '/phpmyadmin',
    '/.env',
    '/config',
    '/.git',
    '/backup',
    '/sql',
    '/shell',
  ]
  
  if (suspiciousPaths.some(path => request.path.toLowerCase().includes(path))) {
    reasons.push('Access to suspicious path')
  }
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    'union select',
    'drop table',
    'insert into',
    'delete from',
    'update set',
    '1=1',
    'or 1=1',
    'and 1=1',
  ]
  
  if (sqlPatterns.some(pattern => request.path.toLowerCase().includes(pattern))) {
    reasons.push('Potential SQL injection attempt')
  }
  
  // Check for XSS patterns
  const xssPatterns = [
    '<script',
    'javascript:',
    'onerror=',
    'onload=',
    'alert(',
  ]
  
  if (xssPatterns.some(pattern => request.path.toLowerCase().includes(pattern))) {
    reasons.push('Potential XSS attempt')
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons,
  }
}

// Get client IP address
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return 'unknown'
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64
}
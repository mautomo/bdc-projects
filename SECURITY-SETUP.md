# BDC Dashboard Security Implementation

This document outlines the comprehensive security features implemented in the BDC Dashboard application.

## 🔐 Authentication & Authorization

### Multi-Domain Google SSO
- **Allowed Domains**: `vandoko.ai` and `strolid.com`
- **Automatic User Creation**: First-time Google SSO users are created with `USER` role
- **Domain Validation**: Middleware blocks unauthorized domains

### External User Management
- **Email Invitations**: Secure token-based invitations with 7-day expiry
- **Password Requirements**: 
  - Minimum 12 characters
  - Must include: uppercase, lowercase, number, special character
  - Common password detection and blocking
- **Role-Based Access**: USER, ADMIN, SUPER_ADMIN roles with proper hierarchy

### Password Security
- **bcrypt Hashing**: Passwords hashed with cost factor 12
- **Password Reset**: Secure token-based reset with 1-hour expiry
- **Rate Limiting**: Protection against brute force attacks

## 🛡️ Security Middleware

### Rate Limiting
- **Login Attempts**: 5 attempts per 15 minutes
- **Password Reset**: 3 attempts per hour
- **API Requests**: 100 requests per minute
- **User Invitations**: 10 invitations per hour per user

### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: (comprehensive CSP)
```

### Threat Detection
- **SQL Injection**: Pattern detection and blocking
- **XSS Attempts**: Script injection prevention
- **Suspicious User Agents**: Bot and scanner detection
- **Path Traversal**: Malicious path access prevention

## 📊 Audit Logging

### Comprehensive Tracking
- **Authentication Events**: Login, logout, failed attempts
- **User Management**: Invitations, role changes, status updates
- **Security Events**: Suspicious activity, blocked requests
- **Data Access**: Resource access and modifications

### Log Structure
```typescript
{
  userId?: string
  action: string
  resource?: string
  details?: object
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}
```

## 🗄️ Database Security

### User Data Protection
- **Email Normalization**: All emails stored in lowercase
- **Password Hashing**: Never store plain text passwords
- **Session Management**: JWT tokens with 8-hour expiry
- **Data Validation**: Input sanitization and validation

### Database Schema
```sql
-- User roles with proper hierarchy
enum UserRole { SUPER_ADMIN, ADMIN, USER }

-- User status management
enum UserStatus { ACTIVE, INACTIVE, SUSPENDED }

-- Authentication type tracking
enum AuthType { GOOGLE_SSO, PASSWORD }
```

## 🔒 Access Control

### Route Protection
- **Middleware Authentication**: All routes protected except auth pages
- **Role-Based Access**: Admin routes restricted to ADMIN/SUPER_ADMIN
- **Domain Validation**: Google SSO users validated against allowed domains
- **Status Checking**: Inactive users automatically blocked

### Admin Controls
- **User Management**: Invite, activate, deactivate users
- **Role Assignment**: Proper role hierarchy enforcement
- **Invitation Management**: View, revoke pending invitations
- **Audit Log Access**: Security event monitoring

## 📧 Email Security

### SMTP Configuration
- **TLS Encryption**: Secure email transmission
- **Authentication**: SMTP user/password authentication
- **Template Security**: HTML email templates with XSS prevention

### Email Features
- **Invitation Emails**: Secure invitation links with tokens
- **Password Reset**: Time-limited reset links
- **Branded Templates**: Professional email templates with security notices

## 🚨 Monitoring & Alerts

### Security Monitoring
- **Real-time Threat Detection**: Immediate suspicious activity logging
- **Failed Login Tracking**: Monitor authentication failures
- **Rate Limit Violations**: Track and log rate limit breaches
- **Admin Activity**: Monitor administrative actions

### Incident Response
- **Automatic Blocking**: SQL injection and XSS attempts blocked
- **Audit Trail**: Complete log of all security events
- **User Status Management**: Ability to suspend compromised accounts

## 🔧 Configuration Security

### Environment Variables
```env
# Secure secrets management
NEXTAUTH_SECRET=crypto-strong-secret
DATABASE_URL=postgresql://secure-connection
SMTP_PASSWORD=app-specific-password
```

### Docker Security
- **Non-root Containers**: Applications run as non-root users
- **Secret Management**: Environment variables for sensitive data
- **Network Isolation**: Internal Docker network for services

## 📋 Security Checklist

### Deployment Security
- [ ] SSL/TLS certificates configured (Let's Encrypt)
- [ ] Environment variables secured
- [ ] Database connection encrypted
- [ ] SMTP authentication configured
- [ ] Google OAuth credentials secured
- [ ] Firewall rules configured
- [ ] Regular security updates scheduled

### Ongoing Security
- [ ] Monitor audit logs regularly
- [ ] Review user access quarterly
- [ ] Update dependencies monthly
- [ ] Security header validation
- [ ] Rate limit effectiveness review
- [ ] Password policy compliance check

## 🆘 Security Incident Response

### Immediate Actions
1. **Account Suspension**: Suspend compromised accounts
2. **Password Reset**: Force password reset for affected users
3. **Audit Review**: Check audit logs for breach scope
4. **Access Revocation**: Revoke active sessions if needed

### Investigation Steps
1. **Log Analysis**: Review audit logs for attack patterns
2. **User Notification**: Inform affected users if necessary
3. **Vulnerability Assessment**: Identify and patch security gaps
4. **System Hardening**: Implement additional security measures

## 🔍 Security Best Practices

### For Administrators
- Use strong, unique passwords
- Enable 2FA on Google accounts
- Regularly review user access
- Monitor security logs
- Keep systems updated

### For Users
- Use company email for SSO access
- Create strong passwords for external accounts
- Report suspicious activity
- Don't share account credentials
- Log out when session complete

This security implementation follows industry best practices and provides comprehensive protection for the BDC Dashboard application.
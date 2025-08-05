# 🔒 Security Guide - Preventing Secret Leaks

## 🚨 **CRITICAL: Secret Leaks Detected**

GitHub has detected the following exposed secrets that need immediate attention:

### **Exposed Secrets:**

1. **Google API Key**: `AIzaSyBDPW2N1-govhKZpkFa_W8TzBzyAQ31wRY`
2. **Google API Key**: `AIzaSyA9dk08pBVDxud16tIzv2QUAZtMOiklhGc`
3. **MongoDB Connection String**: `mongodb+srv://username:password@cluster.mongodb.net/kingdom-studios`

### **Immediate Actions Taken:**

- ✅ **Deleted exposed files**: `google-services.json`, `GoogleService-Info.plist`
- ✅ **Updated .gitignore**: Added comprehensive security patterns
- ✅ **Fixed documentation**: Replaced real credentials with placeholders

---

## 🔑 **Required Actions**

### **1. Revoke Exposed API Keys**

**URGENT**: These keys are now compromised and must be revoked immediately:

1. **Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Credentials"
   - Find and delete the exposed API keys
   - Generate new API keys
   - Update your environment variables

2. **MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Navigate to "Database Access"
   - Change the password for the exposed user
   - Or create a new database user

### **2. Update Environment Variables**

Replace the exposed credentials with new ones:

```bash
# Google API Keys (generate new ones)
GOOGLE_API_KEY=your_new_api_key_here
GOOGLE_CLIENT_ID=your_new_client_id_here

# MongoDB (use new credentials)
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]
```

### **3. Regenerate Firebase Configuration**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Download new `google-services.json` and `GoogleService-Info.plist`
3. **DO NOT COMMIT** these files to Git
4. Store them securely and add to `.gitignore`

---

## 🛡️ **Security Best Practices**

### **Never Commit These Files:**

```
❌ google-services.json
❌ GoogleService-Info.plist
❌ .env files
❌ *-key.json
❌ *-secret.json
❌ service-account*.json
❌ *.pem (certificates)
❌ *.keystore
❌ *.jks
```

### **Use Environment Variables:**

```bash
# ✅ Good - Use environment variables
API_KEY=${GOOGLE_API_KEY}
DATABASE_URL=${MONGODB_URI}

# ❌ Bad - Hardcoded secrets
API_KEY=AIzaSyBDPW2N1-govhKZpkFa_W8TzBzyAQ31wRY
```

### **Template Files:**

Create template files with placeholders:

```bash
# .env.template
GOOGLE_API_KEY=your_google_api_key_here
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]
```

---

## 📋 **Security Checklist**

### **Before Each Commit:**

- [ ] Check for hardcoded API keys
- [ ] Verify no `.env` files are staged
- [ ] Ensure no credential files are included
- [ ] Review `git status` for sensitive files

### **Repository Security:**

- [ ] Enable GitHub secret scanning
- [ ] Set up branch protection rules
- [ ] Require pull request reviews
- [ ] Enable automated security scanning

### **Environment Management:**

- [ ] Use different keys for dev/staging/prod
- [ ] Rotate keys regularly
- [ ] Monitor API usage for anomalies
- [ ] Set up alerts for unusual activity

---

## 🚨 **Emergency Response**

### **If Secrets Are Exposed:**

1. **Immediately revoke** the exposed credentials
2. **Generate new credentials**
3. **Update all environments** (dev, staging, prod)
4. **Monitor for unauthorized usage**
5. **Review access logs** for suspicious activity
6. **Notify team members** about the incident

### **Prevention Measures:**

- Use GitHub's secret scanning
- Set up pre-commit hooks
- Regular security audits
- Team security training

---

## 📞 **Support Contacts**

- **GitHub Security**: security@github.com
- **Google Cloud Support**: https://cloud.google.com/support
- **MongoDB Support**: https://www.mongodb.com/support

---

## ✅ **Verification Steps**

After fixing the leaks:

1. **Check GitHub Security Alerts**: Ensure all alerts are resolved
2. **Test API Keys**: Verify new keys work correctly
3. **Update Documentation**: Ensure all references use placeholders
4. **Team Communication**: Inform team about new credentials
5. **Monitor Logs**: Watch for any unauthorized access attempts

**Remember**: Security is everyone's responsibility. When in doubt, ask before committing sensitive information.

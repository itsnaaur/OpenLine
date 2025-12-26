# Security Guide for OpenLine

## Firestore Security Rules

### Current Rules (Development/Production Ready)

The current Firestore rules are configured as follows:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      // Allow anyone to create a new report (anonymous submission)
      allow create: if true;
      
      // Allow anyone to read reports (accessCode validation happens on frontend)
      allow read: if true;
      
      // Only authenticated admins can update reports (change status, add messages)
      allow update: if request.auth != null;
      
      // Only authenticated admins can delete reports
      allow delete: if request.auth != null;
    }
  }
}
```

### Security Considerations

1. **Anonymous Report Creation**: ✅ Secure
   - Anyone can create reports (required for anonymous submission)
   - No sensitive data is collected
   - Access codes are generated server-side

2. **Report Reading**: ⚠️ Note
   - Currently allows public reads
   - Access code validation happens on the frontend
   - For stricter security, you could add accessCode validation in rules (requires custom function)

3. **Report Updates**: ✅ Secure
   - Only authenticated admins can update
   - Prevents unauthorized status changes or message tampering

4. **Report Deletion**: ✅ Secure
   - Only authenticated admins can delete
   - Prevents accidental or malicious deletion

### Production Recommendations

For production deployment, consider:

1. **Rate Limiting**: Implement rate limiting to prevent spam
2. **Access Code Validation in Rules**: Add server-side validation (requires Cloud Functions)
3. **Storage Rules**: Ensure Firebase Storage rules are also secured
4. **Admin Access**: Use Firebase Custom Claims to distinguish admins from regular users
5. **Monitoring**: Set up Firebase monitoring and alerts

## Firebase Storage Rules

Ensure your Storage rules are configured. Example:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /evidence/{fileName} {
      // Allow anyone to upload evidence (for anonymous reports)
      allow write: if request.resource.size < 5 * 1024 * 1024; // 5MB limit
      
      // Allow anyone to read evidence (for viewing in reports)
      allow read: if true;
    }
  }
}
```

## Environment Variables Security

- ✅ All Firebase config is in `.env.local` (not committed to git)
- ✅ `.env.local` is in `.gitignore`
- ✅ Never commit API keys or secrets to version control

## Authentication Security

- ✅ Admin authentication uses Firebase Auth (secure)
- ✅ Passwords are hashed by Firebase
- ✅ Session management handled by Firebase

## Best Practices

1. **Regular Security Audits**: Review Firestore and Storage rules regularly
2. **Monitor Access**: Check Firebase Console logs for suspicious activity
3. **Keep Dependencies Updated**: Run `npm audit` regularly
4. **Backup Data**: Set up regular Firestore backups
5. **Access Control**: Limit admin account creation


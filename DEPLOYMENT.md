# Deployment Guide for OpenLine

## Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Firestore Database enabled
- [ ] Firebase Storage enabled
- [ ] Authentication (Email/Password) enabled
- [ ] Admin account created in Firebase Authentication
- [ ] Firestore security rules deployed
- [ ] Storage security rules configured
- [ ] Environment variables set up
- [ ] Test all features (submit, track, admin dashboard)

## Deploying to Vercel

### Step 1: Prepare Your Repository

1. Ensure all code is committed to Git
2. Push to GitHub/GitLab/Bitbucket

### Step 2: Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your Git provider
3. Click "Add New Project"
4. Import your OpenLine repository

### Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important:** Use the same values from your `.env.local` file.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `your-project.vercel.app`

### Step 5: Update Firebase Allowed Domains

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to "Authorized domains"
3. This allows Firebase Auth to work on your deployed site

## Post-Deployment

### Test Everything

1. ✅ Submit a test report
2. ✅ Track the report using access code
3. ✅ Log in as admin
4. ✅ View dashboard
5. ✅ Update report status
6. ✅ Send admin reply
6. ✅ Verify reporter sees updates in real-time

### Monitor

- Check Vercel analytics
- Monitor Firebase usage
- Review error logs in both platforms

## Alternative Deployment Options

### Netlify

Similar process to Vercel:
1. Connect repository
2. Add environment variables
3. Deploy

### Self-Hosting

For self-hosting, you'll need:
- Node.js server
- Environment variables configured
- Reverse proxy (nginx recommended)
- SSL certificate

## Troubleshooting

### Firebase Errors After Deployment

- Check environment variables are set correctly
- Verify Firebase project settings
- Check browser console for specific errors

### Build Errors

- Ensure all dependencies are in `package.json`
- Check Next.js version compatibility
- Review build logs in Vercel

### Authentication Not Working

- Verify authorized domains in Firebase
- Check CORS settings
- Ensure API keys are correct


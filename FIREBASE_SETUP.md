# Firebase Setup Guide for OpenLine

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Required Services

### A. Firestore Database
1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (we'll update rules later)
4. Choose a location for your database
5. Click **Enable**

### B. Storage
1. Go to **Build** > **Storage**
2. Click **Get started**
3. Select **Start in test mode**
4. Choose a location (preferably same as Firestore)
5. Click **Done**

### C. Authentication
1. Go to **Build** > **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

## Step 3: Get Your Firebase Config

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. If you don't have a web app, click **</>** (Web icon) to add one
5. Register your app (you can name it "OpenLine Web")
6. Copy the `firebaseConfig` object

It should look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 4: Create Environment File

1. In your project root, create a file named `.env.local`
2. Add your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important:** 
- Replace all values with your actual Firebase config values
- Do NOT commit `.env.local` to git (it's already in .gitignore)
- The `NEXT_PUBLIC_` prefix is required for Next.js to expose these to the browser

## Step 5: Test Connection

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000/test-firebase` to test the connection
3. You should see "✅ Firebase Connected Successfully!" if everything works

## Step 6: Firestore Security Rules (Temporary - Test Mode)

For now, Firestore is in test mode which allows all reads/writes. We'll update this in Phase 4.

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Check that your API key in `.env.local` matches Firebase Console
- Make sure `.env.local` is in the project root (not in a subfolder)
- Restart your dev server after creating/updating `.env.local`

### Error: "Firebase Storage: User does not have permission"
- Make sure Storage is enabled in Firebase Console
- Check that Storage rules are in test mode

### Environment variables not loading
- Make sure variable names start with `NEXT_PUBLIC_`
- Restart the dev server: `npm run dev`
- Clear Next.js cache: Delete `.next` folder and restart

## Next Steps

Once Firebase is connected:
- ✅ Phase 1 (Submit Report) will work
- ✅ Phase 2 (Track Report) will work
- ✅ Phase 3 (Admin Dashboard) will work

Proceed to Phase 2 after confirming the connection works!


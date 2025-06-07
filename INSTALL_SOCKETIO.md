# Socket.IO Installation Guide

## Current Status
The chat application is currently running in **fallback mode** without real-time features. To enable real-time messaging, you need to install Socket.IO packages.

## Quick Installation

### Step 1: Install Backend Socket.IO
```bash
cd backend
npm install socket.io
```

### Step 2: Install Frontend Socket.IO Client
```bash
cd frontend
npm install socket.io-client
```

### Step 3: Enable Real-time Features
After installing the packages, update the frontend imports:

**In `frontend/src/pages/Chat.tsx`:**
```typescript
// Change this line:
import { SocketProvider } from '../context/socket.context-fallback';

// To this:
import { SocketProvider } from '../context/socket.context';
```

**In `frontend/src/components/Chat/ChatContainer.tsx`:**
```typescript
// Change this line:
import { useSocket } from '../../context/socket.context-fallback';

// To this:
import { useSocket } from '../../context/socket.context';
```

**In `frontend/src/components/Chat/MessageInput.tsx`:**
```typescript
// Change this line:
import { useSocket } from '../../context/socket.context-fallback';

// To this:
import { useSocket } from '../../context/socket.context';
```

### Step 4: Restart Servers
```bash
# Backend (with Socket.IO)
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Alternative: Manual Package Installation

If npm install doesn't work, try these alternatives:

### Option 1: Using Yarn
```bash
# Backend
cd backend
yarn add socket.io

# Frontend
cd frontend
yarn add socket.io-client
```

### Option 2: Using pnpm
```bash
# Backend
cd backend
pnpm add socket.io

# Frontend
cd frontend
pnpm add socket.io-client
```

### Option 3: Clear Cache and Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm install socket.io

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm install socket.io-client
```

## What Works Now (Fallback Mode)

✅ **Currently Working:**
- User authentication and login
- Message sending via HTTP API
- Message history loading
- User list with profiles
- Modern responsive UI
- All navigation and routing

❌ **Missing (Requires Socket.IO):**
- Real-time message delivery
- Online/offline status indicators
- Typing indicators
- Auto-scroll to new messages
- Connection status display

## Testing Real-time Features

After installing Socket.IO:

1. **Create Demo Users:**
   ```bash
   cd backend
   npm run create-demo-users
   ```

2. **Test Real-time Chat:**
   - Open http://localhost:5173 in two browser windows
   - Login with different accounts:
     - Window 1: alice@demo.com / password123
     - Window 2: bob@demo.com / password123
   - Start chatting and see real-time updates!

## Troubleshooting

### If Socket.IO Installation Fails:
1. Check your Node.js version (requires v16+)
2. Try clearing npm cache: `npm cache clean --force`
3. Use the fallback mode for now - all core features work

### If Real-time Features Don't Work:
1. Check browser console for connection errors
2. Verify both backend and frontend are running
3. Check that ports 5000 (backend) and 5173 (frontend) are accessible

### If You Get Import Errors:
1. Make sure you updated all the import statements as shown above
2. Restart the development servers
3. Clear browser cache

## File Structure

```
frontend/src/context/
├── socket.context.tsx          # Real-time Socket.IO implementation
├── socket.context-fallback.tsx # Fallback without Socket.IO (currently active)
└── auth.context.tsx           # Authentication (working)
```

The application is designed to work in both modes - with and without Socket.IO!

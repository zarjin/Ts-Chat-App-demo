# Real-Time Chat Application

A modern, real-time chat application built with TypeScript, React, Node.js, Express, Socket.IO, and MongoDB.

## Features

- **Real-time messaging** with Socket.IO
- **User authentication** with JWT
- **Online status indicators**
- **Typing indicators**
- **Modern responsive UI** with TailwindCSS
- **Image sharing** with Cloudinary integration
- **Message history** persistence
- **Mobile-responsive design**

## Tech Stack

### Backend

- Node.js with TypeScript
- Express.js
- Socket.IO for real-time communication
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads
- bcryptjs for password hashing

### Frontend

- React 19 with TypeScript
- TailwindCSS for styling
- Socket.IO client
- Axios for HTTP requests
- React Router for navigation
- Vite for development and building

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ts-Chat-App
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Important**: If you encounter Socket.IO installation issues, you can:

**Option A**: Install Socket.IO manually

```bash
# In the backend directory
npm install socket.io

# In the frontend directory
cd ../frontend
npm install socket.io-client
```

**Option B**: Use the provided installation script

```bash
# Run the installation script (Windows)
install-socket.bat
```

**Option C**: Start with the simple version (without real-time features)

```bash
# Use the simple server without Socket.IO
npm run dev-simple
```

The backend already has a configured `.env` file. Make sure MongoDB is running on your system.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Create Demo Users (Optional)

To test the chat functionality, create some demo users:

```bash
cd backend
npm run create-demo-users
```

This will create three demo users:

- Alice Johnson (alice@demo.com)
- Bob Smith (bob@demo.com)
- Charlie Brown (charlie@demo.com)

All demo users have the password: `password123`

## Running the Application

### 🚀 Quick Start (Current Working Mode)

The application is currently configured to work **without Socket.IO** (fallback mode). All core features work via HTTP API.

### 1. Start the Backend Server

```bash
cd backend
npm run dev-simple
```

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

### 3. Create Demo Users

```bash
cd backend
npm run create-demo-users
```

### 4. Test the Application

- Visit http://localhost:5173
- Login with: alice@demo.com / password123
- Start chatting! (Messages work via HTTP API)

## 🔄 Enable Real-time Features (Socket.IO)

To enable real-time messaging, typing indicators, and online status:

### Option 1: Automatic Setup

```bash
# Run the installation script
switch-to-socketio.bat
```

### Option 2: Manual Setup

See `INSTALL_SOCKETIO.md` for detailed instructions.

The backend will run on http://localhost:5000
The frontend will run on http://localhost:5173

## Usage

1. **Registration/Login**:

   - Visit http://localhost:5173
   - Click "Create Account" to register a new user
   - Or click "Sign In" to login with existing credentials
   - Use demo credentials: alice@demo.com / password123

2. **Chat Interface**:
   - After login, you'll be redirected to the chat interface
   - Select a user from the sidebar to start chatting
   - Messages are sent and received in real-time
   - Online status and typing indicators are shown
   - Click the logout button in the top-right to sign out

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/user/getall` - Get all users (authenticated)
- `GET /api/user/get/:userId` - Get specific user (authenticated)

### Messages

- `POST /api/message/send/:receiverId` - Send message (authenticated)
- `GET /api/message/get/:receiverId` - Get conversation messages (authenticated)

## Socket.IO Events

### Client to Server

- `sendMessage` - Send a new message
- `typing` - Start typing indicator
- `stopTyping` - Stop typing indicator
- `markAsRead` - Mark message as read

### Server to Client

- `newMessage` - Receive new message
- `messageSent` - Confirmation of sent message
- `getOnlineUsers` - List of online users
- `userTyping` - Typing indicator updates
- `messageRead` - Message read confirmation

## Project Structure

```
Ts-Chat-App/
├── backend/
│   ├── src/
│   │   ├── configs/         # Database and service configurations
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Authentication and file upload middlewares
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── socket/          # Socket.IO handlers and services
│   │   ├── scripts/         # Utility scripts
│   │   ├── utils/           # Helper utilities
│   │   └── server.ts        # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth/        # Authentication components
│   │   │   └── Chat/        # Chat-related components
│   │   ├── context/         # React contexts (Auth, Socket)
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main App component
│   ├── package.json
│   └── .env
└── README.md
```

## Development Notes

- The application uses HTTP-only cookies for JWT storage
- Socket.IO connections are authenticated using JWT tokens
- All API endpoints (except auth) require authentication
- The frontend automatically redirects unauthenticated users to login
- Real-time features work across multiple browser tabs/windows

## Troubleshooting

1. **Socket.IO Installation Issues**:

   - If you get "Cannot find module 'socket.io'" error, run: `npm install socket.io` in backend directory
   - For frontend: `npm install socket.io-client` in frontend directory
   - Alternative: Use `npm run dev-simple` to start without Socket.IO

2. **MongoDB Connection Issues**: Ensure MongoDB is running on localhost:27017

3. **Socket.IO Connection Issues**: Check that both frontend and backend are running

4. **CORS Issues**: Verify the CLIENT_URL in backend .env matches frontend URL

5. **Authentication Issues**: Clear browser localStorage and cookies, then try again

6. **TypeScript Compilation Errors**:
   - Make sure all dependencies are installed
   - Try deleting node_modules and running `npm install` again

## Future Enhancements

- Group chat functionality
- Message reactions and replies
- File sharing (documents, videos)
- Voice and video calling
- Message encryption
- Push notifications
- Dark mode theme
- Message search functionality

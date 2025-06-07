import { io } from 'socket.io-client';
import { generateToken } from '../utils/jwt.utils';

const testSocketConnection = async () => {
  try {
    // Generate a test token (you'd normally get this from login)
    const testUserId = '507f1f77bcf86cd799439011'; // Mock ObjectId
    const token = generateToken(testUserId);
    
    console.log('Testing Socket.IO connection...');
    console.log('Token:', token);
    
    // Create socket connection
    const socket = io('http://localhost:5000', {
      auth: {
        token: token
      }
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server with ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
    });

    socket.on('getOnlineUsers', (users) => {
      console.log('📱 Online users:', users);
    });

    socket.on('newMessage', (message) => {
      console.log('💬 New message received:', message);
    });

    socket.on('messageSent', (message) => {
      console.log('✅ Message sent confirmation:', message);
    });

    // Test sending a message after 2 seconds
    setTimeout(() => {
      console.log('📤 Sending test message...');
      socket.emit('sendMessage', {
        receiverId: '507f1f77bcf86cd799439012', // Another mock ObjectId
        message: 'Hello from Socket.IO test!',
        image: ''
      });
    }, 2000);

    // Disconnect after 5 seconds
    setTimeout(() => {
      console.log('🔌 Disconnecting...');
      socket.disconnect();
      process.exit(0);
    }, 5000);

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

testSocketConnection();

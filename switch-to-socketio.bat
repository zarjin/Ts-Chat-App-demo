@echo off
echo Switching to Socket.IO mode...
echo.

echo Installing Socket.IO packages...
cd backend
npm install socket.io
cd ../frontend
npm install socket.io-client
echo.

echo Updating import statements...
cd ../

REM Update Chat.tsx
powershell -Command "(Get-Content 'frontend/src/pages/Chat.tsx') -replace 'socket.context-fallback', 'socket.context' | Set-Content 'frontend/src/pages/Chat.tsx'"

REM Update ChatContainer.tsx
powershell -Command "(Get-Content 'frontend/src/components/Chat/ChatContainer.tsx') -replace 'socket.context-fallback', 'socket.context' | Set-Content 'frontend/src/components/Chat/ChatContainer.tsx'"

REM Update MessageInput.tsx
powershell -Command "(Get-Content 'frontend/src/components/Chat/MessageInput.tsx') -replace 'socket.context-fallback', 'socket.context' | Set-Content 'frontend/src/components/Chat/MessageInput.tsx'"

echo.
echo ✅ Successfully switched to Socket.IO mode!
echo.
echo Next steps:
echo 1. Restart your backend server: cd backend && npm run dev
echo 2. Restart your frontend server: cd frontend && npm run dev
echo 3. Test real-time features with multiple browser windows
echo.
pause

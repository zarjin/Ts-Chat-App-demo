@echo off
echo Switching to Fallback mode (no Socket.IO)...
echo.

echo Updating import statements...

REM Update Chat.tsx
powershell -Command "(Get-Content 'frontend/src/pages/Chat.tsx') -replace 'socket.context', 'socket.context-fallback' | Set-Content 'frontend/src/pages/Chat.tsx'"

REM Update ChatContainer.tsx
powershell -Command "(Get-Content 'frontend/src/components/Chat/ChatContainer.tsx') -replace 'socket.context', 'socket.context-fallback' | Set-Content 'frontend/src/components/Chat/ChatContainer.tsx'"

REM Update MessageInput.tsx
powershell -Command "(Get-Content 'frontend/src/components/Chat/MessageInput.tsx') -replace 'socket.context', 'socket.context-fallback' | Set-Content 'frontend/src/components/Chat/MessageInput.tsx'"

echo.
echo ✅ Successfully switched to Fallback mode!
echo.
echo In this mode:
echo ✅ All core chat features work via HTTP API
echo ❌ No real-time features (typing indicators, online status)
echo.
echo To enable real-time features, run: switch-to-socketio.bat
echo.
pause

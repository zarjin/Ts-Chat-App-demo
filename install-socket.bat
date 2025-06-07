@echo off
echo Installing Socket.IO for backend...
cd backend
npm install socket.io
echo.
echo Installing Socket.IO client for frontend...
cd ../frontend
npm install socket.io-client
echo.
echo Installation complete!
pause

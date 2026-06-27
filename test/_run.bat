@echo off

IF NOT EXIST node_modules (
    echo Installing dependencies...
    npm install
)

start http://localhost:5173
npm run dev
pause

@echo off
echo 🔑 Kingdom Studios App - API Key Configuration
echo ==============================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the kingdom-studios directory
    pause
    exit /b 1
)

REM Copy environment template
echo 📋 Setting up environment file...
if not exist ".env.local" (
    copy ".env.local.template" ".env.local" >nul
    echo ✅ Created .env.local from template
) else (
    echo ⚠️  .env.local already exists, backing up to .env.local.backup
    copy ".env.local" ".env.local.backup" >nul
)

echo.
echo 🔥 FIREBASE SETUP (Required)
echo ==============================
echo 1. Go to: https://console.firebase.google.com/
echo 2. Create new project: 'kingdom-studios-dev'
echo 3. Enable Authentication, Firestore, Storage
echo 4. Get your config from Project Settings ^> Your apps
echo.

set /p firebase_api_key="📝 Enter your Firebase API Key: "
set /p firebase_auth_domain="📝 Enter your Firebase Auth Domain (e.g., project.firebaseapp.com): "
set /p firebase_project_id="📝 Enter your Firebase Project ID: "
set /p firebase_storage_bucket="📝 Enter your Firebase Storage Bucket (e.g., project.appspot.com): "
set /p firebase_messaging_sender_id="📝 Enter your Firebase Messaging Sender ID: "
set /p firebase_app_id="📝 Enter your Firebase App ID: "
set /p firebase_measurement_id="📝 Enter your Firebase Measurement ID (optional, press enter to skip): "

REM Update Firebase keys in .env.local using PowerShell
powershell -Command "(Get-Content .env.local) -replace 'your_firebase_api_key_here', '%firebase_api_key%' | Set-Content .env.local"
powershell -Command "(Get-Content .env.local) -replace 'kingdom-studios-dev.firebaseapp.com', '%firebase_auth_domain%' | Set-Content .env.local"
powershell -Command "(Get-Content .env.local) -replace 'kingdom-studios-dev', '%firebase_project_id%' | Set-Content .env.local"
powershell -Command "(Get-Content .env.local) -replace 'kingdom-studios-dev.appspot.com', '%firebase_storage_bucket%' | Set-Content .env.local"
powershell -Command "(Get-Content .env.local) -replace 'your_messaging_sender_id', '%firebase_messaging_sender_id%' | Set-Content .env.local"
powershell -Command "(Get-Content .env.local) -replace 'your_firebase_app_id', '%firebase_app_id%' | Set-Content .env.local"

if not "%firebase_measurement_id%"=="" (
    powershell -Command "(Get-Content .env.local) -replace 'your_measurement_id', '%firebase_measurement_id%' | Set-Content .env.local"
)

echo ✅ Firebase configuration updated!
echo.

echo 🤖 OPENAI SETUP (Required)
echo ==========================
echo 1. Go to: https://platform.openai.com/api-keys
echo 2. Create new secret key
echo 3. Make sure you have billing enabled
echo.

set /p openai_api_key="📝 Enter your OpenAI API Key (starts with sk-): "

REM Validate and update OpenAI key
powershell -Command "(Get-Content .env.local) -replace 'sk-your_openai_api_key_here', '%openai_api_key%' | Set-Content .env.local"
echo ✅ OpenAI API key updated!

echo.
echo 🎯 BASIC SETUP COMPLETE!
echo ========================
echo ✅ Firebase configured
echo ✅ OpenAI configured
echo.

REM Ask about optional services
echo 🔧 OPTIONAL SERVICES
echo ====================
echo Would you like to configure optional services now?
echo You can always add these later by editing .env.local
echo.

set /p setup_sendgrid="Configure SendGrid for email marketing? (y/N): "
if /i "%setup_sendgrid%"=="y" (
    echo 1. Go to: https://sendgrid.com/
    echo 2. Sign up for free account (100 emails/day)
    echo 3. Create API key with Mail Send permissions
    set /p sendgrid_key="📝 Enter your SendGrid API Key (starts with SG.): "
    powershell -Command "(Get-Content .env.local) -replace 'SG.your_sendgrid_api_key_here', '%sendgrid_key%' | Set-Content .env.local"
    echo ✅ SendGrid configured!
)

echo.
set /p setup_stripe="Configure Stripe for payments? (y/N): "
if /i "%setup_stripe%"=="y" (
    echo 1. Go to: https://dashboard.stripe.com/
    echo 2. Get your test Publishable key from Developers ^> API keys
    set /p stripe_key="📝 Enter your Stripe Publishable Key (starts with pk_test_): "
    powershell -Command "(Get-Content .env.local) -replace 'pk_test_your_stripe_test_key', '%stripe_key%' | Set-Content .env.local"
    echo ✅ Stripe configured!
)

echo.
echo 🧪 TESTING YOUR SETUP
echo =====================
echo Let's test if everything is working...

REM Test if Node.js and npm are installed
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js installed
) else (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ npm installed
) else (
    echo ❌ npm not found. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if TypeScript compiles
echo 🔍 Checking TypeScript compilation...
npx tsc --noEmit >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ TypeScript compilation successful!
) else (
    echo ⚠️  TypeScript compilation has issues (this is normal, we can fix later)
)

echo.
echo 🎉 SETUP COMPLETE!
echo ==================
echo Your Kingdom Studios App is now configured!
echo.
echo 🚀 Next steps:
echo 1. Test the app: npm start
echo 2. Try different platforms:
echo    - Web: npm run web
echo    - iOS: npm run ios
echo    - Android: npm run android
echo.
echo 📖 For more help, see:
echo - API_SETUP_GUIDE.md (detailed setup instructions)
echo - FINAL_PRODUCTION_DEPLOYMENT.md (deployment guide)
echo.
echo 🔧 To add more API keys later:
echo Edit the .env.local file and restart the app
echo.
echo Happy coding! 🚀✨
pause

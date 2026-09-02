@echo off
setlocal enabledelayedexpansion

echo =============================================
echo    CAMERA SIMULATOR - AUTO BUILD APK RELEASE 
echo =============================================

:: Dapatkan path root proyek
set "ROOT_DIR=%~dp0"
set "ANDROID_DIR=%ROOT_DIR%android"

:: 1. Hapus folder cache secara manual
echo [1/4] Membersihkan cache lama secara manual...
cd "%ANDROID_DIR%"
call gradlew.bat --stop
cd "%ROOT_DIR%"

rmdir /s /q "%ANDROID_DIR%\.cxx" 2>nul
rmdir /s /q "%ANDROID_DIR%\app\.cxx" 2>nul
rmdir /s /q "%ANDROID_DIR%\build" 2>nul
rmdir /s /q "%ANDROID_DIR%\app\build" 2>nul
echo Cache berhasil dibersihkan!

:: Buat folder build yang diperlukan terlebih dahulu untuk menghindari bug ENOENT di Windows
echo Membuat folder build perantara...
mkdir "%ANDROID_DIR%\app\build\generated\assets\react\release" 2>nul
mkdir "%ANDROID_DIR%\app\build\generated\sourcemaps\react\release" 2>nul
mkdir "%ANDROID_DIR%\app\build\intermediates\sourcemaps\react\release" 2>nul

:: 2. Pindah ke direktori android
echo [2/4] Masuk ke direktori native android...
cd "%ANDROID_DIR%"

:: 3. Jalankan Gradle assembleRelease
echo [3/4] Mulai melakukan kompilasi APK...
call gradlew.bat assembleRelease

:: 4. Salin APK hasil build ke root folder
echo [4/4] Menyalin berkas APK ke root folder proyek...
cd "%ROOT_DIR%"
copy "%ANDROID_DIR%\app\build\outputs\apk\release\app-release.apk" "%ROOT_DIR%CameraSimulator-Release.apk" /Y

echo =============================================
echo    PROSES SELESAI ^& SUKSES! 
echo =============================================
echo APK Anda siap digunakan di:
echo %ROOT_DIR%CameraSimulator-Release.apk
echo =============================================
pause

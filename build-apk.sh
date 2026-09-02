#!/bin/bash

# Hentikan eksekusi jika terjadi error
set -e

echo "============================================="
echo "  CAMERA SIMULATOR - AUTO BUILD APK RELEASE  "
echo "============================================="

# Dapatkan path root proyek
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$ROOT_DIR/android"

# 1. Hapus folder cache secara manual
echo "[1/4] Membersihkan cache lama secara manual..."
cd "$ANDROID_DIR" && ./gradlew --stop || true
cd "$ROOT_DIR"

rm -rf "$ANDROID_DIR/.cxx" || true
rm -rf "$ANDROID_DIR/app/.cxx" || true
rm -rf "$ANDROID_DIR/build" || true
rm -rf "$ANDROID_DIR/app/build" || true
echo "Cache berhasil dibersihkan!"

# Buat folder build yang diperlukan terlebih dahulu
echo "Membuat folder build perantara..."
mkdir -p "$ANDROID_DIR/app/build/generated/assets/react/release"
mkdir -p "$ANDROID_DIR/app/build/generated/sourcemaps/react/release"
mkdir -p "$ANDROID_DIR/app/build/intermediates/sourcemaps/react/release"

# 2. Pindah ke direktori android
echo "[2/4] Masuk ke direktori native android..."
cd "$ANDROID_DIR"

# 3. Jalankan Gradle assembleRelease
echo "[3/4] Mulai melakukan kompilasi APK..."
./gradlew assembleRelease

# 4. Salin APK hasil build ke root folder agar mudah diambil
echo "[4/4] Menyalin berkas APK ke root folder proyek..."
cp "$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk" "$ROOT_DIR/CameraSimulator-Release.apk"

echo "============================================="
echo "   PROSES SELESAI & SUKSES! 🎉               "
echo "============================================="
echo "APK Anda siap digunakan di:"
echo "📂 $ROOT_DIR/CameraSimulator-Release.apk"
echo "============================================="

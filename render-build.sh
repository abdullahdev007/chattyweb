#!/bin/bash
set -e  # توقف إذا صار أي خطأ

# تحديث npm
npm install -g npm@9

# تنضيف node_modules و lockfile
rm -rf node_modules package-lock.json

# تثبيت dependencies للجذر + workspaces
npm install

# بناء client
cd client
npm install --force
npm run build
cd ..

# بناء backend
cd backend
npm install --force
npm run build
cd ..

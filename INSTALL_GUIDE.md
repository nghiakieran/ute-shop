# 📦 Hướng Dẫn Cài Đặt UTEShop

## 🚀 Bước 1: Cài Đặt Dependencies

Mở terminal trong thư mục `UTEShop` và chạy:

### Với npm:
```bash
npm install
```

### Với yarn:
```bash
yarn install
```

## ⚙️ Bước 2: Tạo file .env

Tạo file `.env` trong thư mục gốc:

```bash
# Copy từ example
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 🏃 Bước 3: Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
```

Server sẽ chạy tại: **http://localhost:3000**

## 🔧 Troubleshooting

### Lỗi: "Cannot find module"
```bash
# Xóa node_modules và install lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Peer dependencies
File `.npmrc` đã được cấu hình với `legacy-peer-deps=true`

### Lỗi TypeScript
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run dev
```

## ✅ Kiểm Tra Cài Đặt

1. Không có lỗi TypeScript trong terminal
2. Browser mở tại http://localhost:3000
3. Trang chủ hiển thị đúng
4. Console không có lỗi

## 📝 Next Steps

Sau khi cài đặt thành công:
1. Đọc [GETTING_STARTED.md](./GETTING_STARTED.md) để bắt đầu
2. Đọc [REDUX_GUIDE.md](./REDUX_GUIDE.md) để hiểu Redux
3. Đọc [STRUCTURE.md](./STRUCTURE.md) để hiểu cấu trúc

Happy coding! 🎉


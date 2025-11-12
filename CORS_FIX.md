# CORS Configuration Fixed

## Những gì đã sửa:

### 1. Backend (NestJS) - `src/main.ts`

Đã cập nhật CORS configuration với đầy đủ options:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  maxAge: 3600,
});
```

### 2. Frontend (React) - Tạo file `.env`

Đã tạo file `.env` với:

```env
VITE_API_BASE_URL=http://localhost:3009/ute-shop/api
```

### 3. Cập nhật API Constants

Đã update default API_BASE_URL trong `src/constants/api.constants.ts`

## Cách sử dụng:

1. **Restart Backend Server:**

   ```bash
   cd ute-shop-be
   npm run start:dev
   ```

2. **Restart Frontend Server:**

   ```bash
   cd ute-shop
   npm run dev
   ```

3. **Kiểm tra:**
   - Frontend chạy ở: `http://localhost:5173` (hoặc 3000)
   - Backend chạy ở: `http://localhost:3009`
   - API endpoint: `http://localhost:3009/ute-shop/api/auth/register`

## Lưu ý:

- Nếu frontend chạy ở port khác (không phải 3000, 5173, 5174), cần thêm port đó vào mảng `origin` trong `main.ts`
- Credentials được enable để hỗ trợ cookies (cho refresh token)
- maxAge: 3600s = preflight request được cache 1 giờ

## Troubleshooting:

Nếu vẫn còn lỗi CORS:

1. **Hard refresh browser:** Ctrl + Shift + R (hoặc Cmd + Shift + R trên Mac)
2. **Clear browser cache**
3. **Kiểm tra port:** Đảm bảo frontend và backend đang chạy đúng port
4. **Check network tab:** Xem request có đi đến đúng URL không
5. **Restart cả 2 servers**

## Production Setup:

Khi deploy lên production, cần:

1. Thêm production domain vào `origin` array trong `main.ts`
2. Update `.env.production` file với production API URL
3. Tắt `origin: true` và chỉ list cụ thể các domains được phép

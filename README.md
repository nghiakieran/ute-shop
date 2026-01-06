# UTE Shop - Frontend (Project CNPM)

Đây là project frontend giao diện khách hàng cho hệ thống UTE Shop.

## Công nghệ sử dụng

- ReactJS (TypeScript)
- Redux Toolkit, Redux Persist
- Ant Design, TailwindCSS
- Axios
- React Router
- Hỗ trợ SSR/SEO cơ bản nếu cần (có thể cần chỉnh lại tuỳ cấu hình thực tế)

## Hướng dẫn cài đặt

1. **Yêu cầu:**
   - Node.js >= v14
   - npm hoặc yarn

2. **Clone repo:**

   ```bash
   git clone https://github.com/nghiakieran/ute-shop.git
   cd ute-shop
   ```

3. **Cài dependencies:**

   ```bash
   npm install
   # hoặc
   yarn install
   ```

4. **Tạo file `.env` ở thư mục gốc**, ví dụ:

   ```
   # Nếu bạn cần đổi API server, cập nhật:
   REACT_APP_API_URL=http://localhost:3009/ute-shop/api

   # Đối với production, nên chỉ build rồi serve tĩnh, cấu hình chứ không bật devTools:
   NODE_ENV=development
   ```

   - Bạn hoàn toàn có thể thêm các biến khác tuỳ thuộc cấu hình backend hoặc tích hợp bên thứ 3 (ví dụ: Cloudinary key, Chat, v.v.).
   - Nếu backend chạy ở domain khác thì cập nhật lại giá trị `REACT_APP_API_URL`.

## Cách chạy dự án

### Phát triển (development)

```bash
npm start
# hoặc
yarn start
```

Web sẽ mặc định chạy ở http://localhost:3000  
Nếu muốn cổng khác, đặt thêm biến `PORT` trong `.env` (tuỳ vào setup CRA hay Vite).

### Build production

```bash
npm run build
# hoặc
yarn build
```

## Lưu ý:

- Một số chức năng (gửi ảnh lên Cloudinary, đăng nhập, thanh toán...) cần cấu hình backend đúng/chạy ổn định.
- Nếu dùng cùng backend mẫu [`zerrorTwo/project-cnpm-ute-shop`](https://github.com/zerrorTwo/project-cnpm-ute-shop), nhớ thiết lập CORS backend cho phép domain frontend.
- Biến môi trường sử dụng chuẩn React: mọi biến phải có prefix `REACT_APP_`.

---

**Tham khảo:**  
- [Source backend mẫu (NestJS)](https://github.com/zerrorTwo/project-cnpm-ute-shop)
- [Các thư viện React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), [Ant Design](https://ant.design/)

_Cảm ơn bạn đã sử dụng dự án!_

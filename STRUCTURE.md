# UTEShop - Cấu Trúc Dự Án

## 📁 Cấu Trúc Thư Mục

```
UTEShop/
├── public/                      # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Loading.tsx
│   │   └── index.ts
│   │
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── index.ts
│   │
│   ├── layouts/                # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── index.ts
│   │
│   ├── guards/                 # Route guards
│   │   ├── AuthGuard.tsx       # Protect authenticated routes
│   │   ├── GuestGuard.tsx      # Prevent authenticated users from accessing guest pages
│   │   └── index.ts
│   │
│   ├── redux/                  # Redux state management
│   │   ├── slices/
│   │   │   ├── auth.slice.ts   # Authentication state
│   │   │   └── user.slice.ts   # User profile state
│   │   ├── createAppSlice.ts   # Helper for creating slices with async thunks
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   └── store.ts            # Redux store configuration
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── api.utils.ts        # API client with Axios
│   │   ├── storage.utils.ts    # LocalStorage helpers
│   │   ├── validation.utils.ts # Form validation
│   │   ├── format.utils.ts     # Formatting functions
│   │   └── index.ts
│   │
│   ├── constants/              # Constants and configurations
│   │   ├── api.constants.ts    # API endpoints
│   │   ├── messages.constants.ts # Error/success messages
│   │   ├── storage.constants.ts # LocalStorage keys
│   │   └── index.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── index.ts
│   │
│   ├── providers/              # Context providers
│   │   ├── ReduxProvider.tsx
│   │   └── index.tsx
│   │
│   ├── routes/                 # Route configuration
│   │   └── index.tsx
│   │
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # Vite environment types
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── .gitignore
└── README.md
```

## 🎯 Các Điểm Chính

### 1. Redux State Management

#### **Auth Slice** (`src/redux/slices/auth.slice.ts`)
Quản lý authentication state:
- `loginUser`: Đăng nhập
- `registerUser`: Đăng ký
- `logoutUser`: Đăng xuất
- `getUserProfile`: Lấy thông tin user
- `forgotPassword`: Gửi OTP quên mật khẩu
- `verifyOtp`: Xác thực OTP
- `resetPassword`: Đặt lại mật khẩu

**Cách sử dụng:**
```tsx
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser, selectIsAuthenticated } from '@/redux/slices/auth.slice';

const dispatch = useAppDispatch();
const isAuthenticated = useAppSelector(selectIsAuthenticated);

// Login
await dispatch(loginUser({ email, password })).unwrap();
```

#### **User Slice** (`src/redux/slices/user.slice.ts`)
Quản lý user profile:
- `updateProfile`: Cập nhật thông tin
- `changePassword`: Đổi mật khẩu
- `uploadAvatar`: Upload avatar

**Cách sử dụng:**
```tsx
import { updateProfile } from '@/redux/slices/user.slice';

await dispatch(updateProfile({ fullName, phone, address })).unwrap();
```

### 2. API Client (`src/utils/api.utils.ts`)

API client với Axios, hỗ trợ:
- Tự động thêm Authorization header
- Auto refresh token khi 401
- Error handling
- Request/Response interceptors

**Cách sử dụng:**
```tsx
import { apiClient } from '@/utils/api.utils';

// GET request
const response = await apiClient.get('/products');

// POST request
const response = await apiClient.post('/auth/login', { email, password });
```

### 3. Route Guards

#### **AuthGuard** - Bảo vệ routes cần authentication
```tsx
<Route
  path="/profile"
  element={
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  }
/>
```

#### **GuestGuard** - Ngăn user đã login vào trang login/register
```tsx
<Route
  path="/login"
  element={
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  }
/>
```

### 4. Validation (`src/utils/validation.utils.ts`)

Các function validation sẵn có:
- `validateEmail(email)`: Validate email
- `validatePassword(password)`: Validate mật khẩu mạnh
- `validatePhone(phone)`: Validate số điện thoại VN
- `validateConfirmPassword(password, confirm)`: So sánh mật khẩu

### 5. Styling với Tailwind CSS

Theme colors được config sẵn:
- **Primary**: Tones màu be/beige (#b8845a)
- **Neutral**: Grayscale từ trắng đến đen
- **Font**: Inter (sans-serif) + Playfair Display (serif)

## 🚀 Cách Chạy Dự Án

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

## 📝 Best Practices

### 1. Redux Dispatch Pattern
```tsx
try {
  await dispatch(actionName(payload)).unwrap();
  // Success handling
} catch (error) {
  // Error handled by Redux
  console.error(error);
}
```

### 2. Form Validation Pattern
```tsx
const [formErrors, setFormErrors] = useState({});

const validateForm = () => {
  const errors = {
    email: validationUtils.validateEmail(formData.email) || '',
    password: validationUtils.validatePassword(formData.password) || '',
  };
  
  setFormErrors(errors);
  return !Object.values(errors).some(err => err !== '');
};
```

### 3. Loading State Pattern
```tsx
const loading = useAppSelector(selectAuthLoading);

<Button isLoading={loading}>
  Submit
</Button>
```

## 🎨 Design System

- **Colors**: Beige (#b8845a), Black (#171717), White (#fafafa)
- **Typography**: 
  - Headings: Playfair Display (serif)
  - Body: Inter (sans-serif)
- **Spacing**: Tailwind's default spacing scale
- **Animations**: Framer Motion for smooth transitions

## 📚 Tài Liệu Tham Khảo

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router v6](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/)


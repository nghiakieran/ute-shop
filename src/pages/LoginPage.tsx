import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  loginUser,
  loginWithGoogle,
  handleGoogleCallback,
  resetError,
} from '@/redux/slices/auth.slice';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useToast } from '@/hooks/useToast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get redirect path from URL params
  const redirectPath = searchParams.get('redirect') || '/';

  // Redirect if already authenticated on mount
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      dispatch(handleGoogleCallback(token));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Đăng nhập thất bại',
        description: error,
      });
      dispatch(resetError());
    }
  }, [error, dispatch, toast]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      // Login successful
      toast({
        variant: 'success',
        title: 'Chào mừng bạn đã trở lại',
        description: 'Đăng nhập thành công!',
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 500);
    } catch (err) {
      // Error handling is done in useEffect
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Chào mừng trở lại</h1>
            <p className="text-neutral-500">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ten@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  error={errors.email}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  error={errors.password}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => dispatch(loginWithGoogle())}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </Button>

            <p className="text-center text-sm text-neutral-500">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-neutral-900 hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 bg-gradient-to-br from-[#d4cac0] via-[#c9bfb5] to-[#bfb5ab] items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>

        <div className="text-center space-y-6 text-white relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-serif font-bold tracking-[0.2em]"
          >
            UTE SHOP
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl font-light max-w-md mx-auto leading-relaxed"
          >
            Thời trang phong cách Châu Âu với sự tối giản tinh tế
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

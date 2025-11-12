import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { registerUser, verifyAccount, resetError, resetRegisterState } from '@/redux/slices/auth.slice';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { OtpInput, OtpInputRef } from '@/components/OtpInput';
import { useToast } from '@/hooks/useToast';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRef = useRef<OtpInputRef>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    loading,
    error,
    isAuthenticated,
    needsVerification,
    registerEmail,
    registerPassword,
    otpError
  } = useAppSelector((state) => state.auth);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (needsVerification && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, needsVerification]);

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        variant: 'success',
        title: 'Đăng ký thành công',
        description: 'Chào mừng bạn đến UTE Shop!',
      });
      navigate('/');
    }
  }, [isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Đăng ký thất bại',
        description: error,
      });
      dispatch(resetError());
    }
  }, [error, dispatch, toast]);

  useEffect(() => {
    if (otpError) {
      toast({
        variant: 'destructive',
        title: 'Xác thực thất bại',
        description: otpError,
      });
      otpRef.current?.reset();
      dispatch(resetError());
    }
  }, [otpError, dispatch, toast]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Only send fullName, email, password to API (confirmPassword is FE validation only)
    dispatch(registerUser({ fullName, email, password, confirmPassword }));
  };

  const handleVerifyOtp = (otp: string) => {
    if (registerEmail && registerPassword && fullName) {
      dispatch(verifyAccount({ email: registerEmail, password: registerPassword, fullName, otp }));
    }
  };

  const handleResendOtp = () => {
    if (registerEmail && fullName) {
      dispatch(registerUser({ fullName, email: registerEmail, password: registerPassword!, confirmPassword: registerPassword! }));
      setCountdown(60);
      setCanResend(false);
      toast({
        variant: 'success',
        title: 'Gửi lại OTP',
        description: 'Mã xác thực mới đã được gửi đến email của bạn',
      });
    }
  };

  if (needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#bfb5ab] via-[#c9bfb5] to-[#d4cac0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a verification code to
            </p>
            <p className="font-medium text-gray-900">{registerEmail}</p>
          </div>

          <div className="space-y-4">
            <OtpInput
              ref={otpRef}
              length={6}
              onComplete={handleVerifyOtp}
              error={!!otpError}
              disabled={loading}
            />
          </div>

          <div className="text-center space-y-2">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend OTP in {countdown}s
              </p>
            )}
          </div>

          <Button
            onClick={() => {
              const otp = otpRef.current?.getOtp();
              if (otp && otp.length === 6) {
                handleVerifyOtp(otp);
              } else {
                toast({
                  variant: 'destructive',
                  title: 'Invalid OTP',
                  description: 'Please enter all 6 digits',
                });
              }
            }}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <button
            onClick={() => dispatch(resetRegisterState())}
            className="w-full text-sm text-gray-500 hover:text-gray-900"
          >
            Back to registration
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 bg-gradient-to-br from-[#bfb5ab] via-[#c9bfb5] to-[#d4cac0] items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>

        <div className="text-center space-y-6 text-white relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-serif font-bold tracking-[0.2em]"
          >
            ATELIER
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl font-light max-w-md mx-auto leading-relaxed"
          >
            Join our community of fashion enthusiasts
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Create account</h1>
            <p className="text-neutral-500">Join us and discover timeless fashion</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  error={errors.fullName}
                  autoComplete="name"
                />
              </div>
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  error={errors.password}
                  autoComplete="new-password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="text-neutral-900 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
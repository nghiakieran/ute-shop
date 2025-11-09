import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { forgotPassword, verifyOtp, resetPassword, resetForgotPassword } from '@/redux/slices/auth.slice';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { OtpInput, OtpInputRef } from '@/components/OtpInput';
import { useToast } from '@/hooks/useToast';
import { validationUtils } from '@/utils/validation.utils';

type Step = 'email' | 'otp' | 'password' | 'success';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const otpRef = useRef<OtpInputRef>(null);

  const { loading, error, forgotPasswordSent, otpVerified, resetPasswordSuccess } =
    useAppSelector((state) => state.auth);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, step]);

  // Handle forgot password success -> move to OTP step
  useEffect(() => {
    if (forgotPasswordSent && step === 'email') {
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to ${email}`,
      });
    }
  }, [forgotPasswordSent, step, email, toast]);

  // Handle OTP verified -> move to password step
  useEffect(() => {
    if (otpVerified && step === 'otp') {
      setStep('password');
      toast({
        title: 'OTP Verified',
        description: 'Please enter your new password',
      });
    }
  }, [otpVerified, step, toast]);

  // Handle reset password success -> move to success step
  useEffect(() => {
    if (resetPasswordSuccess && step === 'password') {
      setStep('success');
    }
  }, [resetPasswordSuccess, step]);

  // Handle errors
  useEffect(() => {
    if (error) {
      if (step === 'otp') {
        setOtpError(true);
        otpRef.current?.reset();
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    }
  }, [error, step, toast]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(resetForgotPassword());
    };
  }, [dispatch]);

  // Step 1: Send email
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validationUtils.validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    dispatch(forgotPassword({ email }));
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError(true);
      return;
    }

    dispatch(verifyOtp({ email, otp: otpValue }));
  };

  // Handle OTP change
  const handleOtpChange = (newOtp: string[]) => {
    setOtp(newOtp);
    setOtpError(false);

    // Auto-submit when all digits are filled
    if (newOtp.every((digit) => digit !== '')) {
      setTimeout(() => {
        dispatch(verifyOtp({ email, otp: newOtp.join('') }));
      }, 300);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;

    setCountdown(60);
    setCanResend(false);
    setOtp(new Array(6).fill(''));
    setOtpError(false);
    otpRef.current?.reset();

    dispatch(forgotPassword({ email }));
    toast({
      title: 'OTP Resent',
      description: 'A new verification code has been sent',
    });
  };

  // Step 3: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValidation = validationUtils.validatePassword(password);
    const confirmValidation = validationUtils.validateConfirmPassword(
      password,
      confirmPassword
    );

    if (passwordValidation || confirmValidation) {
      setPasswordError(passwordValidation || confirmValidation || '');
      return;
    }

    dispatch(
      resetPassword({
        email,
        otp: otp.join(''),
        newPassword: password,
        confirmPassword,
      })
    );
  };

  const handleBackToLogin = () => {
    dispatch(resetForgotPassword());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-neutral-500 mb-8">
                  Enter your email and we'll send you a verification code
                </p>

                <form onSubmit={handleSendEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        className="pl-10"
                        error={emailError}
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-600">{emailError}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold mb-2">Verify Code</h1>
                <p className="text-neutral-500 mb-8">
                  Enter the 6-digit code sent to <strong>{email}</strong>
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <OtpInput
                      ref={otpRef}
                      onChange={handleOtpChange}
                      disabled={loading}
                      error={otpError}
                    />
                    {otpError && (
                      <p className="text-sm text-red-600 text-center">
                        Invalid verification code
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    {countdown > 0 ? (
                      <span className="text-neutral-500">
                        Resend code in{' '}
                        <span className="font-semibold text-neutral-900">
                          0:{countdown < 10 ? `0${countdown}` : countdown}
                        </span>
                      </span>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="text-neutral-900 font-medium hover:underline"
                        disabled={!canResend}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    className="w-full"
                    disabled={loading || otp.some((digit) => !digit)}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Reset Password */}
            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                <p className="text-neutral-500 mb-8">
                  Enter your new password
                </p>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      error={passwordError}
                    />
                    <p className="text-xs text-neutral-500">
                      At least 6 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError('');
                      }}
                      error={passwordError}
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Password Reset!</h1>
                <p className="text-neutral-500 mb-8">
                  Your password has been successfully reset.
                </p>

                <Button onClick={handleBackToLogin} className="w-full">
                  Back to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

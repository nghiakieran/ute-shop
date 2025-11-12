import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { forgotPassword, resetPassword, resetForgotPassword } from '@/redux/slices/auth.slice';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { OtpInput, OtpInputRef } from '@/components/OtpInput';
import { useToast } from '@/hooks/useToast';

type Step = 'email' | 'reset' | 'success';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const otpRef = useRef<OtpInputRef>(null);

    const { loading, error, forgotPasswordSent, resetPasswordSuccess, otpError } =
        useAppSelector((state) => state.auth);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (step === 'reset' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, step]);

    // Handle forgot password success -> move to reset step
    useEffect(() => {
        if (forgotPasswordSent && step === 'email') {
            setStep('reset');
            setCountdown(60);
            setCanResend(false);
            toast({
                variant: 'success',
                title: 'Gửi OTP thành công',
                description: `Mã xác thực đã được gửi đến ${email}`,
            });
        }
    }, [forgotPasswordSent, step, email, toast]);

    // Handle reset password success -> move to success step
    useEffect(() => {
        if (resetPasswordSuccess && step === 'reset') {
            setStep('success');
            toast({
                variant: 'success',
                title: 'Đặt lại mật khẩu thành công',
                description: 'Bạn có thể đăng nhập với mật khẩu mới',
            });
        }
    }, [resetPasswordSuccess, step, toast]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi',
                description: error,
            });
        }
    }, [error, toast]);

    useEffect(() => {
        if (otpError) {
            toast({
                variant: 'destructive',
                title: 'Xác thực thất bại',
                description: otpError,
            });
            otpRef.current?.reset();
        }
    }, [otpError, toast]);

    // Cleanup
    useEffect(() => {
        return () => {
            dispatch(resetForgotPassword());
        };
    }, [dispatch]);

    // Step 1: Send email
    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            return;
        }

        setEmailError('');
        dispatch(forgotPassword({ email }));
    };

    // Step 2: Verify OTP and reset password
    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast({
                variant: 'destructive',
                title: 'OTP không hợp lệ',
                description: 'Vui lòng nhập đầy đủ 6 chữ số',
            });
            return;
        }

        if (!newPassword) {
            setPasswordError('Password is required');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setPasswordError('');
        dispatch(resetPassword({ email, otp, newPassword, confirmPassword }));
    };

    const handleResendOtp = () => {
        dispatch(forgotPassword({ email }));
        setCountdown(60);
        setCanResend(false);
    };

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">Forgot Password?</h1>
                            <p className="text-neutral-500">
                                Enter your email and we'll send you a verification code
                            </p>
                        </div>

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
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        error={emailError}
                                        autoComplete="email"
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-sm text-red-600">{emailError}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Verification Code'}
                            </Button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                );

            case 'reset':
                return (
                    <motion.div
                        key="reset"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">Reset Password</h1>
                            <p className="text-neutral-500">
                                Enter the verification code sent to {email}
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-4">
                                <Label>Verification Code</Label>
                                <OtpInput
                                    ref={otpRef}
                                    length={6}
                                    onChange={(otpArray) => setOtp(otpArray.join(''))}
                                    error={!!otpError}
                                    disabled={loading}
                                />
                                <div className="text-center">
                                    {canResend ? (
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={loading}
                                            className="text-sm text-primary hover:underline disabled:opacity-50"
                                        >
                                            Resend Code
                                        </button>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Resend code in {countdown}s
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10"
                                        error={passwordError}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        error={passwordError}
                                        autoComplete="new-password"
                                    />
                                </div>
                                {passwordError && (
                                    <p className="text-sm text-red-600">{passwordError}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('email');
                                        dispatch(resetForgotPassword());
                                    }}
                                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    Change email
                                </button>
                            </div>
                        </form>
                    </motion.div>
                );

            case 'success':
                return (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100"
                        >
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">Password Reset!</h1>
                            <p className="text-neutral-500">
                                Your password has been successfully reset
                            </p>
                        </div>

                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                        >
                            Back to Login
                        </Button>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image/Branding */}
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
                        ATELIER
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl font-light max-w-md mx-auto leading-relaxed"
                    >
                        Reset your password and continue your journey
                    </motion.p>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    {step !== 'success' && (
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to login
                        </Link>
                    )}

                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

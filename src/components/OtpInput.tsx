/**
 * OTP Input Component
 * 6-digit OTP input với auto-focus
 */

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Input } from '@/components/Input';

interface OtpInputProps {
  onChange: (otp: string[]) => void;
  disabled?: boolean;
  error?: boolean;
}

export interface OtpInputRef {
  focusInput: (index: number) => void;
  reset: () => void;
}

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(
  ({ onChange, disabled, error }, ref) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      focusInput(index: number) {
        if (inputsRef.current[index]) {
          inputsRef.current[index]?.focus();
        }
      },
      reset() {
        setOtp(new Array(6).fill(''));
        inputsRef.current[0]?.focus();
      },
    }));

    const handleChange = (value: string, index: number) => {
      // Only allow numbers
      if (!/^[0-9]$/.test(value) && value !== '') return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onChange(newOtp);

      // Auto-focus next input
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          // Focus previous input on backspace
          inputsRef.current[index - 1]?.focus();
        } else {
          // Clear current input
          const newOtp = [...otp];
          newOtp[index] = '';
          setOtp(newOtp);
          onChange(newOtp);
        }
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').trim();

      // Only process if it's 6 digits
      if (/^\d{6}$/.test(pastedData)) {
        const newOtp = pastedData.split('');
        setOtp(newOtp);
        onChange(newOtp);
        // Focus last input
        inputsRef.current[5]?.focus();
      }
    };

    return (
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {otp.map((value, index) => (
          <Input
            key={index}
            type="text"
            inputMode="numeric"
            value={value}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => (inputsRef.current[index] = el)}
            disabled={disabled}
            error={error ? ' ' : undefined}
            className={`
              text-center text-2xl md:text-4xl font-semibold
              w-12 h-12 md:w-14 md:h-14
              px-0 py-0
              leading-none
              ${error ? 'border-red-500 animate-shake' : ''}
            `}
          />
        ))}
      </div>
    );
  }
);

OtpInput.displayName = 'OtpInput';


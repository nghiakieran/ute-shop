/**
 * VoucherCard Component
 * Display voucher information with status and details
 */

import { Ticket, Copy, Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components';
import type { Voucher, VoucherStatus } from '@/types/review';

interface VoucherCardProps {
  voucher: Voucher;
}

export const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const [copied, setCopied] = useState(false);

  const getVoucherStatus = (): VoucherStatus => {
    if (voucher.status === 'USED') return 'USED';
    const isExpired = new Date(voucher.expiryDate) < new Date();
    if (voucher.status === 'EXPIRED' || isExpired) return 'EXPIRED';
    if (voucher.status === 'INACTIVE') return 'INACTIVE';
    return 'ACTIVE';
  };

  const status = getVoucherStatus();

  const getStatusConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          text: 'Còn hạn',
          className: 'bg-green-50 text-green-700 border-green-200',
        };
      case 'USED':
        return {
          text: 'Đã sử dụng',
          className: 'bg-gray-50 text-gray-700 border-gray-200',
        };
      case 'EXPIRED':
        return {
          text: 'Hết hạn',
          className: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'INACTIVE':
        return {
          text: 'Không hoạt động',
          className: 'bg-gray-50 text-gray-600 border-gray-200',
        };
    }
  };

  const statusConfig = getStatusConfig();

  const copyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getDiscountText = () => {
    if (voucher.type === 'PERCENTAGE') {
      return `Giảm ${voucher.value ?? 0}%`;
    }
    return `Giảm ${(voucher.value ?? 0).toLocaleString('vi-VN')}₫`;
  };

  return (
    <div
      className={cn(
        'bg-card border rounded-lg overflow-hidden transition-all',
        status === 'ACTIVE' && 'hover:shadow-lg',
        status !== 'ACTIVE' && 'opacity-60'
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{getDiscountText()}</h3>
              <p className="text-sm text-muted-foreground">
                Đơn tối thiểu: {(voucher.minOrderValue ?? 0).toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border',
              statusConfig.className
            )}
          >
            {statusConfig.text}
          </span>
        </div>

        {/* Voucher Code */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Mã voucher</p>
          <div className="flex items-center justify-between">
            <code className="text-lg font-mono font-bold tracking-wider">{voucher.code}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              disabled={status !== 'ACTIVE'}
              className="ml-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Đã copy
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {voucher.maxDiscount !== null && voucher.maxDiscount !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giảm tối đa:</span>
              <span className="font-medium">{voucher.maxDiscount.toLocaleString('vi-VN')}₫</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Hạn sử dụng:
            </span>
            <span className="font-medium">{formatDate(voucher.expiryDate)}</span>
          </div>
          {voucher.usedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Đã sử dụng:</span>
              <span className="font-medium">{formatDate(voucher.usedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

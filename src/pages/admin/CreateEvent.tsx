import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Send,
  Loader2,
  Link as LinkIcon,
  Type,
  Search,
  Users,
  CheckSquare,
  Bell,
  Image as ImageIcon,
  X,
  Smartphone,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils'; // Đảm bảo bạn có util này hoặc xóa đi dùng string thường
import {
  notificationAPI,
  UserBasic,
  CreateNotificationEventPayload,
} from '../../utils/notification.api';

// Định nghĩa lại interface cho State form để đồng bộ UI và Logic
interface EventFormData {
  title: string;
  description: string;
  type: 'EVENT' | 'PROMOTION' | 'NEWS' | 'SYSTEM'; // Mở rộng type cho UI
  url: string;
  scheduledAt: string;
  imagePreview: string | null; // UI only (nếu API chưa hỗ trợ thì chỉ để hiển thị)
}

export const CreateEventForm = () => {
  const [loading, setLoading] = useState(false);

  // --- States cho User Selection ---
  const [users, setUsers] = useState<UserBasic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [sendToAll, setSendToAll] = useState(false);

  // --- Form Data ---
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    type: 'EVENT',
    url: '',
    scheduledAt: '',
    imagePreview: null,
  });

  // Load danh sách user (Debounce search)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Giả sử API search trả về rỗng nếu search term rỗng, hoặc trả về list default
        const result = await notificationAPI.searchUsers(searchTerm);
        setUsers(result || []);
      } catch (error) {
        console.error('Lỗi tải user', error);
      }
    };

    const timeoutId = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle thay đổi input text/textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle upload ảnh (Preview)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imagePreview: imageUrl }));
      // Lưu ý: Nếu API cần file, bạn cần thêm state `file` để gửi lên server
    }
  };

  // Toggle chọn 1 user
  const toggleUser = (userId: number) => {
    if (sendToAll) return;
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) return prev.filter((id) => id !== userId);
      return [...prev, userId];
    });
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title) {
      toast.error('Vui lòng nhập tiêu đề!');
      return;
    }
    if (!sendToAll && selectedUserIds.length === 0) {
      toast.error('Vui lòng chọn người nhận hoặc "Gửi tất cả"!');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateNotificationEventPayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type === 'EVENT' ? 'EVENT' : 'EVENT', // Map lại nếu API chỉ nhận 'EVENT'
        url: formData.url,
        sendToAll,
        recipientIds: sendToAll ? [] : selectedUserIds,
        scheduledAt: formData.scheduledAt
          ? new Date(formData.scheduledAt).toISOString()
          : undefined,
        // image: formData.imagePreview // Thêm vào nếu API hỗ trợ gửi link ảnh
      };

      await notificationAPI.createNotificationEvent(payload);

      toast.success(
        `Đã lên lịch gửi cho ${sendToAll ? 'tất cả mọi người' : selectedUserIds.length + ' người'}!`
      );

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'EVENT',
        url: '',
        scheduledAt: '',
        imagePreview: null,
      });
      setSelectedUserIds([]);
      setSendToAll(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
      {/* --- CỘT 1: FORM NHẬP LIỆU --- */}
      <div className="lg:col-span-2 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full"
        >
          {/* Header Form */}
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-indigo-600" />
              Tạo Thông Báo Mới
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gửi thông báo sự kiện hoặc khuyến mãi đến người dùng.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. CHỌN NGƯỜI NHẬN */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Chọn người nhận
              </h3>

              {/* Checkbox Gửi tất cả */}
              <div
                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors mb-4 ${
                  sendToAll
                    ? 'bg-indigo-100 border-indigo-200'
                    : 'bg-white border border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setSendToAll(!sendToAll)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    sendToAll ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'
                  }`}
                >
                  {sendToAll && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Gửi cho tất cả người dùng hệ thống
                  </span>
                  <p className="text-xs text-gray-500">
                    Thông báo sẽ được gửi đến toàn bộ user đang hoạt động
                  </p>
                </div>
              </div>

              {/* Search Box (Ẩn nếu chọn tất cả) */}
              {!sendToAll && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    {users.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500">
                        Không tìm thấy người dùng
                      </div>
                    ) : (
                      users.map((user) => {
                        const isSelected = selectedUserIds.includes(user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => toggleUser(user.id)}
                            className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b last:border-0 border-gray-100 ${
                              isSelected ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <div
                              className={`w-4 h-4 mr-3 rounded border flex items-center justify-center ${
                                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <CheckSquare className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-2 text-right text-xs text-gray-500">
                    Đã chọn:{' '}
                    <span className="font-bold text-indigo-600">{selectedUserIds.length}</span>{' '}
                    người dùng
                  </div>
                </div>
              )}
            </div>

            {/* 2. LOẠI THÔNG BÁO (UI CHIPS) */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'EVENT', label: 'Sự kiện' },
                { id: 'PROMOTION', label: 'Khuyến mãi' },
                { id: 'NEWS', label: 'Tin tức' },
                { id: 'SYSTEM', label: 'Hệ thống' },
              ].map((type) => (
                <div
                  key={type.id}
                  onClick={() => setFormData((prev) => ({ ...prev, type: type.id as any }))}
                  className={`cursor-pointer text-center py-2 px-1 rounded-lg border text-sm font-medium transition-all ${
                    formData.type === type.id
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-200'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </div>
              ))}
            </div>

            {/* 3. NỘI DUNG CHÍNH */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ví dụ: Siêu Sale 12.12"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập nội dung ngắn gọn để thu hút khách hàng..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  maxLength={200}
                />
                <div className="text-right text-xs text-gray-400">
                  {formData.description.length}/200
                </div>
              </div>
            </div>

            {/* 4. UPLOAD ẢNH (UI Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh (Tùy chọn)
              </label>
              {formData.imagePreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imagePreview: null })}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                  <span className="text-xs text-gray-500">Click để tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* 5. CÀI ĐẶT NÂNG CAO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liên kết (URL)
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="/products/123"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hẹn giờ gửi</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {formData.scheduledAt ? 'Lên lịch gửi' : 'Gửi thông báo'}
            </button>
          </div>
        </form>
      </div>

      {/* --- CỘT 2: PREVIEW MOBILE --- */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
              Xem trước
            </h3>
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              iOS / Android
            </div>
          </div>

          {/* Mockup iPhone */}
          <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800 relative max-w-[300px] mx-auto h-[600px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 bg-black rounded-b-xl z-20"></div>

            <div className="bg-white w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col">
              <div className="h-10 bg-white flex items-center justify-between px-6 text-[10px] font-bold pt-2">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                {/* Item Notification Preview */}
                {formData.title || formData.description ? (
                  <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                        <Bell className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        Nexo App • Vừa xong
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 break-words">
                          {formData.title || 'Tiêu đề thông báo'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 break-words">
                          {formData.description || 'Nội dung sẽ hiển thị ở đây...'}
                        </p>
                      </div>
                      {formData.imagePreview && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={formData.imagePreview} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Smartphone className="w-12 h-12 opacity-20" />
                    <p className="text-xs">Chưa có nội dung</p>
                  </div>
                )}

                {/* Dummy Content Background */}
                <div className="mt-6 space-y-3 opacity-20 pointer-events-none select-none grayscale">
                  <div className="h-32 bg-gray-300 rounded-xl w-full"></div>
                  <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
                  <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Database, Lock, Unlock, Search, Trash2, Filter, Check, X, 
  RefreshCw, Download, Edit3, Calendar, TrendingUp, UserCheck, 
  Clock, AlertCircle, FileSpreadsheet, LogOut, MessageSquare
} from 'lucide-react';
import { 
  getAllBookingsFromFirebase, 
  updateBookingStatusInFirebase, 
  updateBookingAdminNotesInFirebase, 
  deleteBookingFromFirebase,
  Booking 
} from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected booking for internal note editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState('');

  // Password for admin access
  const ADMIN_PASSCODE = 'admin888';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setErrorMsg('');
      localStorage.setItem('admin_auth_state', 'true');
    } else {
      setErrorMsg('密碼錯誤！請輸入正確的管理員存取密碼。');
      setPasscode('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth_state');
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth_state');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllBookingsFromFirebase();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings from Firebase', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    try {
      await updateBookingStatusInFirebase(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert('更新預約狀態失敗，請重試！');
    }
  };

  const startEditingNote = (id: string, currentNotes: string = '') => {
    setEditingId(id);
    setEditingNoteValue(currentNotes);
  };

  const saveAdminNote = async (id: string) => {
    try {
      await updateBookingAdminNotesInFirebase(id, editingNoteValue);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, adminNotes: editingNoteValue } : b));
      setEditingId(null);
    } catch (error) {
      alert('更新備忘錄失敗，請重試！');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`⚠️ 警告：您確定要永久刪除此筆預約資料 (${id}) 嗎？此操作無法還原。`)) {
      try {
        await deleteBookingFromFirebase(id);
        setBookings(prev => prev.filter(b => b.id !== id));
      } catch (error) {
        alert('刪除預約資料失敗，請重試！');
      }
    }
  };

  // Export data as CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    
    // CSV Header
    const headers = ['登記編號', '姓名', '聯絡電話', '預約日期', '時段', '項目', '登記日期', '狀態', '內部備忘錄'];
    
    const rows = bookings.map(b => [
      b.id,
      b.name,
      b.phone,
      b.date,
      b.timeSlot,
      b.serviceName,
      b.timestamp,
      b.status || 'pending',
      b.adminNotes || ''
    ]);
    
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `特快船牌驗眼_預約名單_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and search logic
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || (b.status || 'pending') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => (b.status || 'pending') === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-marine-50 text-marine-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-2xl text-slate-800 tracking-tight">管理員後台系統</h2>
          <p className="text-slate-500 text-xs mt-2 mb-6">本介面僅供診所/中心驗眼管理人員登入，請輸入授權密碼。</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="請輸入後台密碼 (預設: admin888)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-marine-500 rounded-xl text-center text-sm tracking-widest font-semibold focus:outline-none focus:ring-1 focus:ring-marine-500"
                autoFocus
              />
              {errorMsg && (
                <p className="text-rose-500 text-xs mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-marine-600 hover:bg-marine-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-marine-600/10 cursor-pointer"
            >
              登入系統
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono">SECURE FIRESTORE CONSOLE PANEL</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 rounded-3xl border border-slate-100 p-4 md:p-8 text-left mt-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-marine-600 mb-1">
            <Database className="w-5 h-5" />
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Admin Panel (Realtime)</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight">
            船牌驗眼預約後台管理
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            即時檢索、修改狀態、編寫內部備忘錄，並安全儲存至 Firebase Cloud Firestore。
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadBookings}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            整理資料
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={bookings.length === 0}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            一鍵匯出 Excel (CSV)
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            登出
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold mb-1">預約總數</div>
          <div className="flex items-end justify-between">
            <span className="font-display text-2xl font-black text-slate-800">{stats.total}</span>
            <span className="p-1.5 bg-slate-50 text-slate-500 rounded-lg"><Calendar className="w-4 h-4" /></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs text-amber-500 font-semibold mb-1">等候審核 (Pending)</div>
          <div className="flex items-end justify-between">
            <span className="font-display text-2xl font-black text-amber-600">{stats.pending}</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-4 h-4" /></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs text-blue-500 font-semibold mb-1">已確認 (Confirmed)</div>
          <div className="flex items-end justify-between">
            <span className="font-display text-2xl font-black text-blue-600">{stats.confirmed}</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><UserCheck className="w-4 h-4" /></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-xs text-emerald-500 font-semibold mb-1">已完成 (Completed)</div>
          <div className="flex items-end justify-between">
            <span className="font-display text-2xl font-black text-emerald-600">{stats.completed}</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Check className="w-4 h-4" /></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-400 font-semibold mb-1">已取消 (Cancelled)</div>
          <div className="flex items-end justify-between">
            <span className="font-display text-2xl font-black text-rose-600">{stats.cancelled}</span>
            <span className="p-1.5 bg-rose-50 text-rose-500 rounded-lg"><X className="w-4 h-4" /></span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋姓名、聯絡電話或登記編號..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-marine-500 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-marine-500"
          />
        </div>
        
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto shrink-0 pb-1 md:pb-0">
          {[
            { id: 'all', label: '全部預約', count: stats.total },
            { id: 'pending', label: '等候審核', count: stats.pending, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { id: 'confirmed', label: '已確認', count: stats.confirmed, color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { id: 'completed', label: '已完結', count: stats.completed, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { id: 'cancelled', label: '已取消', count: stats.cancelled, color: 'text-rose-600 bg-rose-50 border-rose-100' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition shrink-0 cursor-pointer ${
                statusFilter === tab.id 
                  ? 'bg-slate-800 border-slate-800 text-white shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label} <span className="opacity-70 ml-1 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Cards for responsive view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-marine-600 animate-spin" />
            <p className="text-xs text-slate-400">正在與 Cloud Firestore 同步預約資料...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-300" />
            無符合搜尋條件的預約記錄。
          </div>
        ) : (
          <>
            {/* Desktop View Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs">
                    <th className="py-3.5 px-4 font-mono">登記編號</th>
                    <th className="py-3.5 px-4">申請人姓名</th>
                    <th className="py-3.5 px-4">聯絡電話</th>
                    <th className="py-3.5 px-4">預約日期 / 時段</th>
                    <th className="py-3.5 px-4">服務項目</th>
                    <th className="py-3.5 px-4">狀態</th>
                    <th className="py-3.5 px-4 max-w-[200px]">內部備忘錄</th>
                    <th className="py-3.5 px-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{b.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{b.name}</td>
                      <td className="py-3.5 px-4">
                        <a href={`tel:${b.phone}`} className="hover:underline text-marine-600 font-medium">
                          {b.phone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">{b.date}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{b.timeSlot} (星期三)</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{b.serviceName}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={b.status || 'pending'}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                          className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase transition cursor-pointer ${
                            (b.status || 'pending') === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            b.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            b.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            'bg-rose-50 border-rose-200 text-rose-700'
                          }`}
                        >
                          <option value="pending">等候審核 (Pending)</option>
                          <option value="confirmed">已確認 (Confirmed)</option>
                          <option value="completed">已完結 (Completed)</option>
                          <option value="cancelled">已取消 (Cancelled)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {editingId === b.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingNoteValue}
                              onChange={(e) => setEditingNoteValue(e.target.value)}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full focus:outline-none"
                              placeholder="新增內部筆記..."
                              autoFocus
                            />
                            <button
                              onClick={() => saveAdminNote(b.id)}
                              className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => startEditingNote(b.id, b.adminNotes)}
                            className="group flex items-center justify-between gap-1 cursor-pointer hover:bg-slate-100/50 p-1 rounded transition min-h-[24px]"
                          >
                            <span className={b.adminNotes ? 'text-slate-600' : 'text-slate-300 italic'}>
                              {b.adminNotes || '無備忘錄 (點擊編輯)'}
                            </span>
                            <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0 transition" />
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`https://wa.me/852${b.phone}?text=${encodeURIComponent(
                              `你好 ${b.name}，我是驗眼中心。關於您在 ${b.date} ${b.timeSlot} 的特快船牌驗眼預約 (登記ID: ${b.id})，我們已經為您核實。請問您當天是否能如期出席？`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                            title="WhatsApp 聯絡客戶"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            title="刪除資料"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card Layout */}
            <div className="block lg:hidden divide-y divide-slate-100">
              {filteredBookings.map(b => (
                <div key={b.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 transition text-xs text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700 text-sm">{b.id}</span>
                    <select
                      value={b.status || 'pending'}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                      className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] uppercase cursor-pointer ${
                        (b.status || 'pending') === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        b.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        b.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        'bg-rose-50 border-rose-200 text-rose-700'
                      }`}
                    >
                      <option value="pending">PENDING</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">申請人</span>
                      <strong className="text-slate-800">{b.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">聯絡電話</span>
                      <a href={`tel:${b.phone}`} className="text-marine-600 font-semibold hover:underline">
                        {b.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">日期及時段</span>
                      <span className="font-medium text-slate-700">{b.date} ({b.timeSlot})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">服務項目</span>
                      <span className="font-medium text-slate-700">{b.serviceName}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-500 border border-slate-100">
                      <span className="font-semibold block text-[9px] text-slate-400 uppercase">備註</span>
                      {b.notes}
                    </div>
                  )}

                  {/* Internal Notes */}
                  <div className="border-t border-slate-100 pt-2.5">
                    <span className="text-slate-400 block text-[10px] mb-1">內部管理備忘錄</span>
                    {editingId === b.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingNoteValue}
                          onChange={(e) => setEditingNoteValue(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full focus:outline-none"
                          placeholder="新增內部筆記..."
                          autoFocus
                        />
                        <button
                          onClick={() => saveAdminNote(b.id)}
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEditingNote(b.id, b.adminNotes)}
                        className="group flex items-center justify-between gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition min-h-[28px]"
                      >
                        <span className={b.adminNotes ? 'text-slate-700 font-medium' : 'text-slate-400 italic'}>
                          {b.adminNotes || '無備忘錄 (點擊編輯)'}
                        </span>
                        <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 pt-3 mt-1 justify-end">
                    <a
                      href={`https://wa.me/852${b.phone}?text=${encodeURIComponent(
                        `你好 ${b.name}，我是驗眼中心。關於您在 ${b.date} ${b.timeSlot} 的特快船牌驗眼預約 (登記ID: ${b.id})，我們已經為您核實。請問您當天是否能如期出席？`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                    
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" /> 刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

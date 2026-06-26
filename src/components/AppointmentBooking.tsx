import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, Search, Trash2, ArrowRight, ClipboardCopy, Ticket, MapPin, Building, Sparkles, Smartphone, RefreshCw } from 'lucide-react';
import { SERVICES, OFFICE_BRANCHES } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { saveBookingToFirebase, searchBookingsByPhone, deleteBookingFromFirebase, Booking } from '../firebase';

export default function AppointmentBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00');
  const [notes, setNotes] = useState('');
  
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'book' | 'check'>('book');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<Booking[] | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);

  // Available times list for Wednesday 11:00 - 17:30
  const wednesdaySlots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  // Load bookings from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('marine_vision_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (err) {
        console.error('Error parsing bookings', err);
      }
    }
    // Set default date to the next upcoming Wednesday
    const today = new Date();
    const nextWednesday = new Date();
    const day = today.getDay();
    const daysUntilWednesday = (3 - day + 7) % 7 || 7;
    nextWednesday.setDate(today.getDate() + daysUntilWednesday);
    setDate(nextWednesday.toISOString().split('T')[0]);
  }, []);

  const getIsWednesday = (dateStr: string) => {
    if (!dateStr) return false;
    const day = new Date(dateStr).getDay();
    return day === 3; // 3 is Wednesday
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg(null);

    if (!name.trim()) {
      setAlertMsg('請填寫申請人中英文全名');
      return;
    }
    
    // Simple 8-digit HK Phone validation helper (starts with 2-9)
    const hkPhoneRegex = /^[2-9]\d{7}$/;
    if (!hkPhoneRegex.test(phone.trim())) {
      setAlertMsg('請填寫有效的香港 8 位數聯絡電話號碼');
      return;
    }

    if (!date) {
      setAlertMsg('請選擇預約日期');
      return;
    }

    if (!getIsWednesday(date)) {
      setAlertMsg('本中心僅於逢星期三提供服務，請預約星期三之日期（上午11:00至下午5:30）！');
      return;
    }

    const selectedService = SERVICES.find(s => s.id === serviceId);
    if (!selectedService) return;

    // Generate unique registration ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      id: `MV-${randomNum}`,
      name: name.trim(),
      phone: phone.trim(),
      serviceId,
      serviceName: selectedService.name,
      date,
      timeSlot,
      notes: notes.trim(),
      timestamp: new Date().toLocaleDateString('zh-HK'),
      status: 'pending'
    };

    setSubmitting(true);
    try {
      // Save directly to Firebase Firestore
      await saveBookingToFirebase(newBooking);

      // Send automatic email notification via FormSubmit.co
      try {
        await fetch('https://formsubmit.co/ajax/oakleyhk@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `⚓ [特快船牌驗眼] 收到新預約通知 - ${newBooking.name}`,
            _captcha: 'false',
            _template: 'table',
            '預約編號 (Booking ID)': newBooking.id,
            '客戶姓名 (Name)': newBooking.name,
            '聯絡電話 (Phone)': newBooking.phone,
            '預約項目 (Service)': newBooking.serviceName,
            '預約日期 (Date)': newBooking.date,
            '預約時段 (Time Slot)': newBooking.timeSlot,
            '備註事項 (Notes)': newBooking.notes || '無',
            '提交時間 (Timestamp)': newBooking.timestamp
          })
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      const updated = [newBooking, ...bookings];
      setBookings(updated);
      localStorage.setItem('marine_vision_bookings', JSON.stringify(updated));

      setSuccessBooking(newBooking);
      
      // Clear Form inputs
      setName('');
      setPhone('');
      setNotes('');
      animateToTop();
    } catch (error) {
      console.error('Firebase save error:', error);
      setAlertMsg('與 Firebase 資料庫連線失敗，請檢查網路連線後重試。');
    } finally {
      setSubmitting(false);
    }
  };

  const animateToTop = () => {
    const el = document.getElementById('booking-widget');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = searchPhone.trim();
    if (!cleanPhone) {
      setSearchResult([]);
      return;
    }
    
    setSearching(true);
    try {
      // Query directly from Cloud Firestore for real-time accuracy
      const found = await searchBookingsByPhone(cleanPhone);
      setSearchResult(found);
    } catch (err) {
      console.error('Firebase search error, falling back to local storage:', err);
      const found = bookings.filter(b => b.phone === cleanPhone);
      setSearchResult(found);
    } finally {
      setSearching(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('確定要取消此預約登記嗎？')) {
      try {
        // Delete or cancel from Cloud Firestore
        await deleteBookingFromFirebase(bookingId);
      } catch (err) {
        console.error('Firebase delete error:', err);
      }

      const filtered = bookings.filter(b => b.id !== bookingId);
      setBookings(filtered);
      localStorage.setItem('marine_vision_bookings', JSON.stringify(filtered));
      
      // Update active list if in check view
      if (searchResult) {
        setSearchResult(searchResult.filter(b => b.id !== bookingId));
      }
      if (successBooking && successBooking.id === bookingId) {
        setSuccessBooking(null);
      }
    }
  };

  const currentSlots = wednesdaySlots;

  return (
    <div id="booking-widget" className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
      {/* Navigation tabs for widget */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => { setActiveTab('book'); setSuccessBooking(null); }}
          className={`flex-1 py-4 text-center font-display font-semibold text-sm transition transition-all ${
            activeTab === 'book'
              ? 'bg-white text-marine-700 border-t-2 border-marine-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📅 特快線上預約
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('check')}
          className={`flex-1 py-4 text-center font-display font-semibold text-sm transition transition-all ${
            activeTab === 'check'
              ? 'bg-white text-marine-700 border-t-2 border-marine-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🔍 查詢 / 修改預約
        </button>
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* SUCCESS SCREEN */}
          {successBooking && activeTab === 'book' && (
            <motion.div
              key="success-receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-800 mb-1">
                特快驗眼登記成功！
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                我們已為您鎖定該預約席位。請保存下方登船證格式的預約票據，到店出示即可：
              </p>

              {/* Boarding Pass Ticket format visual */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-marine-900 to-marine-950 text-white rounded-3xl overflow-hidden shadow-xl text-left border border-marine-800 relative mb-6">
                
                {/* Visual circles cutout on edges */}
                <div className="absolute left-0 top-[60%] -translate-x-1/2 w-4 h-8 bg-white rounded-r-full border-r border-slate-200" />
                <div className="absolute right-0 top-[60%] translate-x-1/2 w-4 h-8 bg-white rounded-l-full border-l border-slate-200" />

                {/* Ticket Top */}
                <div className="p-5 border-b border-dashed border-white/20">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-marine-500/30 text-marine-300 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
                        Booking Ticket
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest text-gold-400">
                      {successBooking.id}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-white/95 leading-tight mb-2">
                    {successBooking.serviceName}
                  </h4>
                  <div className="flex gap-4 text-xs text-marine-200 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-marine-400" />
                      <span>{successBooking.date} (星期三)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-marine-400" />
                      <span>{successBooking.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Bottom (Details + Fake Barcode) */}
                <div className="p-5 bg-white/5 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-marine-200">
                    <div>
                      <p className="opacity-60 uppercase font-sans">申請人姓名</p>
                      <p className="font-semibold text-white mt-0.5">{successBooking.name}</p>
                    </div>
                    <div>
                      <p className="opacity-60 uppercase font-sans">香港聯絡電話</p>
                      <p className="font-mono font-semibold text-white mt-0.5">{successBooking.phone}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <p className="opacity-60 text-[10px] text-marine-300 flex items-center gap-1 uppercase mb-1">
                      <MapPin className="w-3.5 h-3.5 text-marine-400 shrink-0" />
                      <span>體檢及發證地點:</span>
                    </p>
                    <p className="text-white text-[11px] font-medium leading-normal">
                      {OFFICE_BRANCHES[0].name}<br/>
                      <span className="text-marine-300 font-normal">地址：{OFFICE_BRANCHES[0].address}</span>
                    </p>
                  </div>

                  {/* Pseudo Barcode styling to look incredibly real */}
                  <div className="border-t border-white/10 pt-4 flex flex-col items-center">
                    <div className="w-full bg-white h-10 px-2 rounded-md flex items-center justify-between overflow-hidden opacity-90 select-none">
                      {/* Generates alternating black lines */}
                      <div className="flex w-full h-full gap-[3px_1px_4px_1px_2px_3px]">
                        {[2,6,1,4,8,3,5,2,7,1,4,3,8,2,6,1,7,4,3,2,8,1,5,3,9,1,4,2].map((w, idx) => (
                          <div
                            key={idx}
                            style={{ width: `${w}px` }}
                            className="bg-black h-full shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-[9px] text-marine-400/80 tracking-widest mt-1">
                      *T-{successBooking.id.replace('MV-', '')}-AISTUDIO*
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions and help */}
              <div className="max-w-md mx-auto bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 text-left text-xs text-amber-900 leading-relaxed mb-6">
                💡 <span className="font-semibold">溫馨提示：</span>請按預約時間提前 5 分鐘攜帶您與票據不符之【香港身份證】與【現有眼鏡（如有）】前往中心。若因任何狀況行程衝突，您可以點擊「查詢 / 修改預約」手動進行延期或退票。
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
                <a
                  href={`https://wa.me/85251326417?text=${encodeURIComponent(
                    `你好，我想確認特快船牌驗眼預約：\n\n- 登記編號: ${successBooking.id}\n- 姓名: ${successBooking.name}\n- 聯絡電話: ${successBooking.phone}\n- 預約日期: ${successBooking.date} (星期三)\n- 預約時段: ${successBooking.timeSlot}\n- 預約項目: ${successBooking.serviceName}\n\n謝謝！`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Smartphone className="w-4 h-4" /> 📲 點擊此處：透過 WhatsApp 傳送預約確認
                </a>
                
                <div className="flex gap-2 w-full sm:w-auto justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`【特快船牌驗眼預約】登記ID: ${successBooking.id} | 時間: ${successBooking.date} ${successBooking.timeSlot} | 姓名: ${successBooking.name} | 中心: 尖沙咀加拿芬道加拿芬廣場802室`);
                      alert('預約資訊已複製到您的剪貼簿！可貼在 WhatsApp 傳給朋友。');
                    }}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition flex items-center justify-center gap-1 shrink-0"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5" /> 複製資訊
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessBooking(null)}
                    className="px-4 py-2.5 bg-marine-50 hover:bg-marine-100 text-marine-700 rounded-xl text-xs font-semibold transition shrink-0"
                  >
                    再預約一張
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* NORMAL BOOK FORM VIEW */}
          {!successBooking && activeTab === 'book' && (
            <motion.form
              key="book-form"
              onSubmit={handleBookingSubmit}
              className="space-y-5"
            >
              <div className="text-left border-b border-slate-100 pb-3">
                <h4 className="font-display font-bold text-base text-slate-800">
                  一步登記 ‧ 特快預約船牌驗眼
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  網上自助預約，無多餘排隊，合格後 15 分鐘現場即時批出視力合格證明。
                </p>
              </div>

              {alertMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium text-left">
                  ⚠️ {alertMsg}
                </div>
              )}

              {/* Service Selection */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase font-sans">
                  已選服務類別 Select Eyesight Service
                </label>
                <div className="space-y-2">
                  {SERVICES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 justify-between ${
                        serviceId === s.id
                          ? 'border-marine-600 bg-marine-50/50'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-semibold text-xs md:text-sm text-slate-800">{s.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{s.suitableFor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-extrabold text-sm text-marine-700">HK${s.price}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">現場即拿</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row inputs: Date & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                    填寫預約日期 Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-marine-500 focus:ring-1 focus:ring-marine-500 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none"
                    />
                  </div>
                  {date && !getIsWednesday(date) && (
                    <p className="text-[10px] text-rose-600 font-medium mt-1">
                      ⚠️ 提示：本尖沙咀中心僅於逢星期三（上午11:00至下午5:30）提供船牌驗眼，請選擇星期三的日期。
                    </p>
                  )}
                  {date && getIsWednesday(date) && (
                    <p className="text-[10px] text-emerald-600 font-medium mt-1">
                      ✓ 已選取星期三開放時段。
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                    選擇理想時段 Preferred Slot
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-marine-500 focus:ring-1 focus:ring-marine-500 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none appearance-none"
                    >
                      {currentSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal details: name & phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                    申請人中英文全名 Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="例如: 陳大文 CHAN TAI MAN"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-marine-500 focus:ring-1 focus:ring-marine-500 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                    手提電話 Mobile Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="聯絡電話: 例如 51326417"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-marine-500 focus:ring-1 focus:ring-marine-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-mono text-slate-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes / Comments */}
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  備註說明 Notes (可選填)
                </label>
                <textarea
                  rows={2}
                  placeholder="備註填寫: 如戴眼鏡測驗、有輕微色弱、需要即日遞交蓋印、或攜帶一級續期表格等..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-marine-500 focus:ring-1 focus:ring-marine-500 rounded-xl p-3 text-xs text-slate-700 font-medium outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 text-white font-bold rounded-xl text-sm transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                  submitting 
                    ? 'bg-slate-400 shadow-none cursor-not-allowed' 
                    : 'bg-marine-600 hover:bg-marine-700 shadow-marine-600/20'
                }`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    正在為您安全預約席位...
                  </>
                ) : (
                  '確 認 線 上 特 快 預 約 (現場取證)'
                )}
              </button>
            </motion.form>
          )}

          {/* CHECK BOOKING TABS */}
          {activeTab === 'check' && (
            <motion.div
              key="check-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-left border-b border-slate-100 pb-3">
                <h4 className="font-display font-bold text-base text-slate-800">
                  自助預約查詢及修改中心
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  輸入您預約時登記的手提電話，即可查詢或自主作廢修改現存之證明書登記。
                </p>
              </div>

              <form onSubmit={handleSearchBookings} className="flex gap-2 text-left">
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="輸入8位數手機號碼"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-marine-500 focus:ring-1 focus:ring-marine-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold font-mono text-slate-700 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {searching && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  搜尋
                </button>
              </form>

              {/* SEARCH RESULTS LIST */}
              <div className="space-y-4">
                {searchResult === null ? (
                  bookings.length > 0 ? (
                    <div className="text-left p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        最近在本機登記的預約項目 ({bookings.length} 個):
                      </h5>
                      <div className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                          <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="space-y-0.5 text-left">
                              <p className="font-semibold text-slate-800">{b.name} <span className="text-[10px] font-mono text-slate-400 font-normal">({b.id})</span></p>
                              <p className="text-slate-500 text-[11px]">{b.serviceName}</p>
                              <p className="text-marine-600 font-medium text-[10px]">{b.date}@{b.timeSlot}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(b.id)}
                              className="p-1 px-2.5 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 transition flex items-center gap-1 text-[10px] font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> 取消
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      <Search className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                      <span>本機目前無任何預約紀錄。可填寫左側表單直接預約。</span>
                    </div>
                  )
                ) : searchResult.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 text-left font-medium">
                      符合電話的預約項目共 {searchResult.length} 筆：
                    </p>
                    {searchResult.map((b) => (
                      <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between text-left relative">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.2 rounded font-mono font-bold tracking-tight">
                            {b.id}
                          </span>
                          <h5 className="font-semibold text-xs md:text-sm text-slate-800 pt-1">
                            {b.serviceName}
                          </h5>
                          <div className="text-[11px] text-slate-500 space-y-0.5 font-sans">
                            <p>申請人: <span className="font-semibold text-slate-700">{b.name}</span></p>
                            <p>日期和時間: <span className="font-semibold text-marine-700">{b.date} ({b.timeSlot})</span></p>
                            {b.notes && <p>備註: <span className="italic text-slate-400">{b.notes}</span></p>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-2 hover:bg-rose-50 rounded text-rose-500 transition"
                          title="取消預約"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400">
                    <Trash2 className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                    <span>對不起，查無手機與 <u>「{searchPhone}」</u> 相符之預約項目。請檢查電話是否正確填寫。</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

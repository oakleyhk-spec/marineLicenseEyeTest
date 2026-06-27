/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Anchor,
  Eye,
  Activity,
  Heart,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  ExternalLink,
  Check,
  Clock3,
  HelpCircle,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import local modular helpers
import { SERVICES, FAQS, OFFICE_BRANCHES } from './data';
import VisionTestSimulator from './components/VisionTestSimulator';
import ColorVisionTest from './components/ColorVisionTest';
import MD688FormGuide from './components/MD688FormGuide';
import AppointmentBooking from './components/AppointmentBooking';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'acuity' | 'color' | 'guide'>('acuity');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<'all' | 'general' | 'color' | 'criteria'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Monitor header scrolling for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredFaqs = FAQS.filter(faq => {
    if (selectedFaqCategory === 'all') return true;
    return faq.category === selectedFaqCategory;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 antialiased selection:bg-marine-100 selection:text-marine-900 font-sans">
      
      {/* PROFESSIONAL FLOAT HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md shadow-slate-100/40 border-b border-slate-100 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div
            onClick={() => handleScrollTo('hero')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-marine-700 text-white p-2 rounded-xl group-hover:bg-marine-600 transition shadow-md shadow-marine-700/10">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="font-display font-black text-sm md:text-base tracking-tight text-slate-900 block">
                特快船牌驗眼中心
              </span>
              <span className="text-[10px] text-marine-600 uppercase font-mono font-bold block leading-none">
                Marine License Eyesight
              </span>
            </div>
          </div>

          {/* DESKTOP NAV BAR */}
          {!showAdmin ? (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-slate-600">
              <button
                onClick={() => handleScrollTo('features')}
                className="hover:text-marine-600 transition cursor-pointer"
              >
                服務優勢
              </button>
              <button
                onClick={() => handleScrollTo('interactive-lab')}
                className="hover:text-marine-600 transition cursor-pointer"
              >
                自測中心
              </button>
              <button
                onClick={() => handleScrollTo('pricing')}
                className="hover:text-marine-600 transition cursor-pointer"
              >
                服務收費
              </button>
              <button
                onClick={() => handleScrollTo('location')}
                className="hover:text-marine-600 transition cursor-pointer"
              >
                聯絡及地址
              </button>
              <button
                onClick={() => handleScrollTo('faq')}
                className="hover:text-marine-600 transition cursor-pointer"
              >
                常見問題 FAQ
              </button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-slate-600">
              <span className="text-marine-700 bg-marine-50 px-2.5 py-1 rounded-lg border border-marine-100 font-mono text-[10px] uppercase font-bold">
                ✓ Administrator Secure Mode
              </span>
            </nav>
          )}

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            {showAdmin ? (
              <button
                onClick={() => { setShowAdmin(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                🏠 返回用戶首頁
              </button>
            ) : (
              <>
                <a
                  href="https://wa.me/85251326417"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp 諮詢
                </a>
                <button
                  onClick={() => handleScrollTo('booking-section')}
                  className="px-4 py-2 bg-marine-600 hover:bg-marine-700 text-white font-semibold rounded-lg text-xs transition shadow-md shadow-marine-600/15 cursor-pointer"
                >
                  預約特快驗眼 📅
                </button>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE UNIT */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-50 border border-slate-100 text-slate-600 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 overflow-hidden text-left"
            >
              {showAdmin ? (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => { setShowAdmin(false); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs transition text-center"
                  >
                    🏠 返回用戶首頁
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
                    <button
                      onClick={() => handleScrollTo('features')}
                      className="py-2 hover:bg-slate-50 px-3 rounded-lg text-left"
                    >
                      服務優勢
                    </button>
                    <button
                      onClick={() => handleScrollTo('interactive-lab')}
                      className="py-2 hover:bg-slate-50 px-3 rounded-lg text-left"
                    >
                      自測中心
                    </button>
                    <button
                      onClick={() => handleScrollTo('pricing')}
                      className="py-2 hover:bg-slate-50 px-3 rounded-lg text-left"
                    >
                      服務收費
                    </button>
                    <button
                      onClick={() => handleScrollTo('location')}
                      className="py-2 hover:bg-slate-50 px-3 rounded-lg text-left"
                    >
                      聯絡及地址
                    </button>
                    <button
                      onClick={() => handleScrollTo('faq')}
                      className="py-2 hover:bg-slate-50 px-3 rounded-lg text-left"
                    >
                      常見問題 FAQ
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">
                    <a
                      href="https://wa.me/85251326417"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 bg-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" /> WhatsApp 特快諮詢
                    </a>
                    <button
                      onClick={() => { handleScrollTo('booking-section'); setMobileMenuOpen(false); }}
                      className="w-full py-2.5 bg-marine-600 hover:bg-marine-700 text-white font-semibold rounded-lg text-xs transition shadow-md"
                    >
                      立即預約特快驗眼 📅
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {!showAdmin ? (
        <>
          {/* HERO SECTION */}
          <section
            id="hero"
        className="relative pt-24 md:pt-36 pb-16 md:pb-28 overflow-hidden bg-gradient-to-b from-marine-50/70 via-white to-transparent text-left"
      >
        {/* Subtle geometric circles matching nautical charts */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-marine-100/30 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute left-1/2 bottom-12 w-64 h-64 bg-emerald-100/20 rounded-full blur-2xl pointer-events-none -ml-32" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Hero text */}
            <div className="md:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marine-100 text-marine-800 text-[11px] font-bold tracking-wide uppercase font-sans">
                <ShieldCheck className="w-3.5 h-3.5" /> 香港海事處認可 ‧ 註冊眼科專業檢驗
              </span>

              <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
                【特快船牌驗眼】<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-marine-700 to-marine-900">
                  即日現場領取
                </span> 視力測驗證明書
              </h1>

              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl">
                專為報考「遊樂船隻二級操作人（遊艇牌）」、各級「本地船長執照」及在職續期人士而設。由註冊人員按照海事條例嚴格測試，合格當日 15 分鐘即領證明（表格 M.D. 688 / M.D. 687），安心啟航無阻礙！
              </p>

              {/* Bento-like stats layout inside hero */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-lg pt-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-start">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans tracking-wider">特快辦理</span>
                  <span className="text-slate-800 font-extrabold text-sm md:text-base font-display mt-0.5">15 分鐘</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-none">現場合格即簽</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-start border-l-2 border-l-marine-600">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans tracking-wider">海事署指標</span>
                  <span className="text-slate-800 font-extrabold text-sm md:text-base font-display mt-0.5">100% 機率</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-none">格式及簽章合規</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-start border-l-2 border-l-emerald-600">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans tracking-wider">交通便利</span>
                  <span className="text-slate-800 font-extrabold text-sm md:text-base font-display mt-0.5">尖沙咀 1M</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-none">地鐵外 1 分鐘</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleScrollTo('booking-section')}
                  className="px-6 py-3.5 rounded-xl bg-marine-600 hover:bg-marine-700 text-white font-medium text-xs md:text-sm shadow-lg shadow-marine-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>立即預約特快驗眼 (即日可預約)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScrollTo('interactive-lab')}
                  className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium text-xs md:text-sm flex items-center justify-center gap-1.5 bg-white"
                >
                  <Eye className="w-4 h-4 text-marine-600" />
                  <span>玩玩視力/色覺自測</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 max-w-lg">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 self-start mt-1" />
                  <span className="leading-tight">支援WhatsApp/ 網上預約<br/>逢星期三驗眼</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 專業屈光度數意見與協助
                </span>
              </div>
            </div>

            {/* Hero image or Visual Banner */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-marine-50 to-indigo-50/50 rounded-3xl -rotate-2 transform scale-105 pointer-events-none -z-10" />
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 relative overflow-hidden text-left space-y-5">
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                      <Anchor className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xs text-slate-800 leading-tight">安全考船牌說明</h4>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">Maritime Safety Commission</p>
                    </div>
                  </div>
                  <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    重要注意事項
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-500 leading-relaxed">
                  <div className="flex gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p>
                      <strong>近視無須擔心：</strong>戴眼鏡、隱形眼鏡或漸進鏡，只要其「矯正視力」雙眼能達到標準即可合格。
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p>
                      <strong>色盲色弱指引：</strong>遊樂船涉及夜晚紅綠白燈辨識。輕微色弱市民大部分能合格，我們配備了石原氏板(Ishihara plates)測試，能提供專業評測。
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p>
                      <strong>注意 M.D. 688 有效期：</strong>視力證明書有效期通常只有 <strong>12-24 個月</strong>，測試後必須在此期限内將紙本遞交給海事處，否則需要自費重測。
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-xs text-slate-700">想先初步了解雙眼狀態？</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">歡迎使用我們的一分鐘免費預測自評工具</p>
                  </div>
                  <button
                    onClick={() => handleScrollTo('interactive-lab')}
                    className="p-1.5 px-3 bg-white border border-slate-200 hover:border-marine-500 text-marine-700 text-xs font-semibold rounded-lg transition"
                  >
                    進入 ➡️
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE ADVANTAGES (FEATURES) */}
      <section id="features" className="py-16 bg-white border-y border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left max-w-xl mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-marine-600 font-bold block mb-1">
              PROVEN STRENGTHS
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight">
              為什麼考牌市民一致推薦我們？
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2">
              拒絕排長龍與複雜手續。我們專注船牌驗眼，提供全方位的專業保障服務。
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-marine-500/10 text-marine-700 flex items-center justify-center">
                  <Clock3 className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-slate-800">特快辦理 15分鐘取證</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  高效流程，親臨中心測試加簽發證明書總計仅約 15 - 20 分鐘。即場填寫、合格即時拿到蓋印證明，無需事後漫長等待。
                </p>
              </div>
              <div className="text-left pt-4 text-[10px] text-marine-600 font-mono tracking-wider font-semibold">
                STEP-FACTOR // ULTRA FAST
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-slate-800">100%符合海事署法規</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  由香港第一部分註冊專業眼科人員把關測試，符合《商船(本地船隻)條例》之法定體檢資格，100% 海事署櫃檯認可。
                </p>
              </div>
              <div className="text-left pt-4 text-[10px] text-teal-600 font-mono tracking-wider font-semibold">
                LEGAL COMPLIANCY // 100%
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-slate-800">度數偏差專業建議</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  倘若考生因為屈光度數偏差以致未能於視力測試中合格，視光師會盡量提出專業的參考意見，以助考生重考合格。
                </p>
              </div>
              <div className="text-left pt-4 text-[10px] text-indigo-600 font-mono tracking-wider font-semibold">
                PROFESSIONAL ADVICE // RE-TEST SUPPORT
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-slate-800">極速線上預先登記</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  我們支援在線預約鎖定名額，特別於逢星期三提供服務。尖沙咀中心加拿芬廣場地鐵出站直達，交通方便，不耽誤工作學習。
                </p>
              </div>
              <div className="text-left pt-4 text-[10px] text-emerald-600 font-mono tracking-wider font-semibold">
                CONVENIENCE // ACCESSIBILITY
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKSPACE (VISION LABS) */}
      <section id="interactive-lab" className="py-16 bg-[#fafbfc] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-marine-600 font-bold block mb-1">
              SELF SCREENING STATION
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-snug">
              自助體檢體驗中心
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2">
              我們為市民獨家創設的「E 字視力自測」及「色盲弱模擬評估」，讓您隨時掌握個人眼睛機能狀況，輕鬆消除體檢前的擔憂與迷茫。
            </p>
            <p className="text-[11px] md:text-xs text-rose-500/90 font-medium mt-2 bg-rose-50/50 inline-block px-3 py-1 rounded-lg border border-rose-100/50">
              註：「此自助體驗只是驗眼方式的體驗，其結果與真正的驗眼中心結果完全無關」
            </p>
          </div>

          {/* Interactive Navigation Grid Tabs */}
          <div className="grid grid-cols-3 max-w-3xl mx-auto mb-8 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold text-slate-600 gap-1">
            <button
              onClick={() => setActiveInteractiveTab('acuity')}
              className={`py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeInteractiveTab === 'acuity'
                  ? 'bg-white text-marine-800 shadow-md'
                  : 'hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">E字視力表模擬</span>
              <span className="inline sm:hidden">視力自評</span>
            </button>
            <button
              onClick={() => setActiveInteractiveTab('color')}
              className={`py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeInteractiveTab === 'color'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">色盲色弱紅綠檢測</span>
              <span className="inline sm:hidden">色盲自測</span>
            </button>
            <button
              onClick={() => setActiveInteractiveTab('guide')}
              className={`py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeInteractiveTab === 'guide'
                  ? 'bg-white text-slate-800 shadow-md'
                  : 'hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">MD 688 表格指南</span>
              <span className="inline sm:hidden">證明書範本</span>
            </button>
          </div>

          {/* Core interactive screen stage */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeInteractiveTab === 'acuity' && (
                <motion.div
                  key="acuity"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <VisionTestSimulator />
                </motion.div>
              )}
              {activeInteractiveTab === 'color' && (
                <motion.div
                  key="color"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ColorVisionTest />
                </motion.div>
              )}
              {activeInteractiveTab === 'guide' && (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <MD688FormGuide />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SERVICE PRICING AND FEE SECTION */}
      <section id="pricing" className="py-16 bg-white border-y border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-marine-600 font-bold block mb-1">
              FEE STRATEGY
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-snug">
              收費標準透明，拒絕隱藏費用
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2">
              我們提供的所有申領或續期驗業服務，皆明確包含簽發海事處指定格式「視力測驗證明書（合格當日现场領取）」之全部費用。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {SERVICES.map((plan) => (
              <div
                key={plan.id}
                className="p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 flex flex-col justify-between bg-white hover:border-marine-200 transition relative"
              >


                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-800">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-xs font-semibold text-slate-400">HK$</span>
                    <span className="text-4xl font-extrabold font-mono text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-sans ml-1">現場即發證</span>
                  </div>

                  <div className="border-t border-slate-100 pt-4 text-xs space-y-2 text-slate-500">
                    <p><strong>適合人群：</strong> {plan.suitableFor}</p>
                    <p><strong>所需時長：</strong> {plan.duration}</p>
                  </div>

                  <div className="border-t border-slate-50 pt-4 space-y-2 text-[11px] text-slate-500">
                    {plan.features.map((feat, index) => (
                      <div key={index} className="flex gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleScrollTo('booking-section')}
                    className="w-full py-3 rounded-xl font-bold text-xs transition duration-200 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    選取此項特快預約 ➡️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Professional guidance note */}
          <div className="mt-8 bg-slate-50 border border-slate-100/50 p-4 rounded-2xl max-w-2xl mx-auto flex gap-3 text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500/90 leading-relaxed">
              <span className="font-semibold text-slate-800">專業視光意見與重考支援：</span> 
              倘若考生因為屈光度數偏差以致未能於視力測試中合格，視光師會盡量提出專業的參考意見，以助考生重考合格。
            </div>
          </div>

        </div>
      </section>

      {/* APPOINTMENT BOOKING WIDGET BLOCK */}
      <section id="booking-section" className="py-16 bg-[#fafbfc] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            
            <div className="md:col-span-5 space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-marine-600 font-bold block mb-1">
                ONLINE RESERVATION METHOD
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-snug">
                快速鎖定您的特快體檢名額
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                考期緊張，每天預留可批出之名額有限。填寫右側右方簡單的預約表單，選擇方便日誌。您會立刻獲得一組本機存檔之專屬票據卡，憑票親臨更無需在店面遭遇排隊等候困擾。
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start text-xs text-slate-500 leading-normal">
                  <div className="w-7 h-7 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-marine-600 shrink-0 shadow-sm font-semibold">1</div>
                  <div>
                    <h4 className="font-semibold text-slate-700">選擇並預約時段</h4>
                    <p className="mt-0.5 opacity-90">提供逢星期三特快時段，網上即時選預約。</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start text-xs text-slate-500 leading-normal">
                  <div className="w-7 h-7 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-marine-600 shrink-0 shadow-sm font-semibold">2</div>
                  <div>
                    <h4 className="font-semibold text-slate-700">到店接受 15分鐘測試</h4>
                    <p className="mt-0.5 opacity-90">攜身份證，隨到隨檢。包含雙眼視敏度、Ishihara 色弱盤檢測。</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start text-xs text-slate-500 leading-normal">
                  <div className="w-7 h-7 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-marine-600 shrink-0 shadow-sm font-semibold">3</div>
                  <div>
                    <h4 className="font-semibold text-slate-700">即場簽發 100% 正本</h4>
                    <p className="mt-0.5 opacity-90">合格直接打印或人手蓋上診所圓章，提供有效期 12-24 個月官方證明書。</p>
                  </div>
                </div>
              </div>

              {/* Call-to-action details */}
              <div className="p-4 bg-marine-50/50 border border-marine-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-xs text-marine-800">需要先與一對一客服對接？</h5>
                  <p className="text-[10px] text-marine-500 mt-0.5">我們的尖沙咀夥伴客服隨時解答色盲、度數限制等疑難</p>
                </div>
                <a
                  href="https://wa.me/85251326417"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shrink-0 inline-flex items-center gap-1"
                >
                  WhatsApp 諮詢
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              <AppointmentBooking />
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED LOCATION & CONTACT SECTION */}
      <section id="location" className="py-16 bg-white border-y border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Location context text */}
            <div className="space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-marine-600 font-bold block mb-1">
                CENTRA BRANCH DETAILS
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-snug">
                我們的地理位置及營業時間
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                尖沙咀驗眼中心位處九龍核心商業地段，交通極其方便。您可以星期三預約前來本中心接受體檢、合格取得「視力測驗證明書（M.D. 687）」,（M.D. 688）」後，按您的排期方便地前往海事處各分處提單申報，享有一鍵式高效體驗！
              </p>

              {OFFICE_BRANCHES.map((branch, index) => (
                <div key={index} className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
                  <h3 className="font-display font-bold text-sm md:text-base text-slate-800 flex items-center gap-2">
                    <Building className="w-5 h-5 text-marine-600 shrink-0" />
                    <span>{branch.name}</span>
                  </h3>

                  <div className="space-y-2.5 text-xs text-slate-500">
                    <p className="flex items-start gap-2 leading-relaxed">
                      <MapPin className="w-4 h-4 text-marine-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>詳細地址：</strong>{branch.address}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 leading-relaxed">
                      <Compass className="w-4 h-4 text-marine-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>地鐵引路：</strong>{branch.transport}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 leading-normal">
                      <Phone className="w-4 h-4 text-marine-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>特快熱線：</strong>{branch.phone} (WhatsApp: {branch.whatsapp})
                      </span>
                    </p>
                  </div>

                  <div className="border-t border-slate-200/50 pt-3">
                    <p className="text-xs font-semibold text-slate-700 mb-1">營業及預約開放時間：</p>
                    <ul className="text-[11px] text-slate-500 space-y-1 font-mono">
                      {branch.hours.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-marine-500 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Hong Kong Map layout / Beautiful directions assistance card */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 relative overflow-hidden h-[380px] md:h-[440px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-marine-900 pointer-events-none opacity-[0.02] -z-10" />
              
              {/* Fake Interactive map vector lines with high design fidelity */}
              <div className="flex-1 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 shadow-inner flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow border border-slate-100 text-[10px] leading-relaxed text-slate-700 max-w-xs text-left">
                  <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>尖沙咀加拿芬廣場802室</span>
                  </p>
                  <p>港鐵尖沙咀站 D2 或 B2 出口步行僅 1 分鐘，加拿芬廣場交通極為便利，樓下食肆林立，非常容易預約與認路。</p>
                </div>

                {/* Minimalist Map Graphics */}
                <svg className="w-full h-full opacity-60 text-slate-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines resembling city blocks */}
                  <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="1" />
                  
                  <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="1.5" />

                  {/* Subway route curve */}
                  <path d="M 0,40 Q 30,40 50,50 T 100,55" fill="none" stroke="#0284c7" strokeWidth="3" strokeDasharray="4 2" />

                  {/* Tsim Sha Tsui Target pin anchor */}
                  <circle cx="50" cy="40" r="12" fill="#0369a1" fillOpacity="0.1" />
                  <circle cx="50" cy="40" r="5" fill="#e11d48" />
                </svg>

                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  <a
                    href="https://maps.google.com/?q=Tsim+Sha+Tsui+Carnarvon+Plaza"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 transition shadow flex items-center gap-1"
                  >
                    <span>開啟 Google Map ➡️</span>
                  </a>
                </div>
              </div>

              <div className="mt-4 text-left space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">MAP ASSIST GUIDE</span>
                <p className="text-xs text-slate-500 font-medium">
                  * 有需要隨時致電本中心前台。尖沙咀中心港鐵出口直達，若您從港島前往，亦可搭乘天星小輪，非常快捷方便。
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 bg-[#fafbfc] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-marine-600 font-bold block mb-1">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-800 tracking-tight leading-snug">
              海事處驗眼 ‧ 熱門常見問題
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-2">
              為您詳細解答近視、辨色異常、二級與一級船長牌之官方要求，以及預約流程的各項細節。
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* FAQ Category Toggles (Col-span-4) */}
            <div className="md:col-span-4 space-y-2 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase block px-3 py-1 mb-2 font-sans tracking-wide">
                主題分類過濾器
              </span>
              <button
                onClick={() => { setSelectedFaqCategory('all'); setExpandedFaqId(null); }}
                className={`w-full py-2.5 px-4 text-left rounded-xl transition text-xs font-semibold ${
                  selectedFaqCategory === 'all'
                    ? 'bg-marine-100 text-marine-800'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                全部問題 All FAQ
              </button>
              <button
                onClick={() => { setSelectedFaqCategory('general'); setExpandedFaqId(null); }}
                className={`w-full py-2.5 px-4 text-left rounded-xl transition text-xs font-semibold ${
                  selectedFaqCategory === 'general'
                    ? 'bg-marine-100 text-marine-800'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                戴鏡與攜帶攜文件 (一般)
              </button>
              <button
                onClick={() => { setSelectedFaqCategory('color'); setExpandedFaqId(null); }}
                className={`w-full py-2.5 px-4 text-left rounded-xl transition text-xs font-semibold ${
                  selectedFaqCategory === 'color'
                    ? 'bg-marine-100 text-marine-800'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                色盲色弱紅綠燈 (辨色)
              </button>
              <button
                onClick={() => { setSelectedFaqCategory('criteria'); setExpandedFaqId(null); }}
                className={`w-full py-2.5 px-4 text-left rounded-xl transition text-xs font-semibold ${
                  selectedFaqCategory === 'criteria'
                    ? 'bg-marine-100 text-marine-800'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                表格級別與證明有效期 (標準)
              </button>
            </div>

            {/* FAQS Accordion (Col-span-8) */}
            <div className="md:col-span-8 space-y-3.5">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm text-left overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left py-4 px-5 flex justify-between items-center gap-4 cursor-pointer"
                    >
                      <span className="font-display font-bold text-xs md:text-sm text-slate-800 hover:text-marine-700 transition">
                        Q: {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-marine-600' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-50 bg-slate-50/50"
                        >
                          <div className="p-5 text-xs md:text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
        </>
      ) : (
        <div className="pt-24 md:pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminDashboard />
        </div>
      )}

      {/* REGULATORY EEAT PROFESSIONAL FOOTER BACKGROUND COMPLIANCE */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 text-left border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-marine-600 text-white p-2 rounded-xl">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="text-left">
                  <span className="font-display font-black text-xs md:text-sm tracking-tight text-white block">
                    特快船牌驗眼服務中心
                  </span>
                  <span className="text-[9px] text-marine-400 uppercase font-mono block leading-none">
                    Certified Eyesight Center
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                秉持專業執業、公開透明、特快便民的工作態度。嚴密按照香港海事處船隻操縱之視力及辨色最低標準（M.D. 688/687），助本港無數市民即日取得官方體檢通行證明書。
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-mono text-white mb-4">
                熱門服務項目
              </h4>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li>
                  <button onClick={() => handleScrollTo('pricing')} className="hover:text-marine-400 text-left">
                    遊樂船隻二級操作人驗眼 ($160)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScrollTo('pricing')} className="hover:text-marine-400 text-left">
                    本地營業船隻船長續期驗眼 ($240)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScrollTo('interactive-lab')} className="hover:text-marine-400 text-left">
                    特快視力表 E 字盲配與預檢
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-mono text-white mb-4">
                尖沙咀中心營業時段
              </h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li>逢星期三：上午11:00至下午5:30</li>
                <li className="text-amber-400 font-semibold">• 支援線上特快登記預約</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-mono text-white mb-4">
                香港官方下載輔助
              </h4>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li>
                  <a
                    href="https://www.mardep.gov.hk/hk/forms/home.html"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-marine-400"
                  >
                    <span>海事處官方表格下載</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mardep.gov.hk/hk/pub_services/pdf/pleasure_vessel_exams.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-marine-400"
                  >
                    <span>遊樂船隻二級操作指南</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ahp-council.org.hk/op/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-marine-400"
                  >
                    <span>香港眼科視光師管理委員會</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Compliance Notice Section */}
          <div className="pt-8 text-left space-y-3">
            <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              香港醫療及法規申明確認聲明 (Legal Compliance Statement)
            </h5>
            <div className="text-[10px] text-slate-500 leading-relaxed font-sans space-y-2">
              <p>
                1. 本中心所提供的香港本地船隻（包括一級、二級及三級船長）與遊樂船隻操作人視力及辨色測驗，均由符合香港法例第 359 章《輔助醫療業條例》之註冊第一部分眼科專業視光師（或註冊執業全科醫生）嚴格按照香港海事處（Marine Department）最新視力安全指引執行與親筆簽字。
              </p>
              <p>
                2. 本網站所包含的所有文字、自測模擬、工具預測結果僅供市民初步常規前置篩檢參考，不等同於海事官認證。學員之正式眼睛機能條件合格與否，一概以我們尖沙咀現場體檢後開具的實體紙本「視力測驗證明書」（表格 M.D. 688 / M.D. 687）結果以及海事處最後簽發合格執業證書為準。
              </p>
              <p>
                3. 我們嚴格保護您的隱私。本網站提供的「自助預約」或「自評」等表單紀錄，均經由 Firebase 雲端資料庫安全儲存與加密。資料僅供本中心登辦與核實。
              </p>
              <p>
                4. 免責聲明：本網站僅為第三方資訊指南，並非香港海事處官方網站，本站不會以任何形式收集或要求您輸入個人資料（如身分證號碼、護照或生日等）。最新標準請以香港海事處公佈為準。
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-mono">
            <span>© 2026 特快船牌驗眼及視力測驗證明書服務中心. All Rights Reserved. Powered by AI Studio.</span>
            <button
              onClick={() => {
                setShowAdmin(!showAdmin);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-500 hover:text-white transition flex items-center gap-1.5 cursor-pointer font-sans text-[11px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-semibold"
            >
              💼 {showAdmin ? "返回用戶首頁" : "管理員後台系統"}
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}

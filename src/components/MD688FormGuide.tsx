import React, { useState } from 'react';
import { FileText, HelpCircle, User, Activity, ShieldCheck, Signature, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormSection {
  id: string;
  title: string;
  engTitle: string;
  icon: React.ReactNode;
  hint: string;
  explanation: string;
}

export default function MD688FormGuide() {
  const [activeSection, setActiveSection] = useState<string>('sec-a');

  const sections: FormSection[] = [
    {
      id: 'sec-a',
      title: '甲部：申請人個人資料',
      engTitle: 'Part A: Applicant Information',
      icon: <User className="w-4 h-4 text-marine-600" />,
      hint: '填寫考生的真實中英文姓名與身份證號碼',
      explanation: '前往驗眼當日您必須攜帶香港身份證。登記時我們專業登記人員會核對證件，將中英文全名、HKID 正確填入證明書中，確保與海事處報考資料一致。'
    },
    {
      id: 'sec-b',
      title: '乙部：遠距離視力結果',
      engTitle: 'Part B: Distance Vision Record',
      icon: <Activity className="w-4 h-4 text-marine-600" />,
      hint: '紀錄左眼、右眼及雙眼的裸眼/矯正視力值',
      explanation: '海事處規定考生雙眼之遠距離視力（戴鏡或不戴鏡）必須達致最低 6/12 或 0.7 標準。若您平時戴眼镜，視光師會在證明書標註「With Corrective Lenses（配戴矯正鏡片）」，不影響合格性。'
    },
    {
      id: 'sec-c',
      title: '丙部：辨色能力評測',
      engTitle: 'Part C: Colour Vision Assessment',
      icon: <CheckSquare className="w-4 h-4 text-marine-600" />,
      hint: '標註紅、綠、白三色燈辨識結果',
      explanation: '評估採用 Ishihara 彩色圖譜或 D-15 測試。在夜間航行需要準確識別紅（左舷）、綠（右舷）、白（桅燈）信號。如能輕鬆分辨即標註為「Satisfactory（符合標準）」，此項目是取得遊樂/商業船務牌照的關鍵。'
    },
    {
      id: 'sec-d',
      title: '丁部：註冊眼科專業人員確認',
      engTitle: 'Part D: Assessor Certified Stamp',
      icon: <Signature className="w-4 h-4 text-marine-600" />,
      hint: '執照註冊名冊編號、親筆簽名及加蓋診所官方圓印',
      explanation: '根據《商船(本地船隻)條例》，此測驗證明書必須由香港註冊醫生或香港註冊視光師（第一部分，具備診斷藥物使用權）親筆簽署及加蓋執業蓋章。海事處職員會嚴密核對登記編號。本中心 100% 符合此法定資格！'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-marine-300" />
        <span className="font-display font-medium text-sm md:text-base">M.D. 688 視力證明書填寫指南</span>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8">
        {/* Certificate simulation panel */}
        <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner relative overflow-hidden">
          {/* Watermark styling */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
            <span className="text-8xl font-serif font-bold text-slate-950 -rotate-12">MARINE</span>
          </div>

          <div className="bg-white border-2 border-slate-300/80 rounded-xl p-5 shadow-sm text-[11px] leading-relaxed text-slate-800 font-sans">
            {/* Disclaimer banner */}
            <div className="mb-3 text-center bg-rose-50 border border-rose-100 py-1.5 px-3 rounded-lg">
              <p className="text-[10px] md:text-xs text-rose-600 font-medium">
                ⚠️ 此證明書只是模擬樣本，與真實證明書並不相同
              </p>
            </div>

            {/* Government Heading */}
            <div className="text-center border-b border-slate-200 pb-3 mb-4">
              <h4 className="font-serif font-black tracking-wider text-xs text-slate-900 uppercase">
                MARINE DEPARTMENT, HONG KONG
              </h4>
              <p className="text-[9px] text-slate-500 uppercase font-mono tracking-tighter mt-0.5">
                Government of the Hong Kong Special Administrative Region
              </p>
              <h5 className="font-bold text-slate-800 text-[11px] mt-2">
                本地船隻 / 遊樂船隻操作人視力測驗證明書
              </h5>
              <p className="text-[9px] font-mono text-slate-500">
                EYESIGHT TEST CERTIFICATE FOR LOCAL & PLEASURE VESSELS OPERATORS
              </p>
            </div>

            {/* PART A */}
            <div
              onClick={() => setActiveSection('sec-a')}
              className={`p-2 rounded-lg transition-all cursor-pointer mb-2.5 ${
                activeSection === 'sec-a'
                  ? 'bg-marine-50/80 border-l-4 border-marine-600 shadow-sm'
                  : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between font-bold text-slate-900 text-[10px] uppercase border-b border-dashed border-slate-200 pb-0.5">
                <span>甲部：申請人資料 Applicant Details</span>
                <span className="text-marine-600 text-[9px] font-mono font-semibold">點擊查看 ⬇️</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 mt-1.5 opacity-90 text-[10px]">
                <div>姓名 Name: <span className="font-semibold text-slate-900 font-mono">CHAN TAI MAN (陳大文)</span></div>
                <div>身份證 ID: <span className="font-semibold text-slate-900 font-mono">Y1234**(5)</span></div>
              </div>
            </div>

            {/* PART B */}
            <div
              onClick={() => setActiveSection('sec-b')}
              className={`p-2 rounded-lg transition-all cursor-pointer mb-2.5 ${
                activeSection === 'sec-b'
                  ? 'bg-marine-50/80 border-l-4 border-marine-600 shadow-sm'
                  : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between font-bold text-slate-900 text-[10px] uppercase border-b border-dashed border-slate-200 pb-0.5">
                <span>乙部：遠距離視力 Eyesight Acuity</span>
                <span className="text-marine-600 text-[9px] font-mono font-semibold">點擊查看 ⬇️</span>
              </div>
              <div className="grid grid-cols-3 gap-x-2 mt-1.5 opacity-90 text-[10px]">
                <div>右眼 Right Eye: <span className="font-semibold text-emerald-700 font-mono">6/9 (Pass)</span></div>
                <div>左眼 Left Eye: <span className="font-semibold text-emerald-700 font-mono">6/6 (Pass)</span></div>
                <div>雙眼 Glasses: <span className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded font-mono text-[9px]">Yes</span></div>
              </div>
            </div>

            {/* PART C */}
            <div
              onClick={() => setActiveSection('sec-c')}
              className={`p-2 rounded-lg transition-all cursor-pointer mb-2.5 ${
                activeSection === 'sec-c'
                  ? 'bg-marine-50/80 border-l-4 border-marine-600 shadow-sm'
                  : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between font-bold text-slate-900 text-[10px] uppercase border-b border-dashed border-slate-200 pb-0.5">
                <span>丙部：辨色測試 Colour Vision Test</span>
                <span className="text-marine-600 text-[9px] font-mono font-semibold">點擊查看 ⬇️</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 mt-1.5 opacity-90 text-[10px]">
                <div>紅/綠辨識 Red/Green: <span className="text-emerald-700 font-semibold font-mono">Satisfactory</span></div>
                <div>白燈辨識 White Lights: <span className="text-emerald-700 font-semibold font-mono">Satisfactory</span></div>
              </div>
            </div>

            {/* PART D */}
            <div
              onClick={() => setActiveSection('sec-d')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                activeSection === 'sec-d'
                  ? 'bg-marine-50/80 border-l-4 border-marine-600 shadow-sm'
                  : 'hover:bg-slate-100/50'
              }`}
            >
              <div className="flex justify-between font-bold text-slate-900 text-[10px] uppercase border-b border-dashed border-slate-200 pb-0.5">
                <span>丁部：專業眼科人員簽章 Certified Assessor</span>
                <span className="text-marine-600 text-[9px] font-mono font-semibold">點擊查看 ⬇️</span>
              </div>
              <div className="flex justify-between items-center mt-2 opacity-90 text-[10px]">
                <div>
                  <p>註冊編號 Opt. No: <span className="font-semibold font-mono text-slate-900">OP100234</span></p>
                  <p className="text-[9px] text-slate-400 mt-0.5">香港註冊眼科視光師（第一部分）</p>
                </div>
                <div className="text-center shrink-0 border border-dashed border-slate-300 rounded p-1.5 bg-slate-50">
                  <div className="w-10 h-10 border border-slate-400/50 rounded-full flex items-center justify-center text-[7px] text-slate-400 font-serif leading-tighter transform -rotate-6">
                    <span className="text-center scale-90">APPROVED<br/>EYE CLINIC</span>
                  </div>
                  <p className="text-[8px] text-slate-500 mt-1 font-mono">加蓋執業印</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic description helper */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Interactive Section Explainer
            </span>
            
            <AnimatePresence mode="wait">
              {sections.map((sec) => {
                if (sec.id !== activeSection) return null;
                return (
                  <motion.div
                    key={sec.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="mt-3 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-marine-50 p-1.5 rounded-lg border border-marine-100">
                        {sec.icon}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-slate-800 text-sm md:text-base leading-snug">
                          {sec.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">
                          {sec.engTitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-marine-700 bg-marine-50/50 px-3 py-1.5 rounded-lg border border-marine-100/50 mb-3">
                      💡 {sec.hint}
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {sec.explanation}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-left">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h5 className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 海事處合規認證說明
              </h5>
              <p className="text-[11px] text-slate-500/90 leading-relaxed">
                本官方格式證明書是由第一部分註冊視光師嚴格按照指引填具。我們中心對此文件永久存檔，若您不慎遺失，3個月內提供完全免費特快補發服務。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

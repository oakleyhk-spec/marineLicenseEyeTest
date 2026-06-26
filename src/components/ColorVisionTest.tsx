import React, { useState, useMemo } from 'react';
import { Eye, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLOR_TESTS, ColorTestItem } from '../data';

// @ts-ignore
import ishihara12 from '../assets/images/ishihara_12_1781970595284.jpg';
// @ts-ignore
import ishihara74 from '../assets/images/ishihara_74_1781970606760.jpg';
// @ts-ignore
import ishihara6 from '../assets/images/ishihara_6_1781970615184.jpg';
// @ts-ignore
import ishihara29 from '../assets/images/ishihara_29_1781970626242.jpg';

const PLATE_IMAGES: Record<string, string> = {
  'ishihara_12': ishihara12,
  'ishihara_74': ishihara74,
  'ishihara_6': ishihara6,
  'ishihara_29': ishihara29,
};

interface Dot {
  x: number;
  y: number;
  r: number;
  isForeground: boolean;
}

export default function ColorVisionTest() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [stage, setStage] = useState<'welcome' | 'testing' | 'results'>('welcome');
  const [isAssisted, setIsAssisted] = useState<boolean>(false);

  // Helper: check if a point (x,y) is near a line segment (x1,y1) -> (x2,y2)
  const distToSegment = (x: number, y: number, x1: number, y1: number, x2: number, y2: number): number => {
    const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    if (l2 === 0) return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
    let t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((x - (x1 + t * (x2 - x1))) ** 2 + (y - (y1 + t * (y2 - y1))) ** 2);
  };

  // Build dots procedurally based on current test item seed shapes
  const generatePlateDots = (seed: string): Dot[] => {
    const dots: Dot[] = [];
    const radius = 95;
    const cx = 100;
    const cy = 100;
    
    // Generate a pseudo-random grid using seed to make it reproducible
    let randSeed = seed === 'ishihara_12' ? 12 : seed === 'ishihara_74' ? 74 : seed === 'ishihara_6' ? 6 : 29;
    const random = () => {
      const x = Math.sin(randSeed++) * 10000;
      return x - Math.floor(x);
    };

    // Attempt to pack around 380 dots inside the plate circle
    for (let i = 0; i < 900; i++) {
      const x = cx + (random() * 2 - 1) * radius;
      const y = cy + (random() * 2 - 1) * radius;
      const r = 2.5 + random() * 4.5; // dot radius

      const dx = x - cx;
      const dy = y - cy;
      const distToCenter = Math.sqrt(dx * dx + dy * dy);

      // Verify dot falls cleanly inside the circular plate border
      if (distToCenter + r < radius) {
        // Check overlap with existing dots
        let overlap = false;
        for (const existing of dots) {
          const distance = Math.sqrt((existing.x - x) ** 2 + (existing.y - y) ** 2);
          if (distance < (existing.r + r + 1.2)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          // Check if this (x, y) is part of our test numbers
          let isForeground = false;

          if (seed === 'ishihara_12') {
            // Digit '1'
            const d11 = distToSegment(x, y, 70, 55, 70, 145);
            const d12 = distToSegment(x, y, 55, 70, 70, 55);
            const d13 = distToSegment(x, y, 58, 145, 82, 145);
            
            // Digit '2'
            const d21 = distToSegment(x, y, 105, 68, 135, 68); // top horizontal
            const d22 = distToSegment(x, y, 105, 68, 105, 82);  // top-left hook
            const d23 = distToSegment(x, y, 135, 68, 135, 95);  // top-right vert
            const d24 = distToSegment(x, y, 135, 95, 105, 140); // diagonal
            const d25 = distToSegment(x, y, 105, 140, 135, 140); // bottom flat base
            
            if (d11 < 10 || d12 < 9 || d13 < 9 || d21 < 11 || d22 < 10 || d23 < 10 || d24 < 10 || d25 < 11) {
              isForeground = true;
            }
          } else if (seed === 'ishihara_74') {
            // Digit '7'
            const d71 = distToSegment(x, y, 55, 60, 95, 60); // top horizontal
            const d72 = distToSegment(x, y, 95, 60, 70, 140); // major diagonal
            const d73 = distToSegment(x, y, 55, 60, 55, 75);  // top-left hook down
            const d74 = distToSegment(x, y, 70, 95, 90, 95);  // European mid cross-bar
            
            // Digit '4'
            const d41 = distToSegment(x, y, 140, 55, 110, 110); // left shoulder diagonal
            const d42 = distToSegment(x, y, 105, 110, 155, 110); // horizontal cross
            const d43 = distToSegment(x, y, 140, 55, 140, 145);  // main vertical
            
            if (d71 < 11 || d72 < 11 || d73 < 10 || d74 < 9 || d41 < 10 || d42 < 11 || d43 < 11) {
              isForeground = true;
            }
          } else if (seed === 'ishihara_6') {
            // Digit '6'
            const circleDist = Math.abs(Math.sqrt((x - 100) ** 2 + (y - 115) ** 2) - 25);
            const stemDist1 = distToSegment(x, y, 75, 115, 76, 90);
            const stemDist2 = distToSegment(x, y, 76, 90, 88, 65);
            const stemDist3 = distToSegment(x, y, 88, 65, 105, 60);

            if (circleDist < 9.5 || stemDist1 < 10 || stemDist2 < 10 || stemDist3 < 10) {
              isForeground = true;
            }
          } else if (seed === 'ishihara_29') {
            // Digit '2'
            const d21 = distToSegment(x, y, 50, 68, 78, 68); // top horizontal
            const d22 = distToSegment(x, y, 50, 68, 50, 78);  // top-left hook
            const d23 = distToSegment(x, y, 78, 68, 78, 92);  // top-right vertical
            const d24 = distToSegment(x, y, 78, 92, 50, 135); // diagonal down-left
            const d25 = distToSegment(x, y, 50, 135, 78, 135); // bottom horizontal
            
            // Digit '9'
            const d9Loop = Math.abs(Math.sqrt((x - 132) ** 2 + (y - 82) ** 2) - 16);
            const d9Stem1 = distToSegment(x, y, 148, 82, 148, 115);
            const d9Stem2 = distToSegment(x, y, 148, 115, 122, 138);

            if (d21 < 11 || d22 < 10 || d23 < 10 || d24 < 10 || d25 < 11 || d9Loop < 8.5 || d9Stem1 < 10 || d9Stem2 < 10) {
              isForeground = true;
            }
          }

          dots.push({ x, y, r, isForeground });
        }
      }
    }
    return dots;
  };

  const currentTest = COLOR_TESTS[currentIndex];
  
  const currentDots = useMemo(() => {
    return generatePlateDots(currentTest.svgSeed);
  }, [currentTest]);

  const handleStart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setStage('testing');
  };

  const handleSelectOption = (option: string) => {
    setUserAnswers(prev => ({ ...prev, [currentTest.id]: option }));

    if (currentIndex < COLOR_TESTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStage('results');
    }
  };

  const scoreSummary = useMemo(() => {
    let correct = 0;
    COLOR_TESTS.forEach((t) => {
      if (userAnswers[t.id] === t.number) {
        correct += 1;
      }
    });

    let rating: 'excellent' | 'minor_weak' | 'moderate_weak' = 'excellent';
    let label = '辨色力完美合格';
    let description = '測試顯示您的視色辨色功能完美，對紅綠信號燈有充足的辨別能力，100% 契合香港海事署之一級、二級及續牌驗眼規格。';

    if (correct === 3) {
      rating = 'minor_weak';
      label = '輕微辨色異常或散光影響';
      description = '您答對了 3 題。有可能是因為屏幕亮度、反射光、輕微色弱或散光影響了眼部聚焦。海事處二級船牌對辨色有基礎要求，通常只需能準確手動分辨紅綠實體燈即可通關，建議親臨我們尖沙咀中心讓視光師為您詳細鑑定，不用感到過度焦慮。';
    } else if (correct < 3) {
      rating = 'moderate_weak';
      label = '中度辨色偏差或疑似色弱';
      description = '您答對了 2 題或以下，表示您在區分紅/綠色系交織的圓點時有一定障礙。海事署對於船隻安全駕駛的一級、二級操作人辨色有安全合規規定。我們的專業中心配有專業的辨色燈、D-15 測試鏡等一整套合規輔助器皿，能夠為您提供最安心的一對一輔助指導，歡迎立即預約與視光師安排初步跟進。';
    }

    return { correct, rating, label, description };
  }, [userAnswers]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-950 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-300 animate-pulse" />
          <span className="font-display font-medium text-sm md:text-base">船牌色弱辨色能力模擬測驗</span>
        </div>
        <div className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-200 uppercase tracking-wider">
          Ishihara Plate v1.1
        </div>
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* WELCOME SCREEN */}
          {stage === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-6"
            >
              <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800 mb-2">
                4步快速辨色自評
              </h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
                海上航行最怕看不清紅綠燈號。本板塊以高精確度模擬 Ishihara 彩色色盲測試盤，1分鐘即可快速檢測您對於紅、綠色覺的敏感程度！
              </p>

              <div className="bg-teal-50 border border-teal-100/50 rounded-2xl p-4 max-w-md mx-auto text-left mb-8">
                <h4 className="text-xs font-semibold text-teal-900 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4 text-teal-600" /> 特快船長必讀
                </h4>
                <p className="text-xs text-teal-800/90 leading-relaxed">
                  有很多市民天生輕微色弱，但是在日常生活中辨色無礙。請大膽進行預檢！
                </p>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-600/10 active:scale-95 cursor-pointer"
              >
                開始辨色測驗
              </button>
            </motion.div>
          )}

          {/* TESTING SCREEN */}
          {stage === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-center text-xs text-slate-400 mb-4 font-mono">
                <span>辨色測試: {currentIndex + 1} / {COLOR_TESTS.length}</span>
                <span className="text-emerald-600">海事處指定指標規格</span>
              </div>

              {/* DISPLAY ACTUAL PLATE IMAGE OR HIGH-CONTRAST PROCEDURAL RECONSTRUCTION */}
              <div className="relative w-60 h-60 md:w-64 md:h-64 bg-slate-50 border-4 border-slate-100 rounded-full flex items-center justify-center shadow-lg overflow-hidden mb-8">
                {isAssisted ? (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Circular border lines */}
                    <circle cx="100" cy="100" r="95" fill="#f8fafc" />
                    
                    {/* Procedurally Drawn Dots in Assist Mode */}
                    {currentDots.map((dot, index) => {
                      let fill = '#fb923c';
                      if (dot.isForeground) {
                        const colors = ['#059669', '#10b981', '#34d399', '#0d9488', '#14b8a6', '#4ade80'];
                        fill = colors[(index * 3) % colors.length];
                      } else {
                        const colors = ['#f97316', '#ea580c', '#facc15', '#eab308', '#ca8a04', '#ef4444', '#f87171', '#f59e0b'];
                        fill = colors[(index * 7) % colors.length];
                      }

                      // High Contrast background fading
                      const opacity = dot.isForeground ? 1.0 : 0.08;

                      return (
                        <circle
                          key={index}
                          cx={dot.x}
                          cy={dot.y}
                          r={dot.r}
                          fill={fill}
                          opacity={opacity}
                          style={{ transition: 'opacity 0.3s ease' }}
                          {...(dot.isForeground ? { stroke: '#ffffff', strokeWidth: 1.0 } : {})}
                        />
                      );
                    })}
                  </svg>
                ) : (
                  <img
                    src={PLATE_IMAGES[currentTest.svgSeed]}
                    alt={`Ishihara Plate ${currentTest.number}`}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Assist Toggle */}
              <div className="mb-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsAssisted(prev => !prev)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold select-none transition flex items-center gap-1.5 ${
                    isAssisted 
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isAssisted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {isAssisted ? '關閉高對比輔助 (顯示高清實物圖)' : '開啟高對比輔助 (顯示高強度數字輪廓)'}
                </button>
              </div>

              <div className="w-full max-w-sm">
                <p className="text-sm font-semibold text-slate-700 mb-4">
                  請問您在上方彩色色盤中，能看見哪一個數字？
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {currentTest.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className="py-3 px-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 bg-white transition font-medium text-slate-700 text-sm shadow-sm active:scale-95"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <p className="text-[11px] text-slate-400">
                  * 提示：請於光線亮度充足的環境下進行檢視。如果您有戴眼鏡，可常規配戴眼鏡。
                </p>
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-2"
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase font-mono text-slate-400 block tracking-widest mb-1">
                  辨色評估分析
                </span>
                <div className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-baseline justify-center gap-1">
                  <span className="text-emerald-700 font-mono">{scoreSummary.correct}</span>
                  <span className="text-sm text-slate-400">/ 4 題答對</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl mb-6 text-left border ${
                scoreSummary.rating === 'excellent'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  : 'bg-amber-50 border-amber-100 text-amber-800'
              }`}>
                <div className="flex gap-2.5">
                  {scoreSummary.rating === 'excellent' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm md:text-base">
                      {scoreSummary.label}
                    </h4>
                    <p className="text-xs md:text-sm mt-1.5 leading-relaxed opacity-90">
                      {scoreSummary.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show wrong answers guide for knowledge improvement */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left mb-8">
                <h4 className="text-xs font-semibold text-slate-600 mb-2">正確答案參考：</h4>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                  {COLOR_TESTS.map((test) => {
                    const isRight = userAnswers[test.id] === test.number;
                    return (
                      <div key={test.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                        <span>圖盤 #{test.id}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-400">答案: {test.number}</span>
                          {isRight ? (
                            <span className="text-emerald-600 font-semibold bg-emerald-50 px-1 py-0.5 rounded text-[10px]">對 ({userAnswers[test.id]})</span>
                          ) : (
                            <span className="text-rose-500 font-semibold bg-rose-50 px-1 py-0.5 rounded text-[10px]">錯 ({userAnswers[test.id] || '無'})</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleStart}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white transition text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" /> 重新測驗
                </button>
                <a
                  href="#booking-widget"
                  className="px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition text-xs font-semibold text-center shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> 預約現場視光師檢驗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

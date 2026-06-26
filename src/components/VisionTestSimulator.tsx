import React, { useState } from 'react';
import { Eye, CheckCircle2, RotateCcw, AlertTriangle, ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Glasses, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssessmentResult {
  glasses: boolean;
  score: number;
  status: 'passed' | 'warning' | 'failed';
  feedback: string;
}

export default function VisionTestSimulator() {
  const [stage, setStage] = useState<'welcome' | 'testing' | 'results'>('welcome');
  const [glasses, setGlasses] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [currentDirection, setCurrentDirection] = useState<0 | 90 | 180 | 270>(0); // 0=Up, 90=Right, 180=Down, 270=Left
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Vision levels corresponding to standard snellen decimals
  const levels = [
    { label: '0.1', size: 160, distance: '模擬距離 6 米' },
    { label: '0.3', size: 100, distance: '模擬距離 6 米' },
    { label: '0.5', size: 70, distance: '模擬距離 6 米' },
    { label: '0.7', size: 45, distance: '模擬距離 6 米 (海事處合格門檻)', isCritical: true },
    { label: '0.8', size: 32, distance: '模擬距離 6 米' },
    { label: '1.0', size: 24, distance: '模擬距離 6 米 (雙眼標準視力)' }
  ];

  const directions: { angle: 0 | 90 | 180 | 270; label: string; icon: React.ReactNode }[] = [
    { angle: 0, label: '向上 (Up)', icon: <ArrowUp className="w-6 h-6" /> },
    { angle: 90, label: '向右 (Right)', icon: <ArrowRight className="w-6 h-6" /> },
    { angle: 180, label: '向下 (Down)', icon: <ArrowDown className="w-6 h-6" /> },
    { angle: 270, label: '向左 (Left)', icon: <ArrowLeft className="w-6 h-6" /> }
  ];

  const handleStart = (useGlasses: boolean) => {
    setGlasses(useGlasses);
    setTestIndex(0);
    setCorrectAnswers(0);
    setStage('testing');
    generateRandomDirection();
    setFeedbackMsg(null);
  };

  const generateRandomDirection = () => {
    const choices: (0 | 90 | 180 | 270)[] = [0, 90, 180, 270];
    const rand = choices[Math.floor(Math.random() * choices.length)];
    setCurrentDirection(rand);
  };

  const handleDirectionClick = (selectedAngle: number) => {
    if (feedbackMsg) return; // Prevent double click during transition

    const isCorrect = selectedAngle === currentDirection;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setFeedbackMsg({ text: '答對了！視力圖正在縮小...', isCorrect: true });
    } else {
      setFeedbackMsg({ text: `答錯了。正確缺口是指向 [${getAngleName(currentDirection)}]`, isCorrect: false });
    }

    // Move to next step after brief delay
    setTimeout(() => {
      setFeedbackMsg(null);
      if (testIndex < levels.length - 1) {
        setTestIndex((prev) => prev + 1);
        generateRandomDirection();
      } else {
        setStage('results');
      }
    }, 1500);
  };

  const getAngleName = (angle: number) => {
    if (angle === 0) return '向上 (Ш)';
    if (angle === 90) return '向右 (E)';
    if (angle === 180) return '向下 (M)';
    return '向左 (彐)';
  };

  const getFinalResult = (): AssessmentResult => {
    // 0 correct -> failed
    // 1-2 correct -> acuity around 0.3 warning
    // 3 correct -> acuity around 0.5 (below 0.7 bar)
    // 4 correct -> acuity around 0.7 (marine limit passed)
    // 5+ correct -> excellent 0.8 / 1.0 passed
    const correctCount = correctAnswers;
    let score = 0;
    let status: 'passed' | 'warning' | 'failed' = 'failed';
    let feedback = '';

    if (correctCount === 0) {
      score = 0.1;
      status = 'failed';
      feedback = '測試結果顯示您的視力偏低，可能無法通過海事處最低 0.7 之標準。建議驗眼當天配戴全新合適度數的眼鏡，並由我們的視光師為您詳細調校及重測。';
    } else if (correctCount <= 2) {
      score = 0.3;
      status = 'warning';
      feedback = '您的大部分測試回答不夠精確。海事處二級船牌及電力小輪操作人等視力要求為 0.7 (矯正視力)。建議預約特快驗眼，我們專業註冊人員會為您安排一對一深度調校。';
    } else if (correctCount === 3) {
      score = 0.5;
      status = 'warning';
      feedback = '您的模擬視力約為 0.5，接近但有些微低於海事處 0.7 的最低標準。大部分市民因近視或散光不足而導致此問題，只需在驗眼當日配戴適當眼鏡，即可通過測驗！';
    } else if (correctCount === 4) {
      score = 0.7;
      status = 'passed';
      feedback = '恭喜！您的模擬視力約為 0.7，剛剛達到海事處規定的視力測驗合格門檻。請在實體驗眼當天保持眼睛充足休息，我們將現場協助您一對一覆核，助您順利取證！';
    } else if (correctCount === 5) {
      score = 0.8;
      status = 'passed';
      feedback = '優良！您的模擬視力已達到 0.8 規格，極大機率能輕鬆通過海事處官方驗眼標準。只要體檢時視色能力也合格，當日即可領取「視力測驗證明書」！';
    } else {
      score = 1.0;
      status = 'passed';
      feedback = '太卓越了！您的眼睛機能極佳，模擬視力達 1.0。海事處的標準對於您而言是非常寬鬆的，您可以直接前往我們中心進行 15 分鐘極速體檢，辦理證明書！';
    }

    return { glasses, score, status, feedback };
  };

  const currentLevel = levels[testIndex];
  const results = stage === 'results' ? getFinalResult() : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
      {/* Indicator bar */}
      <div className="bg-gradient-to-r from-marine-800 to-marine-900 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-marine-300 animate-pulse" />
          <span className="font-display font-medium text-sm md:text-base">海事處 E 字視力表模擬評估</span>
        </div>
        <div className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-marine-200 uppercase tracking-wider">
          Accuracy Tool v2.6
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
              <div className="mx-auto w-16 h-16 bg-marine-50 rounded-full flex items-center justify-center mb-4">
                <Glasses className="w-8 h-8 text-marine-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800 mb-2">
                1分鐘模擬視力自測
              </h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
                考船牌前心慌慌？本小工具有效模擬國際「對照 E 字」視力測試，助您初步掌握您的雙眼在模擬 6 米外的矯正視力值。
              </p>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 max-w-md mx-auto text-left mb-8">
                <div className="flex gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-900">自測準備小貼士</h4>
                    <p className="text-xs text-amber-800/90 mt-1 leading-normal">
                      請將手機或屏幕置於眼睛正前方約 40-50 厘米處，閉上一隻眼，用另一隻眼單獨測試。請選擇您當天採用的驗眼狀態：
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => handleStart(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition font-medium text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  我是「裸眼」進行測試
                </button>
                <button
                  type="button"
                  onClick={() => handleStart(true)}
                  className="px-5 py-3 rounded-xl bg-marine-600 text-white hover:bg-marine-700 transition font-medium text-sm shadow-md shadow-marine-600/10 flex items-center justify-center gap-2"
                >
                  <Glasses className="w-4 h-4" /> 我「戴著眼鏡/隱形」測試
                </button>
              </div>
            </motion.div>
          )}

          {/* TESTING SCREEN */}
          {stage === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-2"
            >
              {/* Progress and indicators */}
              <div className="w-full flex justify-between items-center text-xs text-slate-400 mb-4 font-mono">
                <span>測試進度: {testIndex + 1} / {levels.length}</span>
                <span>{currentLevel.distance}</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
                <div
                  className="bg-marine-600 h-1.5 transition-all duration-300"
                  style={{ width: `${((testIndex + 1) / levels.length) * 100}%` }}
                />
              </div>

              <div className="text-center mb-2">
                <span className="text-xs text-slate-500">當前模擬視力等值：</span>
                <span className="text-xl font-bold font-mono text-marine-700 ml-1">
                  {currentLevel.label}
                </span>
                {currentLevel.isCritical && (
                  <span className="ml-2 bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-sans">
                    海事署合格標準
                  </span>
                )}
              </div>

              {/* STAGE MAIN INTERACTION - THE "E" SIZE CAN VARY */}
              <div className="w-64 h-64 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex items-center justify-center relative shadow-inner overflow-hidden mb-8">
                {/* Visual grid reference lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-full h-px bg-slate-300 pointer-events-none" />
                  <div className="h-full w-px bg-slate-300 pointer-events-none absolute" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${testIndex}-${currentDirection}`}
                    initial={{ scale: 0.8, opacity: 0, rotate: currentDirection - 90 }}
                    animate={{ scale: 1, opacity: 1, rotate: currentDirection - 90 }}
                    exit={{ scale: 0.9, opacity: 0, rotate: currentDirection - 90 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    style={{
                      width: `${currentLevel.size}px`,
                      height: `${currentLevel.size}px`
                    }}
                    className="flex items-center justify-center select-none cursor-default"
                  >
                    {/* Drawing elegant SVG high contrast standard E Chart letter */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-slate-900 fill-current"
                    >
                      {/* Standard Snellen E is composed of 5 units of equal height/width (three bars + back) */}
                      <path d="M 10,10 H 90 V 30 H 30 V 45 H 80 V 65 H 30 V 80 H 90 V 100 H 10 Z" />
                    </svg>
                  </motion.div>
                </AnimatePresence>

                {/* Live screen overlay feedback */}
                {feedbackMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute inset-0 flex flex-col justify-center items-center p-4 text-center ${
                      feedbackMsg.isCorrect ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {feedbackMsg.isCorrect ? (
                      <CheckCircle2 className="w-12 h-12 mb-2 animate-bounce" />
                    ) : (
                      <AlertTriangle className="w-12 h-12 mb-2 animate-pulse" />
                    )}
                    <p className="font-semibold text-sm leading-snug">{feedbackMsg.text}</p>
                  </motion.div>
                )}
              </div>

              {/* Direction controls overlay */}
              <div className="text-center w-full max-w-sm">
                <p className="text-xs text-slate-500 mb-3">
                  請點擊下方對應的按鈕，指出上圖【E 的缺口】朝向哪邊：
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {directions.map((dir) => (
                    <button
                      key={dir.angle}
                      type="button"
                      onClick={() => handleDirectionClick(dir.angle)}
                      disabled={!!feedbackMsg}
                      className="py-3 px-4 rounded-xl border border-slate-200 hover:border-marine-500 hover:bg-marine-50 hover:text-marine-700 font-medium text-slate-700 bg-white transition shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                    >
                      {dir.icon}
                      <span>{dir.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {stage === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-2"
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase font-mono text-slate-400 block tracking-widest mb-1">
                  模擬檢測結果
                </span>
                <div className="text-5xl font-mono font-extrabold text-marine-800 tracking-tight flex items-baseline justify-center gap-1">
                  <span>{results.score}</span>
                  <span className="text-sm font-sans font-normal text-slate-500">
                    {results.glasses ? '(矯正視力值)' : '(裸眼視力值)'}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl mb-6 flex gap-4 ${
                results.status === 'passed' 
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' 
                  : results.status === 'warning'
                  ? 'bg-amber-50 border border-amber-100 text-amber-800'
                  : 'bg-rose-50 border border-rose-100 text-rose-800'
              }`}>
                {results.status === 'passed' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-left text-xs md:text-sm leading-relaxed">
                  <h4 className="font-semibold text-slate-800 mb-1">
                    {results.status === 'passed' ? '👍 大機率符合海事處要求' : '⚠️ 建議深入檢查或在驗眼當天攜帶眼镜'}
                  </h4>
                  <p className="opacity-90">{results.feedback}</p>
                </div>
              </div>

              {/* Highlights comparison */}
              <div className="grid grid-cols-2 gap-4 text-center mb-8">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">我的答對題數</span>
                  <span className="text-lg font-bold text-slate-700">{correctAnswers} / 6 關</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">海事處最低門檻</span>
                  <span className="text-lg font-bold text-rose-600">0.7 (矯正視力)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setStage('welcome')}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white transition text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" /> 重新測驗
                </button>
                <a
                  href="#booking-widget"
                  className="px-6 py-3 rounded-xl bg-marine-600 text-white hover:bg-marine-700 transition text-xs font-semibold text-center shadow-md shadow-marine-600/20 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> 立即預約現場官方驗眼
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

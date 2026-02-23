
import React, { useState, useEffect, useRef } from 'react';
import { View, TenseData, Question, ScoreEntry, UserStats } from './types';
import { TENSES, ROBOT_MASCOT_URL, SNIPER_POOL, GARDEN_POOL, MACHINE_POOL, QUEST_POOL, SCRAMBLE_POOL, MATCH_POOL, SENTENCE_POOL, PRE_TEST_POOL, POST_TEST_POOL } from './constants';
import { getGrammarAdvice, getTechnicalSupport, speakText, generateMascotLogo } from './services/geminiService';

// --- Sound System ---
const playSound = (type: 'correct' | 'wrong' | 'victory' | 'message') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else if (type === 'victory') {
      osc.type = 'sine';
      [440, 554, 659, 880].forEach((f, i) => {
        osc.frequency.setValueAtTime(f, ctx.currentTime + (i * 0.1));
      });
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    } else if (type === 'message') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    }
    
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn("Audio blocked");
  }
};

// --- Login Screen ---
const LoginScreen = ({ onLogin, mascotUrl, isGenerating }: { onLogin: (name: string) => void, mascotUrl: string, isGenerating: boolean }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
      playSound('victory');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10 overflow-hidden">
      <div className="max-w-md w-full bg-white/90 dark:bg-slate-800 p-12 rounded-[4rem] shadow-2xl border-4 border-pinky/20 text-center animate-scale-in">
        <div className="relative mb-6">
          <img src="/assets/logo.png" className="size-32 mx-auto object-contain mb-4" alt="TenseBunny Logo" />
        </div>
        <div className="relative mb-10">
          <img src={mascotUrl} className={`size-48 mx-auto object-contain transition-all duration-1000 ${isGenerating ? 'blur-md opacity-30' : 'animate-float'}`} alt="mascot" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full font-display font-bold text-lg shadow-lg">Hello! 🌸</div>
        </div>
        <h1 className="text-5xl font-display font-black text-primary mb-4 leading-tight">Welcome to<br/>TenseBunny</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 italic">กรุณาบอกชื่อของคุณให้เรารู้หน่อยนะคะ</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อของคุณ..."
            className="w-full px-8 py-5 rounded-[2rem] border-2 border-pinky/30 bg-background-light dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-xl font-bold text-center outline-none dark:text-white"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={!name.trim()}
            className="w-full py-6 bg-primary text-white font-black rounded-[2.5rem] text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            ไปกันเลย! <span className="material-icons-round">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Quiz Component ---
const QuizEngine = ({ count, title, pool, onComplete, mascotUrl, goToLesson, hideFeedback = false }: { 
  count: number, title: string, pool: Question[], onComplete: (score: number) => void, mascotUrl: string, goToLesson: (tenseId: string) => void, hideFeedback?: boolean
}) => {
  const [questions] = useState(() => [...pool].sort(() => Math.random() - 0.5).slice(0, count));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [missedTenses, setMissedTenses] = useState<string[]>([]);

  const handleNext = () => {
    const isCorrect = selected === questions[current].correct;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setMissedTenses(prev => {
        const t = questions[current].tense;
        return prev.includes(t) ? prev : [...prev, t];
      });
    }

    if (hideFeedback) {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setIsFinished(true);
      }
    } else {
      setShowFeedback(true);
    }
  };

  const proceed = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in relative z-10 text-center">
        <div className="bg-white/95 dark:bg-slate-800 p-16 rounded-[4rem] shadow-2xl border border-pinky/20">
          <div className="size-52 bg-gradient-to-br from-primary to-lavender rounded-full mx-auto flex items-center justify-center text-white shadow-2xl border-8 border-white mb-10">
            <span className="text-7xl font-display font-black">{Math.round((score / count) * 100)}%</span>
          </div>
          <h2 className="text-5xl font-display font-bold dark:text-white mb-4">{title} สำเร็จ!</h2>
          <p className="text-2xl text-slate-500 font-medium italic mb-10">คะแนนของคุณ: {score} / {count}</p>
          
          {missedTenses.length > 0 && (
            <div className="text-left bg-primary/5 p-10 rounded-[3rem] border-2 border-dashed border-primary/20 mb-12 animate-slide-up">
              <h3 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                <span className="material-icons-round">analytics</span> คำแนะนำจาก AI Tutor
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">คุณยังมีส่วนที่ผิดในเรื่อง Tense เหล่านี้ เราแนะนำให้กลับไปทวนบทเรียนดูนะคะ:</p>
              <div className="flex flex-wrap gap-3">
                {missedTenses.map(tName => {
                  const tData = TENSES.find(td => td.name === tName);
                  return (
                    <button key={tName} onClick={() => goToLesson(tData?.id || "")} className="px-6 py-3 bg-white border-2 border-pinky/20 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2">
                      <span className="material-icons-round">auto_stories</span> {tName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <button onClick={() => onComplete(score)} className="px-16 py-7 bg-primary text-white font-black rounded-[2.5rem] text-2xl shadow-2xl hover:scale-110 transition-all">เสร็จสิ้นและสะสมคะแนน</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white/95 dark:bg-slate-800 rounded-[4rem] shadow-2xl border border-pinky/20 animate-fade-in relative z-10">
      <div className="flex justify-between items-center mb-12">
        <span className="text-[10px] uppercase font-black text-pink-300 tracking-[0.3em] bg-primary/5 px-6 py-2 rounded-full">Question {current + 1} / {count}</span>
        <img src={mascotUrl} className="size-20 animate-float object-contain" alt="mascot" />
      </div>
      <h2 className="text-4xl font-display font-bold dark:text-white text-center leading-relaxed mb-16 italic">"{q.sentence.replace('___', '______')}"</h2>
      
      {!showFeedback ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {q.options?.map(opt => (
              <button key={opt} onClick={() => setSelected(opt)} className={`p-8 rounded-[2.5rem] border-2 font-bold text-2xl transition-all shadow-sm ${selected === opt ? 'border-primary bg-primary text-white scale-105 shadow-xl' : 'border-pinky/10 dark:text-slate-300 bg-white dark:bg-slate-900 hover:border-primary/50'}`}>{opt}</button>
            ))}
          </div>
          <button disabled={!selected} onClick={handleNext} className="w-full py-8 bg-primary text-white font-black rounded-[2.5rem] text-3xl disabled:opacity-30 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">ส่งคำตอบ</button>
        </>
      ) : (
        <div className="animate-scale-in">
          <div className={`p-10 rounded-[3rem] border-4 mb-10 ${selected === q.correct ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
            <div className="flex items-center gap-4 mb-6">
              <span className={`material-icons-round text-5xl ${selected === q.correct ? 'text-green-500' : 'text-red-500'}`}>
                {selected === q.correct ? 'check_circle' : 'cancel'}
              </span>
              <h3 className="text-3xl font-display font-bold dark:text-white">{selected === q.correct ? 'ถูกต้องค่ะ!' : 'ยังไม่ถูกนะคะ...'}</h3>
            </div>
            <p className="text-xl font-bold mb-4 dark:text-slate-200">เฉลย: <span className="text-primary">{q.correct}</span></p>
            <p className="text-lg text-slate-600 dark:text-slate-400 italic">"{q.explanation}"</p>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-pink-300 tracking-widest">Tense: {q.tense}</span>
              <button onClick={() => speakText(q.sentence.replace('___', q.correct))} className="size-12 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-inner"><span className="material-icons-round">volume_up</span></button>
            </div>
          </div>
          <button onClick={proceed} className="w-full py-8 bg-primary text-white font-black rounded-[2.5rem] text-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">ข้อถัดไป <span className="material-icons-round align-middle text-4xl">arrow_forward</span></button>
        </div>
      )}
    </div>
  );
};

// --- Game Components (MatchMaker, Scramble, Runner, Generic) ---
const MatchMaker = ({ onFinish }: { onFinish: (xp: number) => void }) => {
  const [questions] = useState(() => [...MATCH_POOL].sort(() => Math.random() - 0.5).slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleMatch = (tenseName: string) => {
    const isCorrect = tenseName === questions[current].correct;
    playSound(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else { setFinished(true); playSound('victory'); }
  };

  if (finished) return (
    <div className="max-w-2xl mx-auto text-center p-12 bg-white/90 dark:bg-slate-800 rounded-[3rem] shadow-2xl animate-fade-in border border-pinky/20 relative z-10">
      <h2 className="text-4xl font-display font-bold text-primary mb-6">Matching Complete!</h2>
      <p className="text-7xl font-display font-bold mb-8 text-primary">{score} / {questions.length}</p>
      <button onClick={() => onFinish(score * 30)} className="w-full py-6 bg-primary text-white font-bold rounded-2xl text-2xl shadow-lg">รับ {score * 30} XP</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-12 bg-white/80 dark:bg-slate-800 rounded-[3.5rem] shadow-2xl border-4 border-dashed border-pinky/30 relative z-10">
      <div className="text-center mb-10">
        <p className="text-sm font-bold text-pink-300 uppercase tracking-widest mb-4">MATCH THE TENSE</p>
        <h2 className="text-4xl font-display font-bold dark:text-white italic leading-relaxed">"{questions[current].sentence}"</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {questions[current].options?.map(opt => (
          <button key={opt} onClick={() => handleMatch(opt)} className="p-5 bg-white dark:bg-slate-900 border-2 border-pinky/20 rounded-2xl font-bold text-lg hover:bg-primary/5 hover:border-primary transition-all active:scale-95 dark:text-white">{opt}</button>
        ))}
      </div>
    </div>
  );
};

const SentenceScramble = ({ onFinish }: { onFinish: (xp: number) => void }) => {
  const [questions] = useState(() => [...SCRAMBLE_POOL].sort(() => Math.random() - 0.5).slice(0, 4));
  const [current, setCurrent] = useState(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const addWord = (w: string) => {
    if (!userWords.includes(w)) {
      setUserWords([...userWords, w]);
    }
  };

  const clear = () => setUserWords([]);

  const checkAnswer = () => {
    const isCorrect = userWords.join(" ") === questions[current].correct;
    playSound(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (current < questions.length - 1) { setCurrent(c => c + 1); setUserWords([]); }
      else { setFinished(true); playSound('victory'); }
    }, 800);
  };

  if (finished) return (
    <div className="max-w-2xl mx-auto text-center p-12 bg-white/90 dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-pinky/20 relative z-10">
      <h2 className="text-4xl font-display font-bold text-primary mb-6">Master Builder!</h2>
      <p className="text-7xl font-display font-bold mb-8 text-primary">{score} / {questions.length}</p>
      <button onClick={() => onFinish(score * 50)} className="w-full py-6 bg-primary text-white font-bold rounded-2xl text-2xl shadow-lg">รับ {score * 50} XP</button>
    </div>
  );

  const availableWords = questions[current].scrambledWords!.filter(w => !userWords.includes(w));

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white/80 dark:bg-slate-800 rounded-[3.5rem] shadow-2xl relative z-10 border border-pinky/10">
      <div className="text-center mb-10">
        <p className="text-sm font-bold text-pink-300 mb-2 uppercase tracking-widest">Build this Tense: {questions[current].tense}</p>
        <div className="min-h-[100px] p-8 bg-pinky/5 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-pinky/20 flex flex-wrap gap-4 justify-center items-center">
          {userWords.map((w, i) => <span key={i} className="px-5 py-2.5 bg-primary text-white font-bold rounded-2xl shadow-sm">{w}</span>)}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {availableWords.map((w, i) => (
          <button key={i} onClick={() => addWord(w)} className="px-6 py-3 bg-white dark:bg-slate-700 border-2 border-pinky/10 rounded-2xl font-bold text-xl hover:scale-110 active:scale-95 transition-all shadow-sm dark:text-white">{w}</button>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={clear} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">ล้างทั้งหมด</button>
        <button disabled={userWords.length < questions[current].scrambledWords!.length} onClick={checkAnswer} className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl text-xl shadow-lg disabled:opacity-30">ตรวจคำตอบ</button>
      </div>
    </div>
  );
};

const TenseRunner = ({ onFinish }: { onFinish: (xp: number) => void }) => {
  const [questions] = useState(() => [...POST_TEST_POOL].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || finished) { setFinished(true); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const handleAnswer = (ans: string) => {
    const isCorrect = ans === questions[current].correct;
    playSound(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) { setScore(s => s + 1); setTimeLeft(t => t + 3); }
    else setTimeLeft(t => Math.max(0, t - 5));

    if (current < questions.length - 1) setCurrent(c => c + 1);
    else setFinished(true);
  };

  if (finished) return (
    <div className="max-w-2xl mx-auto text-center p-12 bg-white/90 dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-pinky/20 relative z-10">
      <h2 className="text-4xl font-display font-bold text-primary mb-4">Time's Up!</h2>
      <div className="bg-primary/5 p-10 rounded-[3rem] mb-8">
        <p className="text-xl font-bold text-pink-300 mb-2 uppercase">Total Correct</p>
        <p className="text-8xl font-display font-bold text-primary">{score}</p>
      </div>
      <button onClick={() => onFinish(score * 40)} className="w-full py-6 bg-primary text-white font-bold rounded-2xl text-2xl shadow-lg">รับ {score * 40} XP</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-12 bg-white/80 dark:bg-slate-800 rounded-[3.5rem] shadow-2xl relative z-10 border-4 border-primary/20 overflow-hidden">
      <div className="absolute top-0 left-0 h-4 bg-primary transition-all duration-1000" style={{ width: `${(timeLeft/30)*100}%` }}></div>
      <div className="flex justify-between items-center mb-12 mt-4">
         <span className={`font-display font-bold text-4xl flex items-center gap-3 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-primary'}`}><span className="material-icons-round text-4xl">timer</span> {timeLeft}s</span>
         <span className="font-black text-slate-300 uppercase tracking-widest text-sm">RUNNER MODE</span>
      </div>
      <h2 className="text-4xl font-display font-bold dark:text-white text-center mb-14 italic leading-relaxed">"{questions[current].sentence}"</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions[current].options?.map(opt => (
          <button key={opt} onClick={() => handleAnswer(opt)} className="p-7 bg-white dark:bg-slate-900 border-2 border-pinky/10 rounded-3xl font-bold text-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 dark:text-white">{opt}</button>
        ))}
      </div>
    </div>
  );
};

const GenericGameWrapper = ({ title, pool, onFinish, icon, description }: { 
  title: string, pool: Question[], onFinish: (xp: number) => void, icon: string, description: string 
}) => {
  const [questions] = useState(() => [...pool].sort(() => Math.random() - 0.5).slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (ans: string) => {
    const isCorrect = ans === questions[current].correct;
    playSound(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else { setFinished(true); playSound('victory'); }
  };

  if (finished) return (
    <div className="max-w-2xl mx-auto text-center p-12 bg-white/90 dark:bg-slate-800 rounded-[3rem] shadow-2xl animate-fade-in border border-pinky/20 relative z-10">
      <h2 className="text-4xl font-display font-bold text-primary mb-6">{title} Complete!</h2>
      <div className="bg-primary/5 p-10 rounded-[3rem] mb-8">
        <p className="text-7xl font-display font-bold text-primary">{score} / {questions.length}</p>
      </div>
      <button onClick={() => onFinish(score * 20)} className="w-full py-6 bg-primary text-white font-bold rounded-2xl text-2xl shadow-lg transition-all active:scale-95">รับ {score * 20} XP</button>
    </div>
  );

  const q = questions[current];
  return (
    <div className="max-w-3xl mx-auto p-12 bg-white/80 dark:bg-slate-800 rounded-[3.5rem] shadow-2xl relative z-10 border-4 border-dashed border-pinky/30">
      <div className="text-center mb-12">
        <div className="size-24 rounded-[2.5rem] bg-primary/10 text-primary flex items-center justify-center mb-8 mx-auto shadow-inner"><span className="material-icons-round text-5xl">{icon}</span></div>
        <p className="text-xs font-black text-pink-300 uppercase tracking-widest mb-4">{description}</p>
        <h2 className="text-4xl font-display font-bold dark:text-white italic leading-relaxed">
          {q.targetTense && <span className="block text-xl text-primary not-italic mb-2 underline">Transform to: {q.targetTense}</span>}
          {q.wrongPart && <span className="block text-xl text-primary not-italic mb-2 underline">Fix this part: "{q.wrongPart}"</span>}
          "{q.sentence}"
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {q.options?.map(opt => (
          <button key={opt} onClick={() => handleAnswer(opt)} className="p-7 bg-white dark:bg-slate-900 border-2 border-pinky/10 rounded-3xl font-bold text-2xl hover:bg-primary/5 hover:border-primary transition-all text-left group flex justify-between items-center shadow-sm dark:text-white">
            <span>{opt}</span>
            <span className="material-icons-round text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const [view, setView] = useState<View>(View.LOGIN);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tensebunny_theme');
    return saved === 'dark';
  });
  const [preTestScore, setPreTestScore] = useState<number | null>(null);
  const [postTestScore, setPostTestScore] = useState<number | null>(null);
  const [activeTense, setActiveTense] = useState(TENSES[0]);
  const [mascotUrl, setMascotUrl] = useState(ROBOT_MASCOT_URL);
  const [isGeneratingMascot, setIsGeneratingMascot] = useState(false);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('tensebunny_stats');
    if (saved) return JSON.parse(saved);
    return { userName: '', xp: 0, level: 1, streak: 1, lastPlayed: '', badges: [] };
  });

  useEffect(() => {
    const initMascot = async () => {
      setIsGeneratingMascot(true);
      const generated = await generateMascotLogo();
      if (generated) setMascotUrl(generated);
      setIsGeneratingMascot(false);
    };
    initMascot();
  }, []);

  // Effect สำหรับ Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tensebunny_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tensebunny_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('tensebunny_stats', JSON.stringify(stats));
    if (stats.userName && view === View.LOGIN) {
      setView(View.HOME);
    }
  }, [stats]);

  const handleLogin = (name: string) => {
    setStats(prev => ({ ...prev, userName: name }));
    setView(View.HOME);
  };

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
    setView(View.GAMES);
  };

  const isGated = preTestScore === null;

  const goToLessonFromQuiz = (tenseId: string) => {
    const t = TENSES.find(td => td.id === tenseId || td.name === tenseId);
    if (t) setActiveTense(t);
    setView(View.LESSONS);
  };

  const renderContent = () => {
    switch(view) {
      case View.LOGIN: return <LoginScreen onLogin={handleLogin} mascotUrl={mascotUrl} isGenerating={isGeneratingMascot} />;
      case View.HOME: return (
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-20 min-h-[80vh] relative z-10 text-center">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:text-left">
            <div className="flex-1 space-y-12 animate-fade-in">
              <div className="inline-block bg-primary/10 px-8 py-3 rounded-full border border-primary/20">
                <span className="text-xl font-display font-bold text-primary">ยินดีต้อนรับกลับมานะคะ, {stats.userName}! 🌸</span>
              </div>
              <h1 className="text-8xl md:text-9xl font-display font-black leading-[0.8] dark:text-white tracking-tighter">Tense<br/><span className="text-gradient-pastel">Bunny</span></h1>
              <p className="text-3xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">สัมผัสโลกแห่ง Tense ที่หวานละมุนที่สุด พร้อมระบบมินิเกมและ AI ผู้ช่วยส่วนตัว</p>
              <button onClick={() => isGated ? setView(View.PRE_TEST) : setView(View.LESSONS)} className="px-16 py-8 bg-primary text-white font-black rounded-[2.5rem] text-3xl shadow-2xl hover:scale-110 transition-all flex items-center justify-center gap-4 mx-auto lg:mx-0">
                {isGated ? 'เริ่มแบบทดสอบแรก' : 'ไปที่บทเรียน'} <span className="material-icons-round text-4xl">rocket_launch</span>
              </button>
            </div>
            <div className="flex-1 relative">
              <img src={mascotUrl} alt="Mascot" className={`animate-float w-full max-w-lg mx-auto drop-shadow-2xl transition-all duration-1000 ${isGeneratingMascot ? 'opacity-20 blur-sm scale-90' : 'opacity-100 scale-100'}`} />
            </div>
          </div>

          {/* Section: Why TenseBunny? */}
          <div className="mt-32 w-full animate-fade-in">
            <h2 className="text-5xl font-display font-bold text-primary mb-20 underline decoration-pinky decoration-dashed underline-offset-8">ทำไมถึงต้องใช้ TenseBunny? 🌸</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: 'sports_esports', title: 'Gamified Learning', desc: 'เปลี่ยนแกรมม่าที่น่าเบื่อให้กลายเป็นมินิเกมแสนสนุก เก็บ XP และ Level up ไปด้วยกัน' },
                { icon: 'psychology', title: 'AI-Powered Tutor', desc: 'มี GrammarBot (Gemini AI) คอยตอบคำถามและอธิบายข้อสงสัยได้ตลอด 24 ชั่วโมง' },
                { icon: 'analytics', title: 'Smart Feedback', desc: 'ระบบวิเคราะห์หลังสอบที่จะบอกชัดเจนว่าคุณควรทวน Tense ไหนเพิ่มเติม' },
                { icon: 'auto_awesome', title: 'Kawaii Aesthetic', desc: 'ดีไซน์ธีมชมพูหวานละมุน สบายตา ช่วยให้การเรียนรู้เป็นเรื่องที่ไม่เครียด' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/70 dark:bg-slate-800 p-10 rounded-[3rem] border border-pinky/20 shadow-xl hover:scale-105 transition-transform">
                  <div className="size-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-inner">
                    <span className="material-icons-round text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 dark:text-white">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      case View.PRE_TEST: return <QuizEngine count={20} title="Placement Test" pool={PRE_TEST_POOL} mascotUrl={mascotUrl} goToLesson={goToLessonFromQuiz} hideFeedback={true} onComplete={(s) => { setPreTestScore(s); setView(View.LESSONS); }} />;
      case View.POST_TEST: return <QuizEngine count={30} title="Final Mastery Exam" pool={POST_TEST_POOL} mascotUrl={mascotUrl} goToLesson={goToLessonFromQuiz} hideFeedback={false} onComplete={(s) => { setPostTestScore(s); setView(View.RANKING); }} />;
      case View.LESSONS: return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          <aside className="lg:col-span-3 space-y-3 overflow-y-auto max-h-[80vh] scrollbar-hide pr-2">
            <h3 className="font-display font-bold text-2xl dark:text-white mb-6 px-4">Mastery Course</h3>
            {TENSES.map(t => (
              <button key={t.id} onClick={() => setActiveTense(t)} className={`w-full text-left px-8 py-5 rounded-[2rem] transition-all border-2 ${t.id === activeTense.id ? 'bg-primary border-primary text-white font-bold shadow-xl scale-105' : 'bg-white dark:bg-slate-800 border-pinky/10 text-slate-500 hover:border-primary/30 dark:text-slate-300'}`}>{t.name}</button>
            ))}
          </aside>
          <main className="lg:col-span-9 bg-white/80 dark:bg-slate-800 p-14 rounded-[4rem] shadow-2xl border border-pinky/20 animate-fade-in overflow-hidden relative">
            <h1 className="text-7xl font-display font-bold text-primary mb-6">{activeTense.name}</h1>
            <p className="text-2xl text-slate-500 dark:text-slate-400 mb-12 italic leading-relaxed">"{activeTense.description}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-primary/5 dark:bg-slate-700/30 p-10 rounded-[3.5rem] border-2 border-primary/20 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] font-black text-pink-300 uppercase tracking-[0.3em] mb-6">Sentence Structure</span>
                <span className="text-5xl font-display font-bold dark:text-white text-center leading-tight">
                  {activeTense.formula.subject} + <span className="text-primary">{activeTense.formula.verb}</span>
                </span>
                <p className="mt-8 text-sm text-slate-400 font-bold italic">*{activeTense.formula.note}</p>
              </div>
              <div className="bg-accent/10 dark:bg-amber-900/10 p-10 rounded-[3.5rem] border-2 border-accent/20 dark:border-amber-800/30 shadow-inner">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] block mb-6">Keywords / Signal Words</span>
                <div className="flex flex-wrap gap-3">
                  {activeTense.signalWords.map(word => <span key={word} className="px-5 py-2.5 bg-white dark:bg-slate-700 rounded-2xl text-base font-bold shadow-sm border border-pinky/5 dark:border-white/5 dark:text-slate-200">{word}</span>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="font-display font-bold text-2xl dark:text-white flex items-center gap-3"><span className="material-icons-round text-primary">auto_awesome</span> วิธีใช้งาน (Usages)</h4>
                <ul className="space-y-4">
                  {activeTense.usages.map((u, i) => <li key={i} className="flex items-start gap-4 text-xl text-slate-600 dark:text-slate-300 leading-relaxed"><span className="material-icons-round text-primary mt-1">check_circle</span> {u}</li>)}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="font-display font-bold text-2xl dark:text-white flex items-center gap-3"><span className="material-icons-round text-accent">chat_bubble</span> ตัวอย่างประโยค</h4>
                {activeTense.examples.map((ex, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-pinky/10 flex justify-between items-center group hover:shadow-lg transition-all">
                    <div className="space-y-1">
                      <p className="text-xl font-medium italic dark:text-slate-200">"{ex.text}"</p>
                      <span className="text-[10px] font-black uppercase text-pink-300 tracking-tighter bg-primary/5 px-3 py-1 rounded-full">{ex.category}</span>
                    </div>
                    <button onClick={() => speakText(ex.text)} className="size-12 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-inner"><span className="material-icons-round">volume_up</span></button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      );
      case View.GAMES: return (
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-7xl font-display font-bold text-gradient-pastel mb-6">Game Kingdom</h2>
            <p className="text-2xl text-slate-400 font-medium italic">เล่นเกมเพื่อสะสม XP และยึดครองอันดับหนึ่ง!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { id: View.GAME_MATCH, title: "MatchMaker", icon: "category", desc: "จับคู่ประโยคที่ลอยมากับ Tense", xp: "30 XP / ข้อ" },
              { id: View.GAME_SCRAMBLE, title: "Sentence Builder", icon: "edit", desc: "เรียงคำศัพท์ให้ถูกหลักไวยากรณ์", xp: "50 XP / ข้อ" },
              { id: View.GAME_RUNNER, title: "Tense Runner", icon: "speed", desc: "ตอบไวให้ทันก่อนเวลาจะหมด!", xp: "40 XP / ข้อ" },
              { id: View.GAME_SNIPER, title: "Tense Sniper", icon: "gps_fixed", desc: "ระบุ Tense ให้แม่นยำที่สุด", xp: "20 XP / ข้อ" },
              { id: View.GAME_GARDEN, title: "Grammar Garden", icon: "local_florist", desc: "เติมกริยาช่วยเพื่อปลูกดอกไม้", xp: "20 XP / ข้อ" },
              { id: View.GAME_MACHINE, title: "Time Machine", icon: "auto_fix_high", desc: "แปลงประโยคย้อนเวลากลับไป", xp: "20 XP / ข้อ" }
            ].map(game => (
              <button key={game.id} onClick={() => setView(game.id as View)} className="group bg-white/95 dark:bg-slate-800 p-12 rounded-[4rem] border border-pinky/20 shadow-xl hover:-translate-y-4 transition-all text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                <div className="size-24 rounded-[2.5rem] bg-primary/10 text-primary flex items-center justify-center mb-8 mx-auto group-hover:bg-primary group-hover:text-white transition-colors shadow-inner"><span className="material-icons-round text-5xl">{game.icon}</span></div>
                <h3 className="text-3xl font-display font-bold mb-4 dark:text-white">{game.title}</h3>
                <p className="text-base text-slate-400 mb-8 leading-relaxed">{game.desc}</p>
                <span className="text-xs font-black text-primary bg-primary/10 px-6 py-2 rounded-full uppercase tracking-widest">{game.xp}</span>
              </button>
            ))}
          </div>
        </div>
      );
      case View.GAME_MATCH: return <MatchMaker onFinish={addXP} />;
      case View.GAME_SCRAMBLE: return <SentenceScramble onFinish={addXP} />;
      case View.GAME_RUNNER: return <TenseRunner onFinish={addXP} />;
      case View.GAME_SNIPER: return <GenericGameWrapper title="Tense Sniper" pool={PRE_TEST_POOL} onFinish={addXP} icon="gps_fixed" description="ระบุ Tense จากประโยค" />;
      case View.GAME_GARDEN: return <GenericGameWrapper title="Grammar Garden" pool={GARDEN_POOL} onFinish={addXP} icon="local_florist" description="เติมกริยาให้ประโยคสมบูรณ์" />;
      case View.GAME_MACHINE: return <GenericGameWrapper title="Time Machine" pool={MACHINE_POOL} onFinish={addXP} icon="auto_fix_high" description="ย้อนเวลาเพื่อแปลงประโยค" />;
      case View.RANKING: return (
        <div className="max-w-4xl mx-auto py-20 px-4 relative z-10 text-center">
          <div className="bg-white/95 dark:bg-slate-800 p-16 rounded-[4rem] shadow-2xl border border-pinky/20">
             <h2 className="text-6xl font-display font-bold text-primary mb-12 flex items-center justify-center gap-6"><span className="material-icons-round text-6xl">emoji_events</span> Achievement Hall</h2>
             <p className="text-2xl text-slate-500 mb-12">ยินดีด้วยนะคะ {stats.userName}! ทำ Final Exam เพื่อดูความก้าวหน้าของคุณที่นี่</p>
             {postTestScore !== null ? (
                <div className="bg-primary/5 p-8 rounded-3xl mb-8">
                  <p className="text-xl font-bold text-pink-400 mb-2 uppercase">Best Mastery Score</p>
                  <p className="text-7xl font-display font-bold text-primary">{Math.round((postTestScore / 30) * 100)}%</p>
                </div>
             ) : null}
             <button onClick={() => setView(View.POST_TEST)} className="px-16 py-7 bg-primary text-white font-bold rounded-[2.5rem] text-2xl shadow-2xl hover:scale-105 transition-all mb-10">ท้าทาย Final Exam (30 ข้อ)</button>
          </div>
        </div>
      );
      case View.CONTACT: return (
        <div className="max-w-4xl mx-auto py-20 text-center relative z-10">
           <div className="bg-white/95 dark:bg-slate-800 p-16 rounded-[4rem] shadow-xl border border-pinky/20">
             <h2 className="text-5xl font-display font-bold mb-10 text-primary">Contact Support</h2>
             <div className="space-y-6 text-2xl font-medium dark:text-slate-300">
               <p className="flex items-center justify-center gap-4"><span className="material-icons-round text-primary text-3xl">email</span> skykandanai@gmail.com</p>
               <p className="flex items-center justify-center gap-4"><span className="material-icons-round text-primary text-3xl">phone</span> 098-772-2069</p>
             </div>
           </div>
        </div>
      );
      case View.CHAT_SUPPORT: return (
        <div className="max-w-4xl mx-auto py-10 px-4 h-[75vh] flex flex-col relative z-10">
           <div className="bg-white/95 dark:bg-slate-800 rounded-[3rem] shadow-2xl flex flex-col flex-grow overflow-hidden border border-pinky/20">
             <div className="p-10 border-b border-pinky/10 bg-primary/5 flex items-center gap-6">
               <img src={mascotUrl} className="size-20" alt="Bot" />
               <div>
                 <h2 className="text-3xl font-display font-bold dark:text-white">GrammarBot AI</h2>
                 <p className="text-xs font-black text-pink-300 uppercase tracking-widest">Online Assistant</p>
               </div>
             </div>
             <div className="flex-grow p-12 overflow-y-auto">
               <div className="bg-white/50 dark:bg-slate-700 p-10 rounded-[3rem] text-center border-2 border-dashed border-pinky/20">
                 <p className="text-2xl text-slate-500 dark:text-slate-400 italic">"สวัสดีค่ะ {stats.userName}! ถามเรื่อง Tense ได้เลยนะคะ ฉันจะช่วยอธิบายให้เข้าใจง่ายที่สุดค่ะ"</p>
               </div>
             </div>
           </div>
        </div>
      );
      default: return null;
    }
  };

  const Navbar = () => (
    <nav className="glass sticky top-0 z-50 px-12 py-6 flex justify-between items-center border-b border-pinky/20">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView(View.HOME)}>
        <img src={mascotUrl} className="size-14 object-contain" />
        <span className="font-display font-bold text-4xl hidden sm:inline dark:text-white">Tense<span className="text-primary">Bunny</span></span>
      </div>
      <div className="hidden lg:flex items-center gap-4 bg-white/60 dark:bg-slate-800/60 p-2 rounded-[2.5rem] border border-pinky/10 shadow-sm">
        {[
          { id: View.HOME, label: 'Home', icon: 'home' },
          { id: View.LESSONS, label: 'Lesson', icon: 'auto_stories' },
          { id: View.GAMES, label: 'Games', icon: 'sports_esports' },
          { id: View.RANKING, label: 'Rank', icon: 'emoji_events' },
          { id: View.CONTACT, label: 'Contact', icon: 'alternate_email' }
        ].map(item => (
          <button key={item.id} onClick={() => setView(item.id)} className={`px-8 py-3 rounded-full font-bold text-base flex items-center gap-3 transition-all ${view === item.id || (view.toString().startsWith('game_') && item.id === View.GAMES) ? 'bg-primary text-white shadow-xl' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}>
            <span className="material-icons-round text-2xl">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Level {stats.level}</span>
          <div className="w-28 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1.5 shadow-inner"><div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.xp % 100}%` }}></div></div>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-4 bg-white/50 dark:bg-slate-700 rounded-3xl border border-pinky/10 hover:scale-110 active:scale-95 transition-all shadow-sm"><span className="material-icons-round text-primary text-3xl">{darkMode ? 'light_mode' : 'dark_mode'}</span></button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-background-light dark:bg-background-dark">
      {view !== View.LOGIN && <Navbar />}
      <main className="flex-grow">{renderContent()}</main>
      
      {view !== View.LOGIN && (
        <button onClick={() => setView(View.CHAT_SUPPORT)} className="fixed bottom-12 right-12 size-24 bg-gradient-to-br from-primary to-lavender text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group">
          <span className="material-icons-round text-5xl">face</span>
          <div className="absolute -top-16 right-0 bg-white dark:bg-slate-800 text-primary px-6 py-3 rounded-2xl text-lg font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border dark:border-pinky/20">ถาม AI Tutor</div>
        </button>
      )}

      {view !== View.LOGIN && (
        <footer className="py-12 text-center text-slate-400 border-t border-pinky/10 bg-white/40 dark:bg-slate-900/40">
          <div className="flex flex-col items-center gap-4">
             <img src={mascotUrl} className="size-12 opacity-50 mb-2" alt="mini mascot" />
             <p className="font-display font-bold tracking-widest uppercase text-sm">© 2026 TenseBunny - English is Beautiful 🌸</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;

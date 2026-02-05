
import { useState } from 'react';

type Lang = 'en' | 'jp';

const CONTENT = {
    en: {
        title: "Lightpaper",
        subtitle: "Game Mechanics & Economy",
        scoreMultTitle: "Points System",
        scoreMultDesc: "Earn points by defeating the AI in Chess. Points are awarded based on victory and difficulty level.",
        scoreFormula: "Win Base (100) × Multiplier + Draw (20)",
        scoreNote: "* Losing results in 0 points.",
        levelLabel: ["Beginner (x1)", "Easy (x1.5)", "Normal (x2)", "Hard (x3)", "Expert (x5)"],
        bonusTitle: "Login Bonus Logic",
        bonusDesc: "Claim $CHH tokens daily (Resets at 00:00 UTC). The amount depends on your game performance.",
        baseReward: "Base Reward",
        perfBonus: "Performance Bonus",
        bonusFormulaTitle: "Bonus Formula:",
        bonusFormula: "Unclaimed Points = Total Score - Claimed Score",
        bonusNote: "You receive your Unclaimed Points as a bonus (Max 1,000 $CHH/day).",
        carryOverNote: "Points exceeding the 1,000 cap are CARRIED OVER to the next day. They are not lost!",
        maxDaily: "Max Daily Total",
        aboutTitle: "About $CHH",
        aboutDesc: "$CHH (Chihuahua) is a community token on the Base network. Play CHHess, accumulate points, and claim your daily allowance to join the ecosystem!",
        close: "Close Lightpaper"
    },
    jp: {
        title: "ライトペーパー",
        subtitle: "ゲームシステムとエコノミー",
        scoreMultTitle: "ポイントシステム",
        scoreMultDesc: "チェスでAIに勝利してポイントを獲得しましょう。勝利時の基本ポイントに難易度倍率が掛かります。",
        scoreFormula: "勝利点 (100) × 倍率 ＋ 引き分け (20)",
        scoreNote: "※ 敗北時のポイントは0です。",
        levelLabel: ["Beginner (x1)", "Easy (x1.5)", "Normal (x2)", "Hard (x3)", "Expert (x5)"],
        bonusTitle: "ログインボーナスの仕組み",
        bonusDesc: "毎日$CHHトークンを請求できます（UTC 0:00リセット）。獲得量はゲームの成績（未請求ポイント）に依存します。",
        baseReward: "基本報酬",
        perfBonus: "パフォーマンスボーナス",
        bonusFormulaTitle: "ボーナス計算式:",
        bonusFormula: "未請求ポイント = 総獲得ポイント - 過去に請求した分",
        bonusNote: "未請求ポイントがボーナスとして付与されます（1日最大 1,000 $CHH）。",
        carryOverNote: "上限（1,000pt）を超えたポイントは翌日以降に持ち越されます。ポイントが無駄になることはありません！",
        maxDaily: "1日の最大獲得量",
        aboutTitle: "$CHHについて",
        aboutDesc: "$CHH (Chihuahua) はBaseネットワーク上のコミュニティトークンです。CHHessをプレイしてポイントを貯め、エコシステムに参加しましょう！",
        close: "閉じる"
    }
};

export const LightpaperModal = ({ onClose }: { onClose: () => void }) => {
    const [lang, setLang] = useState<Lang>('en'); // Default to EN

    const t = CONTENT[lang];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col gap-6 animate-bounce-in max-h-[85vh] overflow-y-auto border-4 border-slate-100 custom-scrollbar">
                
                {/* Header Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    {/* Language Switch */}
                    <div className="bg-slate-100 rounded-full p-1 flex border border-slate-200">
                        <button 
                            onClick={() => setLang('en')}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            EN
                        </button>
                        <button 
                            onClick={() => setLang('jp')}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'jp' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            JP
                        </button>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="text-center space-y-2 mt-4">
                    <span className="text-4xl">📄</span>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.title}</h2>
                    <p className="text-slate-400 font-bold text-sm">{t.subtitle}</p>
                </div>

                <div className="space-y-6">
                    {/* Section 1: Game Multipliers */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                        <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
                            <span>🎯</span> {t.scoreMultTitle}
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                {t.scoreMultDesc}
                            </p>
                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                                <code className="text-orange-600 font-bold text-sm sm:text-base">
                                    {t.scoreFormula}
                                </code>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {t.levelLabel.map((lbl, i) => (
                                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                    <span className="text-slate-600 font-bold">{lbl}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 italic text-center mt-2">
                            {t.scoreNote}
                        </p>
                    </div>

                    {/* Section 2: Login Bonus */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border border-orange-100 space-y-3">
                        <h3 className="text-lg font-black text-orange-600 flex items-center gap-2">
                            <span>🎁</span> {t.bonusTitle}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium">
                            {t.bonusDesc}
                        </p>
                        
                        <div className="bg-white/80 p-4 rounded-xl border border-orange-100 space-y-3">
                            <div className="flex justify-between items-center border-b border-orange-100 pb-2">
                                <span className="font-bold text-slate-600">{t.baseReward}</span>
                                <span className="font-black text-orange-500">500 $CHH</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-orange-100 pb-2">
                                <span className="font-bold text-slate-600">{t.perfBonus}</span>
                                <span className="font-black text-orange-500">Max 1,000 $CHH</span>
                            </div>
                            
                            <div className="text-xs text-slate-500 bg-orange-100/50 p-3 rounded-lg space-y-2">
                                <div>
                                    <strong className="text-orange-700">{t.bonusFormulaTitle}</strong><br/>
                                    <code>{t.bonusFormula}</code>
                                </div>
                                <p className="leading-relaxed">
                                    {t.bonusNote}
                                </p>
                                <p className="font-bold text-orange-600 border-t border-orange-200/50 pt-2 mt-2">
                                    {t.carryOverNote}
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <span className="font-black text-slate-700">{t.maxDaily}</span>
                                <span className="font-black text-2xl text-orange-600">1,500 $CHH</span>
                            </div>
                        </div>
                    </div>

                     {/* Section 3: About */}
                     <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                        <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
                            <span>🐶</span> {t.aboutTitle}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            {t.aboutDesc}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg active:scale-95"
                >
                    {t.close}
                </button>
            </div>
        </div>
    );
};

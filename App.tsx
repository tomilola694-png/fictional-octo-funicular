
import React, { useState, useEffect } from 'react';
import { TOPICS } from './constants';
import { StatTopic, TopicConfig, BlueprintOutput, SampleQuestion } from './types';
import { generateBlueprint, generateSampleQuestions } from './services/geminiService';
import TopicCard from './components/TopicCard';
import CodeBlock from './components/CodeBlock';
import Previewer from './components/Previewer';
import QuestionCard from './components/QuestionCard';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<TopicConfig | null>(null);
  const [viewMode, setViewMode] = useState<'practice' | 'architect'>('practice');
  const [paperFilter, setPaperFilter] = useState<'ALL' | 'S1' | 'S2'>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [formulaTab, setFormulaTab] = useState<'CH2-5' | 'CH6-9' | 'CH10-12' | 'TABLES'>('CH2-5');

  const [blueprint, setBlueprint] = useState<BlueprintOutput | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<SampleQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'template' | 'logic' | 'assessment'>('template');

  const [masteryData, setMasteryData] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('statarch_mastery');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('statarch_mastery', JSON.stringify(masteryData));
  }, [masteryData]);

  useEffect(() => {
    if (selectedTopic) {
      handleAutoGenerate(selectedTopic);
    }
  }, [selectedTopic]);

  const handleAutoGenerate = async (topic: TopicConfig) => {
    setLoading(true);
    setError(null);
    setBlueprint(null);
    setPracticeQuestions([]);

    try {
      const [questions, result] = await Promise.all([
        generateSampleQuestions(topic.id),
        generateBlueprint(topic.id)
      ]);

      setPracticeQuestions(questions);
      setBlueprint(result);
      setViewMode('practice');

      setMasteryData(prev => ({
        ...prev,
        [topic.id]: Math.min((prev[topic.id] || 0) + 5, 100)
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to generate topic data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = TOPICS.filter(t => paperFilter === 'ALL' || t.paper === paperFilter);

  return (
    <div className="min-h-screen pb-24 bg-[#FAFAFA] relative overflow-x-hidden">
      {/* Expanded Formula Sheet Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] lg:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out border-l border-slate-100 p-0 flex flex-col ${showFormulaSheet ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-zinc-900 text-white">
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm text-pink-500">Master Statistics Reference</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Chapters 2 - 12 • 9709 Syllabus Compatible</p>
          </div>
          <button onClick={() => setShowFormulaSheet(false)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-pink-500 transition-colors">✕</button>
        </div>

        <div className="flex bg-zinc-800 p-1">
          {(['CH2-5', 'CH6-9', 'CH10-12', 'TABLES'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFormulaTab(tab)}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-tighter transition-all ${formulaTab === tab ? 'bg-zinc-900 text-pink-500 shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab.replace('CH', 'Chapter ')}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {formulaTab === 'CH2-5' && (
            <>
              <section className="space-y-4">
                <h4 className="font-black text-zinc-900 text-[11px] uppercase border-b-2 border-pink-500 pb-1 w-fit">Chapter 2: Data Summary</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Class Width</p>
                    <Previewer content="\text{Class Width} = \frac{\text{highest value} - \text{lowest value}}{\text{number classes}}" isMathOnly={true} />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Class Midpoint</p>
                    <Previewer content="\text{Midpoint} = \frac{\text{upper limit} + \text{lower limit}}{2}" isMathOnly={true} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="font-black text-zinc-900 text-[11px] uppercase border-b-2 border-pink-500 pb-1 w-fit">Chapter 3: Central Tendency</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Sample Mean</p>
                    <Previewer content="\bar{x} = \frac{\sum x}{n}" isMathOnly={true} />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Weighted Mean</p>
                    <Previewer content="\bar{x} = \frac{\sum w \cdot x}{\sum w}" isMathOnly={true} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="font-black text-zinc-900 text-[11px] uppercase border-b-2 border-pink-500 pb-1 w-fit">Chapter 4: Probability Rules</h4>
                <div className="p-6 bg-zinc-900 rounded-3xl text-white space-y-4 shadow-xl">
                  <Previewer content="P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)" isMathOnly={true} className="text-white invert" />
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
                      <p className="text-[8px] font-black text-pink-500 uppercase">Permutations</p>
                      <Previewer content="_nP_r = \frac{n!}{(n-r)!}" isMathOnly={true} className="text-white invert" />
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
                      <p className="text-[8px] font-black text-pink-500 uppercase">Combinations</p>
                      <Previewer content="_nC_r = \frac{n!}{r!(n-r)!}" isMathOnly={true} className="text-white invert" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="font-black text-zinc-900 text-[11px] uppercase border-b-2 border-pink-500 pb-1 w-fit">Chapter 5: Discrete Distributions</h4>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Poisson Distribution</p>
                  <Previewer content="P(X=r) = \frac{e^{-\mu} \mu^r}{r!}" isMathOnly={true} />
                  <Previewer content="\mu = \text{mean}, \sigma = \sqrt{\mu}" isMathOnly={true} className="mt-2" />
                </div>
              </section>
            </>
          )}

          {formulaTab === 'TABLES' && (
            <div className="space-y-8 pb-10">
              <section>
                <h4 className="font-black text-zinc-900 text-[11px] uppercase border-b-2 border-pink-500 pb-1 w-fit mb-4">Greek Alphabet</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { l: 'α', n: 'Alpha' }, { l: 'β', n: 'Beta' }, { l: 'γ', n: 'Gamma' }, { l: 'μ', n: 'Mu' },
                    { l: 'σ', n: 'Sigma' }, { l: 'λ', n: 'Lambda' }, { l: 'Φ', n: 'Phi' }, { l: 'χ', n: 'Chi' }
                  ].map((g, i) => (
                    <div key={i} className="flex flex-col items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xl font-serif">{g.l}</span>
                      <span className="text-[7px] uppercase font-black text-slate-400">{g.n}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <header className="bg-white border-b border-slate-100 py-10 px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center rotate-3 shadow-xl">
                <span className="text-pink-500 text-3xl font-black">Σ</span>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase tracking-tighter">STATARCH</h1>
                <p className="text-pink-600 text-[9px] font-black tracking-[0.4em] uppercase">Cambridge Examiner Suite</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {['ALL', 'S1', 'S2'].map(p => (
                <button
                  key={p}
                  onClick={() => setPaperFilter(p as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${paperFilter === p ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode('practice')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'practice' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-500 hover:text-pink-600'}`}
              >
                Practice
              </button>
              <button
                onClick={() => setViewMode('architect')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'architect' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-500 hover:text-pink-600'}`}
              >
                Architect
              </button>
            </div>
            <button
              onClick={() => setShowFormulaSheet(true)}
              className="bg-black text-white text-[10px] font-black px-6 py-3 rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest shadow-xl active:scale-95"
            >
              Formula Ref
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <aside className="lg:col-span-4 space-y-12">
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] border-b-4 border-pink-500 pb-1">Syllabus Browser</h2>
              <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">{filteredTopics.length} Topics</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {filteredTopics.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  mastery={masteryData[topic.id] || 0}
                  selected={selectedTopic?.id === topic.id}
                  onSelect={setSelectedTopic}
                />
              ))}
            </div>
          </section>
        </aside>

        <div className="lg:col-span-8">
          {!selectedTopic ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-20 bg-white rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="text-9xl mb-10 drop-shadow-2xl">📐</div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Select a Topic</h3>
              <p className="text-slate-400 max-w-md font-bold uppercase text-[11px] tracking-widest italic opacity-60">Architect of your own success.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {loading ? (
                <div className="animate-pulse space-y-8">
                  <div className="h-64 bg-slate-200 rounded-[3rem]" />
                  <div className="h-64 bg-slate-200 rounded-[3rem]" />
                </div>
              ) : viewMode === 'practice' ? (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {practiceQuestions.map(q => <QuestionCard key={q.id} question={q} />)}
                </div>
              ) : blueprint && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex bg-slate-100 p-1 rounded-[2rem] border border-slate-200 w-fit mx-auto">
                    {['template', 'logic', 'assessment'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-pink-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {activeTab === 'template' && <Previewer content={blueprint.questionTemplate} className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm" />}
                  {activeTab === 'logic' && <CodeBlock title="SymPy Analysis Engine" language="python" code={blueprint.sympyCode} />}
                  {activeTab === 'assessment' && <CodeBlock title="STACK Verification Schema" language="maxima" code={blueprint.stackPrtLogic} />}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest z-50 animate-bounce">
          {error}
        </div>
      )}

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm border-t border-slate-100 py-4 px-8 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Procedural Engine Active</span>
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Developed by StatArch Advanced Systems</div>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { Activity, Calendar, Zap, ShieldCheck, ArrowUpRight, Filter, TrendingUp, Layers } from 'lucide-react';

export type TimePeriod = 'diario' | 'semanal' | 'mensual';

interface DataPoint {
  period: string;
  volumeRYC: number;
  txCount: number;
  tps: number;
  successRate: number;
  avgGas: number;
}

const DAILY_DATA: DataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0') + ':00';
  const baseVol = 1200 + Math.floor(Math.sin(i / 3) * 600 + Math.random() * 800);
  const txs = Math.floor(baseVol / 12) + 120;
  return {
    period: hour,
    volumeRYC: baseVol,
    txCount: txs,
    tps: Math.round((txs / 3600) * 100) / 10 + 3800,
    successRate: 99.9 + (Math.random() * 0.09),
    avgGas: 0.0001,
  };
});

const WEEKLY_DATA: DataPoint[] = [
  { period: 'Lunes', volumeRYC: 45200, txCount: 14200, tps: 4100, successRate: 99.98, avgGas: 0.00009 },
  { period: 'Martes', volumeRYC: 58900, txCount: 18500, tps: 4350, successRate: 99.99, avgGas: 0.00008 },
  { period: 'Miércoles', volumeRYC: 72400, txCount: 22100, tps: 4600, successRate: 99.97, avgGas: 0.0001 },
  { period: 'Jueves', volumeRYC: 64100, txCount: 19800, tps: 4400, successRate: 99.98, avgGas: 0.00009 },
  { period: 'Viernes', volumeRYC: 89300, txCount: 27400, tps: 4950, successRate: 99.96, avgGas: 0.00011 },
  { period: 'Sábado', volumeRYC: 98500, txCount: 31200, tps: 5200, successRate: 99.99, avgGas: 0.00012 },
  { period: 'Domingo', volumeRYC: 56800, txCount: 17300, tps: 4250, successRate: 99.98, avgGas: 0.00008 },
];

const MONTHLY_DATA: DataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = `Día ${i + 1}`;
  const baseVol = 30000 + Math.floor(Math.sin(i / 4) * 15000 + Math.random() * 12000);
  const txs = Math.floor(baseVol / 3) + 5000;
  return {
    period: day,
    volumeRYC: baseVol,
    txCount: txs,
    tps: Math.round(3900 + Math.random() * 1300),
    successRate: 99.95 + (Math.random() * 0.04),
    avgGas: 0.0001,
  };
});

export function BlockchainVolumeChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('semanal');
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  const currentData = 
    selectedPeriod === 'diario' 
      ? DAILY_DATA 
      : selectedPeriod === 'semanal' 
      ? WEEKLY_DATA 
      : MONTHLY_DATA;

  // Calculate Aggregates
  const totalVolume = currentData.reduce((sum, item) => sum + item.volumeRYC, 0);
  const totalTxs = currentData.reduce((sum, item) => sum + item.txCount, 0);
  const avgTps = Math.round(currentData.reduce((sum, item) => sum + item.tps, 0) / currentData.length);
  const avgSuccess = (currentData.reduce((sum, item) => sum + item.successRate, 0) / currentData.length).toFixed(2);

  const selectedPoint = activeBarIndex !== null ? currentData[activeBarIndex] : null;

  return (
    <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Volumen de Transacciones y Salud de Red
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Cúpula ReyChain L2
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Métricas de rendimiento en tiempo real y volumen procesado en Reycoin (RYC).
          </p>
        </div>

        {/* Period Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 shrink-0">
          <button
            onClick={() => { setSelectedPeriod('diario'); setActiveBarIndex(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'diario'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Diario (24h)
          </button>
          <button
            onClick={() => { setSelectedPeriod('semanal'); setActiveBarIndex(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'semanal'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semanal (7d)
          </button>
          <button
            onClick={() => { setSelectedPeriod('mensual'); setActiveBarIndex(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'mensual'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mensual (30d)
          </button>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Volumen Periodo</span>
            <Layers className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {totalVolume.toLocaleString('es-MX')} <span className="text-xs text-amber-500">RYC</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs periodo anterior
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Transacciones</span>
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {totalTxs.toLocaleString('es-MX')} <span className="text-xs text-slate-400">txs</span>
          </div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
            Bloques L2 Optimizados
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>TPS Promedio</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {avgTps.toLocaleString()} <span className="text-xs text-slate-400">tx/s</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            Latencia Sub-Segundo
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Tasa de Éxito</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {avgSuccess}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono mt-0.5">
            Zero-Failure Consensus
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveBarIndex(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveBarIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data: DataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-amber-500/30 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 font-mono">
                      <div className="font-bold text-amber-400 border-b border-white/10 pb-1 flex items-center justify-between gap-4">
                        <span>{data.period}</span>
                        <span className="text-[10px] text-emerald-400">Éxito: {data.successRate.toFixed(2)}%</span>
                      </div>
                      <div className="text-white flex justify-between gap-4">
                        <span className="text-gray-400">Volumen:</span>
                        <strong className="text-amber-300">{data.volumeRYC.toLocaleString('es-MX')} RYC</strong>
                      </div>
                      <div className="text-white flex justify-between gap-4">
                        <span className="text-gray-400">Transacciones:</span>
                        <strong>{data.txCount.toLocaleString()} txs</strong>
                      </div>
                      <div className="text-white flex justify-between gap-4">
                        <span className="text-gray-400">Rendimiento TPS:</span>
                        <strong className="text-cyan-400">{data.tps} TPS</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="volumeRYC" radius={[6, 6, 0, 0]}>
              {currentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeBarIndex === index ? '#f59e0b' : index % 2 === 0 ? '#d97706' : '#b45309'}
                  className="transition-all duration-200 cursor-pointer hover:opacity-100"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Bar Detail Banner */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-amber-300"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Periodo Seleccionado: <strong className="text-white">{selectedPoint.period}</strong></span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Volumen: <strong className="text-white">{selectedPoint.volumeRYC.toLocaleString()} RYC</strong></span>
              <span>Txs: <strong className="text-white">{selectedPoint.txCount}</strong></span>
              <span>Gas Medio: <strong className="text-emerald-400">&lt;{selectedPoint.avgGas} RYC</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

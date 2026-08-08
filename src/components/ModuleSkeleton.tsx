import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export function ModuleSkeleton() {
  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full animate-fade-in">
      {/* Header Skeleton */}
      <div className="bg-[#111112] dark:bg-[#111112] bg-slate-100 border border-white/5 dark:border-white/5 border-slate-200 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 animate-pulse" />
            <div className="h-6 w-48 bg-white/10 dark:bg-white/10 bg-slate-300 rounded-lg animate-pulse" />
            <div className="h-5 w-24 bg-cyan-500/10 rounded-full border border-cyan-500/20 animate-pulse" />
          </div>
          <div className="h-3 w-64 bg-white/5 dark:bg-white/5 bg-slate-200 rounded animate-pulse" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-28 bg-white/5 dark:bg-white/5 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-9 w-32 bg-cyan-500/20 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-[#0c0c0e] dark:bg-[#0c0c0e] bg-slate-200 h-40 sm:h-52 p-6 flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-blue-950/30 to-purple-950/20 animate-pulse" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="h-5 w-36 bg-cyan-500/20 rounded-lg animate-pulse" />
          <div className="h-5 w-24 bg-white/10 rounded-lg animate-pulse" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="h-7 w-3/5 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-4 w-2/5 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#111112] dark:bg-[#111112] bg-white border border-white/5 dark:border-white/5 border-slate-200 rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-white/10 dark:bg-white/10 bg-slate-200 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="h-8 w-28 bg-white/15 dark:bg-white/15 bg-slate-300 rounded-lg animate-pulse" />
              <div className="h-3 w-20 bg-emerald-500/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Big Module View Skeleton */}
        <div className="lg:col-span-8 bg-[#111112] dark:bg-[#111112] bg-white border border-white/5 dark:border-white/5 border-slate-200 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-white/10 dark:bg-white/10 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-20 bg-white/5 dark:bg-white/5 bg-slate-100 rounded animate-pulse" />
          </div>

          <div className="h-64 bg-white/5 dark:bg-white/5 bg-slate-100 rounded-xl relative overflow-hidden flex items-end p-4 gap-3">
            {[40, 70, 30, 85, 60, 95, 50, 80].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="flex-1 bg-gradient-to-t from-cyan-500/30 to-blue-500/10 rounded-t-md animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-white/5 dark:bg-white/5 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-white/5 dark:bg-white/5 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-white/5 dark:bg-white/5 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Right Side Panel Skeleton */}
        <div className="lg:col-span-4 bg-[#111112] dark:bg-[#111112] bg-white border border-white/5 dark:border-white/5 border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="h-4 w-32 bg-white/10 dark:bg-white/10 bg-slate-200 rounded animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="p-3 bg-white/5 dark:bg-white/5 bg-slate-100 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/10 bg-slate-300 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-28 bg-white/10 dark:bg-white/10 bg-slate-300 rounded animate-pulse" />
                    <div className="h-2.5 w-20 bg-white/5 dark:bg-white/5 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-cyan-500/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Status Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 dark:bg-black/80 bg-white/90 backdrop-blur-xl border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 z-40 text-xs font-mono">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
        <span>Sincronizando Módulo en Cúpula OS...</span>
      </div>
    </div>
  );
}

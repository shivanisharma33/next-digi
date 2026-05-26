import React from 'react';
import { Clock } from 'lucide-react';

const formatNumber = (n: number | undefined | null) => {
  if (n === null || n === undefined) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
};

const StockPriceCard = ({ liveStockData, isLoadingStock, stockError }: { liveStockData?: any; isLoadingStock: boolean; stockError: string | null }) => {
  return (
    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between h-fit min-h-[250px]">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[12px] font-black uppercase tracking-[0.12em] text-white/30 mb-2">Nasdaq: {liveStockData?.symbol || '---'}</div>
            {isLoadingStock ? (
              <div className="h-14 bg-white/5 animate-pulse rounded-lg w-40 mb-4" />
            ) : stockError ? (
              <div className="text-red-500 font-bold mb-4">{stockError}</div>
            ) : (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <div className="text-5xl font-semibold text-white tracking-tighter">${liveStockData?.price?.toFixed(2)}</div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${liveStockData && liveStockData.changePercent >= 0 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                    {liveStockData && liveStockData.changePercent >= 0 ? '▲' : '▼'} ${Math.abs(liveStockData?.change || 0).toFixed(2)} ({Math.abs(liveStockData?.changePercent || 0).toFixed(2)}%)
                  </div>

                  <div className="text-sm text-white/40">Volume: <span className="text-white font-semibold">{formatNumber(liveStockData?.volume)}</span></div>
                </div>
              </>
            )}
          </div>

          <div className="text-right text-[10px] text-white/30">
            <div className="mb-2 text-[10px] font-bold text-white/20">{new Date().toLocaleDateString()}</div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Clock size={12} className="text-white/30" />
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{liveStockData?.lastUpdated || '---'}</span>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Change</div>
            <div className="text-white font-semibold">${liveStockData?.change?.toFixed(2) ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Change %</div>
            <div className="text-white font-semibold">{liveStockData?.changePercent?.toFixed(2) ?? '—'}%</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Volume</div>
            <div className="text-white font-semibold">{formatNumber(liveStockData?.volume)}</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Open</div>
            <div className="text-white font-semibold">${liveStockData?.open?.toFixed(2) ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Today's High</div>
            <div className="text-white font-semibold">${liveStockData?.high?.toFixed(2) ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Today's Low</div>
            <div className="text-white font-semibold">${liveStockData?.low?.toFixed(2) ?? '—'}</div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-white/5 text-xs text-white/30">
        <div className="flex items-center justify-between">
          <div>Market Cap: <span className="text-white font-semibold">{liveStockData?.marketCap || '—'}</span></div>
          <div>Avg Vol: <span className="text-white font-semibold">{liveStockData?.avgVolume || '—'}</span></div>
        </div>
      </div>
    </div>
  );
};

export default StockPriceCard;

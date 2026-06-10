"use client";

import React, { useState, useEffect, useRef } from "react";
import { m } from "framer-motion";
import Link from 'next/link';
import { generateSlug } from "../utils/slugify";
import { STRAPI_URL } from "../lib/config";
import {
  TrendingUp,
  FileText,
  Calendar,
  Shield,
  Mail,
  ArrowUpRight,
  BarChart as BarChartIcon,
  ChevronRight,
  Download,
  Newspaper
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import StockPriceCard from './StockPriceCard';
import dynamic from 'next/dynamic';

const InvestorHeroVisual3D = dynamic(() => import('./InvestorHeroVisual3D'), { ssr: false });
const CubeGridNetwork3D = dynamic(() => import('./CubeGridNetwork3D'), { ssr: false });
const InvestorPulseGraph = dynamic(() => import('./InvestorPulseGraph'), { ssr: false });

interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
}

interface LiveStockAPIResponse {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number | null;
  low: number | null;
  open: number | null;
  lastUpdated: string;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  lastUpdated: string;
  marketCap: string;
  weekHigh52: string;
  weekLow52: string;
  avgVolume: string;
}

const ResourceCard = ({ title, desc, icon: Icon, to }: { title: string; desc: string; icon: any; to: string }) => (
  <Link href={to} className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] overflow-hidden hover:border-[#ffc629]/30 transition-all duration-500 block text-center sm:text-left flex flex-col items-center sm:items-start">
    <div className="relative z-10 w-full">
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-[#ffc629] group-hover:bg-[#ffc629]/10 transition-all mx-auto sm:mx-0 mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed mb-8">{desc}</p>
      <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffc629] hover:text-white transition-colors">
        Learn More <ArrowUpRight size={14} />
      </div>
    </div>
  </Link>
);

const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return isoString;
  }
};

const InvestorRelations = () => {
  const [activeRange, setActiveRange] = useState<"1D" | "1W" | "1M" | "3M" | "6M" | "ALL">("1M");
  const [liveStockData, setLiveStockData] = useState<StockData | null>(null);
  const [isLoadingStock, setIsLoadingStock] = useState(true);
  const [stockError, setStockError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<StockDataPoint[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [cachedData, setCachedData] = useState<Record<string, StockDataPoint[]>>({});
  const cachedDataRef = useRef<Record<string, StockDataPoint[]>>({});

  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [isLoadingReleases, setIsLoadingReleases] = useState(true);
  const [releasesError, setReleasesError] = useState<string | null>(null);

  // Fetch 4 Latest Press Releases
  useEffect(() => {
    const fetchLatestReleases = async () => {
      try {
        setIsLoadingReleases(true);
        setReleasesError(null);
        const url = `${STRAPI_URL}/api/press-releases?populate[pdf_file][fields]=url,name&fields=title,date,content&sort[0]=date:desc&pagination[page]=1&pagination[pageSize]=4`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const json = await res.json();
        setPressReleases(json.data || []);
      } catch (err: any) {
        console.error("Error fetching press releases:", err);
        setReleasesError(err.message || "Failed to load press releases");
      } finally {
        setIsLoadingReleases(false);
      }
    };

    fetchLatestReleases();
  }, []);

  // Fetch Live Stock Data using Client-side direct fetching
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoadingStock(true);
        setStockError(null);

        const symbol = 'DGXX';
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Requests go through our server-side proxy (/api/stock) so the Massive
        // API key is never exposed to the browser.
        const snapshotUrl = `/api/stock?type=snapshot`;
        const quoteUrl = `/api/stock?type=quote`;
        const lastTradeUrl = `/api/stock?type=trade`;
        const dailyUrl = `/api/stock?type=open-close&date=${today}`;

        const [snapshotRes, quoteRes, tradeRes, dailyRes] = await Promise.all([
          fetch(snapshotUrl).catch(() => null),
          fetch(quoteUrl).catch(() => null),
          fetch(lastTradeUrl).catch(() => null),
          fetch(dailyUrl).catch(() => null),
        ]);

        const snapshotData = snapshotRes?.ok ? await snapshotRes.json() : null;
        const quoteData = quoteRes?.ok ? await quoteRes.json() : null;
        const tradeData = tradeRes?.ok ? await tradeRes.json() : null;
        const dailyData = dailyRes?.ok ? await dailyRes.json() : null;

        const snapshot = snapshotData?.ticker;
        const quote = quoteData?.results?.[0];
        const trade = tradeData?.results?.[0];
        const daily = dailyData;

        const livePrice =
          Number(quote?.ask_price) ||
          Number(trade?.price) ||
          Number(quote?.bid_price) ||
          Number(snapshot?.day?.c) ||
          Number(snapshot?.min?.c) ||
          Number(snapshot?.lastTrade?.p) ||
          Number(daily?.close) ||
          Number(daily?.afterHours) ||
          Number(daily?.high) ||
          Number(daily?.open);

        const openPrice = Number(snapshot?.day?.o) || Number(daily?.open) || Number(trade?.price) || null;
        const volume = Number(snapshot?.day?.v) || Number(daily?.volume) || Number(trade?.size) || 0;
        const high = Number(snapshot?.day?.h) || Number(daily?.high) || livePrice || null;
        const low = Number(snapshot?.day?.l) || Number(daily?.low) || livePrice || null;

        if (!livePrice) throw new Error('Stock price unavailable');

        const change = openPrice ? livePrice - openPrice : 0;
        const changePercent = openPrice ? (change / openPrice) * 100 : 0;

        let lastUpdated;
        try {
          const timestamp = quote?.sip_timestamp || (trade?.sip_timestamp || trade?.participant_timestamp) || (snapshot?.updated || snapshot?.lastTrade?.t);
          if (timestamp) {
            const ms = timestamp > 10000000000000 ? Math.floor(timestamp / 1000000) : timestamp;
            const date = new Date(ms);
            lastUpdated = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
          } else {
            lastUpdated = new Date().toISOString();
          }
        } catch {
          lastUpdated = new Date().toISOString();
        }

        const formattedLastUpdated = new Date(lastUpdated).toLocaleString('en-US', {
          month: '2-digit', day: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        });

        const stockInfo: StockData = {
          symbol: symbol,
          price: Number(livePrice.toFixed(4)),
          change: Number(change.toFixed(4)),
          changePercent: Number(changePercent.toFixed(4)),
          volume: volume,
          high: high !== null ? Number(high.toFixed(4)) : livePrice,
          low: low !== null ? Number(low.toFixed(4)) : livePrice,
          open: openPrice !== null ? Number(openPrice.toFixed(4)) : livePrice,
          lastUpdated: formattedLastUpdated,
          marketCap: '',
          weekHigh52: '',
          weekLow52: '',
          avgVolume: ''
        };

        setLiveStockData(stockInfo);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setStockError('Unable to load stock data.');
      } finally {
        setIsLoadingStock(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Update refs for caching
  useEffect(() => {
    cachedDataRef.current = cachedData;
  }, [cachedData]);

  // Fetch Historical Data for Chart
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        if (cachedDataRef.current[activeRange]) {
          setHistoricalData(cachedDataRef.current[activeRange]);
          return;
        }

        if (activeRange === "1D") {
          return; // Handled separately
        }

        setIsLoadingChart(true);
        const today = new Date();
        const dataPoints: StockDataPoint[] = [];

        let daysToFetch: number;
        let intervalDays: number;

        switch (activeRange) {
          case "1W": daysToFetch = 7; intervalDays = 1; break;
          case "1M": daysToFetch = 30; intervalDays = 2; break;
          case "3M": daysToFetch = 90; intervalDays = 4; break;
          case "6M": daysToFetch = 180; intervalDays = 7; break;
          case "ALL": daysToFetch = 730; intervalDays = 21; break;
          default: daysToFetch = 30; intervalDays = 2;
        }

        const dates: string[] = [];
        for (let i = daysToFetch - 1; i >= 0; i -= intervalDays) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayOfWeek = date.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            dates.push(date.toISOString().split('T')[0]);
          }
        }

        const batchSize = 10;
        const results: (unknown | null)[] = [];

        for (let i = 0; i < dates.length; i += batchSize) {
          const batch = dates.slice(i, i + batchSize);
          const batchPromises = batch.map(dateString =>
            fetch(`/api/stock?type=open-close&date=${dateString}`)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          );

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);

          if (i + batchSize < dates.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        results.forEach((data, index) => {
          if (data && typeof data === 'object' && 'status' in data && data.status === 'OK') {
            const dateStr = dates[index];
            const date = new Date(dateStr);
            const apiData = data as any;
            const currentPrice = apiData.close ?? apiData.preMarket ?? apiData.high ?? apiData.open;

            if (currentPrice) {
              dataPoints.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                price: Number(currentPrice.toFixed(2)),
                volume: apiData.volume || 0,
              });
            }
          }
        });

        if (dataPoints.length > 0) {
          setHistoricalData(dataPoints);
          setCachedData(prev => {
            const newCache = { ...prev, [activeRange]: dataPoints };
            cachedDataRef.current = newCache;
            return newCache;
          });
        } else {
          setHistoricalData([]);
        }
        setIsLoadingChart(false);
      } catch {
        setIsLoadingChart(false);
      }
    };

    fetchHistoricalData();
  }, [activeRange]);

  // Handle 1D pseudo-data using liveStockData
  useEffect(() => {
    if (activeRange === "1D" && liveStockData && !cachedDataRef.current["1D"]) {
      const dataPoints: StockDataPoint[] = [];
      const intervals = 14;
      for (let i = 0; i <= intervals; i++) {
        const time = 9.5 + (i * 0.5);
        const hour = Math.floor(time);
        const minute = (time % 1) * 60;
        const timeStr = `${hour}:${minute === 0 ? '00' : '30'}`;
        const progress = i / intervals;
        let price;
        if (progress < 0.3) {
          price = liveStockData.open + (liveStockData.high - liveStockData.open) * (progress / 0.3);
        } else if (progress < 0.7) {
          price = liveStockData.high - (liveStockData.high - liveStockData.low) * ((progress - 0.3) / 0.4);
        } else {
          price = liveStockData.low + (liveStockData.price - liveStockData.low) * ((progress - 0.7) / 0.3);
        }
        dataPoints.push({
          date: timeStr,
          price: Number(price.toFixed(2)),
          volume: Math.floor(liveStockData.volume / intervals),
        });
      }
      setHistoricalData(dataPoints);
      setCachedData(prev => {
        const newCache = { ...prev, "1D": dataPoints };
        cachedDataRef.current = newCache;
        return newCache;
      });
    }
  }, [activeRange, liveStockData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] border border-[#ffc629]/30 rounded-lg p-3 shadow-2xl">
          <p className="text-sm font-semibold text-white/50 mb-1">{payload[0].payload.date}</p>
          <p className="text-lg font-bold text-[#ffc629]">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-black text-white min-h-screen relative selection:bg-[#ffc629] selection:text-black">

      {/* HERO SECTION */}
      <section className="relative min-h-[560px] md:min-h-[680px] flex items-center px-4 sm:px-6 pt-32 pb-20 border-b border-white/5 overflow-hidden">
        {/* Ambient background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradient glow */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[#ffc629]/[0.06] blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffc629]/[0.04] blur-[140px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            }}
          />
          {/* Vertical accent line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-8 items-center">
          {/* LEFT: Text */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Top Company Badge (Matching Reference Image) */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#ffc629]/30 bg-[#ffc629]/5 backdrop-blur-sm mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc629] shadow-[0_0_8px_rgba(255,198,41,0.8)]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ffc629]">Investor Relations</span>
            </m.div>

            {/* Heading */}
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold uppercase tracking-tighter mb-6 text-white leading-[0.95]"
            >
              Investor <span className="bg-gradient-to-r from-[#ffc629] to-[#ffdb6e] bg-clip-text text-transparent">Center</span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-white/50 leading-relaxed mb-10 max-w-xl"
            >
              Powering the future of industrial AI infrastructure. Access financial performance, governance, and the latest corporate developments from Digi Power X.
            </m.p>

            {/* CTAs */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-[#ffc629] px-7 py-4 rounded-xl text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_40px_rgba(255,198,41,0.25)] hover:shadow-[0_0_50px_rgba(255,198,41,0.4)]"
              >
                Latest Presentation
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </a>
              <Link href="/sec-filings"
                className="group inline-flex items-center gap-3 bg-white/[0.03] border border-white/10 px-7 py-4 rounded-xl text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/[0.06] hover:border-white/20 transition-all backdrop-blur-sm"
              >
                SEC Filings
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </m.div>


          </m.div>

          {/* RIGHT: Pulse Graph Visual */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full relative flex items-center justify-center"
          >
            {/* Ambient halos */}
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_60%_40%,rgba(255,198,41,0.18),transparent_55%)] blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,198,41,0.08),transparent_60%)] blur-3xl pointer-events-none" />

            {/* Chart frame — sized to the pulse graph's square aspect */}
            <div className="relative w-full max-w-[640px] aspect-square">

              {/* Outer subtle border */}
              <div className="absolute inset-0 rounded-3xl border border-white/[0.04] pointer-events-none" />

              {/* Corner brackets — bolder, framing the chart */}
              <div className="absolute -top-px -right-px w-14 h-14 border-t-2 border-r-2 border-[#ffc629]/50 rounded-tr-3xl pointer-events-none" />
              <div className="absolute -bottom-px -left-px w-14 h-14 border-b-2 border-l-2 border-[#ffc629]/50 rounded-bl-3xl pointer-events-none" />
              <div className="absolute -top-px -left-px w-8 h-8 border-t border-l border-white/15 rounded-tl-3xl pointer-events-none" />
              <div className="absolute -bottom-px -right-px w-8 h-8 border-b border-r border-white/15 rounded-br-3xl pointer-events-none" />

              <div className="absolute inset-0 px-8 py-6">
                <InvestorPulseGraph />
              </div>
       
            </div>
          </m.div>
        </div>
      </section>

      {/* DASHBOARD SECTION */}
      <section className="py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Stock Performance Card */}
            <div className="lg:col-span-2 bg-[#080808] border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col">
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold uppercase tracking-tight mb-2">Stock Information</h2>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-medium">Real-time market performance</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 bg-white/5 p-1 rounded-lg">
                  {(["1D", "1W", "1M", "3M", "6M", "ALL"] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setActiveRange(range)}
                      className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeRange === range ? 'bg-[#ffc629] text-black shadow-lg shadow-[#ffc629]/20' : 'text-white/40 hover:text-white'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-[350px] w-full bg-white/[0.01] border border-white/5 rounded-2xl relative overflow-hidden p-6 flex flex-col">
                {isLoadingChart && historicalData.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <BarChartIcon size={40} className="text-[#ffc629]/40 mb-4 animate-pulse" />
                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Loading performance data...</p>
                  </div>
                ) : historicalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc629" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ffc629" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickMargin={10} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={(val) => `$${val}`} domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,198,41,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }} />
                      <Area type="monotone" dataKey="price" stroke="#ffc629" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" activeDot={{ r: 6, fill: '#ffc629', stroke: '#000', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No data available for this range</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price & News Sidebar */}
            <div className="space-y-6">
              <Link href="/investors" className="block">
      <StockPriceCard liveStockData={liveStockData} isLoadingStock={isLoadingStock} stockError={stockError} />
    </Link>

              <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-6 pb-3 border-b border-white/5 text-center lg:text-left">Latest Press Releases</h3>
                
                {isLoadingReleases ? (
                  <div className="space-y-6 animate-pulse">
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className="block text-center lg:text-left space-y-2">
                        <div className="h-2 w-16 bg-white/5 rounded mx-auto lg:mx-0"></div>
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-3/4 bg-white/5 rounded mx-auto lg:mx-0"></div>
                        <div className="h-2.5 w-14 bg-white/5 rounded mx-auto lg:mx-0"></div>
                      </div>
                    ))}
                  </div>
                ) : releasesError ? (
                  <div className="text-center py-6 text-white/30 text-xs">
                    <p className="mb-2">Failed to load announcements</p>
                    <button 
                      onClick={() => {
                        setPressReleases([]);
                        setReleasesError(null);
                        setIsLoadingReleases(true);
                        const fetchLatestReleases = async () => {
                          try {
                            const url = `${STRAPI_URL}/api/press-releases?populate[pdf_file][fields]=url,name&fields=title,date,content&sort[0]=date:desc&pagination[page]=1&pagination[pageSize]=4`;
                            const res = await fetch(url);
                            if (!res.ok) throw new Error();
                            const json = await res.json();
                            setPressReleases(json.data || []);
                          } catch {
                            setReleasesError("Failed to load press releases");
                          } finally {
                            setIsLoadingReleases(false);
                          }
                        };
                        fetchLatestReleases();
                      }}
                      className="px-3 py-1 bg-white/5 border border-white/10 hover:border-[#ffc629]/40 rounded text-[9px] uppercase tracking-wider text-[#ffc629] transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : pressReleases.length === 0 ? (
                  <div className="text-center py-6 text-white/30 text-xs">
                    No press releases found.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pressReleases.map((item, idx) => {
                      const dateStr = formatDate(item.date);
                      const slug = generateSlug(item.title, item.documentId);
                      
                      return (
                        <Link href={`/press-releases/${slug}`}
                          key={item.documentId || idx}
                          className="group cursor-pointer block text-center lg:text-left"
                        >
                          <div className="text-[9px] font-bold text-[#ffc629] mb-1">{dateStr}</div>
                          <div className="text-sm font-semibold text-white group-hover:text-[#ffc629] transition-colors line-clamp-2 leading-snug">{item.title}</div>
                          <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-white/20 flex items-center justify-center lg:justify-start gap-1 group-hover:text-white transition-colors">
                            Read More <ArrowUpRight size={10} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <Link href="/press-releases" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors flex items-center justify-center gap-2">
                    View All Announcements <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      

      {/* RESOURCES SECTION */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 lg:mb-16 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h2 className="text-3xl font-semibold uppercase tracking-tighter mb-4">Investor Resources</h2>
            <div className="h-1 w-12 bg-[#ffc629]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <ResourceCard title="SEC Filings" desc="Access financial statements, quarterly reports, and compliance documents." icon={FileText} to="/sec-filings" />
            <ResourceCard title="Events & Presentations" desc="View upcoming earnings webcasts and past investor presentations." icon={Calendar} to="/documents-charters" />
            <ResourceCard title="Stock Information" desc="Detailed historical performance and real-time market metrics." icon={TrendingUp} to="/investors" />
            <ResourceCard title="Press Releases" desc="Latest news and official corporate announcements from DigiPowerX." icon={Newspaper} to="/press-releases" />
            <ResourceCard title="Governance" desc="Information regarding our board of directors and corporate practices." icon={Shield} to="/leadership" />
            <ResourceCard title="Contact IR" desc="Get in touch with our dedicated Investor Relations support team." icon={Mail} to="/contact" />
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER PLACEHOLDER */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">© 2026 DigiPowerX • Industrial AI Infrastructure</p>
      </footer>

    </div>
  );
};

export default InvestorRelations;
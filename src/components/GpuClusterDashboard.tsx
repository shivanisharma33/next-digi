"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type GpuState = 'high' | 'med' | 'low' | 'idle' | 'error';
interface GpuNode { id: number; util: number; vram: number; power: number; temp: number; state: GpuState; job: string | null; }
interface LogEntry { c: string; m: string; }
interface TimedLogEntry extends LogEntry { ts: string; key: string; }
type LogTab = 'logs' | 'jobs' | 'alerts';

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GPU_COUNT = 64;
const MAX_LOG = 40;
let keyIdx = 0;
const nk = () => String(++keyIdx);

function randInt(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function randF(a: number, b: number, d = 1) { return (Math.random() * (b - a) + a).toFixed(d); }
function nowTs() {
  const n = new Date();
  return [n.getHours(), n.getMinutes(), n.getSeconds()].map(x => String(x).padStart(2, '0')).join(':');
}

// â”€â”€â”€ Initial GPU generation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function genGpus(): GpuNode[] {
  return Array.from({ length: GPU_COUNT }, (_, i) => {
    if (i === 12) return { id: i, util: 0, vram: 80, power: 0, temp: 95, state: 'error', job: null };
    const r = Math.random();
    if (r < 0.60) return { id: i, util: randInt(75,99), vram: randInt(65,80), power: randInt(620,700), temp: randInt(68,85), state: 'high', job: `job-${randInt(1000,9999)}` };
    if (r < 0.78) return { id: i, util: randInt(40,74), vram: randInt(35,64), power: randInt(350,619), temp: randInt(55,67), state: 'med', job: `job-${randInt(1000,9999)}` };
    if (r < 0.92) return { id: i, util: randInt(5,39), vram: randInt(10,34), power: randInt(100,349), temp: randInt(40,54), state: 'low', job: `job-${randInt(1000,9999)}` };
    return { id: i, util: 0, vram: randInt(2,9), power: randInt(60,99), temp: randInt(36,39), state: 'idle', job: null };
  });
}

// â”€â”€â”€ Log data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INIT_LOGS: LogEntry[] = [
  { c: 'green', m: '[OK]   Cluster initialized: 64Ã— NVIDIA Blackwell' },
  { c: '', m: '[INFO] InfiniBand 400G fabric: HEALTHY' },
  { c: 'green', m: '[OK]   NVLink 4.0 mesh: ALL NODES CONNECTED' },
  { c: 'blue', m: '[NET]  Spine-leaf topology active â€” 2Ã— Quantum-2 switches' },
  { c: '', m: '[INFO] Job scheduler: SLURM v23.11 â€” 14 jobs queued' },
  { c: 'green', m: '[OK]   NVMe-oF storage: 4.8PB available' },
  { c: '', m: '[INFO] Checkpoint: step_4291 written to /mnt/ckpt/run-01' },
  { c: 'amber', m: '[WARN] GPU-12: thermal sensor spike â€” monitoring' },
  { c: 'blue', m: '[SCHED] llm-finetune-70b allocated to nodes 00-07' },
  { c: 'green', m: '[OK]   Throughput: 2.94 samples/sec (peak)' },
];

const JOBS_LOG: LogEntry[] = [
  { c: 'green', m: 'JOB-5821  llm-finetune-70b       RUNNING   GPUs:00-31  4h 12m' },
  { c: 'green', m: 'JOB-5819  stable-diffusion-xl     RUNNING   GPUs:32-47  1h 58m' },
  { c: 'blue',  m: 'JOB-5823  bert-large-pretraining  QUEUED    GPUs:â€”       waiting' },
  { c: 'green', m: 'JOB-5816  whisper-large-v3        RUNNING   GPUs:48-55  6h 03m' },
  { c: '',      m: 'JOB-5815  codellama-34b           COMPLETE  GPUs:â€”       done' },
  { c: 'blue',  m: 'JOB-5824  gpt-moe-inference       QUEUED    GPUs:â€”       waiting' },
  { c: 'green', m: 'JOB-5820  llava-next-video        RUNNING   GPUs:56-63  2h 41m' },
];

const ALERTS_LOG: LogEntry[] = [
  { c: 'amber', m: '[WARN] GPU-12: temp 95Â°C â€” above safe threshold' },
  { c: 'amber', m: '[WARN] GPU-12: power delivery fault detected' },
  { c: '', m: '[INFO] GPU-12 excluded from scheduler pool' },
  { c: 'green', m: '[OK]   All other 63 GPUs: nominal' },
  { c: 'amber', m: '[WARN] InfiniBand port 14: intermittent CRC errors (rate < 0.001%)' },
  { c: 'green', m: '[OK]   Storage RAID: no degraded volumes' },
  { c: '', m: '[INFO] Thermal alert threshold: 90Â°C â€” 1 active alert' },
];

const HELP_LINES: LogEntry[] = [
  { c: 'green', m: '  nvidia-smi      â€” GPU device summary' },
  { c: 'green', m: '  cluster status  â€” full cluster health report' },
  { c: 'green', m: '  jobs list       â€” active & queued jobs' },
  { c: 'green', m: '  top gpus        â€” top 5 utilized GPUs' },
  { c: 'green', m: '  clear           â€” clear log output' },
];

// â”€â”€â”€ GPU Node Cell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATE_BG: Record<GpuState, string> = {
  high:  'rgba(0,232,120,0.18)',
  med:   'rgba(245,197,24,0.16)',
  low:   'rgba(59,130,246,0.14)',
  idle:  'rgba(255,255,255,0.04)',
  error: 'rgba(239,68,68,0.22)',
};
const STATE_BORDER: Record<GpuState, string> = {
  high:  'rgba(0,232,120,0.5)',
  med:   'rgba(245,197,24,0.45)',
  low:   'rgba(59,130,246,0.4)',
  idle:  'rgba(255,255,255,0.08)',
  error: 'rgba(239,68,68,0.7)',
};
const STATE_TEXT: Record<GpuState, string> = {
  high: '#00e878', med: '#f5c518', low: '#3b82f6', idle: 'rgba(255,255,255,0.25)', error: '#ef4444',
};

function GpuCell({ g, hovered, onHover }: { g: GpuNode; hovered: boolean; onHover: (id: number | null) => void }) {
  const label = g.state === 'error' ? 'ERR' : g.state === 'idle' ? 'â€”' : `${g.util}%`;
  return (
    <div
      onMouseEnter={() => onHover(g.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'relative',
        background: STATE_BG[g.state],
        border: `1px solid ${STATE_BORDER[g.state]}`,
        borderRadius: 3,
        padding: '5px 4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        cursor: 'default',
        transition: 'all 0.3s',
        height: 44,
        boxShadow: hovered ? `0 0 12px ${STATE_BORDER[g.state]}` : 'none',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        zIndex: hovered ? 10 : 1,
      }}
    >
      <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>
        G{String(g.id).padStart(2,'0')}
      </span>
      <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: STATE_TEXT[g.state], lineHeight: 1 }}>
        {label}
      </span>
      {/* Util bar */}
      {g.state !== 'idle' && g.state !== 'error' && (
        <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden', marginTop: 1 }}>
          <div style={{ width: `${g.util}%`, height: '100%', background: STATE_TEXT[g.state], transition: 'width 0.6s', borderRadius: 1 }} />
        </div>
      )}
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
          background: '#0a0f0c', border: '1px solid rgba(0,232,120,0.3)', borderRadius: 6,
          padding: '8px 10px', minWidth: 160, zIndex: 100, pointerEvents: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}>
          {[
            ['GPU', `B200 #${g.id}`],
            ['Util', g.state === 'error' ? 'ERROR' : `${g.util}%`],
            ['VRAM', `${g.vram} / 180 GB`],
            ['Power', `${g.power} W`],
            ['Temp', `${g.temp}Â°C`],
            ['Job', g.job || 'none'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>{k}</span>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#00e878', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Sparkbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Sparkbar({ label, val, color = '#00e878' }: { label: string; val: number; color?: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>{label}</span>
        <span style={{ fontSize: 9, fontFamily: 'monospace', color, fontWeight: 700 }}>{val}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.8s', boxShadow: `0 0 6px ${color}` }} />
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GpuClusterDashboard: React.FC = () => {
  const [gpus, setGpus] = useState<GpuNode[]>(() => genGpus());
  const [spark, setSpark] = useState({ net: 94, nvl: 71, stor: 58 });
  const [tab, setTab] = useState<LogTab>('logs');
  const [log, setLog] = useState<TimedLogEntry[]>(() =>
    INIT_LOGS.map((l, i) => ({ ...l, ts: nowTs(), key: nk() }))
  );
  const [input, setInput] = useState('');
  const [hoveredGpu, setHoveredGpu] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const gpusRef = useRef(gpus);
  gpusRef.current = gpus;

  const metrics = useMemo(() => {
    const active = gpus.filter(g => g.state !== 'idle' && g.state !== 'error');
    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    return {
      active: active.length,
      avgUtil: avg(active.map(g => g.util)),
      avgVram: avg(gpus.map(g => g.vram)),
      avgPower: avg(gpus.map(g => g.power)),
      avgTemp: avg(gpus.map(g => g.temp)),
      pflops: ((active.length * 1979) / 1000).toFixed(1),
    };
  }, [gpus]);

  // Live GPU updates
  useEffect(() => {
    const id = setInterval(() => {
      setGpus(prev => prev.map(g => {
        if (g.state === 'error') return g;
        return { ...g, util: Math.min(100, Math.max(0, g.util + randInt(-3,3))), temp: Math.min(95, Math.max(36, g.temp + randInt(-1,1))), power: Math.min(700, Math.max(60, g.power + randInt(-10,10))) };
      }));
      setSpark({ net: randInt(85,99), nvl: randInt(58,82), stor: randInt(45,70) });
      if (Math.random() < 0.45) {
        const msgs: LogEntry[] = [
          { c: '', m: `[INFO] Checkpoint: step_${randInt(4000,9999)} written` },
          { c: 'green', m: `[OK]   Throughput: ${randF(2.1,3.8)} samples/sec` },
          { c: 'blue', m: `[NET]  Bandwidth peak: ${randInt(360,400)} Gb/s` },
          { c: 'amber', m: `[WARN] Thermal headroom reduced on GPU-${randInt(1,63)}` },
          { c: 'green', m: `[OK]   NCCL AllReduce: ${randF(0.1,0.5)}ms latency` },
          { c: 'blue', m: `[SCHED] New job queued: job-${randInt(5500,5999)}` },
        ];
        const pick = msgs[randInt(0, msgs.length - 1)];
        setLog(prev => { const next = [...prev, { ...pick, ts: nowTs(), key: nk() }]; if (next.length > MAX_LOG) next.splice(0, next.length - MAX_LOG); return next; });
      }
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll log
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const switchTab = useCallback((t: LogTab) => {
    setTab(t);
    const src = t === 'jobs' ? JOBS_LOG : t === 'alerts' ? ALERTS_LOG : INIT_LOGS;
    setLog(src.map(l => ({ ...l, ts: nowTs(), key: nk() })));
  }, []);

  const submitCmd = useCallback((raw: string) => {
    const val = raw.trim().toLowerCase();
    if (!val) return;
    const echo: TimedLogEntry = { c: 'echo', m: val, ts: 'â¯', key: nk() };
    let lines: LogEntry[] = [];
    if (val === 'help') lines = HELP_LINES;
    else if (val === 'clear') { setLog([]); return; }
    else if (val === 'jobs list') lines = JOBS_LOG;
    else if (val === 'cluster status') lines = [
      { c: 'green', m: '[OK]   Cluster: HEALTHY' },
      { c: '', m: `[INFO] Active GPUs: ${gpusRef.current.filter(g => g.state !== 'idle' && g.state !== 'error').length}/64` },
      { c: 'amber', m: '[WARN] 1 GPU in error state (GPU-12)' },
    ];
    else if (val === 'top gpus') lines = gpusRef.current.filter(g => g.state === 'high').sort((a,b) => b.util - a.util).slice(0,5).map(g => ({ c: 'green', m: `GPU-${String(g.id).padStart(2,'0')}  ${g.util}%  ${g.vram}GB VRAM  ${g.temp}Â°C  ${g.power}W` }));
    else lines = [{ c: 'red', m: `command not found: ${val} â€” type 'help'` }];
    setLog(prev => { const next = [...prev, echo, ...lines.map(l => ({ ...l, ts: '  ', key: nk() }))]; if (next.length > MAX_LOG) next.splice(0, next.length - MAX_LOG); return next; });
  }, []);

  const LOG_COLOR: Record<string, string> = { green: '#00e878', amber: '#f5c518', blue: '#3b82f6', red: '#ef4444', echo: '#00e878', '': 'rgba(255,255,255,0.55)' };

  return (
    <div style={{ background: '#050806', border: '1px solid rgba(0,232,120,0.15)', borderRadius: 8, overflow: 'hidden', fontFamily: 'monospace', boxShadow: '0 0 60px rgba(0,232,120,0.06)' }}>
      {/* Title bar */}
      <div style={{ background: '#07100a', borderBottom: '1px solid rgba(0,232,120,0.1)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ef4444','#f5c518','#00e878'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <span style={{ fontSize: 10, color: 'rgba(0,232,120,0.5)', marginLeft: 8 }}>neocloudz-cluster-01 â€” gpu-monitor â€” live</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e878', boxShadow: '0 0 6px #00e878', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 9, color: '#00e878', letterSpacing: '0.1em' }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* GPU Grid Panel */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Panel header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 9, color: 'rgba(0,232,120,0.6)', letterSpacing: '0.2em' }}>â–¸ GPU CLUSTER Â· {GPU_COUNT} NODES Â· BLACKWELL</span>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { v: metrics.active, k: 'active' },
                { v: `${metrics.avgUtil}%`, k: 'avg util' },
                { v: `${metrics.pflops}`, k: 'PFLOPS' },
              ].map(s => (
                <div key={s.k} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#00e878' }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{s.k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 8Ã—8 GPU grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 3 }}>
            {gpus.map(g => <GpuCell key={g.id} g={g} hovered={hoveredGpu === g.id} onHover={setHoveredGpu} />)}
          </div>

          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
            {[
              { k: 'GPU Util', v: `${metrics.avgUtil}%`, sub: 'avg Â· 64 GPUs', c: '#00e878' },
              { k: 'VRAM', v: `${metrics.avgVram}GB`, sub: 'avg Â· 180GB max', c: '#f5c518' },
              { k: 'Power', v: `${metrics.avgPower}W`, sub: 'avg Â· 700W TDP', c: '#3b82f6' },
              { k: 'Temp', v: `${metrics.avgTemp}Â°C`, sub: 'avg Â· limit 90Â°C', c: metrics.avgTemp > 80 ? '#ef4444' : 'rgba(255,255,255,0.7)' },
            ].map(m => (
              <div key={m.k} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: '8px 10px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 3, letterSpacing: '0.1em' }}>{m.k}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: m.c, lineHeight: 1 }}>{m.v}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Sparklines */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <Sparkbar label="Network I/O (InfiniBand 400G)" val={spark.net} color="#00e878" />
            <Sparkbar label="NVLink Bandwidth" val={spark.nvl} color="#f5c518" />
            <Sparkbar label="Storage Throughput" val={spark.stor} color="#3b82f6" />
          </div>
        </div>

        {/* Log Panel */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#07100a' }}>
            {(['logs', 'jobs', 'alerts'] as LogTab[]).map(t => (
              <button key={t} onClick={() => switchTab(t)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 16px', fontSize: 9, letterSpacing: '0.15em',
                color: tab === t ? '#00e878' : 'rgba(255,255,255,0.25)',
                borderBottom: tab === t ? '1px solid #00e878' : '1px solid transparent',
                textTransform: 'uppercase', transition: 'color 0.2s',
              }}>
                {t}{t === 'alerts' ? ' â—' : ''}
              </button>
            ))}
          </div>

          {/* Log output */}
          <div ref={logRef} style={{ height: 130, overflowY: 'auto', padding: '8px 14px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,232,120,0.2) transparent' }}>
            {log.map(l => (
              <div key={l.key} style={{ display: 'flex', gap: 10, marginBottom: 2, lineHeight: 1.5 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', flexShrink: 0, width: 50 }}>{l.ts}</span>
                <span style={{ fontSize: 9, color: l.c === 'echo' ? '#00e878' : LOG_COLOR[l.c] || 'rgba(255,255,255,0.55)' }}>{l.m}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', width: 50 }}>{nowTs()}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>monitoring<span style={{ animation: 'blink 1s step-end infinite' }}>â–ˆ</span></span>
            </div>
          </div>

          {/* Terminal input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#07100a' }}>
            <span style={{ fontSize: 10, color: '#00e878', flexShrink: 0 }}>neo@cluster:~$</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { submitCmd(input); setInput(''); } }}
              placeholder="type 'help' for commandsâ€¦"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#07100a' }}>
          {[['#00e878', 'High (>70%)'], ['#f5c518', 'Medium'], ['#3b82f6', 'Low (<40%)'], ['rgba(255,255,255,0.15)', 'Idle'], ['#ef4444', 'Error']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{l}</span>
            </div>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 8, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>64Ã— B200 Â· NVLink 4.0 Â· IB 400G Â· NeoCloudz</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
};

export default GpuClusterDashboard;

export type GpuState = 'high' | 'med' | 'low' | 'idle' | 'error';
export type LogTab = 'logs' | 'jobs' | 'net';

export interface GpuNode {
  id: number;
  util: number;
  vram: number;
  power: number;
  temp: number;
  state: GpuState;
  job: string | null;
}

export interface LogEntry {
  c: string; // color key: '', 'green', 'blue', 'amber', 'red', 'echo'
  m: string; // message
}

export interface TimedLogEntry extends LogEntry {
  ts: string;
  key: string;
}

interface GaugeBarProps {
  label: string
  value: number | null  // 0–20
  color: string
}

export function GaugeBar({ label, value, color }: GaugeBarProps) {
  const pct = value !== null ? (value / 20) * 100 : 0
  return (
    <div className="flex-1 rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className="text-[9px] font-bold uppercase tracking-wide text-white/50 mb-1">{label}</div>
      <div className="text-xl font-extrabold" style={{ color }}>
        {value !== null ? value.toFixed(1) : '—'}
      </div>
      <div className="h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.12)' }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

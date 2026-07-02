interface SparklineProps {
  values: number[]
  predicted?: number | null
  color: string
}

export function Sparkline({ values, predicted, color }: SparklineProps) {
  if (values.length === 0) return null

  const toX = (i: number, total: number) =>
    total === 1 ? 50 : 5 + (i / (total - 1)) * 90

  const toY = (v: number) => 32 - (v / 20) * 28 + 2

  const points = values.map((v, i) => ({ x: toX(i, values.length), y: toY(v) }))

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  const firstX = points[0].x
  const lastX = points[points.length - 1].x
  const lastY = points[points.length - 1].y

  const areaPath = [
    `M ${firstX} 34`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${lastX} 34`,
    'Z',
  ].join(' ')

  const predX = predicted != null ? Math.min(toX(values.length, values.length), 100) : null
  const predY = predicted != null ? toY(predicted) : null

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 32 }}
      aria-hidden="true"
    >
      {/* filled area */}
      <path d={areaPath} fill={color} fillOpacity={0.1} />

      {/* stroke line */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* predicted: dashed line + circle */}
      {predicted != null && predX != null && predY != null && (
        <>
          <line
            x1={lastX}
            y1={lastY}
            x2={predX}
            y2={predY}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="2 2"
            strokeOpacity={0.4}
          />
          <circle cx={predX} cy={predY} r={2.5} fill={color} fillOpacity={0.4} />
        </>
      )}
    </svg>
  )
}

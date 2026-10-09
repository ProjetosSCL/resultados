import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { RankedItem, MetricDefinition } from "../types";

interface RankingChartProps {
  items: RankedItem[];
  metric: MetricDefinition;
}

const GREEN = "var(--color-q-green)";
const STRIPES = "url(#q-bar-stripes)";

export const RankingChart: React.FC<RankingChartProps> = ({ items, metric }) => {
  if (items.length === 0) return null;

  const narrow = typeof window !== "undefined" && window.innerWidth < 640;
  const labelMax = narrow ? 13 : 19;

  const chartData = items.map((item) => ({
    name: item.displayNome,
    fullName: item.nome,
    value: item.value,
    formattedValue: item.formattedValue,
    rank: item.rank,
    isTied: item.isTied,
  }));

  const dynamicHeight = Math.max(280, items.length * 44 + 70);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="z-50 rounded-2xl bg-q-green px-3.5 py-2.5 text-left text-white shadow-lg">
        <p className="m-0 text-[11px] font-semibold text-white/75">
          {data.rank}º lugar{data.isTied ? " • empate" : ""}
        </p>
        <p className="m-0 text-xs font-bold">{data.fullName}</p>
        <p className="m-0 mt-0.5 text-sm font-extrabold">
          {data.formattedValue}
          <span className="ml-1.5 text-[11px] font-medium text-white/75">{metric.shortLabel}</span>
        </p>
      </div>
    );
  };

  return (
    <section className="h-full rounded-q-card bg-q-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-q-soft text-q-green">
            <BarChart3 className="size-4.5" />
          </div>
          <div>
            <h3 className="m-0 text-base font-extrabold tracking-tight text-q-ink">
              Ranking Geral Comparativo
            </h3>
            <p className="m-0 text-xs text-q-muted">
              {items.length} avaliados • {metric.shortLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-q-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-q-green" />
            1º lugar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="q-stripes size-3 rounded-full" />
            Demais posições
          </span>
        </div>
      </div>

      <div style={{ height: `${dynamicHeight}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <defs>
              <pattern id="q-bar-stripes" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="7" height="7" fill="var(--color-q-green-stripe)" />
                <rect width="2" height="7" fill="#ffffff" opacity="0.45" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="4 4" horizontal={false} vertical stroke="var(--color-q-line)" />
            <XAxis
              type="number"
              stroke="var(--color-q-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={narrow ? 112 : 168}
              tick={({ x, y, payload }) => {
                const item = chartData.find((d) => d.name === payload.value);
                const rank = item ? item.rank : 0;
                const label =
                  payload.value.length > labelMax ? payload.value.slice(0, labelMax - 2) + "…" : payload.value;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-8}
                      y={4}
                      textAnchor="end"
                      fill={rank === 1 ? GREEN : "#55555b"}
                      fontSize={11}
                      fontWeight={rank <= 3 ? 700 : 500}
                    >
                      {rank}º {label}
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 125, 0, 0.06)" }} />
            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={18} animationDuration={600}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.rank === 1 ? GREEN : STRIPES} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

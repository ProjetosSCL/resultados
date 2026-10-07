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
import { RankedItem, MetricDefinition } from "../types";
import { BarChart3 } from "lucide-react";
import { Card, Display, Text, AssetChip } from "./stone-ds";

interface RankingChartProps {
  items: RankedItem[];
  metric: MetricDefinition;
}

export const RankingChart: React.FC<RankingChartProps> = ({ items, metric }) => {
  if (items.length === 0) return null;

  const chartData = items.map((item) => ({
    name: item.displayNome,
    fullName: item.nome,
    value: item.value,
    formattedValue: item.formattedValue,
    rank: item.rank,
    isTied: item.isTied,
  }));

  // Cores do Stone Design System para o ranking
  const getBarColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#F0C828"; // Amarelo Stone (Ouro)
      case 2:
        return "#C8D2C8"; // Cinza Stone (Prata)
      case 3:
        return "#FF8232"; // Laranja Stone (Bronze)
      default:
        return "#00D700"; // Verde Stone primário para demais
    }
  };

  const dynamicHeight = Math.max(280, items.length * 44 + 70);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const rank = data.rank;
      let medalLabel = `${rank}º Lugar`;
      let badgeStyle = "bg-[#00461E] text-[#C8D2C8] border-[#007D00]";

      if (rank === 1) {
        medalLabel = "🥇 1º Lugar (Ouro)";
        badgeStyle = "bg-[#F0C828]/20 text-[#FFEB41] border-[#F0C828]";
      } else if (rank === 2) {
        medalLabel = "🥈 2º Lugar (Prata)";
        badgeStyle = "bg-[#C8D2C8]/20 text-[#F5FFF5] border-[#C8D2C8]";
      } else if (rank === 3) {
        medalLabel = "🥉 3º Lugar (Bronze)";
        badgeStyle = "bg-[#FF8232]/20 text-[#FFA53C] border-[#FF8232]";
      }

      return (
        <div className="bg-[#1E281E] border border-[#007D00] rounded-stone-md p-3.5 shadow-2xl backdrop-blur-md text-left z-50">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-stone-pill border font-body ${badgeStyle}`}>
              {medalLabel}
            </span>
            {data.isTied && (
              <span className="text-[10px] bg-[#00461E] text-[#C8D2C8] px-1.5 py-0.5 rounded-stone-pill font-body">
                Empatado
              </span>
            )}
          </div>
          <Display as="p" width="condensed" uppercase={false} className="font-bold text-sm text-[#F5FFF5] mb-0.5">
            {data.fullName}
          </Display>
          <Text size="caption" className="text-[#C8D2C8]">
            {metric.label}:{" "}
            <span className="font-bold text-[#A5FA00] text-sm font-display">
              {data.formattedValue}
            </span>
          </Text>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      layout="principal"
      tone="surface"
      className="mb-10 shadow-lg shadow-[#1E281E]/60 border border-[#007D00]/50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#00461E] border border-[#00D700]/40 rounded-stone-md text-[#00D700]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <Display as="h3" width="condensed" uppercase={true} className="text-lg font-bold text-[#F5FFF5] tracking-tight">
              Ranking Geral Comparativo
            </Display>
            <Text size="caption" className="text-[#C8D2C8]">
              Desempenho de todos os participantes ({items.length} avaliados)
            </Text>
          </div>
        </div>

        {/* Legenda de Cores Stone */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs text-[#C8D2C8] bg-[#00461E]/80 border border-[#007D00] px-3.5 py-1.5 rounded-stone-pill font-body">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-stone-pill bg-[#F0C828]" />
            1º Ouro
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-stone-pill bg-[#C8D2C8]" />
            2º Prata
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-stone-pill bg-[#FF8232]" />
            3º Bronze
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-stone-pill bg-[#00D700]" />
            Demais posições
          </span>
        </div>
      </div>

      <div style={{ height: `${dynamicHeight}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 35, left: 15, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#00461E"
              opacity={0.4}
            />
            <XAxis
              type="number"
              stroke="#96A096"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#00461E" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#C8D2C8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#00461E" }}
              width={140}
              tick={({ x, y, payload }) => {
                const item = chartData.find((d) => d.name === payload.value);
                const rank = item ? item.rank : 0;
                let rankColor = "#C8D2C8";
                let prefix = `${rank}º `;
                if (rank === 1) {
                  rankColor = "#F0C828";
                  prefix = "🥇 ";
                } else if (rank === 2) {
                  rankColor = "#F5FFF5";
                  prefix = "🥈 ";
                } else if (rank === 3) {
                  rankColor = "#FF8232";
                  prefix = "🥉 ";
                }

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-10}
                      y={4}
                      textAnchor="end"
                      fill={rankColor}
                      fontSize={12}
                      fontWeight={rank <= 3 ? "700" : "500"}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {prefix}
                      {payload.value.length > 18
                        ? payload.value.slice(0, 16) + "…"
                        : payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 215, 0, 0.05)" }} />
            <Bar
              dataKey="value"
              radius={[0, 999, 999, 0]}
              barSize={18}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.rank)}
                  stroke={entry.rank === 1 ? "#FFEB41" : undefined}
                  strokeWidth={entry.rank === 1 ? 1 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

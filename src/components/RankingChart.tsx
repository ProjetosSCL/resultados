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

  const getBarColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#d4af37"; // Ouro Minimalista
      case 2:
        return "#b0b0b0"; // Prata
      case 3:
        return "#c87d55"; // Bronze
      default:
        return "#2d9d6e"; // Verde Muted Primário
    }
  };

  const dynamicHeight = Math.max(260, items.length * 40 + 60);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const rank = data.rank;
      let medalLabel = `${rank}º Lugar`;
      let badgeStyle = "bg-[#242b33] text-[#b0b0b0] border-[#3a434d]";

      if (rank === 1) {
        medalLabel = "1º Lugar (Ouro)";
        badgeStyle = "bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/40";
      } else if (rank === 2) {
        medalLabel = "2º Lugar (Prata)";
        badgeStyle = "bg-[#b0b0b0]/15 text-[#b0b0b0] border-[#b0b0b0]/40";
      } else if (rank === 3) {
        medalLabel = "3º Lugar (Bronze)";
        badgeStyle = "bg-[#c87d55]/15 text-[#c87d55] border-[#c87d55]/40";
      }

      return (
        <div className="bg-[#1a1f26] border border-[#3a434d] rounded-[6px] p-3 shadow-lg text-left z-50">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border ${badgeStyle}`}>
              {medalLabel}
            </span>
            {data.isTied && (
              <span className="text-[10px] bg-[#242b33] text-[#808080] px-1.5 py-0.5 rounded-[3px]">
                Empatado
              </span>
            )}
          </div>
          <p className="font-semibold text-xs text-[#e8e8e8] mb-0.5">{data.fullName}</p>
          <p className="text-xs text-[#b0b0b0] m-0">
            {metric.label}:{" "}
            <span className="font-bold text-[#2d9d6e] text-sm">
              {data.formattedValue}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card mb-8 border-[#3a434d] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[6px] bg-[#242b33] border border-[#3a434d] flex items-center justify-center text-[#2d9d6e]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#e8e8e8] tracking-tight m-0">
              Ranking Geral Comparativo
            </h3>
            <p className="text-xs text-[#808080] m-0">
              Visualização de todos os participantes ({items.length} avaliados)
            </p>
          </div>
        </div>

        {/* Legenda de Cores Minimalista */}
        <div className="flex items-center flex-wrap gap-3 text-xs text-[#b0b0b0] bg-[#242b33] border border-[#3a434d] px-3 py-1.5 rounded-[6px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#d4af37]" />
            1º Ouro
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#b0b0b0]" />
            2º Prata
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#c87d55]" />
            3º Bronze
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-[#2d9d6e]" />
            Demais posições
          </span>
        </div>
      </div>

      <div style={{ height: `${dynamicHeight}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 30, left: 10, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#242b33"
              opacity={0.8}
            />
            <XAxis
              type="number"
              stroke="#808080"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#3a434d" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#b0b0b0"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#3a434d" }}
              width={140}
              tick={({ x, y, payload }) => {
                const item = chartData.find((d) => d.name === payload.value);
                const rank = item ? item.rank : 0;
                let rankColor = "#b0b0b0";
                let prefix = `${rank}º `;
                if (rank === 1) {
                  rankColor = "#d4af37";
                  prefix = "1º ";
                } else if (rank === 2) {
                  rankColor = "#e8e8e8";
                  prefix = "2º ";
                } else if (rank === 3) {
                  rankColor = "#c87d55";
                  prefix = "3º ";
                }

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={-8}
                      y={4}
                      textAnchor="end"
                      fill={rankColor}
                      fontSize={11}
                      fontWeight={rank <= 3 ? "600" : "400"}
                      style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(45, 157, 110, 0.05)" }} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              barSize={16}
              animationDuration={600}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.rank)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

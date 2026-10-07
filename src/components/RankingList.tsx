import React, { useState } from "react";
import { RankedItem, MetricDefinition } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { Search, ListOrdered, Users } from "lucide-react";

interface RankingListProps {
  items: RankedItem[];
  metric: MetricDefinition;
  isOperations: boolean;
}

export const RankingList: React.FC<RankingListProps> = ({
  items,
  metric,
  isOperations,
}) => {
  const [filterView, setFilterView] = useState<"rest" | "all">("rest");
  const [searchTerm, setSearchTerm] = useState("");

  if (items.length === 0) return null;

  const baseItems = filterView === "rest" ? items.filter((it) => it.rank > 3) : items;

  const filteredItems = baseItems.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.nome.toLowerCase().includes(term) ||
      item.displayNome.toLowerCase().includes(term)
    );
  });

  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="card mb-10 border-[#3a434d] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[6px] bg-[#242b33] border border-[#3a434d] flex items-center justify-center text-[#2d9d6e]">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#e8e8e8] tracking-tight m-0">
              {filterView === "rest" ? "Demais Posições (A partir do 4º)" : "Ranking Completo"}
            </h3>
            <p className="text-xs text-[#808080] m-0">
              {filteredItems.length} {isOperations ? "operações listadas" : "angels listados"}
            </p>
          </div>
        </div>

        {/* Controles de visualização e filtro */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Campo de Busca Minimalista */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Buscar ${isOperations ? "operação" : "angel"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#242b33] border border-[#3a434d] rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-[#e8e8e8] placeholder-[#808080] focus:outline-none focus:border-[#2d9d6e] transition-colors w-full sm:w-48"
            />
          </div>

          {/* Alternador Ver Resto / Ver Todos */}
          <div className="flex items-center bg-[#242b33] p-0.5 rounded-[6px] border border-[#3a434d] text-xs">
            <button
              onClick={() => setFilterView("rest")}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all cursor-pointer ${
                filterView === "rest"
                  ? "bg-[#2d9d6e] text-[#0f1419] font-semibold shadow-sm"
                  : "text-[#b0b0b0] hover:text-[#e8e8e8]"
              }`}
            >
              A partir do 4º
            </button>
            <button
              onClick={() => setFilterView("all")}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all cursor-pointer ${
                filterView === "all"
                  ? "bg-[#2d9d6e] text-[#0f1419] font-semibold shadow-sm"
                  : "text-[#b0b0b0] hover:text-[#e8e8e8]"
              }`}
            >
              Todos ({items.length})
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-[#808080] text-sm">
          {items.length <= 3 && filterView === "rest" ? (
            <div className="flex flex-col items-center gap-1.5">
              <Users className="w-7 h-7 text-[#505a50]" />
              <p className="m-0">Todos os participantes estão no pódio!</p>
              <button
                onClick={() => setFilterView("all")}
                className="text-[#2d9d6e] text-xs hover:underline mt-1 font-medium cursor-pointer"
              >
                Clique aqui para visualizar todos
              </button>
            </div>
          ) : (
            <p className="m-0">Nenhum participante encontrado para a busca "{searchTerm}".</p>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#3a434d]/60">
          {filteredItems.map((item) => {
            let rankBadgeStyle = "bg-[#242b33] text-[#b0b0b0] border-[#3a434d]";
            let rankText = `${item.rank}º`;

            if (item.rank === 1) {
              rankBadgeStyle = "bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/30";
              rankText = "1º";
            } else if (item.rank === 2) {
              rankBadgeStyle = "bg-[#b0b0b0]/15 text-[#e8e8e8] border-[#b0b0b0]/30";
              rankText = "2º";
            } else if (item.rank === 3) {
              rankBadgeStyle = "bg-[#c87d55]/15 text-[#c87d55] border-[#c87d55]/30";
              rankText = "3º";
            }

            const percentage = Math.min(100, Math.max(8, (item.value / maxValue) * 100));

            return (
              <div
                key={item.id}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-[#242b33]/40 transition-colors rounded-[6px]"
              >
                {/* Lado Esquerdo: Posição, Avatar e Nome */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-[4px] flex items-center justify-center font-semibold text-xs border shrink-0 ${rankBadgeStyle}`}
                  >
                    <span>{rankText}</span>
                  </div>

                  <AvatarPhoto
                    src={item.photoUrl}
                    name={item.nome}
                    fallbackInitials={item.avatarFallback}
                    size="md"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[#e8e8e8] truncate block">
                        {item.displayNome}
                      </span>
                      {item.isTied && (
                        <span className="text-[10px] uppercase font-medium px-1.5 py-0.2 rounded bg-[#242b33] text-[#808080] border border-[#3a434d]">
                          Empate
                        </span>
                      )}
                    </div>
                    {isOperations && (
                      <span className="text-[11px] text-[#808080] truncate block">
                        {item.nome}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lado Direito: Barra visual Minimalista e Valor */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-20 sm:w-32 hidden sm:block">
                    <div className="h-1.5 w-full bg-[#242b33] rounded-full overflow-hidden border border-[#3a434d]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.rank === 1
                            ? "bg-[#d4af37]"
                            : item.rank === 2
                            ? "bg-[#b0b0b0]"
                            : item.rank === 3
                            ? "bg-[#c87d55]"
                            : "bg-[#2d9d6e]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-semibold text-[#e8e8e8] block">
                      {item.formattedValue}
                    </span>
                    <span className="text-[10px] text-[#808080] block font-normal">
                      {metric.shortLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

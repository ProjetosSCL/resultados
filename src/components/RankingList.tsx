import React, { useState } from "react";
import { RankedItem, MetricDefinition } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { Search, ListOrdered, Users } from "lucide-react";
import { Card, Display, Text, AssetChip } from "./stone-ds";

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
    <Card
      layout="principal"
      tone="surface"
      className="mb-12 shadow-lg shadow-[#1E281E]/60 border border-[#007D00]/50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#00461E] border border-[#007D00] rounded-stone-md text-[#A5FA00]">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <Display as="h3" width="condensed" uppercase={true} className="text-lg font-bold text-[#F5FFF5] tracking-tight">
              {filterView === "rest" ? "Demais Posições (A partir do 4º)" : "Ranking Completo"}
            </Display>
            <Text size="caption" className="text-[#C8D2C8]">
              {filteredItems.length} {isOperations ? "operações listadas" : "angels listados"}
            </Text>
          </div>
        </div>

        {/* Controles de visualização e filtro */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Campo de Busca Stone */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#C8D2C8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Buscar ${isOperations ? "operação" : "angel"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1E281E] border border-[#007D00] rounded-stone-pill pl-9 pr-3.5 py-1.5 text-xs text-[#F5FFF5] placeholder-[#96A096] focus:outline-none focus:border-[#00D700] transition-colors w-full sm:w-48 font-body"
            />
          </div>

          {/* Alternador Ver Resto / Ver Todos (Stone Pills) */}
          <div className="flex items-center bg-[#00461E]/80 p-1 rounded-stone-pill border border-[#007D00] text-xs font-body">
            <button
              onClick={() => setFilterView("rest")}
              className={`px-3 py-1 rounded-stone-pill font-semibold transition-all cursor-pointer ${
                filterView === "rest"
                  ? "bg-[#00D700] text-[#00461E] font-bold shadow-sm"
                  : "text-[#C8D2C8] hover:text-[#F5FFF5]"
              }`}
            >
              A partir do 4º
            </button>
            <button
              onClick={() => setFilterView("all")}
              className={`px-3 py-1 rounded-stone-pill font-semibold transition-all cursor-pointer ${
                filterView === "all"
                  ? "bg-[#00D700] text-[#00461E] font-bold shadow-sm"
                  : "text-[#C8D2C8] hover:text-[#F5FFF5]"
              }`}
            >
              Todos ({items.length})
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10 text-[#C8D2C8] text-sm">
          {items.length <= 3 && filterView === "rest" ? (
            <div className="flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-[#505A50]" />
              <Text>Todos os participantes estão no pódio!</Text>
              <button
                onClick={() => setFilterView("all")}
                className="text-[#00D700] text-xs hover:underline mt-1 font-semibold cursor-pointer"
              >
                Clique aqui para visualizar todos
              </button>
            </div>
          ) : (
            <Text>Nenhum participante encontrado para a busca "{searchTerm}".</Text>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#00461E]/60">
          {filteredItems.map((item) => {
            let rankBadgeStyle = "bg-[#00461E] text-[#C8D2C8] border-[#007D00]";
            let medalPrefix = "";

            if (item.rank === 1) {
              rankBadgeStyle = "bg-[#F0C828]/20 text-[#FFEB41] border-[#F0C828]";
              medalPrefix = "🥇 ";
            } else if (item.rank === 2) {
              rankBadgeStyle = "bg-[#C8D2C8]/20 text-[#F5FFF5] border-[#C8D2C8]";
              medalPrefix = "🥈 ";
            } else if (item.rank === 3) {
              rankBadgeStyle = "bg-[#FF8232]/20 text-[#FFA53C] border-[#FF8232]";
              medalPrefix = "🥉 ";
            }

            const percentage = Math.min(100, Math.max(8, (item.value / maxValue) * 100));

            return (
              <div
                key={item.id}
                className="py-3 sm:py-3.5 px-2 flex items-center justify-between gap-3 hover:bg-[#00461E]/40 transition-colors rounded-stone-md"
              >
                {/* Lado Esquerdo: Posição, Avatar e Nome */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-stone-pill flex items-center justify-center font-bold text-xs border shrink-0 font-display ${rankBadgeStyle}`}
                  >
                    <span>{medalPrefix || `${item.rank}º`}</span>
                  </div>

                  <AvatarPhoto
                    src={item.photoUrl}
                    name={item.nome}
                    fallbackInitials={item.avatarFallback}
                    size="md"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Display
                        as="span"
                        width="condensed"
                        uppercase={false}
                        className="font-bold text-sm text-[#F5FFF5] truncate block"
                      >
                        {item.displayNome}
                      </Display>
                      {item.isTied && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded-stone-pill bg-[#00461E] text-[#C8D2C8] border border-[#007D00] font-body">
                          Empate
                        </span>
                      )}
                    </div>
                    {isOperations && (
                      <Text size="caption" className="text-[#96A096] truncate block">
                        {item.nome}
                      </Text>
                    )}
                  </div>
                </div>

                {/* Lado Direito: Barra visual Stone e Valor Numérico */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-24 sm:w-36 hidden sm:block">
                    <div className="h-2 w-full bg-[#1E281E] rounded-stone-pill overflow-hidden border border-[#00461E]">
                      <div
                        className={`h-full rounded-stone-pill transition-all duration-500 ${
                          item.rank === 1
                            ? "bg-[#F0C828]"
                            : item.rank === 2
                            ? "bg-[#C8D2C8]"
                            : item.rank === 3
                            ? "bg-[#FF8232]"
                            : "bg-[#00D700]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <Display as="span" width="condensed" className="text-sm sm:text-base font-bold text-[#F5FFF5] block">
                      {item.formattedValue}
                    </Display>
                    <Text size="caption" className="text-[#96A096] block font-medium">
                      {metric.shortLabel}
                    </Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

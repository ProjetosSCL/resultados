import React, { useState } from "react";
import { Search, ListOrdered, Users } from "lucide-react";
import { RankedItem, MetricDefinition } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";

interface RankingListProps {
  items: RankedItem[];
  metric: MetricDefinition;
  isOperations: boolean;
}

const RANK_BADGE: Record<number, string> = {
  1: "bg-[#fbf3d4] text-[#7a5c00]",
  2: "bg-[#e9e9ec] text-[#55555b]",
  3: "bg-[#f8e6dc] text-[#9a5330]",
};

export const RankingList: React.FC<RankingListProps> = ({ items, metric, isOperations }) => {
  const [filterView, setFilterView] = useState<"rest" | "all">("rest");
  const [searchTerm, setSearchTerm] = useState("");

  if (items.length === 0) return null;

  const baseItems = filterView === "rest" ? items.filter((it) => it.rank > 3) : items;
  const term = searchTerm.trim().toLowerCase();
  const filteredItems = baseItems.filter(
    (item) =>
      !term ||
      item.nome.toLowerCase().includes(term) ||
      item.displayNome.toLowerCase().includes(term),
  );
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  const toggleBtn = (active: boolean) =>
    `cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
      active ? "bg-q-card text-q-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]" : "text-q-muted hover:text-q-ink"
    }`;

  return (
    <section className="h-full rounded-q-card bg-q-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-q-soft text-q-green">
            <ListOrdered className="size-4.5" />
          </div>
          <div>
            <h3 className="m-0 text-base font-extrabold tracking-tight text-q-ink">
              {filterView === "rest" ? "Demais Posições" : "Ranking Completo"}
            </h3>
            <p className="m-0 text-xs text-q-muted">
              {filteredItems.length} {isOperations ? "operações listadas" : "angels listados"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-q-muted" />
            <input
              type="text"
              placeholder={`Buscar ${isOperations ? "operação" : "angel"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full bg-q-soft py-2 pl-9 pr-4 text-xs text-q-ink placeholder:text-q-muted focus:outline-2 focus:outline-q-green sm:w-44"
            />
          </div>
          <div className="inline-flex rounded-full bg-q-soft p-1">
            <button onClick={() => setFilterView("rest")} className={toggleBtn(filterView === "rest")}>
              A partir do 4º
            </button>
            <button onClick={() => setFilterView("all")} className={toggleBtn(filterView === "all")}>
              Todos ({items.length})
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-8 text-center text-sm text-q-muted">
          {items.length <= 3 && filterView === "rest" ? (
            <div className="flex flex-col items-center gap-1.5">
              <Users className="size-7 text-q-green-stripe" />
              <p className="m-0">Todos os participantes estão no pódio!</p>
              <button
                onClick={() => setFilterView("all")}
                className="mt-1 cursor-pointer text-xs font-semibold text-q-green hover:underline"
              >
                Clique aqui para visualizar todos
              </button>
            </div>
          ) : (
            <p className="m-0">Nenhum participante encontrado para a busca "{searchTerm}".</p>
          )}
        </div>
      ) : (
        <div>
          {/* cabeçalho da tabela */}
          <div className="mb-1 hidden items-center gap-3 px-3 text-xs font-medium text-q-muted sm:flex">
            <span className="w-8 text-center">#</span>
            <span className="flex-1">Nome</span>
            <span className="w-28">Desempenho</span>
            <span className="w-20 text-right">{metric.shortLabel}</span>
          </div>

          <div className="space-y-0.5">
            {filteredItems.map((item) => {
              const percentage = Math.min(100, Math.max(8, (item.value / maxValue) * 100));
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-q-row"
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                      RANK_BADGE[item.rank] ?? "bg-q-soft text-q-muted"
                    }`}
                  >
                    {item.rank}º
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <AvatarPhoto
                      src={item.photoUrl}
                      name={item.nome}
                      fallbackInitials={item.avatarFallback}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="block truncate text-sm font-bold text-q-ink">
                          {item.displayNome}
                        </span>
                        {item.isTied && (
                          <span className="rounded-full bg-q-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-q-muted">
                            Empate
                          </span>
                        )}
                      </div>
                      {isOperations && (
                        <span className="block truncate text-[11px] text-q-muted">{item.nome}</span>
                      )}
                    </div>
                  </div>

                  <div className="hidden w-28 sm:block">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-q-soft">
                      <div
                        className={`h-full rounded-full ${item.rank <= 3 ? "bg-q-green" : "q-stripes"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="w-20 shrink-0 text-right text-sm font-extrabold text-q-ink">
                    {item.formattedValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

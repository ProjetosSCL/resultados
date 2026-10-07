import React from "react";
import { Trophy, Medal, Award, Sparkles } from "lucide-react";
import { RankedItem, MetricDefinition } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { triggerConfetti } from "../utils/confetti";
import { AssetChip } from "./stone-ds";

interface PodiumProps {
  items: RankedItem[];
  metric: MetricDefinition;
  isOperations: boolean;
}

export const Podium: React.FC<PodiumProps> = ({ items, metric, isOperations }) => {
  const first = items[0];
  const second = items[1];
  const third = items[2];

  if (!first) {
    return (
      <div className="card text-center text-[#b0b0b0] py-8">
        Nenhum dado disponível para exibir o pódio desta categoria.
      </div>
    );
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerConfetti(x, y);
  };

  return (
    <div className="relative w-full mb-8">
      {/* Podium Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-[#e8e8e8] tracking-tight m-0">
              Pódio dos Campeões
            </h2>
            <AssetChip label={metric.shortLabel} variant="success" />
          </div>
          <p className="text-xs text-[#b0b0b0] mt-1 m-0">
            {metric.description}
          </p>
        </div>
        <div className="text-xs text-[#6b9b7d] bg-[#242b33] border border-[#3a434d] rounded-[6px] px-3 py-1.5 self-start sm:self-auto flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2d9d6e]" />
          <span>Clique nos cards para celebrar</span>
        </div>
      </div>

      {/* Grid of 3 Podium Pillars (2º - 1º - 3º) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
        {/* 2º LUGAR - PRATA (Esquerda) */}
        {second ? (
          <div
            onClick={handleCardClick}
            className="group cursor-pointer order-2 md:order-1 transition-all duration-300 hover:-translate-y-1 focus:outline-none"
          >
            <div className="card text-center border-[#3a434d] hover:border-[#b0b0b0] transition-colors relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-[#b0b0b0]/60" />
              <div className="absolute top-3 right-3 text-[#b0b0b0]/30 group-hover:text-[#b0b0b0]/60 transition-colors">
                <Medal className="w-6 h-6" />
              </div>

              {/* Badge da Posição */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#b0b0b0]/15 border border-[#b0b0b0]/30 text-[#b0b0b0] text-[11px] font-semibold tracking-wider mb-4">
                <span>2º LUGAR</span>
                {second.isTied && (
                  <span className="text-[10px] bg-[#242b33] text-[#b0b0b0] px-1 py-0.2 rounded">
                    EMPATE
                  </span>
                )}
              </div>

              {/* Foto com Ring de Prata */}
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <AvatarPhoto
                    src={second.photoUrl}
                    name={second.nome}
                    fallbackInitials={second.avatarFallback}
                    size="xl"
                    medalRing="silver"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#242b33] border border-[#b0b0b0] text-[#e8e8e8] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                    2
                  </div>
                </div>
              </div>

              {/* Nome */}
              <h3
                className="text-sm sm:text-base font-semibold text-[#e8e8e8] line-clamp-1 mb-0.5 group-hover:text-[#2d9d6e] transition-colors m-0"
                title={second.nome}
              >
                {second.displayNome}
              </h3>
              {isOperations && (
                <span className="text-[11px] text-[#808080] block mb-3 font-normal">
                  {second.nome.includes("-") ? second.nome.split("-")[0].trim() : "Operação"}
                </span>
              )}

              {/* Valor */}
              <div className="bg-[#242b33] rounded-[6px] py-2 px-3 border border-[#3a434d] mt-2">
                <span className="text-[10px] uppercase text-[#808080] font-medium block">
                  {metric.shortLabel}
                </span>
                <span className="text-xl font-bold text-[#e8e8e8] tracking-tight">
                  {second.formattedValue}
                </span>
              </div>
            </div>

            {/* Pedestal Prata */}
            <div className="hidden md:flex flex-col items-center justify-center h-16 bg-[#242b33] border-x border-b border-[#3a434d] rounded-b-[8px] shadow-sm mt-0.5">
              <span className="text-xl font-bold text-[#b0b0b0]">2</span>
              <span className="text-[10px] uppercase tracking-wider text-[#808080]">Prata</span>
            </div>
          </div>
        ) : (
          <div className="order-2 md:order-1 hidden md:block opacity-30 card p-6 text-center text-[#808080]">
            2º Lugar vago
          </div>
        )}

        {/* 1º LUGAR - OURO (Centro - Destaque Principal) */}
        {first && (
          <div
            onClick={handleCardClick}
            className="group cursor-pointer order-1 md:order-2 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
          >
            <div className="card text-center border-[#d4af37]/60 hover:border-[#d4af37] bg-[#1a1f26] relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              {/* Golden line */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-[#d4af37]" />
              <div className="absolute top-3 right-3 text-[#d4af37]/40 group-hover:text-[#d4af37]/80 transition-colors">
                <Trophy className="w-7 h-7" />
              </div>

              {/* Badge da Posição */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-wider mb-4">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>1º LUGAR CAMPEÃO</span>
                {first.isTied && (
                  <span className="text-[10px] bg-[#242b33] text-[#d4af37] px-1 py-0.2 rounded">
                    EMPATE
                  </span>
                )}
              </div>

              {/* Foto com Ring de Ouro */}
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <AvatarPhoto
                    src={first.photoUrl}
                    name={first.nome}
                    fallbackInitials={first.avatarFallback}
                    size="2xl"
                    medalRing="gold"
                    className="scale-105"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#d4af37] text-[#0f1419] w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    1
                  </div>
                </div>
              </div>

              {/* Nome */}
              <h3
                className="text-base sm:text-lg font-bold text-[#ffffff] line-clamp-1 mb-0.5 group-hover:text-[#2d9d6e] transition-colors m-0"
                title={first.nome}
              >
                {first.displayNome}
              </h3>
              {isOperations && (
                <span className="text-xs text-[#2d9d6e] block mb-3 font-medium">
                  {first.nome.includes("-") ? first.nome.split("-")[0].trim() : "Operação"}
                </span>
              )}

              {/* Valor */}
              <div className="bg-[#242b33] rounded-[6px] py-2.5 px-3.5 border border-[#3a434d] mt-2">
                <span className="text-[10px] uppercase text-[#808080] font-medium block">
                  {metric.label}
                </span>
                <span className="text-2xl font-bold text-[#2d9d6e] tracking-tight">
                  {first.formattedValue}
                </span>
              </div>
            </div>

            {/* Pedestal Ouro */}
            <div className="hidden md:flex flex-col items-center justify-center h-24 bg-[#242b33] border-x border-b border-[#3a434d] rounded-b-[8px] shadow-sm mt-0.5">
              <span className="text-2xl font-bold text-[#d4af37]">1</span>
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37]">Campeão</span>
            </div>
          </div>
        )}

        {/* 3º LUGAR - BRONZE (Direita) */}
        {third ? (
          <div
            onClick={handleCardClick}
            className="group cursor-pointer order-3 transition-all duration-300 hover:-translate-y-1 focus:outline-none"
          >
            <div className="card text-center border-[#3a434d] hover:border-[#c87d55] transition-colors relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-[#c87d55]/60" />
              <div className="absolute top-3 right-3 text-[#c87d55]/30 group-hover:text-[#c87d55]/60 transition-colors">
                <Award className="w-6 h-6" />
              </div>

              {/* Badge da Posição */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#c87d55]/15 border border-[#c87d55]/30 text-[#c87d55] text-[11px] font-semibold tracking-wider mb-4">
                <span>3º LUGAR</span>
                {third.isTied && (
                  <span className="text-[10px] bg-[#242b33] text-[#c87d55] px-1 py-0.2 rounded">
                    EMPATE
                  </span>
                )}
              </div>

              {/* Foto com Ring de Bronze */}
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <AvatarPhoto
                    src={third.photoUrl}
                    name={third.nome}
                    fallbackInitials={third.avatarFallback}
                    size="xl"
                    medalRing="bronze"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#242b33] border border-[#c87d55] text-[#e8e8e8] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                    3
                  </div>
                </div>
              </div>

              {/* Nome */}
              <h3
                className="text-sm sm:text-base font-semibold text-[#e8e8e8] line-clamp-1 mb-0.5 group-hover:text-[#2d9d6e] transition-colors m-0"
                title={third.nome}
              >
                {third.displayNome}
              </h3>
              {isOperations && (
                <span className="text-[11px] text-[#808080] block mb-3 font-normal">
                  {third.nome.includes("-") ? third.nome.split("-")[0].trim() : "Operação"}
                </span>
              )}

              {/* Valor */}
              <div className="bg-[#242b33] rounded-[6px] py-2 px-3 border border-[#3a434d] mt-2">
                <span className="text-[10px] uppercase text-[#808080] font-medium block">
                  {metric.shortLabel}
                </span>
                <span className="text-xl font-bold text-[#c87d55] tracking-tight">
                  {third.formattedValue}
                </span>
              </div>
            </div>

            {/* Pedestal Bronze */}
            <div className="hidden md:flex flex-col items-center justify-center h-12 bg-[#242b33] border-x border-b border-[#3a434d] rounded-b-[8px] shadow-sm mt-0.5">
              <span className="text-lg font-bold text-[#c87d55]">3</span>
              <span className="text-[10px] uppercase tracking-wider text-[#808080]">Bronze</span>
            </div>
          </div>
        ) : (
          <div className="order-3 hidden md:block opacity-30 card p-6 text-center text-[#808080]">
            3º Lugar vago
          </div>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { Trophy, Medal, Award, Sparkles } from "lucide-react";
import { RankedItem, MetricDefinition } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { triggerConfetti } from "../utils/confetti";
import { Display, Text, AssetChip } from "./stone-ds";

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
      <div className="bg-[#00461E]/40 border border-[#007D00] rounded-stone-lg p-8 text-center text-[#C8D2C8]">
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
    <div className="relative w-full mb-10">
      {/* Background radial glow com tons de verde Stone */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D700]/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Podium Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#A5FA00] animate-pulse" />
            <Display as="h2" width="condensed" uppercase={true} className="text-xl sm:text-2xl text-[#F5FFF5] tracking-tight">
              Pódio dos Campeões
            </Display>
            <AssetChip size="P" label={metric.shortLabel} className="ml-1" />
          </div>
          <Text size="sm" className="text-[#C8D2C8] mt-0.5">
            {metric.description}
          </Text>
        </div>
        <div className="text-xs text-[#A5FA00] bg-[#00461E]/80 border border-[#007D00] rounded-stone-pill px-3.5 py-1.5 self-start sm:self-auto flex items-center gap-1.5 font-body font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#A5FA00]" />
          <span>Clique nos cards para celebrar 🎉</span>
        </div>
      </div>

      {/* Grid of 3 Podium Pillars (2º - 1º - 3º) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end pt-4">
        {/* 2º LUGAR - PRATA (Esquerda) */}
        {second ? (
          <div
            onClick={handleCardClick}
            className="group cursor-pointer order-2 md:order-1 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
          >
            <div className="relative bg-gradient-to-b from-[#00461E] via-[#1E281E] to-[#1E281E] border-2 border-[#C8D2C8] rounded-stone-lg p-5 sm:p-6 text-center shadow-xl shadow-[#1E281E]/80 overflow-hidden backdrop-blur-md">
              {/* Silver Metallic accent ribbon */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#96A096] via-[#F5FFF5] to-[#96A096]" />
              <div className="absolute top-3 right-3 text-[#C8D2C8]/30 group-hover:text-[#C8D2C8]/60 transition-colors">
                <Medal className="w-8 h-8" />
              </div>

              {/* Badge da Posição */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-stone-pill bg-[#C8D2C8]/20 border border-[#C8D2C8] text-[#F5FFF5] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <span>🥈 {second.rank}º LUGAR</span>
                {second.isTied && (
                  <span className="text-[10px] bg-[#00461E] text-[#C8D2C8] px-1.5 py-0.2 rounded-stone-pill">
                    EMPATE
                  </span>
                )}
              </div>

              {/* Foto com Ring de Prata */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <AvatarPhoto
                    src={second.photoUrl}
                    name={second.nome}
                    fallbackInitials={second.avatarFallback}
                    size="xl"
                    medalRing="silver"
                  />
                  <div className="absolute -bottom-2 -right-1 bg-[#00461E] border-2 border-[#C8D2C8] text-[#F5FFF5] w-7 h-7 rounded-stone-pill flex items-center justify-center text-xs font-bold shadow-md">
                    2º
                  </div>
                </div>
              </div>

              {/* Nome */}
              <Display
                as="h3"
                width="condensed"
                uppercase={false}
                className="text-base sm:text-lg font-bold text-[#F5FFF5] line-clamp-1 mb-1 group-hover:text-[#A5FA00] transition-colors"
                title={second.nome}
              >
                {second.displayNome}
              </Display>
              {isOperations && (
                <Text size="caption" className="text-[#C8D2C8] block mb-3 font-medium">
                  {second.nome.includes("-") ? second.nome.split("-")[0].trim() : "Operação"}
                </Text>
              )}

              {/* Valor */}
              <div className="bg-[#1E281E] rounded-stone-md py-2.5 px-3 border border-[#007D00]/60">
                <Text size="caption" weight="semibold" className="uppercase tracking-wider text-[#96A096] block">
                  {metric.shortLabel}
                </Text>
                <Display as="span" width="condensed" className="text-xl sm:text-2xl text-[#C8D2C8] font-bold">
                  {second.formattedValue}
                </Display>
              </div>
            </div>

            {/* Pedestal Prata */}
            <div className="hidden md:flex flex-col items-center justify-center h-20 bg-gradient-to-b from-[#00461E]/90 to-[#1E281E] border-x border-b border-[#007D00] rounded-b-stone-lg shadow-inner mt-0.5">
              <span className="text-3xl font-black text-[#C8D2C8]/80 font-display">2</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#96A096]">Prata Stone</span>
            </div>
          </div>
        ) : (
          <div className="order-2 md:order-1 hidden md:block opacity-30 border border-dashed border-[#007D00] rounded-stone-lg p-6 text-center text-[#96A096]">
            2º Lugar vago
          </div>
        )}

        {/* 1º LUGAR - OURO (Centro - Destaque Principal) */}
        {first && (
          <div
            onClick={handleCardClick}
            className="group cursor-pointer order-1 md:order-2 transition-all duration-300 hover:-translate-y-2 focus:outline-none"
          >
            <div className="relative bg-gradient-to-b from-[#00461E] via-[#00461E]/90 to-[#1E281E] border-2 border-[#F0C828] rounded-stone-lg p-6 sm:p-7 text-center shadow-2xl shadow-[#00D700]/20 overflow-hidden backdrop-blur-md animate-glow-stone">
              {/* Golden Ribbon Stone */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#F0C828] via-[#FFEB41] to-[#F0C828] shadow-[0_0_15px_#F0C828]" />

              <div className="absolute top-3 right-3 text-[#F0C828]/40 group-hover:text-[#F0C828]/80 transition-colors">
                <Trophy className="w-10 h-10 animate-bounce duration-1000" />
              </div>

              {/* Badge da Posição */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-stone-pill bg-[#F0C828]/25 border border-[#F0C828] text-[#FFEB41] text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(240,200,40,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFEB41] animate-spin" style={{ animationDuration: "6s" }} />
                <span>🥇 1º LUGAR CAMPEÃO</span>
                {first.isTied && (
                  <span className="text-[10px] bg-[#00461E] text-[#FFEB41] px-1.5 py-0.2 rounded-stone-pill">
                    EMPATE
                  </span>
                )}
              </div>

              {/* Foto com Ring de Ouro */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <AvatarPhoto
                    src={first.photoUrl}
                    name={first.nome}
                    fallbackInitials={first.avatarFallback}
                    size="2xl"
                    medalRing="gold"
                    className="scale-105"
                  />
                  <div className="absolute -bottom-2 -right-1 bg-[#F0C828] border-2 border-[#F5FFF5] text-[#00461E] w-8 h-8 rounded-stone-pill flex items-center justify-center text-sm font-black shadow-lg">
                    1º
                  </div>
                </div>
              </div>

              {/* Nome */}
              <Display
                as="h3"
                width="condensed"
                uppercase={false}
                className="text-lg sm:text-xl font-bold text-[#F5FFF5] line-clamp-1 mb-1 group-hover:text-[#A5FA00] transition-colors"
                title={first.nome}
              >
                {first.displayNome}
              </Display>
              {isOperations && (
                <Text size="caption" className="text-[#A5FA00] block mb-3 font-semibold">
                  {first.nome.includes("-") ? first.nome.split("-")[0].trim() : "Operação"}
                </Text>
              )}

              {/* Valor */}
              <div className="bg-[#1E281E] rounded-stone-md py-3 px-4 border border-[#00D700]/50 shadow-inner">
                <Text size="caption" weight="bold" className="uppercase tracking-wider text-[#A5FA00] block">
                  {metric.label}
                </Text>
                <Display as="span" width="condensed" className="text-2xl sm:text-3xl text-[#00D700] font-black">
                  {first.formattedValue}
                </Display>
              </div>
            </div>

            {/* Pedestal Ouro */}
            <div className="hidden md:flex flex-col items-center justify-center h-28 bg-gradient-to-b from-[#00D700]/30 via-[#00461E] to-[#1E281E] border-x border-b border-[#00D700] rounded-b-stone-lg shadow-inner mt-0.5">
              <span className="text-4xl font-black text-[#00D700] font-display">1</span>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#A5FA00]">
                Ouro Campeão
              </span>
            </div>
          </div>
        )}

        {/* 3º LUGAR - BRONZE (Direita) */}
        {third ? (
          <div
            onClick={handleCardClick}
            className="group cursor-pointer order-3 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
          >
            <div className="relative bg-gradient-to-b from-[#00461E] via-[#1E281E] to-[#1E281E] border-2 border-[#FF8232] rounded-stone-lg p-5 sm:p-6 text-center shadow-xl shadow-[#1E281E]/80 overflow-hidden backdrop-blur-md">
              {/* Bronze Metallic accent ribbon */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#A0460A] via-[#FFA53C] to-[#A0460A]" />
              <div className="absolute top-3 right-3 text-[#FF8232]/30 group-hover:text-[#FF8232]/60 transition-colors">
                <Award className="w-8 h-8" />
              </div>

              {/* Badge da Posição */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-stone-pill bg-[#FF8232]/20 border border-[#FF8232] text-[#FFA53C] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <span>🥉 {third.rank}º LUGAR</span>
                {third.isTied && (
                  <span className="text-[10px] bg-[#00461E] text-[#FFA53C] px-1.5 py-0.2 rounded-stone-pill">
                    EMPATE
                  </span>
                )}
              </div>

              {/* Foto com Ring de Bronze */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <AvatarPhoto
                    src={third.photoUrl}
                    name={third.nome}
                    fallbackInitials={third.avatarFallback}
                    size="xl"
                    medalRing="bronze"
                  />
                  <div className="absolute -bottom-2 -right-1 bg-[#A0460A] border-2 border-[#FF8232] text-[#F5FFF5] w-7 h-7 rounded-stone-pill flex items-center justify-center text-xs font-bold shadow-md">
                    3º
                  </div>
                </div>
              </div>

              {/* Nome */}
              <Display
                as="h3"
                width="condensed"
                uppercase={false}
                className="text-base sm:text-lg font-bold text-[#F5FFF5] line-clamp-1 mb-1 group-hover:text-[#A5FA00] transition-colors"
                title={third.nome}
              >
                {third.displayNome}
              </Display>
              {isOperations && (
                <Text size="caption" className="text-[#C8D2C8] block mb-3 font-medium">
                  {third.nome.includes("-") ? third.nome.split("-")[0].trim() : "Operação"}
                </Text>
              )}

              {/* Valor */}
              <div className="bg-[#1E281E] rounded-stone-md py-2.5 px-3 border border-[#007D00]/60">
                <Text size="caption" weight="semibold" className="uppercase tracking-wider text-[#96A096] block">
                  {metric.shortLabel}
                </Text>
                <Display as="span" width="condensed" className="text-xl sm:text-2xl text-[#FF8232] font-bold">
                  {third.formattedValue}
                </Display>
              </div>
            </div>

            {/* Pedestal Bronze */}
            <div className="hidden md:flex flex-col items-center justify-center h-14 bg-gradient-to-b from-[#00461E]/90 to-[#1E281E] border-x border-b border-[#007D00] rounded-b-stone-lg shadow-inner mt-0.5">
              <span className="text-2xl font-black text-[#FF8232]/80 font-display">3</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF8232]">Bronze Stone</span>
            </div>
          </div>
        ) : (
          <div className="order-3 hidden md:block opacity-30 border border-dashed border-[#007D00] rounded-stone-lg p-6 text-center text-[#96A096]">
            3º Lugar vago
          </div>
        )}
      </div>
    </div>
  );
};

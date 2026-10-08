import React from "react";
import { Crown, PartyPopper } from "lucide-react";
import { MonthHighlightData } from "../types";
import { AvatarPhoto } from "./AvatarPhoto";
import { triggerGoldenFireworks } from "../utils/confetti";
import { Card, Display, Text, Button, AssetChip } from "./stone-ds";

interface MonthHighlightProps {
  highlight: MonthHighlightData | null;
  referenceMonth: string;
  isOperations: boolean;
}

export const MonthHighlight: React.FC<MonthHighlightProps> = ({
  highlight,
  referenceMonth,
  isOperations,
}) => {
  if (!highlight) return null;

  const handleCelebrate = () => {
    triggerGoldenFireworks();
  };

  return (
    <Card
      layout="principal"
      tone="dark"
      className="relative mb-12 overflow-hidden border-2 border-[#00D700] bg-gradient-to-r from-[#00461E] via-[#1E281E] to-[#00461E] shadow-2xl shadow-[#00D700]/20"
    >
      {/* Decorative Stone Ambient Heatmap Glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00D700]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#A5FA00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 z-10">
        {/* Left Side: Avatar & Crown */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-[#00D700] p-2 rounded-stone-pill shadow-lg shadow-[#00D700]/50 animate-bounce">
                <Crown className="w-6 h-6 text-[#00461E] fill-[#00461E]" />
              </div>
            </div>
            <AvatarPhoto
              src={highlight.photoUrl}
              name={highlight.nome}
              fallbackInitials={highlight.avatarFallback}
              size="2xl"
              medalRing="gold"
              className="mt-2"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-stone-pill bg-[#00D700] text-[#00461E] text-xs font-bold uppercase tracking-widest mb-2 shadow-sm font-body">
              <span>DESTAQUE DO MÊS • {referenceMonth}</span>
            </div>

            <Display
              as="h2"
              width="condensed"
              uppercase={true}
              className="text-2xl sm:text-3xl font-black text-[#F5FFF5] tracking-tight"
            >
              {highlight.displayNome}
            </Display>

            {isOperations && (
              <Text size="caption" className="text-[#C8D2C8] font-semibold mb-1">
                {highlight.nome}
              </Text>
            )}

            <Text size="sm" weight="medium" className="text-[#A5FA00] max-w-md mt-1">
              {highlight.summaryNote}
            </Text>
          </div>
        </div>

        {/* Center / Right: Podiums Count & Achievements */}
        <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
          {/* Stats Bar (Estilo Stone Dashboard) */}
          <div className="flex items-center gap-3 bg-[#1E281E] border border-[#007D00] rounded-stone-md p-3 px-4 shadow-inner">
            <div className="text-center px-2">
              <Display as="span" width="condensed" className="text-2xl font-black text-[#00D700] block">
                {highlight.totalPodiums}
              </Display>
              <span className="text-[10px] uppercase font-bold text-[#C8D2C8] tracking-wider font-body">
                Pódios Totais
              </span>
            </div>
            <div className="h-8 w-px bg-[#00461E]" />
            <div className="text-center px-2">
              <Display as="span" width="condensed" className="text-2xl font-black text-[#F0C828] block">
                {highlight.firstPlaceCount}
              </Display>
              <span className="text-[10px] uppercase font-bold text-[#F0C828] tracking-wider font-body">
                🥇 1º Lugares
              </span>
            </div>
            <div className="h-8 w-px bg-[#00461E]" />
            <div className="text-center px-2">
              <Display as="span" width="condensed" className="text-2xl font-black text-[#C8D2C8] block">
                {highlight.secondPlaceCount}
              </Display>
              <span className="text-[10px] uppercase font-bold text-[#C8D2C8] tracking-wider font-body">
                🥈 2º Lugares
              </span>
            </div>
            <div className="h-8 w-px bg-[#00461E]" />
            <div className="text-center px-2">
              <Display as="span" width="condensed" className="text-2xl font-black text-[#FF8232] block">
                {highlight.thirdPlaceCount}
              </Display>
              <span className="text-[10px] uppercase font-bold text-[#FF8232] tracking-wider font-body">
                🥉 3º Lugares
              </span>
            </div>
          </div>

          {/* Medals List com AssetChip */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-1.5 max-w-lg">
            {highlight.appearances.map((app, idx) => {
              let medalIcon = "🥇";
              let chipColor = "border-[#F0C828] text-[#F0C828]";
              if (app.rank === 2) {
                medalIcon = "🥈";
                chipColor = "border-[#C8D2C8] text-[#C8D2C8]";
              } else if (app.rank === 3) {
                medalIcon = "🥉";
                chipColor = "border-[#FF8232] text-[#FF8232]";
              }

              return (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-stone-pill text-xs font-semibold bg-[#1E281E]/90 border ${chipColor}`}
                >
                  <span>{medalIcon}</span>
                  <span className="font-bold text-[#F5FFF5]">{app.rank}º em {app.categoryLabel}:</span>
                  <span className="text-[#A5FA00] font-bold">{app.valueFormatted}</span>
                </div>
              );
            })}
          </div>

          {/* Celebrate Button Stone */}
          <Button
            variant="primary"
            size="md"
            onClick={handleCelebrate}
            className="gap-2 text-xs uppercase tracking-wider font-bold mt-1 shadow-lg shadow-[#00D700]/30"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Celebrar Reconhecimento</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

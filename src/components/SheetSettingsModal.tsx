import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Display, Text, Button } from "./stone-ds";

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpreadsheetId: string;
  onSave: (sheetIdOrUrl: string) => void;
  onResetToSample: () => void;
  isUsingSampleData: boolean;
  errors: string[];
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  currentSpreadsheetId,
  onSave,
  onResetToSample,
  isUsingSampleData,
  errors,
}) => {
  const [inputValue, setInputValue] = useState(currentSpreadsheetId || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inputValue.trim());
    onClose();
  };

  const handleReset = () => {
    setInputValue("");
    onResetToSample();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E281E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1E281E] border-2 border-[#007D00] rounded-stone-lg p-6 sm:p-7 shadow-2xl text-[#F5FFF5]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#00461E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#00D700] rounded-stone-md text-[#00461E]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <Display as="h3" width="condensed" uppercase={true} className="text-lg font-bold text-[#F5FFF5]">
                Conectar Planilha Google Sheets
              </Display>
              <Text size="caption" className="text-[#C8D2C8]">
                Sincronize as abas OPERAÇÕES, ANGELS e FOTOS
              </Text>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-stone-pill hover:bg-[#00461E] text-[#C8D2C8] hover:text-[#00D700] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="mt-4 mb-4">
          {isUsingSampleData ? (
            <div className="flex items-start gap-2.5 bg-[#00461E]/80 border border-[#00D700]/50 p-3.5 rounded-stone-md text-xs text-[#F5FFF5]">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#A5FA00]" />
              <div>
                <p className="font-bold text-[#A5FA00]">Utilizando Dados de Amostra da Operação</p>
                <p className="text-[#C8D2C8] mt-0.5 font-body">
                  Exibindo dados padrão da franquia técnica (João Câmara, Patos, Trairi e Green Angels). Cole a URL da sua planilha abaixo para sincronizar dados em tempo real.
                </p>
              </div>
            </div>
          ) : errors.length > 0 ? (
            <div className="flex items-start gap-2.5 bg-[#FF8232]/10 border border-[#FF8232] p-3.5 rounded-stone-md text-xs text-[#FFA53C]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF8232]" />
              <div>
                <p className="font-bold text-[#FF8232]">Aviso na conexão da planilha:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#FFA53C]/90 font-body">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#00D700]/10 border border-[#00D700] p-3.5 rounded-stone-md text-xs text-[#00D700]">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00D700]" />
              <span className="font-bold">Conectado com sucesso à planilha do Google Sheets.</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#A5FA00] uppercase tracking-wider mb-1.5 font-body">
              Link ou ID da Planilha do Google Sheets
            </label>
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0X.../edit"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-[#00461E]/60 border border-[#007D00] rounded-stone-md px-3.5 py-2.5 text-sm text-[#F5FFF5] placeholder-[#96A096] focus:outline-none focus:border-[#00D700] transition-colors font-body"
            />
            <span className="text-[11px] text-[#C8D2C8] mt-1 block font-body">
              Pode ser a URL completa compartilhada ou o ID alfanumérico.
            </span>
          </div>

          {/* Checklist Instructions */}
          <div className="bg-[#00461E]/40 border border-[#007D00] rounded-stone-md p-3.5 space-y-2 text-xs text-[#C8D2C8] font-body">
            <p className="font-bold text-[#00D700]">Requisitos da Planilha:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#A5FA00] font-bold">1.</span>
                <span>Compartilhamento: <strong>"Qualquer pessoa com o link pode ler"</strong> (sem exigir login).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A5FA00] font-bold">2.</span>
                <span>Abas com os nomes: <strong>OPERAÇÕES</strong>, <strong>ANGELS</strong> e <strong>FOTOS</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A5FA00] font-bold">3.</span>
                <span>Fotos: links do Google Drive ou links diretos de imagem.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-[#C8D2C8] hover:text-[#00D700] px-3 py-2 rounded-stone-pill hover:bg-[#00461E] transition-colors cursor-pointer font-body font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar dados de exemplo</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1 sm:flex-none text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-none text-xs font-bold"
              >
                <span>Conectar e Atualizar</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

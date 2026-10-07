import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "./stone-ds";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1419]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1a1f26] border border-[#3a434d] rounded-[8px] p-5 sm:p-6 shadow-xl text-[#e8e8e8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#3a434d]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#242b33] border border-[#3a434d] flex items-center justify-center text-[#2d9d6e]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#e8e8e8] m-0">
                Conectar Planilha Google Sheets
              </h3>
              <p className="text-xs text-[#808080] m-0">
                Sincronize as abas OPERAÇÕES, ANGELS e FOTOS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] hover:bg-[#242b33] text-[#808080] hover:text-[#e8e8e8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="mt-4 mb-4">
          {isUsingSampleData ? (
            <div className="flex items-start gap-2.5 bg-[#242b33] border border-[#3a434d] p-3 rounded-[6px] text-xs text-[#b0b0b0]">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#2d9d6e]" />
              <div>
                <p className="font-semibold text-[#2d9d6e] m-0">Dados de Exemplo da Operação</p>
                <p className="text-[#b0b0b0] mt-0.5 m-0">
                  Exibindo dados padrão da franquia técnica (João Câmara, Patos, Trairi e Green Angels). Cole a URL da sua planilha abaixo para sincronizar dados em tempo real.
                </p>
              </div>
            </div>
          ) : errors.length > 0 ? (
            <div className="flex items-start gap-2.5 bg-[#242b33] border border-[#c87d55]/40 p-3 rounded-[6px] text-xs text-[#c87d55]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#c87d55]" />
              <div>
                <p className="font-semibold text-[#c87d55] m-0">Aviso na conexão da planilha:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#b0b0b0]">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#2d9d6e]/10 border border-[#2d9d6e]/30 p-3 rounded-[6px] text-xs text-[#2d9d6e]">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2d9d6e]" />
              <span className="font-medium">Conectado com sucesso à planilha do Google Sheets.</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#e8e8e8] uppercase tracking-wider mb-1.5">
              Link ou ID da Planilha do Google Sheets
            </label>
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0X.../edit"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-[#242b33] border border-[#3a434d] rounded-[6px] px-3.5 py-2 text-sm text-[#e8e8e8] placeholder-[#808080] focus:outline-none focus:border-[#2d9d6e] transition-colors"
            />
            <span className="text-[11px] text-[#808080] mt-1 block">
              Pode ser a URL completa compartilhada ou somente o ID alfanumérico.
            </span>
          </div>

          {/* Checklist Instructions */}
          <div className="bg-[#242b33]/60 border border-[#3a434d] rounded-[6px] p-3 space-y-1.5 text-xs text-[#b0b0b0]">
            <p className="font-semibold text-[#e8e8e8] m-0">Requisitos da Planilha:</p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-[#2d9d6e] font-bold">1.</span>
                <span>Compartilhamento: <strong>"Qualquer pessoa com o link pode ler"</strong> (sem exigir login).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#2d9d6e] font-bold">2.</span>
                <span>Abas com os nomes: <strong>OPERAÇÕES</strong>, <strong>ANGELS</strong> e <strong>FOTOS</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#2d9d6e] font-bold">3.</span>
                <span>Fotos: links do Google Drive ou links diretos de imagem.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-[#808080] hover:text-[#2d9d6e] px-2 py-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar dados de exemplo</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="ghost"
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
                className="flex-1 sm:flex-none text-xs font-semibold"
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

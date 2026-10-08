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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-q-ink/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-q-card bg-q-card p-5 text-q-ink shadow-2xl sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-q-line">
          <div className="flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-full bg-q-green-tint text-q-green">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-q-ink m-0">
                Conectar Planilha Google Sheets
              </h3>
              <p className="text-xs text-q-muted m-0">
                Sincronize as abas OPERAÇÕES, ANGELS e FOTOS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-q-muted transition-colors hover:bg-q-soft hover:text-q-ink cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="mt-4 mb-4">
          {isUsingSampleData ? (
            <div className="flex items-start gap-2.5 rounded-2xl bg-q-green-tint p-3.5 text-xs text-q-green-deep">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-q-green" />
              <div>
                <p className="font-bold text-q-green-deep m-0">Dados de Exemplo da Operação</p>
                <p className="text-q-green-deep/80 mt-0.5 m-0">
                  Exibindo dados padrão da franquia técnica (João Câmara, Patos, Trairi e Green Angels). Cole a URL da sua planilha abaixo para sincronizar dados em tempo real.
                </p>
              </div>
            </div>
          ) : errors.length > 0 ? (
            <div className="flex items-start gap-2.5 rounded-2xl bg-[#fdeee3] p-3.5 text-xs text-[#a0460a]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#e07020]" />
              <div>
                <p className="font-bold text-[#a0460a] m-0">Aviso na conexão da planilha:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#a0460a]/85">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-q-green-tint p-3.5 text-xs text-q-green-deep">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-q-green" />
              <span className="font-medium">Conectado com sucesso à planilha do Google Sheets.</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-q-ink uppercase tracking-wider mb-1.5">
              Link ou ID da Planilha do Google Sheets
            </label>
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0X.../edit"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-2xl bg-q-soft px-4 py-3 text-sm text-q-ink placeholder:text-q-muted focus:outline-2 focus:outline-q-green"
            />
            <span className="text-[11px] text-q-muted mt-1 block">
              Pode ser a URL completa compartilhada ou somente o ID alfanumérico.
            </span>
          </div>

          {/* Checklist Instructions */}
          <div className="bg-q-soft rounded-2xl p-3.5 space-y-1.5 text-xs text-q-muted">
            <p className="font-bold text-q-ink m-0">Requisitos da Planilha:</p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-q-green font-bold">1.</span>
                <span>Compartilhamento: <strong>"Qualquer pessoa com o link pode ler"</strong> (sem exigir login).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-q-green font-bold">2.</span>
                <span>Abas com os nomes: <strong>OPERAÇÕES</strong>, <strong>ANGELS</strong> e <strong>FOTOS</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-q-green font-bold">3.</span>
                <span>Fotos: links do Google Drive ou links diretos de imagem.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-q-muted hover:text-q-green px-2 py-1.5 transition-colors cursor-pointer"
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

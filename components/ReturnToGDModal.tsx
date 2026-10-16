import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, CloseIcon } from './Icons';

const MOTIVOS = [
  'Ausência das pastas obrigatórias (Inicial_I e Recursos_R)',
  'Documentação incompleta',
  'Documento ilegível ou corrompido',
  'Dossiê duplicado',
  'Classificação documental incorreta',
  'Outro',
];

const MAX_OBSERVACAO = 500;

interface ReturnToGDModalProps {
  isOpen: boolean;
  dossierIds: string[];
  onClose: () => void;
  onConfirm: (motivo: string, observacao: string) => void;
}

const ReturnToGDModal: React.FC<ReturnToGDModalProps> = ({ isOpen, dossierIds, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setMotivo('');
    setObservacao('');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const count = dossierIds.length;
  const subtitle =
    count === 1 ? 'Informe o motivo para devolver este dossiê.' : `Informe o motivo para devolver estes ${count} dossiês.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-gd-title"
        className="w-full max-w-[540px] rounded-lg bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-base font-bold text-white" aria-hidden>
              !
            </span>
            <div>
              <h2 id="return-gd-title" className="text-base font-semibold text-gray-900">Retornar para Gestão Documental</h2>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="Fechar">
            <CloseIcon className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label htmlFor="return-gd-motivo" className="mb-1.5 block text-sm font-medium text-gray-800">
              Motivo da Devolução <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="return-gd-motivo"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm text-gray-800 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
              >
                <option value="" disabled hidden />
                {MOTIVOS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div>
            <label htmlFor="return-gd-observacao" className="mb-1.5 block text-sm font-medium text-gray-800">
              Observação
            </label>
            <textarea
              id="return-gd-observacao"
              value={observacao}
              onChange={e => setObservacao(e.target.value.slice(0, MAX_OBSERVACAO))}
              maxLength={MAX_OBSERVACAO}
              rows={4}
              placeholder="Descreva detalhadamente o motivo da devolução..."
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
            />
            <p className="mt-1 text-right text-[11px] text-gray-400">{observacao.length}/{MAX_OBSERVACAO}</p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(motivo, observacao.trim())}
            disabled={!motivo}
            className="rounded-md bg-[#2e3b8c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#25306f] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Confirmar Devolução
          </button>
        </footer>
      </div>
    </div>
  );
};

export const ReturnToGDButton: React.FC<{ count: number; onClick: () => void; size?: 'sm' | 'md' }> = ({ count, onClick, size = 'sm' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-md bg-[#2e3b8c] font-semibold text-white hover:bg-[#25306f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3b8c]/40 ${
      size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-sm'
    }`}
  >
    Devolver selecionados à GD ({count})
  </button>
);

export default ReturnToGDModal;

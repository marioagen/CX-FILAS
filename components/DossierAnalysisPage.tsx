import React, { useState } from 'react';
import {
  DownloadIcon, LinkIcon, MapIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon,
  FileTextIcon, CheckCircleIcon, CircleIcon, InfoIcon, FolderIcon, PencilSquareIcon, PenIcon, EraserIcon,
  MinusIcon, PlusIcon, MaximizeIcon, MoreVerticalIcon, ListIcon, AlertTriangleIcon, RefreshCwIcon,
} from './Icons';

export interface DossierToAnalyze {
  id: string;
  numeroDossie: string;
  pendente?: boolean;
}

interface DossierAnalysisPageProps {
  dossier: DossierToAnalyze;
  onBack: () => void;
}

const ANALYSIS_STEPS = [
  'Diagnóstico Rápido',
  'Existência de financiamento',
  'CR/CADMUT',
  'Contribuição',
  'Mudança de Devedor',
  'Índices de Reajuste',
];

type FolderNode =
  | { kind: 'folder'; name: string; items: string[] }
  | { kind: 'missing'; name: string };

const FOLDERS: FolderNode[] = [
  { kind: 'missing', name: 'Inicial_I' },
  {
    kind: 'folder',
    name: '555 - 2002.07.04_AN',
    items: [
      '01.01-Contratos',
      '02.04-FIF, RIF, Cadastro de Apólice de Seguro',
      '03.02-Mudança de Devedor',
      '04.01-Contratos',
      '05.03-Alterações Contratuais / Aditivos',
      '06.15-Ofícios de Solicitação de Documentos',
      '07.09-Planilhas de Evolução',
      '08.16-Outros',
      '09.06-Documentos de Empreendimento',
      '10.13-CADMUT',
      '11.13-CADMUT',
      '12.13-CADMUT',
      '13.13-CADMUT',
      '14.14-Ofícios de Término de Análise',
      '15.16-Outros',
    ],
  },
  { kind: 'missing', name: 'Recursos_R' },
];

const CONTRACT_TEXT =
  'Pelo presente instrumento particular, com força de escritura pública, na forma do artigo 61 da Lei nº 4.380 de 21 de agosto de 1964, com a redação dada pelo artigo 1º da Lei nº 5.049 de 29 de junho de 1966, as partes adiante nomeadas e qualificadas, de um lado como PROMITENTE VENDEDORA, a empresa abaixo identificada, e de outro lado como PROMITENTE COMPRADOR(A) o(s) mutuário(s) qualificado(s) no item 2 do quadro-resumo, têm entre si justo e contratado o presente, que se regerá pelas cláusulas e condições seguintes. CLÁUSULA PRIMEIRA — A PROMITENTE VENDEDORA, sendo senhora e legítima possuidora do imóvel descrito no item 3 do quadro-resumo, livre e desembaraçado de quaisquer ônus, promete vendê-lo ao(à) PROMITENTE COMPRADOR(A), pelo preço e condições estipulados neste instrumento. CLÁUSULA SEGUNDA — O preço total da presente promessa é o constante do item 4 do quadro-resumo, que será pago na forma ali estabelecida, sendo a parcela financiada sujeita à correção monetária pelos índices aplicáveis às cadernetas de poupança, conforme normas do Sistema Financeiro da Habitação. CLÁUSULA TERCEIRA — O saldo devedor será amortizado em prestações mensais e sucessivas, calculadas pelo Plano de Equivalência Salarial por Categoria Profissional, vencendo-se a primeira no mês subsequente ao da assinatura deste instrumento. CLÁUSULA QUARTA — O(A) PROMITENTE COMPRADOR(A) contribuirá para o Fundo de Compensação de Variações Salariais na forma da legislação vigente à data da assinatura do contrato. ';

const DossierAnalysisPage: React.FC<DossierAnalysisPageProps> = ({ dossier, onBack }) => {
  const [activeStep, setActiveStep] = useState('Contribuição');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ isencao: true });
  const [checklistOpen, setChecklistOpen] = useState<Record<string, boolean>>({ assinatura: true, qualificacao: false });
  const [answer, setAnswer] = useState('');
  const [viewerTab, setViewerTab] = useState<'documentos' | 'imagens'>('documentos');
  const [selectedItem, setSelectedItem] = useState('14.14-Ofícios de Término de Análise');
  const [zoom, setZoom] = useState(75);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceHighlight | null>(null);
  const [activeConferenciaRowKey, setActiveConferenciaRowKey] = useState<string | null>(null);
  const [showOnlyDivergencias, setShowOnlyDivergencias] = useState(false);

  const showDocumentEvidence = (evidence: EvidenceHighlight, rowKey: string) => {
    setActiveEvidence(evidence);
    setActiveConferenciaRowKey(rowKey);
    setSelectedItem(CONTRATO_EVIDENCIA_ITEM);
  };

  const toggleSection = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleChecklist = (key: string) =>
    setChecklistOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const showDivergencias = () => {
    const divergentSectionIds = CHECKLIST_SECTIONS
      .filter(section => section.blocos.some(bloco => bloco.linhas.some(linha => linha.status === 'divergencia')))
      .map(section => section.id);

    setShowOnlyDivergencias(true);
    setChecklistOpen(Object.fromEntries(divergentSectionIds.map(id => [id, true])));
    window.requestAnimationFrame(() => {
      document.getElementById('divergencias-checklist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const stepIndex = ANALYSIS_STEPS.indexOf(activeStep);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white text-[13px] text-gray-800">
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-gray-200 bg-white">
        <nav className="flex items-center gap-2 text-sm min-w-0" aria-label="Navegação">
          <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:text-[#005c9e]">Análise</button>
          <span className="text-gray-400">&gt;</span>
          <button type="button" onClick={onBack} className="font-semibold text-gray-800 hover:text-[#005c9e]">Documentos de análises</button>
          <span className="text-gray-400">&gt;</span>
          <span className="font-semibold text-gray-800 truncate">{dossier.numeroDossie}</span>
        </nav>
        <span className="shrink-0 rounded border border-[#b9d3ea] bg-[#e8f1f9] px-3 py-1 text-xs font-medium text-[#005c9e]">
          Em Análise Completa
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#f4f6f8] border-b border-gray-200 overflow-x-auto">
        <ToolbarButton icon={<DownloadIcon className="h-3.5 w-3.5" />} label="Download" />
        <ToolbarButton icon={<LinkIcon className="h-3.5 w-3.5" />} label="URLs" />
        <ToolbarButton icon={<MapIcon className="h-3.5 w-3.5" />} label="Mapas" />
        <button type="button" className="shrink-0 rounded bg-[#005c9e] p-2 text-white hover:bg-[#004a7c]" aria-label="Buscar">
          <SearchIcon className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2 mx-auto shrink-0">
          <StepArrow
            direction="left"
            disabled={stepIndex <= 0}
            onClick={() => setActiveStep(ANALYSIS_STEPS[Math.max(0, stepIndex - 1)])}
          />
          <fieldset className="relative rounded-lg border border-gray-300 bg-white px-2 pt-3 pb-1.5">
            <legend className="absolute -top-2 left-3 bg-[#f4f6f8] px-1 text-[11px] text-gray-600">Análise Simplificada</legend>
            <div className="flex items-center gap-1.5">
              {ANALYSIS_STEPS.map((step, i) => {
                const isActive = step === activeStep;
                const isDone = i === 0;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveStep(step)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] transition-colors ${
                      isActive
                        ? 'bg-[#0b3d6e] text-white font-semibold'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                        isActive ? 'border-white bg-white' : isDone ? 'border-[#005c9e]' : 'border-gray-400 bg-white'
                      }`}
                    >
                      {(isActive || isDone) && <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#0b3d6e]' : 'bg-[#005c9e]'}`} />}
                    </span>
                    {step}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <StepArrow
            direction="right"
            disabled={stepIndex >= ANALYSIS_STEPS.length - 1}
            onClick={() => setActiveStep(ANALYSIS_STEPS[Math.min(ANALYSIS_STEPS.length - 1, stepIndex + 1)])}
          />
        </div>

        <ToolbarButton icon={<FileTextIcon className="h-3.5 w-3.5" />} label="Ofício de Término" />
      </div>

      {/* Dossier info */}
      <div className="px-4 pt-3 bg-white">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-[#e4e7eb] text-gray-700">
              {['ID', 'Ag. Financeiro', 'Contrato', 'HIP', 'Mutuário', 'Categoria', 'Demanda'].map(h => (
                <th key={h} scope="col" className="px-2 py-1 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-500 border-b border-gray-200">
              <td className="px-2 py-1">{dossier.id}</td>
              <td className="px-2 py-1">53167</td>
              <td className="px-2 py-1">0000002100063</td>
              <td className="px-2 py-1">1</td>
              <td className="px-2 py-1">MANOELA LEDESMA MONTEIRO</td>
              <td className="px-2 py-1">Pedido Reanálise</td>
              <td className="px-2 py-1">BR 1 AF CAIXA C1</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Split workspace */}
      <div className="flex flex-1 min-h-0 gap-4 px-4 pt-3">
        {/* Analysis form */}
        <section className="w-[42%] min-w-[360px] flex flex-col min-h-0 border border-gray-200 border-b-0 bg-white">
          <h2 className="px-4 py-2 text-xs font-medium text-gray-700">Análise simplificada</h2>
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {dossier.pendente && (
              <>
                <PendenciasImpeditiveasAlert onShowDivergencias={showDivergencias} />
                <EtapaChecklistPanel
                  open={checklistOpen}
                  onToggle={toggleChecklist}
                  activeRowKey={activeConferenciaRowKey}
                  onShowEvidence={showDocumentEvidence}
                  showOnlyDivergencias={showOnlyDivergencias}
                  onClearFilter={() => setShowOnlyDivergencias(false)}
                />
              </>
            )}
            <AccordionSection
              title="ISENÇÃO"
              done
              open={!!openSections.isencao}
              onToggle={() => toggleSection('isencao')}
            >
              <p className="px-3 pt-2 pb-3 text-[13px] text-gray-800">[Q] A data do contrato é anterior a 01/07/1977 (Isenção)?</p>
              <div className="flex items-center gap-3 px-3 pb-3">
                <label htmlFor="resp-contratos" className="w-24 shrink-0 text-xs text-gray-700">Contratos</label>
                <input
                  id="resp-contratos"
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Digite sua resposta aqui"
                  className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e]"
                />
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" aria-label="Resposta sugerida disponível" />
              </div>
              <div className="mx-1 mb-2 flex gap-2 rounded border border-[#3b82c4] bg-white px-3 py-2">
                <InfoIcon className="h-4 w-4 shrink-0 mt-0.5 text-[#005c9e]" />
                <ul className="list-disc pl-4 space-y-0.5 text-xs text-gray-800">
                  <li>Atentar-se ao item 5.5 do RAFCVS referente às especificidades de 16/06/1967 a 31/12/1977</li>
                  <li>Contratos entre 11/1984 a 03/1985 — Podem ser à vista (PES) ou mensal (EQ) — 3.1.4.2 do RAFCVS</li>
                  <li>Atenção: nos casos de contratos de construção, conforme item 5.1.5.5 do RAFCVS, a contribuição deve ser recolhida considerando-se a data da apuração da dívida (ou seja, data de término de obra conforme item 9.1.19 do RAFCVS)</li>
                </ul>
              </div>
            </AccordionSection>

            <AccordionSection title="AF CAIXA" done open={!!openSections.af} onToggle={() => toggleSection('af')}>
              <p className="px-3 py-3 text-xs text-gray-500">Nenhuma pergunta pendente nesta seção.</p>
            </AccordionSection>

            <AccordionSection
              title="CONTRIBUIÇÃO À VISTA"
              done
              warning
              tags={['Plano de CML', 'MAPA']}
              open={!!openSections.vista}
              onToggle={() => toggleSection('vista')}
            >
              <div className="mx-1 my-2 flex gap-2 rounded border border-[#f59e0b] bg-amber-50/60 px-3 py-2 text-xs text-gray-800" role="note">
                <AlertTriangleIcon className="h-4 w-4 shrink-0 mt-0.5 text-[#d97706]" aria-hidden />
                <p>
                  <span className="font-semibold text-[#92400e]">Inconsistência:</span> a data de recolhimento da contribuição à vista no
                  Plano de CML (15/08/1984) diverge da registrada no MAPA (15/09/1984). Confira o comprovante antes de concluir.
                </p>
              </div>
            </AccordionSection>

            <div className="mx-1 flex items-center gap-2 rounded border border-[#3b82c4] px-3 py-2 text-xs text-gray-800">
              <InfoIcon className="h-4 w-4 shrink-0 text-[#005c9e]" />
              Atentar-se à possibilidade de cessão de crédito para considerar a data da cessão em sua conferência.
            </div>

            <AccordionSection title="CONTRIBUIÇÃO MENSAL" done open={!!openSections.mensal} onToggle={() => toggleSection('mensal')}>
              <p className="px-3 py-3 text-xs text-gray-500">Nenhuma pergunta pendente nesta seção.</p>
            </AccordionSection>

            <AccordionSection
              title="CESSÃO"
              tags={['CESSÃO', 'RAFI']}
              open={!!openSections.cessao}
              onToggle={() => toggleSection('cessao')}
            >
              <p className="px-3 py-3 text-xs text-gray-500">Responda as seções anteriores para liberar esta etapa.</p>
            </AccordionSection>
          </div>
        </section>

        {/* Document viewer */}
        <section className="flex-1 min-w-0 flex flex-col min-h-0 bg-[#3a3d42]">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-[#2b2e33] text-gray-200">
            <ListIcon className="h-4 w-4" />
            <div className="flex items-center gap-2 mx-auto">
              <input
                aria-label="Página atual"
                defaultValue={1}
                className="w-14 rounded-sm bg-[#1d1f22] px-2 py-0.5 text-center text-xs text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <span className="text-xs text-gray-400">/ 68</span>
              <span className="mx-2 h-4 w-px bg-gray-600" />
              <button type="button" onClick={() => setZoom(z => Math.max(25, z - 25))} aria-label="Diminuir zoom" className="hover:text-white">
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="rounded-sm bg-[#1d1f22] px-2 py-0.5 text-xs tabular-nums">{zoom}%</span>
              <button type="button" onClick={() => setZoom(z => Math.min(200, z + 25))} aria-label="Aumentar zoom" className="hover:text-white">
                <PlusIcon className="h-4 w-4" />
              </button>
              <span className="mx-2 h-4 w-px bg-gray-600" />
              <RefreshCwIcon className="h-3.5 w-3.5" />
              <MaximizeIcon className="h-3.5 w-3.5" />
              <PenIcon className="h-3.5 w-3.5" />
              <EraserIcon className="h-3.5 w-3.5" />
            </div>
            <ListIcon className="h-4 w-4" />
            <MoreVerticalIcon className="h-4 w-4" />
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Folder tree */}
            <aside className="w-[38%] min-w-[220px] max-w-[300px] flex flex-col min-h-0 bg-[#2f3338] text-gray-200">
              <div className="flex justify-center gap-6 pt-3 text-xs">
                {(['documentos', 'imagens'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setViewerTab(tab)}
                    className={`pb-2 capitalize ${viewerTab === tab ? 'border-b-2 border-white text-white font-medium' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto text-xs">
                <div className="px-3 py-1.5 bg-[#4a4f56] text-gray-200">Documento Completo</div>
                {FOLDERS.map(folder =>
                  folder.kind === 'missing' && !dossier.pendente ? (
                    <div key={folder.name} className="flex items-center gap-2 px-3 py-1.5 bg-[#24272b] text-gray-100">
                      <FolderIcon className="h-3.5 w-3.5 text-gray-300" />
                      <span>{folder.name}</span>
                    </div>
                  ) : folder.kind === 'missing' ? (
                    <div
                      key={folder.name}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#3d3220] text-amber-300 border-y border-amber-500/30"
                      title={`Pasta obrigatória ${folder.name} ausente`}
                    >
                      <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">{folder.name}</span>
                      <span className="ml-auto text-[10px] uppercase tracking-wide text-amber-400/80">Ausente</span>
                    </div>
                  ) : (
                    <div key={folder.name}>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#24272b] text-gray-100">
                        <FolderIcon className="h-3.5 w-3.5 text-gray-300" />
                        <span>{folder.name}</span>
                      </div>
                      {folder.items.map(item => {
                        const isSelected = item === selectedItem;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className={`group flex w-full items-center gap-2 pl-5 pr-3 py-1.5 text-left ${
                              isSelected ? 'bg-[#f6d7b8] text-[#7a3e0e]' : 'hover:bg-[#3a3f45]'
                            }`}
                          >
                            <FileTextIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate flex-1">{item}</span>
                            <PencilSquareIcon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? '' : 'text-gray-400'}`} />
                            <DownloadIcon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? '' : 'text-gray-400'}`} />
                          </button>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </aside>

            {/* Page canvas */}
            <div className="relative flex-1 min-w-0 overflow-auto bg-[#5b5f65] p-4">
              {selectedItem === CONTRATO_EVIDENCIA_ITEM ? (
                <InstrumentoCompraVendaDocument highlight={activeEvidence} zoom={zoom} />
              ) : (
                <>
                  <span className="absolute left-[18%] top-[40%] h-2.5 w-2.5 rounded-full bg-black" aria-hidden />
                  <span className="absolute left-[18%] top-[62%] h-2.5 w-2.5 rounded-full bg-black" aria-hidden />
                  <article
                    className="mx-auto bg-white shadow-lg px-6 py-5 origin-top"
                    style={{ width: `${(zoom / 75) * 360}px` }}
                    aria-label={`Visualização de ${selectedItem}`}
                  >
                    <header className="flex items-start gap-3 mb-2">
                      <div className="h-8 w-8 shrink-0 border-2 border-black flex items-center justify-center text-[8px] font-black">AV</div>
                      <p className="font-serif text-[7px] font-bold uppercase leading-tight">
                        Contrato de promessa de compra e venda, na forma abaixo discriminada
                      </p>
                    </header>
                    <p
                      className="font-serif text-justify text-gray-900 leading-[1.35]"
                      style={{ fontSize: `${(zoom / 75) * 5.2}px` }}
                    >
                      {CONTRACT_TEXT.repeat(4)}
                    </p>
                  </article>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const CONTRATO_EVIDENCIA_ITEM = '01.01-Contratos';

type ConferenciaStatus = 'confere' | 'divergencia';
type EvidenceHighlight = 'data-assinatura' | 'nome-mutuario' | 'cpf-mutuario';

interface ConferenciaRow {
  fonte: string;
  valor: string;
  status: ConferenciaStatus;
}

interface ConferenciaBloco {
  pergunta: string;
  evidence: EvidenceHighlight;
  linhas: ConferenciaRow[];
}

const CHECKLIST_SECTIONS: { id: string; titulo: string; blocos: ConferenciaBloco[] }[] = [
  {
    id: 'assinatura',
    titulo: 'Assinatura das partes / procuração',
    blocos: [
      {
        pergunta: 'Qual a data da assinatura? Conforme subitem 9.1.6 do RAFCVS.',
        evidence: 'data-assinatura',
        linhas: [
          { fonte: 'DOSSIÊ', valor: '12/06/1984', status: 'confere' },
          { fonte: 'SICVS', valor: '12/06/1984', status: 'confere' },
          { fonte: 'CADMUT', valor: '12/06/1984', status: 'confere' },
        ],
      },
    ],
  },
  {
    id: 'qualificacao',
    titulo: 'Qualificação',
    blocos: [
      {
        pergunta: 'Nome do mutuário principal.',
        evidence: 'nome-mutuario',
        linhas: [
          { fonte: 'DOSSIÊ', valor: 'Arlindo Laguna', status: 'confere' },
          { fonte: 'SICVS', valor: 'Arlindo Laguna', status: 'confere' },
          { fonte: 'CADMUT', valor: 'Arlindo Laguna', status: 'confere' },
        ],
      },
      {
        pergunta: 'Número do CPF do mutuário principal.',
        evidence: 'cpf-mutuario',
        linhas: [
          { fonte: 'DOSSIÊ', valor: '482.719.064-70', status: 'confere' },
          { fonte: 'SICVS', valor: '482.719.064-70', status: 'confere' },
          { fonte: 'CADMUT', valor: '482.710.004-70', status: 'divergencia' },
        ],
      },
    ],
  },
];

const EtapaChecklistPanel: React.FC<{
  open: Record<string, boolean>;
  onToggle: (id: string) => void;
  activeRowKey: string | null;
  onShowEvidence: (evidence: EvidenceHighlight, rowKey: string) => void;
  showOnlyDivergencias: boolean;
  onClearFilter: () => void;
}> = ({ open, onToggle, activeRowKey, onShowEvidence, showOnlyDivergencias, onClearFilter }) => {
  const visibleSections = showOnlyDivergencias
    ? CHECKLIST_SECTIONS.filter(section => section.blocos.some(bloco => bloco.linhas.some(linha => linha.status === 'divergencia')))
    : CHECKLIST_SECTIONS;

  return (
  <div id="divergencias-checklist" className="mx-1 mb-4 scroll-mt-3 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Checklist da etapa</p>
        <h3 className="mt-1 text-base font-bold text-[#0b2d4a] leading-tight">Qualificação do mutuário</h3>
      </div>
      {showOnlyDivergencias ? (
        <button
          type="button"
          onClick={onClearFilter}
          className="shrink-0 rounded border border-[#b45309] px-2.5 py-1 text-[11px] font-semibold text-[#92400e] hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b45309] focus-visible:ring-offset-2"
        >
          Mostrar todos
        </button>
      ) : (
        <span className="shrink-0 rounded-full bg-[#005c9e] px-2.5 py-0.5 text-[11px] font-semibold text-white">
          3 conferidos
        </span>
      )}
    </div>

    <div className="divide-y divide-gray-100">
      {visibleSections.map(section => {
        const isOpen = !!open[section.id];
        const hasDivergencia = section.blocos.some(b => b.linhas.some(l => l.status === 'divergencia'));
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => onToggle(section.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-gray-50/80"
            >
              {hasDivergencia ? <ChecklistWarningIcon /> : <ChecklistDoneIcon />}
              <span className="flex-1 text-sm font-bold text-[#0b2d4a]">{section.titulo}</span>
              {isOpen
                ? <ChevronUpIcon className="h-4 w-4 shrink-0 text-gray-400" />
                : <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-5 border-t border-gray-50">
                {section.blocos.map((bloco, idx) => (
                  <ConferenciaBlocoView
                    key={idx}
                    bloco={bloco}
                    sectionId={section.id}
                    blocoIndex={idx}
                    activeRowKey={activeRowKey}
                    onShowEvidence={onShowEvidence}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
  );
};

const ChecklistDoneIcon: React.FC = () => (
  <span
    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white"
    aria-hidden
  >
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  </span>
);

const ChecklistWarningIcon: React.FC = () => (
  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#d97706]" title="Há divergência nesta seção">
    <AlertTriangleIcon className="h-5 w-5" aria-hidden />
    <span className="sr-only">Há divergência nesta seção</span>
  </span>
);

const ConferenciaBlocoView: React.FC<{
  bloco: ConferenciaBloco;
  sectionId: string;
  blocoIndex: number;
  activeRowKey: string | null;
  onShowEvidence: (evidence: EvidenceHighlight, rowKey: string) => void;
}> = ({ bloco, sectionId, blocoIndex, activeRowKey, onShowEvidence }) => {
  const defaultRowKey = `${sectionId}-${blocoIndex}-${bloco.linhas[0]?.fonte ?? '0'}`;

  return (
    <div>
      <p className="text-xs font-medium text-[#0b2d4a] leading-snug">{bloco.pergunta}</p>
      <div className="mt-2 rounded border border-gray-100 overflow-hidden">
        {bloco.linhas.map((linha, i) => {
          const rowKey = `${sectionId}-${blocoIndex}-${linha.fonte}`;
          const isActive = activeRowKey === rowKey;
          return (
            <button
              key={linha.fonte}
              type="button"
              onClick={() => onShowEvidence(bloco.evidence, rowKey)}
              className={`grid w-full grid-cols-[72px_1fr_auto] items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                i > 0 ? 'border-t border-gray-100' : ''
              } ${
                isActive
                  ? linha.status === 'divergencia'
                    ? 'bg-rose-50 ring-1 ring-inset ring-rose-200'
                    : 'bg-emerald-50/80 ring-1 ring-inset ring-emerald-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-bold uppercase tracking-wide text-gray-500 text-[10px]">{linha.fonte}</span>
              <span className="text-[#0b2d4a]">{linha.valor}</span>
              <ConferenciaStatusLabel status={linha.status} />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onShowEvidence(bloco.evidence, defaultRowKey)}
        className="mt-2 text-xs font-medium text-[#005c9e] hover:underline"
      >
        Ver evidência no documento →
      </button>
    </div>
  );
};

const ConferenciaStatusLabel: React.FC<{ status: ConferenciaStatus }> = ({ status }) =>
  status === 'confere' ? (
    <span className="font-bold text-[#15803d]">Confere</span>
  ) : (
    <span className="font-bold text-[#be185d]">Divergência</span>
  );

const EvidenceMark: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) =>
  active ? (
    <mark className="bg-[#fff3b0] text-inherit px-0.5 rounded-sm">{children}</mark>
  ) : (
    <>{children}</>
  );

const InstrumentoCompraVendaDocument: React.FC<{ highlight: EvidenceHighlight | null; zoom: number }> = ({ highlight, zoom }) => {
  const scale = zoom / 75;
  const bodySize = scale * 11;

  return (
    <article
      className="mx-auto bg-white shadow-lg px-10 py-8 origin-top text-[#1a1a1a]"
      style={{ width: `${scale * 400}px`, fontSize: `${bodySize}px` }}
      aria-label="Instrumento particular de compra e venda"
    >
      <h1
        className="text-center font-serif font-bold text-[#0b2d4a] uppercase tracking-wide leading-snug"
        style={{ fontSize: `${scale * 13}px` }}
      >
        Instrumento particular de compra e venda
      </h1>
      <div className="mt-6 space-y-4 font-serif text-justify leading-[1.65]">
        <p>
          Pelo presente instrumento particular, as partes abaixo qualificadas celebram contrato de financiamento
          habitacional, nos termos da legislação do Sistema Financeiro da Habitação.
        </p>
        <p>
          De um lado, como mutuário,{' '}
          <EvidenceMark active={highlight === 'nome-mutuario'}>ARLINDO LAGUNA</EvidenceMark>, brasileiro, portador do
          CPF nº <EvidenceMark active={highlight === 'cpf-mutuario'}>482.719.064-70</EvidenceMark>, residente e
          domiciliado na forma do cadastro em anexo.
        </p>
        <p>
          As partes firmam o presente em{' '}
          <EvidenceMark active={highlight === 'data-assinatura'}>12 de junho de 1984</EvidenceMark>, na cidade de
          Itajaí, Estado de Santa Catarina, comprometendo-se ao cumprimento das condições de pagamento e garantias
          previstas neste instrumento e seus anexos.
        </p>
        <p>
          O imóvel objeto desta operação encontra-se devidamente descrito na matrícula referenciada no processo,
          estando livre e desembaraçado de ônus, salvo o financiamento ora contratado.
        </p>
      </div>
      <div className="mt-10 text-center font-sans" style={{ fontSize: `${scale * 10}px` }}>
        <div className="mx-auto w-48 border-t border-gray-800 pt-2">
          <p className="font-semibold text-gray-900">
            <EvidenceMark active={highlight === 'nome-mutuario'}>ARLINDO LAGUNA</EvidenceMark>
          </p>
          <p className="text-gray-600 mt-0.5">Mutuário</p>
        </div>
      </div>
    </article>
  );
};

const PendenciasImpeditiveasAlert: React.FC<{ onShowDivergencias: () => void }> = ({ onShowDivergencias }) => (
  <div
    className="mx-1 mb-3 flex gap-3 rounded-lg border border-orange-400 bg-[#fafafa] px-4 py-3"
    role="alert"
  >
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white"
      aria-hidden
    >
      !
    </span>
    <div className="min-w-0 flex-1 pt-0.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
        Lembrete antes de concluir
      </p>
      <p className="mt-0.5 text-sm font-bold text-[#0b2d4a] leading-snug">
        Há pendências impeditivas neste dossiê
      </p>
      <p className="mt-1 text-xs text-[#0b2d4a] leading-relaxed">
        A ausência das pastas <span className="font-semibold">Inicial_I</span> e{' '}
        <span className="font-semibold">Recursos_R</span> bloqueia a conclusão, independentemente da
        conferência cadastral.
      </p>
      <div className="mt-2 flex justify-start">
        <button
          type="button"
          onClick={onShowDivergencias}
          className="rounded border border-[#005c9e] bg-transparent px-3 py-1.5 text-xs font-semibold text-[#005c9e] transition-colors hover:bg-[#e8f1f9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005c9e] focus-visible:ring-offset-2"
        >
          Ver divergências
        </button>
      </div>
    </div>
  </div>
);

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button
    type="button"
    className="shrink-0 flex items-center gap-1.5 rounded bg-[#005c9e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#004a7c] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#005c9e]"
  >
    {icon}
    {label}
  </button>
);

const StepArrow: React.FC<{ direction: 'left' | 'right'; disabled: boolean; onClick: () => void }> = ({ direction, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'left' ? 'Etapa anterior' : 'Próxima etapa'}
    className="h-8 w-8 shrink-0 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {direction === 'left' ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
  </button>
);

const AccordionSection: React.FC<{
  title: string;
  done?: boolean;
  warning?: boolean;
  tags?: string[];
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, done, warning, tags, open, onToggle, children }) => (
  <div className="border-b border-gray-100">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-2 bg-[#eef0f3] px-3 py-1.5 text-left hover:bg-[#e5e8ec]"
    >
      {warning ? (
        <span className="flex shrink-0 text-[#d97706]" title="Há inconsistência nesta seção">
          <AlertTriangleIcon className="h-4 w-4" aria-hidden />
          <span className="sr-only">Há inconsistência nesta seção</span>
        </span>
      ) : done
        ? <CheckCircleIcon className="h-4 w-4 shrink-0 text-[#005c9e]" />
        : <CircleIcon className="h-4 w-4 shrink-0 text-gray-400" />}
      <span className="text-[11px] font-semibold tracking-wide text-gray-700">{title}</span>
      <span className="ml-auto flex items-center gap-1">
        {tags?.map(tag => (
          <span key={tag} className="rounded bg-[#5b6b7d] px-1.5 py-0.5 text-[10px] font-medium text-white">{tag}</span>
        ))}
        {open ? <ChevronUpIcon className="h-4 w-4 text-gray-500" /> : <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
      </span>
    </button>
    {open && <div>{children}</div>}
  </div>
);

export default DossierAnalysisPage;

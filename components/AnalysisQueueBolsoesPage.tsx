import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangleIcon, ArrowUpDownIcon, ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon, CloseIcon, FileTextIcon, FilterIcon,
  PencilSquareIcon, PlusIcon, SearchIcon, TrashIcon, UploadIcon, UsersIcon,
} from './Icons';
import { SemPastasObrigatoriasFilter } from './DocumentAnalysisPage';
import ReturnToGDModal, { ReturnToGDButton } from './ReturnToGDModal';

interface QueueDoc {
  id: string;
  nrDoc: string;
  cat: string;
  status: string;
  demanda: string;
  bancoCredor: string;
  agente: string;
  contrato: string;
  hipoteca: string;
  pendente?: boolean;
}

interface Bolsao {
  id: number;
  name: string;
  analysts: string[];
  docs: QueueDoc[];
}

const BOLSAO_DOCS: QueueDoc[] = [
  { id: '1963', nrDoc: '9001318223753_53145_0009040035115_1.pdf', cat: '1ª Análise', status: 'Em análise simplificada', demanda: '', bancoCredor: 'CAIXA', agente: '53145', contrato: '0009040035115', hipoteca: '1', pendente: true },
  { id: '2131', nrDoc: '9001318223122_50141_0257583_1.pdf', cat: 'Validação', status: 'Em análise simplificada', demanda: '', bancoCredor: 'CAIXA', agente: '50141', contrato: '0257583', hipoteca: '1' },
  { id: '2334', nrDoc: '10104828976_00012_0001690637091_1.pdf', cat: 'Pedido Reanálise', status: 'Em análise simplificada', demanda: '', bancoCredor: 'EMGEA', agente: '00012', contrato: '0001690637091', hipoteca: '1', pendente: true },
  { id: '2418', nrDoc: '9001318224410_53145_0009040041872_1.pdf', cat: '1ª Análise', status: 'Em análise simplificada', demanda: '', bancoCredor: 'CAIXA', agente: '53145', contrato: '0009040041872', hipoteca: '1', pendente: true },
  { id: '2475', nrDoc: '20117_10104912335_50176_0001000629304_1.pdf', cat: 'Validação', status: 'Em análise simplificada', demanda: '', bancoCredor: 'UNICARD', agente: '50176', contrato: '0001000629304', hipoteca: '2' },
  { id: '2503', nrDoc: '31540_03100512288_00024_0703000118852_1.pdf', cat: 'Pedido Reanálise', status: 'Em análise simplificada', demanda: '', bancoCredor: 'COHAB/SP', agente: '00024', contrato: '0703000118852', hipoteca: '1', pendente: true },
];

const GENERAL_DOCS: QueueDoc[] = [
  { id: '451', nrDoc: '9001319102365_53131_9044994401151_1.pdf', cat: 'Reanálise (Inadequado AUDIR)', status: 'Aguardando Análise', demanda: 'Estoque 3026', bancoCredor: 'CAIXA', agente: '53131', contrato: '9044994401151', hipoteca: '1' },
  { id: '561', nrDoc: '115221_17130237590_50176_0001000617911_1.pdf', cat: 'Validação', status: 'Em Análise Simplificada', demanda: 'BR 2 AF EMGEA C1', bancoCredor: 'UNICARD', agente: '50176', contrato: '0001000617911', hipoteca: '1' },
  { id: '569', nrDoc: '30102_03100447257_00024_0703000104123_1.pdf', cat: 'Pedido Reanálise', status: 'Complementação - Análise', demanda: 'BR 1 AF CAIXA C1', bancoCredor: 'COHAB/SP', agente: '00024', contrato: '0703000104123', hipoteca: '2', pendente: true },
  { id: '985', nrDoc: 'alisson9001318001118_53147_0680006740_47.pdf', cat: '1ª Análise', status: 'Em Análise Simplificada', demanda: '', bancoCredor: 'CAIXA', agente: '53147', contrato: '0680006740', hipoteca: '1' },
  { id: '1482', nrDoc: '15050_10106315887_85035_9908000011711_1.pdf', cat: '', status: 'Complementação - Análise', demanda: '', bancoCredor: 'EMGEA', agente: '85035', contrato: '9908000011711', hipoteca: '1' },
  { id: '1524', nrDoc: '14516_11122043196_52126_0000314504400_1.pdf', cat: '1ª Análise', status: 'Em Análise Simplificada', demanda: '', bancoCredor: 'BANCO DO BRASIL', agente: '52126', contrato: '0000314504400', hipoteca: '1' },
  { id: '1590', nrDoc: '15 - 02103313742_50142_1300000756718_1.pdf', cat: '', status: 'Aguardando Análise', demanda: '', bancoCredor: 'BANCO ITAU', agente: '50142', contrato: '1300000756718', hipoteca: '1', pendente: true },
  { id: '1610', nrDoc: '9kb.pdf15 - 02103545448_50137_0201010007506_7.pdf', cat: 'AJ - Subsídio', status: 'Aguardando Análise', demanda: 'SP AI - PHE/POUPEX 10304152120224013400', bancoCredor: 'SANTANDER', agente: '50137', contrato: '0201010007506', hipoteca: '2', pendente: true },
  { id: '1653', nrDoc: '25340_11115709515_50165_0000000145221_1.pdf', cat: 'AJ - Cumprimento', status: 'Aguardando Análise', demanda: 'SP/BR 1 LOTE 4 INAD/AUDIT', bancoCredor: 'BROOKLYN', agente: '50165', contrato: '0000000145221', hipoteca: '1', pendente: true },
  { id: '1762', nrDoc: '130175_90013186388834_03030_0001740004148_1.pdf', cat: 'Pedido Reanálise', status: 'Aguardando Análise', demanda: 'SP/BR PRIORIDADE GESTÃO GECVS/SUFUS/VIMAR', bancoCredor: 'DATANORTE', agente: '03030', contrato: '0001740004148', hipoteca: '1' },
  { id: '1804', nrDoc: '9001318205531_53131_9044994412078_1.pdf', cat: '1ª Análise', status: 'Aguardando Análise', demanda: 'Estoque 3026', bancoCredor: 'CAIXA', agente: '53131', contrato: '9044994412078', hipoteca: '1', pendente: true },
  { id: '1871', nrDoc: '15062_10106427719_85035_9908000014420_1.pdf', cat: 'Validação', status: 'Complementação - Análise', demanda: 'BR 2 AF EMGEA C1', bancoCredor: 'EMGEA', agente: '85035', contrato: '9908000014420', hipoteca: '1', pendente: true },
  { id: '1926', nrDoc: '14588_11122150734_52126_0000314517725_1.pdf', cat: 'AJ - Subsídio', status: 'Aguardando Análise', demanda: '', bancoCredor: 'BANCO DO BRASIL', agente: '52126', contrato: '0000314517725', hipoteca: '2' },
  { id: '1957', nrDoc: '9001318219904_53147_0680006812_1.pdf', cat: '1ª Análise', status: 'Aguardando Análise', demanda: 'BR 1 AF CAIXA C1', bancoCredor: 'CAIXA', agente: '53147', contrato: '0680006812', hipoteca: '1', pendente: true },
  { id: '2042', nrDoc: '25411_11115833602_50165_0000000151937_1.pdf', cat: 'AJ - Cumprimento', status: 'Em Análise Simplificada', demanda: 'SP/BR 1 LOTE 4 INAD/AUDIT', bancoCredor: 'BROOKLYN', agente: '50165', contrato: '0000000151937', hipoteca: '1', pendente: true },
  { id: '2096', nrDoc: '130212_90013186401127_03030_0001740009316_1.pdf', cat: 'Pedido Reanálise', status: 'Aguardando Análise', demanda: '', bancoCredor: 'DATANORTE', agente: '03030', contrato: '0001740009316', hipoteca: '1' },
];

const ANALYSTS = ['Ana Paula Ribeiro', 'Carlos Henrique Souza', 'Daniel Souza', 'Elvio Trindade'];

type SortDir = 'Todos' | 'Crescente' | 'Decrescente';
type GeneralSortKey = 'id' | 'nrDoc' | 'bolsao' | 'cat' | 'status' | 'bancoCredor';

interface AnalysisQueueBolsoesPageProps {
  onClose: () => void;
}

const AnalysisQueueBolsoesPage: React.FC<AnalysisQueueBolsoesPageProps> = ({ onClose }) => {
  const [bolsoes, setBolsoes] = useState<Bolsao[]>([
    { id: 1, name: 'Novo Bolsão', analysts: ['Ana Paula Ribeiro', 'Carlos Henrique Souza'], docs: BOLSAO_DOCS },
    { id: 2, name: 'Bolsão Teste', analysts: ['Daniel Souza'], docs: [] },
  ]);
  const [selectedBolsaoId, setSelectedBolsaoId] = useState(1);
  const [activeTab, setActiveTab] = useState<'equipe' | 'regras'>('regras');
  const [generalDocs, setGeneralDocs] = useState<QueueDoc[]>(GENERAL_DOCS);
  const [notification, setNotification] = useState<string | null>(null);

  const [showBolsaoFilters, setShowBolsaoFilters] = useState(true);
  const [bolsaoSearch, setBolsaoSearch] = useState('');
  const [bolsaoStatus, setBolsaoStatus] = useState('Todos');
  const [bolsaoSemPastas, setBolsaoSemPastas] = useState(false);
  const [orderAgente, setOrderAgente] = useState<SortDir>('Todos');
  const [orderHipoteca, setOrderHipoteca] = useState<SortDir>('Todos');
  const [orderStatus, setOrderStatus] = useState<SortDir>('Todos');
  const [selectedBolsaoDocIds, setSelectedBolsaoDocIds] = useState<string[]>([]);

  const [showGeneralFilters, setShowGeneralFilters] = useState(true);
  const [generalSearchDraft, setGeneralSearchDraft] = useState('');
  const [generalSearch, setGeneralSearch] = useState('');
  const [generalStatusDraft, setGeneralStatusDraft] = useState('');
  const [generalStatus, setGeneralStatus] = useState('');
  const [generalSemPastasDraft, setGeneralSemPastasDraft] = useState(false);
  const [generalSemPastas, setGeneralSemPastas] = useState(false);
  const [selectedGeneralIds, setSelectedGeneralIds] = useState<string[]>([]);
  const [generalSort, setGeneralSort] = useState<{ key: GeneralSortKey; dir: 'asc' | 'desc' } | null>(null);
  const [returnTarget, setReturnTarget] = useState<{ source: 'bolsao' | 'general'; ids: string[] } | null>(null);
  const closeReturnModal = useCallback(() => setReturnTarget(null), []);

  const selectedBolsao = bolsoes.find(b => b.id === selectedBolsaoId) ?? bolsoes[0];
  const hasPendingOrder = orderAgente !== 'Todos' || orderHipoteca !== 'Todos' || orderStatus !== 'Todos';

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    setSelectedBolsaoDocIds([]);
    setSelectedGeneralIds([]);
    resetOrder();
  }, [selectedBolsaoId]);

  const resetOrder = () => {
    setOrderAgente('Todos');
    setOrderHipoteca('Todos');
    setOrderStatus('Todos');
  };

  const orderedBolsaoDocs = useMemo(() => {
    const docs = [...selectedBolsao.docs];
    const criteria: [keyof QueueDoc, SortDir][] = [
      ['agente', orderAgente],
      ['hipoteca', orderHipoteca],
      ['status', orderStatus],
    ];
    docs.sort((a, b) => {
      for (const [key, dir] of criteria) {
        if (dir === 'Todos') continue;
        const cmp = a[key].localeCompare(b[key], 'pt-BR', { numeric: true });
        if (cmp !== 0) return dir === 'Crescente' ? cmp : -cmp;
      }
      return 0;
    });
    return docs;
  }, [selectedBolsao.docs, orderAgente, orderHipoteca, orderStatus]);

  const visibleBolsaoDocs = useMemo(() => {
    const term = bolsaoSearch.trim().toLowerCase();
    return orderedBolsaoDocs.filter(doc =>
      (!term || doc.id.includes(term) || doc.contrato.toLowerCase().includes(term)) &&
      (bolsaoStatus === 'Todos' || doc.status === bolsaoStatus) &&
      (!bolsaoSemPastas || doc.pendente)
    );
  }, [orderedBolsaoDocs, bolsaoSearch, bolsaoStatus, bolsaoSemPastas]);

  const bolsaoNameByDocId = useMemo(() => {
    const map = new Map<string, string>();
    bolsoes.forEach(b => b.docs.forEach(d => map.set(d.id, b.name)));
    return map;
  }, [bolsoes]);

  const visibleGeneralDocs = useMemo(() => {
    const term = generalSearch.trim().toLowerCase();
    const docs = generalDocs.filter(doc =>
      (!term || [doc.id, doc.nrDoc, doc.demanda, doc.bancoCredor].some(v => v.toLowerCase().includes(term))) &&
      (!generalStatus || generalStatus === 'Todos' || doc.status === generalStatus) &&
      (!generalSemPastas || doc.pendente)
    );
    if (!generalSort) return docs;
    const value = (doc: QueueDoc) => (generalSort.key === 'bolsao' ? bolsaoNameByDocId.get(doc.id) ?? '' : doc[generalSort.key]);
    return [...docs].sort((a, b) => {
      const cmp = value(a).localeCompare(value(b), 'pt-BR', { numeric: true });
      return generalSort.dir === 'asc' ? cmp : -cmp;
    });
  }, [generalDocs, generalSearch, generalStatus, generalSemPastas, generalSort, bolsaoNameByDocId]);

  const updateSelectedBolsao = (fn: (b: Bolsao) => Bolsao) =>
    setBolsoes(prev => prev.map(b => (b.id === selectedBolsao.id ? fn(b) : b)));

  const handleCreateBolsao = () => {
    const id = Math.max(...bolsoes.map(b => b.id)) + 1;
    setBolsoes(prev => [...prev, { id, name: `Novo Bolsão ${id}`, analysts: [], docs: [] }]);
    setSelectedBolsaoId(id);
  };

  const handleDeleteBolsao = () => {
    if (bolsoes.length === 1) return;
    setGeneralDocs(prev => [...prev, ...selectedBolsao.docs]);
    const remaining = bolsoes.filter(b => b.id !== selectedBolsao.id);
    setBolsoes(remaining);
    setSelectedBolsaoId(remaining[0].id);
    setNotification(`Bolsão "${selectedBolsao.name}" excluído.`);
  };

  const handleRemoveDocs = (ids: string[]) => {
    if (ids.length === 0) return;
    const removed = selectedBolsao.docs.filter(d => ids.includes(d.id));
    updateSelectedBolsao(b => ({ ...b, docs: b.docs.filter(d => !ids.includes(d.id)) }));
    setGeneralDocs(prev => [...removed, ...prev]);
    setSelectedBolsaoDocIds(prev => prev.filter(id => !ids.includes(id)));
    setNotification(`${removed.length} dossiê(s) desatribuído(s) de ${selectedBolsao.name}.`);
  };

  const handleAssignSelected = () => {
    const toAssign = generalDocs.filter(d => selectedGeneralIds.includes(d.id));
    if (toAssign.length === 0) return;
    updateSelectedBolsao(b => ({ ...b, docs: [...b.docs, ...toAssign] }));
    setGeneralDocs(prev => prev.filter(d => !selectedGeneralIds.includes(d.id)));
    setSelectedGeneralIds([]);
    setNotification(`${toAssign.length} dossiê(s) atribuído(s) a ${selectedBolsao.name}.`);
  };

  const handleSaveOrder = () => {
    updateSelectedBolsao(b => ({ ...b, docs: orderedBolsaoDocs }));
    resetOrder();
    setNotification('Ordenação salva.');
  };

  const handleSearchGeneral = () => {
    setGeneralSearch(generalSearchDraft);
    setGeneralStatus(generalStatusDraft);
    setGeneralSemPastas(generalSemPastasDraft);
    setSelectedGeneralIds([]);
  };

  const handleClearGeneralFilters = () => {
    setGeneralSearchDraft('');
    setGeneralSearch('');
    setGeneralStatusDraft('');
    setGeneralStatus('');
    setGeneralSemPastasDraft(false);
    setGeneralSemPastas(false);
  };

  const toggleSort = (key: GeneralSortKey) =>
    setGeneralSort(prev => (prev?.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const handleConfirmReturn = () => {
    if (!returnTarget) return;
    const { source, ids } = returnTarget;
    if (source === 'bolsao') {
      updateSelectedBolsao(b => ({ ...b, docs: b.docs.filter(d => !ids.includes(d.id)) }));
      setSelectedBolsaoDocIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setGeneralDocs(prev => prev.filter(d => !ids.includes(d.id)));
      setSelectedGeneralIds(prev => prev.filter(id => !ids.includes(id)));
    }
    setReturnTarget(null);
    setNotification(`${ids.length} ${ids.length === 1 ? 'dossiê devolvido' : 'dossiês devolvidos'} à Gestão Documental.`);
  };

  const allSelectedPending = (docs: QueueDoc[], ids: string[]) =>
    ids.length > 0 && ids.every(id => docs.find(d => d.id === id)?.pendente);

  const allBolsaoSelected = visibleBolsaoDocs.length > 0 && visibleBolsaoDocs.every(d => selectedBolsaoDocIds.includes(d.id));
  const allGeneralSelected = visibleGeneralDocs.length > 0 && visibleGeneralDocs.every(d => selectedGeneralIds.includes(d.id));
  const canReturnBolsao = allSelectedPending(selectedBolsao.docs, selectedBolsaoDocIds);
  const canReturnGeneral = allSelectedPending(generalDocs, selectedGeneralIds);

  return (
    <div className="relative flex h-[calc(100vh-140px)] min-h-[560px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm text-[#1f2d3d]">
      {notification && (
        <div className="absolute top-4 right-14 z-30 rounded-md bg-[#005c9e] px-4 py-2 text-xs font-medium text-white shadow-lg" role="status">
          {notification}
        </div>
      )}

      <header className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
        <div className="border-l-4 border-[#005c9e] pl-3">
          <h1 className="text-lg font-semibold leading-tight text-[#0b2d4a]">Gerenciar Fila e Bolsões</h1>
          <p className="text-xs text-gray-500">Gestor: ANA CARLA PEREIRA LOPES</p>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="Fechar">
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Bolsões sidebar */}
        <aside className="flex w-[25%] min-w-[220px] max-w-[300px] flex-col border-r border-gray-200 bg-[#f7f8fa]">
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" onClick={onClose} className="flex items-center gap-1 text-sm font-medium text-[#0b2d4a] hover:text-[#005c9e]">
              <ChevronLeftIcon className="h-4 w-4" />
              Meus Bolsões
            </button>
            <button
              type="button"
              onClick={handleCreateBolsao}
              className="rounded bg-[#005c9e] p-1.5 text-white hover:bg-[#004a7c]"
              aria-label="Criar bolsão"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="px-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded border border-[#005c9e] bg-white py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#005c9e] hover:bg-[#eef5fb]"
            >
              <ArrowUpDownIcon className="h-3.5 w-3.5" />
              Priorizar bolsões
            </button>
          </div>
          <ul className="mt-3 flex-1 space-y-2 overflow-y-auto px-0 pb-3">
            {bolsoes.map(b => {
              const isSelected = b.id === selectedBolsao.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedBolsaoId(b.id)}
                    className={`flex w-full items-start justify-between gap-2 bg-white px-4 py-3 text-left shadow-sm transition-colors ${
                      isSelected ? 'border-l-4 border-[#005c9e]' : 'border-l-4 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-medium ${isSelected ? 'text-[#005c9e]' : 'text-[#0b2d4a]'}`}>{b.name}</span>
                      <span className="block text-[11px] text-gray-400">
                        {b.analysts.length} {b.analysts.length === 1 ? 'analista' : 'analistas'} • {b.docs.length} {b.docs.length === 1 ? 'dossiê' : 'dossiês'}
                      </span>
                    </span>
                    <PencilSquareIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#005c9e]" />
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Bolsão detail */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="px-5 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Nome do bolsão</p>
                <h2 className="text-xl font-bold text-[#0b2d4a]">{selectedBolsao.name}</h2>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <button type="button" className="flex items-center gap-1 text-[#005c9e] hover:underline">
                  <UploadIcon className="h-3.5 w-3.5" />
                  Upload lote dossiês
                </button>
                <button
                  type="button"
                  onClick={handleDeleteBolsao}
                  disabled={bolsoes.length === 1}
                  className="flex items-center gap-1 text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                  Excluir Bolsão
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-6 border-b border-gray-200 text-sm">
              <TabButton active={activeTab === 'equipe'} onClick={() => setActiveTab('equipe')} icon={<UsersIcon className="h-4 w-4" />}>
                Equipe ({selectedBolsao.analysts.length})
              </TabButton>
              <TabButton active={activeTab === 'regras'} onClick={() => setActiveTab('regras')} icon={<FileTextIcon className="h-4 w-4" />}>
                Regras de Distribuição Dossiês
              </TabButton>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#f7f8fa] px-5 py-4">
            {activeTab === 'equipe' ? (
              <EquipeTab
                analysts={selectedBolsao.analysts}
                onAdd={name => updateSelectedBolsao(b => ({ ...b, analysts: [...b.analysts, name] }))}
                onRemove={name => updateSelectedBolsao(b => ({ ...b, analysts: b.analysts.filter(a => a !== name) }))}
              />
            ) : (
              <div className="space-y-4">
                {/* Documentos disponíveis no bolsão */}
                <section className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0b2d4a]">
                      Documentos disponíveis ({selectedBolsao.docs.length})
                    </h3>
                    <div className="flex gap-2">
                      {canReturnBolsao && (
                        <ReturnToGDButton onClick={() => setReturnTarget({ source: 'bolsao', ids: selectedBolsaoDocIds })} count={selectedBolsaoDocIds.length} />
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedBolsaoDocIds(allBolsaoSelected ? [] : visibleBolsaoDocs.map(d => d.id))}
                        className="rounded bg-[#005c9e] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#004a7c]"
                      >
                        {allBolsaoSelected ? 'Limpar seleção' : 'Selecionar todos'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocs(selectedBolsaoDocIds.length ? selectedBolsaoDocIds : selectedBolsao.docs.map(d => d.id))}
                        disabled={selectedBolsao.docs.length === 0}
                        className="flex items-center gap-1 rounded border border-red-400 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <TrashIcon className="h-3 w-3" />
                        {selectedBolsaoDocIds.length ? `Desatribuir (${selectedBolsaoDocIds.length})` : 'Desatribuir todos'}
                      </button>
                    </div>
                  </div>

                  <FilterToggle open={showBolsaoFilters} onToggle={() => setShowBolsaoFilters(v => !v)} />

                  {showBolsaoFilters && (
                    <div className="mt-2 grid grid-cols-12 gap-3">
                      <Field className="col-span-12 md:col-span-4" label="Buscar dossiê / contrato" hint="(filtro)">
                        <div className="relative">
                          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <input
                            value={bolsaoSearch}
                            onChange={e => setBolsaoSearch(e.target.value)}
                            placeholder="ID ou Contrato"
                            className={`${inputClass} pl-8`}
                          />
                        </div>
                      </Field>
                      <Field className="col-span-6 md:col-span-2 md:border-r md:border-gray-200 md:pr-3" label="Status" hint="(filtro)">
                        <Select value={bolsaoStatus} onChange={setBolsaoStatus} options={['Todos', 'Em análise simplificada']} />
                      </Field>
                      <Field className="col-span-6 md:col-span-2" label="Agente financeiro" hint="(ordenação)">
                        <Select value={orderAgente} onChange={v => setOrderAgente(v as SortDir)} options={['Todos', 'Crescente', 'Decrescente']} />
                      </Field>
                      <Field className="col-span-6 md:col-span-2" label="Hipoteca" hint="(ordenação)">
                        <Select
                          value={orderHipoteca === 'Todos' ? 'Todas' : orderHipoteca}
                          onChange={v => setOrderHipoteca(v === 'Todas' ? 'Todos' : (v as SortDir))}
                          options={['Todas', 'Crescente', 'Decrescente']}
                        />
                      </Field>
                      <Field className="col-span-6 md:col-span-2" label="Status" hint="(ordenação)">
                        <Select value={orderStatus} onChange={v => setOrderStatus(v as SortDir)} options={['Todos', 'Crescente', 'Decrescente']} />
                      </Field>
                      <div className="col-span-12 flex">
                        <SemPastasObrigatoriasFilter compact checked={bolsaoSemPastas} onChange={setBolsaoSemPastas} />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{visibleBolsaoDocs.length} de {selectedBolsao.docs.length} documentos</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveOrder}
                        disabled={!hasPendingOrder}
                        className="rounded bg-[#005c9e] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#004a7c] disabled:cursor-not-allowed disabled:bg-[#9cc0dc]"
                      >
                        Salvar ordenação
                      </button>
                      <button
                        type="button"
                        onClick={resetOrder}
                        disabled={!hasPendingOrder}
                        className="rounded bg-gray-100 px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        Desfazer
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 overflow-x-auto rounded border border-gray-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-white text-[10px] uppercase tracking-wide text-gray-500">
                        <tr className="border-b border-gray-200">
                          <th className="w-10 px-3 py-2.5" />
                          {['ID', 'Agente financeiro', 'Contrato', 'Hipoteca', 'Status'].map(h => (
                            <th key={h} className="px-3 py-2.5 text-left font-semibold">
                              <span className="inline-flex items-center gap-1">{h}<ArrowUpDownIcon className="h-3 w-3 text-gray-300" /></span>
                            </th>
                          ))}
                          <th className="px-3 py-2.5 text-center font-semibold">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {visibleBolsaoDocs.map(doc => (
                          <tr key={doc.id} className={selectedBolsaoDocIds.includes(doc.id) ? 'bg-[#eef5fb]' : 'hover:bg-gray-50'}>
                            <td className="px-3 py-2.5">
                              <Checkbox
                                checked={selectedBolsaoDocIds.includes(doc.id)}
                                onChange={() => setSelectedBolsaoDocIds(prev => toggle(prev, doc.id))}
                                label={`Selecionar dossiê ${doc.id}`}
                              />
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-[#005c9e]">
                              <DocIdCell doc={doc} />
                            </td>
                            <td className="px-3 py-2.5">{doc.agente}</td>
                            <td className="px-3 py-2.5">{doc.contrato}</td>
                            <td className="px-3 py-2.5">{doc.hipoteca}</td>
                            <td className="px-3 py-2.5">
                              <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                {doc.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveDocs([doc.id])}
                                className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                aria-label={`Desatribuir dossiê ${doc.id}`}
                              >
                                <CloseIcon className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {visibleBolsaoDocs.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                              {selectedBolsao.docs.length === 0
                                ? 'Nenhum dossiê neste bolsão. Selecione documentos na lista abaixo para atribuir.'
                                : bolsaoSemPastas
                                  ? 'Nenhum dossiê sem pastas Inicial_I e Recursos_R neste bolsão.'
                                  : 'Nenhum dossiê corresponde aos filtros.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Filtros gerais */}
                <section className="rounded-md border border-gray-200 bg-white p-4">
                  <FilterToggle open={showGeneralFilters} onToggle={() => setShowGeneralFilters(v => !v)} />

                  {showGeneralFilters && (
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[240px] flex-1">
                          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <input
                            value={generalSearchDraft}
                            onChange={e => setGeneralSearchDraft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearchGeneral()}
                            placeholder="Buscar documentos"
                            className={`${inputClass} pl-8`}
                          />
                        </div>
                        <SemPastasObrigatoriasFilter compact checked={generalSemPastasDraft} onChange={setGeneralSemPastasDraft} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Grupo Credor"><Select placeholder="Grupo Credor" options={['CAIXA', 'EMGEA', 'COHAB/SP']} /></Field>
                        <Field label="Agente Financeiro"><Select placeholder="Agente Financeiro" options={[]} disabled /></Field>
                        <Field label="Hipoteca"><input placeholder="Hipoteca" className={inputClass} /></Field>
                        <Field label="FH 1/2/3"><Select placeholder="FH 1/2/3" options={['FH1', 'FH2', 'FH3']} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                        <Field label="Categoria"><Select placeholder="Categoria" options={['1ª Análise', 'Pedido Reanálise', 'Validação']} /></Field>
                        <Field label="Status">
                          <Select
                            placeholder="Status"
                            value={generalStatusDraft}
                            onChange={setGeneralStatusDraft}
                            options={['Aguardando Análise', 'Em Análise Simplificada', 'Complementação - Análise']}
                          />
                        </Field>
                        <Field label="Nome do Mutuário"><input placeholder="Nome do Mutuário" className={inputClass} /></Field>
                        <Field label="Tipo de Evento"><Select placeholder="Tipo de Evento" options={['L10', 'L13', 'TPZ']} /></Field>
                        <Field label="OR"><Select placeholder="OR" options={['11', '32']} /></Field>
                        <Field label="Plano de Reajustamento"><Select placeholder="Plano de Reajustamento" options={['EQ1', 'PES']} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="%CEF"><input placeholder="%CEF" className={inputClass} /></Field>
                        <Field label="IM"><Select placeholder="IM" options={['00', '07', '08']} /></Field>
                        <Field label="Indicador de Cessão"><Select placeholder="Indicador de Cessão" options={['Sim', 'Não']} /></Field>
                        <Field label="Demandas"><Select placeholder="Demandas" options={['Estoque 3026', 'BR 1 AF CAIXA C1']} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Código FH2"><input placeholder="Código FH2" className={inputClass} /></Field>
                        <Field label="Data assinatura (início)"><input type="date" className={inputClass} /></Field>
                        <Field label="até"><input type="date" className={inputClass} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Field label="Liberação da GD"><input type="date" className={inputClass} /></Field>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleClearGeneralFilters}
                          className="flex items-center gap-1.5 rounded border border-red-400 bg-white px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                        >
                          <FilterIcon className="h-3.5 w-3.5" />
                          Limpar Filtros
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotification('Filtros salvos para este bolsão.')}
                          className="flex items-center gap-1.5 rounded border border-[#005c9e] bg-white px-3 py-2 text-[11px] font-semibold text-[#005c9e] hover:bg-[#eef5fb]"
                        >
                          <span aria-hidden className="text-sm leading-none">≡</span>
                          Salvar Filtros
                        </button>
                        <button
                          type="button"
                          onClick={handleSearchGeneral}
                          className="flex items-center gap-1.5 rounded bg-[#005c9e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004a7c]"
                        >
                          <SearchIcon className="h-3.5 w-3.5" />
                          Buscar Documentos
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Listagem geral */}
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-[#0b2d4a]">
                      <Checkbox
                        checked={allGeneralSelected}
                        onChange={() => setSelectedGeneralIds(allGeneralSelected ? [] : visibleGeneralDocs.map(d => d.id))}
                        label="Selecionar todos"
                      />
                      Selecionar todos
                    </label>
                    {selectedGeneralIds.length > 0 && (
                      <div className="flex gap-2">
                        {canReturnGeneral && (
                          <ReturnToGDButton onClick={() => setReturnTarget({ source: 'general', ids: selectedGeneralIds })} count={selectedGeneralIds.length} />
                        )}
                        <button
                          type="button"
                          onClick={handleAssignSelected}
                          className="rounded bg-[#005c9e] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#004a7c]"
                        >
                          Atribuir a {selectedBolsao.name} ({selectedGeneralIds.length})
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
                    <table className="min-w-[1100px] w-full text-[11px]">
                      <thead className="text-[10px] uppercase tracking-wide text-gray-500">
                        <tr className="border-b border-gray-200">
                          <th className="w-10 px-3 py-3" />
                          {([
                            ['id', 'ID'],
                            ['nrDoc', 'Nr. Doc.'],
                            ['bolsao', 'Bolsão'],
                            ['cat', 'Cat.'],
                            ['status', 'Status'],
                          ] as [GeneralSortKey, string][]).map(([key, label]) => (
                            <th key={key} className="px-3 py-3 text-left font-semibold">
                              <button type="button" onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 uppercase hover:text-[#005c9e]">
                                {label}
                                <SortIndicator active={generalSort?.key === key} dir={generalSort?.dir} />
                              </button>
                            </th>
                          ))}
                          <th className="px-3 py-3 text-left font-semibold">Demanda</th>
                          <th className="px-3 py-3 text-left font-semibold">
                            <button type="button" onClick={() => toggleSort('bancoCredor')} className="inline-flex items-center gap-1 uppercase hover:text-[#005c9e]">
                              Banco credor
                              <SortIndicator active={generalSort?.key === 'bancoCredor'} dir={generalSort?.dir} />
                            </button>
                          </th>
                          <th className="px-3 py-3 text-left font-semibold">Ag. financeiro</th>
                          <th className="px-3 py-3 text-left font-semibold">Contrato</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#1f2d3d]">
                        {visibleGeneralDocs.map(doc => {
                          const isSelected = selectedGeneralIds.includes(doc.id);
                          return (
                            <tr
                              key={doc.id}
                              onClick={() => setSelectedGeneralIds(prev => toggle(prev, doc.id))}
                              className={`cursor-pointer ${isSelected ? 'bg-[#eef5fb]' : 'hover:bg-gray-50'}`}
                            >
                              <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => setSelectedGeneralIds(prev => toggle(prev, doc.id))}
                                  label={`Selecionar dossiê ${doc.id}`}
                                />
                              </td>
                              <td className="px-3 py-2.5"><DocIdCell doc={doc} /></td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{doc.nrDoc}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{bolsaoNameByDocId.get(doc.id) ?? ''}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{doc.cat}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{doc.status}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{doc.demanda}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{doc.bancoCredor}</td>
                              <td className="px-3 py-2.5">{doc.agente}</td>
                              <td className="px-3 py-2.5">{doc.contrato}</td>
                            </tr>
                          );
                        })}
                        {visibleGeneralDocs.length === 0 && (
                          <tr>
                            <td colSpan={10} className="px-3 py-8 text-center text-gray-500">
                              Nenhum documento encontrado. Ajuste os filtros e clique em Buscar Documentos.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>

      <ReturnToGDModal
        isOpen={returnTarget !== null}
        dossierIds={returnTarget?.ids ?? []}
        onClose={closeReturnModal}
        onConfirm={handleConfirmReturn}
      />
    </div>
  );
};

const inputClass =
  'w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#005c9e] focus:outline-none focus:ring-1 focus:ring-[#005c9e] disabled:bg-gray-100 disabled:text-gray-400';

const DocIdCell: React.FC<{ doc: QueueDoc }> = ({ doc }) => (
  <span className="inline-flex items-center gap-1.5">
    {doc.id}
    {doc.pendente && (
      <span className="text-amber-600" title="Pastas obrigatórias Inicial_I e Recursos_R ausentes">
        <AlertTriangleIcon className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">Pastas obrigatórias Inicial_I e Recursos_R ausentes</span>
      </span>
    )}
  </span>
);

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ active, onClick, icon, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`-mb-px flex items-center gap-2 border-b-2 pb-2.5 font-medium transition-colors ${
      active ? 'border-[#005c9e] text-[#005c9e]' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    {children}
  </button>
);

const FilterToggle: React.FC<{ open: boolean; onToggle: () => void }> = ({ open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#005c9e] hover:underline"
  >
    <FilterIcon className="h-3.5 w-3.5" />
    {open ? 'Ocultar Filtros' : 'Mostrar Filtros'}
    {open ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
  </button>
);

const Field: React.FC<{ label: string; hint?: string; className?: string; children: React.ReactNode }> = ({ label, hint, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-[10px] text-gray-500">
      {hint ? <span className="font-semibold uppercase tracking-wide">{label}</span> : label}
      {hint && <span className="ml-1 text-[9px] uppercase text-gray-400">{hint}</span>}
    </span>
    {children}
  </label>
);

const Select: React.FC<{
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ options, value, onChange, placeholder, disabled }) => {
  const valueProps = value === undefined ? { defaultValue: '' } : { value };
  return (
    <div className="relative">
      <select
        {...valueProps}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        className={`${inputClass} appearance-none pr-7`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
    </div>
  );
};

const Checkbox: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    aria-label={label}
    className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-[#005c9e] focus:ring-[#005c9e]"
  />
);

const SortIndicator: React.FC<{ active: boolean; dir?: 'asc' | 'desc' }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDownIcon className="h-3 w-3 text-gray-300" />;
  return dir === 'asc' ? <ChevronUpIcon className="h-3 w-3 text-[#005c9e]" /> : <ChevronDownIcon className="h-3 w-3 text-[#005c9e]" />;
};

const EquipeTab: React.FC<{ analysts: string[]; onAdd: (name: string) => void; onRemove: (name: string) => void }> = ({ analysts, onAdd, onRemove }) => {
  const available = ANALYSTS.filter(a => !analysts.includes(a));
  const [toAdd, setToAdd] = useState('');

  return (
    <section className="rounded-md border border-gray-200 bg-white p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0b2d4a]">Analistas do bolsão ({analysts.length})</h3>
      <div className="mt-3 flex gap-2">
        <div className="flex-1">
          <Select placeholder="Selecione um analista" options={available} value={toAdd} onChange={setToAdd} />
        </div>
        <button
          type="button"
          disabled={!toAdd}
          onClick={() => { onAdd(toAdd); setToAdd(''); }}
          className="rounded bg-[#005c9e] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#004a7c] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Adicionar
        </button>
      </div>
      <ul className="mt-3 divide-y divide-gray-100 rounded border border-gray-200">
        {analysts.map(a => (
          <li key={a} className="flex items-center justify-between px-3 py-2.5 text-xs">
            {a}
            <button type="button" onClick={() => onRemove(a)} className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label={`Remover ${a}`}>
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {analysts.length === 0 && <li className="px-3 py-6 text-center text-xs text-gray-500">Nenhum analista neste bolsão. Adicione um analista acima.</li>}
      </ul>
    </section>
  );
};

export default AnalysisQueueBolsoesPage;

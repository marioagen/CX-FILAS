
import React, { useState, useMemo } from 'react';
import { User, Document } from '../types';
import { CloseIcon, SearchIcon, TrashIcon, ChevronDownIcon, CalendarIcon, ResetIcon, DownloadIcon, UploadIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ListIcon, LayoutGridIcon } from './Icons';
import MultiSelect from './MultiSelect';

interface DocumentAssignmentProps {
  user: User;
  onBack: () => void;
}

const assignedDocsData = [
    { id: '535', name: '02105164179_00024_1304001403211_1.pdf' },
    { id: '536', name: '05114601576_24_2904000702413_1.pdf' },
    { id: '542', name: '97101_9001319718908_00024_1347000904229_1.pdf' },
];

const availableDocsData: Document[] = [
    { id: '472', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Simplificada', stat: 'Em Análise (Simplificada)', dtAssin: '18/06/1986 00:00:00', mut: 'DORIA VANIA NUNES BARBOSA LIMA', tipoEvt: 'L13', or: '32', planReaj: 'EQ1 1 P 01 CTP', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
    { id: '472-2', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Simplificada', stat: 'Em Análise (Simplificada)', dtAssin: '18/06/1986 00:00:00', mut: 'DORIA VANIA NUNES BARBOSA LIMA', tipoEvt: 'L13', or: '32', planReaj: 'EQ1 1 P 01 CTP', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Prioritário' },
    { id: '474', nrDoc: '9001318223195_85058_9923810062231_1.pdf', cat: 'Completa', stat: 'Em Análise (Completa)', dtAssin: '13/09/1984 00:00:00', mut: 'MARICELIA MORAIS FREITAS', tipoEvt: 'L13', or: '32', planReaj: 'PES A 4 A 07 SMH', im: '08', fh2: 'Não', fh3: 'Sim', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Guilherme Calabresi', bolsao: 'Bolsão Análise Simples' },
    { id: '543', nrDoc: '71657_9001319854844_22001_0008020420670_1.pdf', cat: 'Simplificada', stat: '1ª Análise', dtAssin: '01/09/1988 00:00:00', mut: 'ROSANGELA FERREIRA DE LIMA', tipoEvt: 'L10', or: '32', planReaj: 'EQ1 1 P 06 CTP', im: '07', fh2: 'Não', fh3: 'Não', cess: 'Não', cef: '0910', codigoFh2: 'Código FH2', gestor: 'Celeste Mayumi Teraoka Garcia', bolsao: 'Bolsão Minas Gerais' },
    { id: '546', nrDoc: '32138_10104932667_85053_9948000312011_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '20/06/1983 00:00:00', mut: 'AROLDO GUEDES DA CUNHA', tipoEvt: 'L13', or: '32', planReaj: 'PES 1 A 04 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '546-2', nrDoc: '32138_10104932667_85053_9948000312011_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '20/06/1983 00:00:00', mut: 'AROLDO GUEDES DA CUNHA', tipoEvt: 'L13', or: '32', planReaj: 'PES 1 A 04 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '1000', codigoFh2: 'Código FH2', gestor: 'Tarsila Correa', bolsao: 'Bolsão RJ Capital' },
    { id: '547', nrDoc: '41801_9001108341627_43521_7001078400003_1.pdf', cat: 'Simplificada', stat: 'Pedido Reanálise', dtAssin: '31/03/1981 00:00:00', mut: 'HUMBERTO CARDOZO DE SOUZA', tipoEvt: 'TPZ', or: '11', planReaj: 'PES 1 A 01 UPC', im: '00', fh2: 'Não', fh3: 'Não', cess: 'Sim', cef: '0000', codigoFh2: 'Código FH2', gestor: 'Celeste Mayumi Teraoka Garcia', bolsao: 'Bolsão Minas Gerais' },
];

type SortKey = keyof Document | 'filaOrigem';
type SortDirection = 'asc' | 'desc';

const DocumentAssignment: React.FC<DocumentAssignmentProps> = ({ user, onBack }) => {
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDirection }>({ key: 'id', direction: 'asc' });
    
    const grupoCredorOptions = [ 'Bancos Privados', 'COHAB', 'CAIXA', 'Entes Públicos', 'Liquidandas', 'Outros' ];
    const agenteFinanceiroOptions = [ '22000 - BANCO UBS PACTUAL / PREVISUL', '22001 - BANCO ITAÚ / BANESTADO', '50013 - BANCO DE CRÉITO NACIONAL S/A - BCN S/A', '50048 - BANCO SANTANDER BRASIL S/A', '50137 - BANCO REAL S/A' ];
    const categoriaOptions = [ 'AJ - Cumprimento', 'AJ - Subsídio', 'Pedidos GECVS', 'Ofício Vencido', 'Pedido AF', 'Reanálise (Inadequado AUDIR)' ];

    const sortedDocs = useMemo(() => {
        let sortableItems = [...availableDocsData];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue: string | number | undefined;
                let bValue: string | number | undefined;

                if (sortConfig.key === 'filaOrigem') {
                    aValue = a.gestor && a.bolsao ? `${a.gestor} > ${a.bolsao}` : '';
                    bValue = b.gestor && b.bolsao ? `${b.gestor} > ${b.bolsao}` : '';
                } else {
                    const key = sortConfig.key as keyof Document;
                    aValue = a[key];
                    bValue = b[key];
                }

                if (aValue === undefined || bValue === undefined) return 0;
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [sortConfig]);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full flex flex-col">
            <header className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Documentos para {user.nomeCompleto}</h2>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </header>

            <main className="flex-grow p-6 overflow-y-auto space-y-6 bg-gray-50">
                {/* Documentos Atribuidos */}
                <div className="bg-white p-4 rounded-md border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Documentos Atribuídos</h3>
                        <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-red-700">
                            <TrashIcon className="h-4 w-4" />
                            <span>Desatribuir todos</span>
                        </button>
                    </div>
                    <div className="flex items-center border rounded-md mb-4">
                         <input type="text" placeholder="Buscar documentos..." className="w-full p-2 pl-3 focus:outline-none bg-gray-100 rounded-l-md text-gray-800 placeholder-gray-500"/>
                         <button className="bg-blue-600 text-white p-2.5 rounded-r-md m-[-1px] border border-blue-600"><SearchIcon className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-2">
                        {assignedDocsData.map(doc => (
                            <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-md text-sm text-gray-800">
                                <span><span className="font-bold">{doc.id}</span> - {doc.name}</span>
                                <button className="text-gray-500 hover:text-red-600"><CloseIcon className="h-5 w-5"/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lista de Documentos */}
                <div className="bg-white p-4 rounded-md border">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Lista de documentos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 text-sm mb-4">
                        <div className="col-span-full">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input type="text" placeholder="Buscar documentos..." className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500"/>
                             </div>
                        </div>
                        <div className="lg:col-span-3"><MultiSelect label="Grupo Credor" options={grupoCredorOptions} /></div>
                        <div className="lg:col-span-3"><MultiSelect label="Agente Financeiro" options={agenteFinanceiroOptions} /></div>
                        <div className="lg:col-span-3"><SelectInput label="Hipoteca" /></div>
                        <div className="lg:col-span-3"><SelectInput label="FH 1/2/3" /></div>
                        
                        <div className="lg:col-span-2"><MultiSelect label="Categoria" options={categoriaOptions} /></div>
                        <div className="lg:col-span-2"><SelectInput label="Status" /></div>
                        <div className="lg:col-span-2"><TextInput label="Nome do Mutuário" /></div>
                        <div className="lg:col-span-2"><TextInput label="Tipo de Evento" /></div>
                        <div className="lg:col-span-2"><TextInput label="OR" /></div>
                        <div className="lg:col-span-2"><TextInput label="Plano de Reajustamento" /></div>

                        <div className="lg:col-span-3"><TextInput label="%CEF" /></div>
                        <div className="lg:col-span-3"><TextInput label="IM" /></div>
                        <div className="lg:col-span-3"><SelectInput label="Indicador de Cessão" /></div>
                        <div className="lg:col-span-3"><TextInput label="Código FH2" /></div>

                        <div className="lg:col-span-4"><DateInput label="Data assinatura" /></div>
                        <div className="lg:col-span-4"><DateInput label="até" /></div>
                        <div className="lg:col-span-4"><DateInput label="Liberação da GD" /></div>
                        
                        <div className="col-span-full flex justify-end items-end space-x-2">
                            <ActionButton icon={<SearchIcon className="h-5 w-5" />} color="blue" />
                            <ActionButton icon={<ResetIcon className="h-5 w-5" />} color="gray" />
                            <ActionButton icon={<DownloadIcon className="h-5 w-5" />} color="green" />
                            <ActionButton icon={<UploadIcon className="h-5 w-5" />} color="green" />
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <div className="flex items-center">
                                <input type="checkbox" id="select-all" className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                                <label htmlFor="select-all" className="ml-2 font-medium text-gray-700">Selecionar todos</label>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Visualização em Tabela">
                                    <ListIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => setViewMode('card')} className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Visualização em Cards">
                                    <LayoutGridIcon className="h-5 w-5" />
                                </button>
                                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <span>Mostrar:</span>
                                    <SelectInput options={['Todos', '10', '25', '50']} defaultValue="Todos" />
                                    <span>itens</span>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'table' ? (
                            <DocumentTable documents={sortedDocs} sortConfig={sortConfig} onSort={handleSort} />
                        ) : (
                            <div className="space-y-3">
                                {sortedDocs.map(doc => <DocumentItem key={doc.id} doc={doc} />)}
                            </div>
                        )}

                         <div className="mt-4 flex justify-center items-center space-x-1">
                            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500"><ChevronLeftIcon className="h-5 w-5"/></button>
                            <button className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white">1</button>
                            <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">2</button>
                            <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">3</button>
                            <button className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">4</button>
                            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500"><ChevronRightIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="flex justify-end items-center p-4 border-t bg-white">
                <button onClick={onBack} className="bg-gray-500 text-white px-6 py-2 rounded-md mr-4 hover:bg-gray-600">Cancelar</button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Atribuir</button>
            </footer>
        </div>
    );
};

const tableHeaders: { key: SortKey; label: string; className?: string }[] = [
    { key: 'id', label: 'Id' }, 
    { key: 'nrDoc', label: 'Nr. Doc.', className: 'min-w-[250px]' }, 
    { key: 'filaOrigem', label: 'Fila de Origem', className: 'min-w-[250px]' },
    { key: 'cat', label: 'Cat.' }, 
    { key: 'stat', label: 'Status' }, 
    { key: 'dtAssin', label: 'Dt. Assinatura', className: 'min-w-[140px]' }, 
    { key: 'mut', label: 'Mutuário', className: 'min-w-[200px]' }, 
    { key: 'tipoEvt', label: 'Tipo Evt.' }, 
    { key: 'or', label: 'OR' }, 
    { key: 'planReaj', label: 'Plano Reaj.', className: 'min-w-[120px]' }, 
    { key: 'im', label: 'IM' }, 
    { key: 'fh2', label: 'FH2' }, 
    { key: 'fh3', label: 'FH3' }, 
    { key: 'cess', label: 'Cess.' }, 
    { key: 'cef', label: '%CEF' }
];

const DocumentTable: React.FC<{ documents: Document[]; sortConfig: { key: SortKey | null; direction: SortDirection }; onSort: (key: SortKey) => void; }> = ({ documents, sortConfig, onSort }) => {
    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) return <ChevronDownIcon className="h-3 w-3 text-gray-300" />;
        if (sortConfig.direction === 'asc') return <ChevronUpIcon className="h-3 w-3" />;
        return <ChevronDownIcon className="h-3 w-3" />;
    };
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left">
                           <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                        </th>
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key} scope="col" onClick={() => onSort(key)} className={`px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${className ?? ''}`}>
                                <div className="flex items-center space-x-1">
                                    <span>{label}</span>
                                    {getSortIcon(key)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"/></td>
                            {tableHeaders.map(({key}) => {
                                if (key === 'filaOrigem') {
                                    return <td key={`${doc.id}-${key}`} className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.gestor && doc.bolsao ? `${doc.gestor} > ${doc.bolsao}` : ''}</td>;
                                }
                                return <td key={`${doc.id}-${key}`} className="px-4 py-3 whitespace-nowrap text-gray-700">{doc[key as keyof Document]}</td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TextInput: React.FC<{ label?: string }> = ({ label }) => (
    <div>
        {label && <label className="block text-gray-500 mb-1">{label}</label>}
        <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800" />
    </div>
);

const SelectInput: React.FC<{ label?: string, options?: string[], defaultValue?: string }> = ({ label, options=['Opção 1', 'Opção 2'], defaultValue }) => (
     <div>
        {label && <label className="block text-gray-500 mb-1">{label}</label>}
        <div className="relative">
            <select defaultValue={defaultValue} className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-gray-100 text-gray-800">
                {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-4 w-4"/>
            </div>
        </div>
    </div>
);

const DateInput: React.FC<{label?: string}> = ({label}) => (
     <div className="w-full">
        {label && <label className="block text-gray-500 mb-1">{label}</label>}
        <div className="relative">
             <input type="text" placeholder="dd/mm/aaaa" className="w-full p-2 border border-gray-300 rounded-md pr-10 bg-gray-100 text-gray-800 placeholder-gray-500" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <CalendarIcon className="h-5 w-5"/>
            </div>
        </div>
     </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode, color: 'blue' | 'gray' | 'green' }> = ({ icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        gray: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        green: 'bg-green-500 hover:bg-green-600 text-white',
    };
    return (
        <button className={`p-2 rounded-md ${colorClasses[color]}`}>{icon}</button>
    )
};

const DocumentItem: React.FC<{doc: Document}> = ({ doc }) => {
    return (
        <div className="border rounded-md p-3 flex items-start space-x-3 text-xs text-gray-600">
            <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"/>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-blue-600">Id: {doc.id}</span></p>
                <p><span className="font-semibold text-gray-800">Nr. Doc.:</span> {doc.nrDoc}</p>
                {doc.gestor && doc.bolsao && (
                    <p className="col-span-full"><span className="font-semibold text-gray-800">Fila de Origem:</span> {doc.gestor} &gt; {doc.bolsao}</p>
                )}
                <p><span className="font-semibold text-gray-800">Cat.:</span> {doc.cat}</p>
                <p><span className="font-semibold text-gray-800">Stat.:</span> {doc.stat}</p>
                <p><span className="font-semibold text-gray-800">Dt. assin.:</span> {doc.dtAssin}</p>
                <p className="col-span-1 sm:col-span-2"><span className="font-semibold text-gray-800">Mut.:</span> {doc.mut}</p>
                <p><span className="font-semibold text-gray-800">Tipo evt.:</span> {doc.tipoEvt}</p>
                <p><span className="font-semibold text-gray-800">OR:</span> {doc.or}</p>
                <p><span className="font-semibold text-gray-800">Plan. reaj.:</span> {doc.planReaj}</p>
                <p><span className="font-semibold text-gray-800">IM:</span> {doc.im}</p>
                <p><span className="font-semibold text-gray-800">FH2:</span> {doc.fh2}</p>
                <p><span className="font-semibold text-gray-800">FH3:</span> {doc.fh3}</p>
                <p><span className="font-semibold text-gray-800">Cess.:</span> {doc.cess}</p>
                <p><span className="font-semibold text-gray-800">Cef:</span> {doc.cef}</p>
                <p><span className="font-semibold text-gray-800">{doc.codigoFh2}</span></p>
            </div>
        </div>
    )
};

export default DocumentAssignment;

import React, { useState } from 'react';
import { Manager, User } from '../types';
import { CloseIcon, SearchIcon, ChevronDownIcon, CalendarIcon, ResetIcon, PlusIcon, TrashIcon, UsersIcon, FileTextIcon } from './Icons';

interface QueueManagementProps {
  manager: Manager;
  onBack: () => void;
}

interface Bolsao {
    id: number;
    name: string;
    userIds: string[]; // List of user matriculas
}

const QueueManagement: React.FC<QueueManagementProps> = ({ manager, onBack }) => {
    const [bolsoes, setBolsoes] = useState<Bolsao[]>([
        { id: 1, name: 'Bolsão Prioritário', userIds: [manager.users[0]?.matricula].filter(Boolean) },
        { id: 2, name: 'Bolsão Análise Simples', userIds: [] }
    ]);
    const [selectedBolsaoId, setSelectedBolsaoId] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<'users' | 'filters'>('users');

    const selectedBolsao = bolsoes.find(b => b.id === selectedBolsaoId);

    // Helpers
    const handleCreateBolsao = () => {
        const newId = Math.max(...bolsoes.map(b => b.id), 0) + 1;
        const newBolsao: Bolsao = { id: newId, name: `Novo Bolsão ${newId}`, userIds: [] };
        setBolsoes([...bolsoes, newBolsao]);
        setSelectedBolsaoId(newId);
        setActiveTab('users');
    };

    const handleDeleteBolsao = (id: number) => {
        if (bolsoes.length === 1) return; // Prevent deleting last one for this demo
        const newBolsoes = bolsoes.filter(b => b.id !== id);
        setBolsoes(newBolsoes);
        if (selectedBolsaoId === id) {
            setSelectedBolsaoId(newBolsoes[0].id);
        }
    };

    const handleUpdateName = (name: string) => {
        setBolsoes(bolsoes.map(b => b.id === selectedBolsaoId ? { ...b, name } : b));
    };

    const handleAddUser = (matricula: string) => {
        if (!selectedBolsao) return;
        // Remove user from other bolsoes first to ensure 1-to-1 relationship
        const updatedBolsoes = bolsoes.map(b => {
            if (b.id === selectedBolsaoId) {
                return { ...b, userIds: [...b.userIds, matricula] };
            } else {
                return { ...b, userIds: b.userIds.filter(id => id !== matricula) };
            }
        });
        setBolsoes(updatedBolsoes);
    };

    const handleRemoveUser = (matricula: string) => {
        setBolsoes(bolsoes.map(b => b.id === selectedBolsaoId ? { ...b, userIds: b.userIds.filter(id => id !== matricula) } : b));
    };

    // Calculate available users (users currently in OTHER bolsoes are technically available to be moved, but we might want to visually indicate where they are)
    // For the dropdown, let's show all users under this manager, but indicate their current status.
    const getAvailableUsersForDropdown = () => {
        return manager.users.filter(u => !selectedBolsao?.userIds.includes(u.matricula));
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b bg-gray-50 flex-shrink-0">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800">Gestão de Filas e Bolsões</h2>
                    <span className="text-sm text-gray-500">Gestor: {manager.name}</span>
                </div>
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </header>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar: List of Bolsões */}
                <aside className="w-1/4 min-w-[250px] border-r bg-gray-50 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-white">
                        <span className="font-semibold text-gray-700">Meus Bolsões</span>
                        <button 
                            onClick={handleCreateBolsao}
                            className="bg-[#005c9e] text-white p-1.5 rounded-md hover:bg-[#004a7c]"
                            title="Criar novo bolsão"
                        >
                            <PlusIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-2">
                        {bolsoes.map(bolsao => (
                            <div 
                                key={bolsao.id}
                                onClick={() => setSelectedBolsaoId(bolsao.id)}
                                className={`p-3 rounded-md cursor-pointer flex justify-between items-center transition-colors ${selectedBolsaoId === bolsao.id ? 'bg-white border-l-4 border-[#005c9e] shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <div className="truncate pr-2">
                                    <div className={`font-medium ${selectedBolsaoId === bolsao.id ? 'text-[#005c9e]' : ''}`}>{bolsao.name}</div>
                                    <div className="text-xs text-gray-400">{bolsao.userIds.length} analista(s)</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content: Details of Selected Bolsão */}
                <main className="flex-grow flex flex-col bg-white">
                    {selectedBolsao ? (
                        <>
                            {/* Toolbar / Tabs */}
                            <div className="border-b px-6 pt-6 pb-0 bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nome do Bolsão</label>
                                        <input 
                                            type="text" 
                                            value={selectedBolsao.name}
                                            onChange={(e) => handleUpdateName(e.target.value)}
                                            className="text-2xl font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-[#005c9e] focus:outline-none w-full bg-transparent transition-colors"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteBolsao(selectedBolsao.id)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-red-50"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span>Excluir Bolsão</span>
                                    </button>
                                </div>

                                <div className="flex space-x-6">
                                    <button 
                                        onClick={() => setActiveTab('users')}
                                        className={`pb-3 px-1 flex items-center space-x-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#005c9e] text-[#005c9e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <UsersIcon className="h-5 w-5" />
                                        <span className="font-medium">Equipe ({selectedBolsao.userIds.length})</span>
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('filters')}
                                        className={`pb-3 px-1 flex items-center space-x-2 border-b-2 transition-colors ${activeTab === 'filters' ? 'border-[#005c9e] text-[#005c9e]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FileTextIcon className="h-5 w-5" />
                                        <span className="font-medium">Regras de Distribuição (Dossiês)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-grow overflow-y-auto bg-gray-50 p-6">
                                {activeTab === 'users' && (
                                    <div className="max-w-4xl mx-auto space-y-6">
                                        
                                        {/* Add User Section */}
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Adicionar Analista ao Bolsão</h3>
                                            <div className="flex space-x-2">
                                                <div className="relative flex-grow">
                                                    <select 
                                                        className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-[#005c9e] focus:border-transparent outline-none"
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleAddUser(e.target.value);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    >
                                                        <option value="">Selecione um analista para mover para este bolsão...</option>
                                                        {getAvailableUsersForDropdown().map(user => {
                                                            // Find if user belongs to another bolsao
                                                            const currentBolsao = bolsoes.find(b => b.userIds.includes(user.matricula));
                                                            const label = user.nomeCompleto;
                                                            const subLabel = currentBolsao ? `(Atualmente em: ${currentBolsao.name})` : '(Sem bolsão)';
                                                            
                                                            return (
                                                                <option key={user.matricula} value={user.matricula}>
                                                                    {label} - {subLabel}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <ChevronDownIcon className="h-4 w-4"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Nota: Ao adicionar um analista que já pertence a outro bolsão, ele será movido automaticamente para este.
                                            </p>
                                        </div>

                                        {/* List of Users in this Bolsao */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {selectedBolsao.userIds.length > 0 ? (
                                                        selectedBolsao.userIds.map(userId => {
                                                            const user = manager.users.find(u => u.matricula === userId);
                                                            if (!user) return null;
                                                            return (
                                                                <tr key={userId} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nomeCompleto}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.matricula}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <button 
                                                                            onClick={() => handleRemoveUser(userId)}
                                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                                                                            title="Remover do bolsão"
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                                                                Nenhum analista atribuído a este bolsão ainda.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'filters' && (
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase border-b pb-2">Critérios de Elegibilidade (Filtros)</h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Os documentos que corresponderem aos filtros abaixo serão automaticamente direcionados para a fila deste bolsão.
                                        </p>
                                        
                                        {/* Reusing the exact grid layout requested previously */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 text-sm mb-4">
                                            <div className="col-span-full">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <SearchIcon className="h-5 w-5 text-gray-400"/>
                                                    </div>
                                                    <input type="text" placeholder="Buscar documentos por palavras-chave..." className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors"/>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-3"><SelectInput label="Grupo Credor" /></div>
                                            <div className="lg:col-span-3"><SelectInput label="Agente Financeiro" /></div>
                                            <div className="lg:col-span-3"><SelectInput label="Hipoteca" /></div>
                                            <div className="lg:col-span-3"><SelectInput label="FH 1/2/3" /></div>
                                            
                                            <div className="lg:col-span-2"><SelectInput label="Categoria" /></div>
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

                                            <div className="col-span-full flex justify-end items-end space-x-2 pt-4 border-t mt-2">
                                                <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                                                    <ResetIcon className="h-4 w-4 mr-2" />
                                                    Limpar Filtros
                                                </button>
                                                <button className="flex items-center px-6 py-2 text-white bg-[#005c9e] hover:bg-[#004a7c] rounded-md shadow-sm transition-colors">
                                                    Salvar Regras
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p>Selecione ou crie um bolsão para começar.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Reused Input Components
const TextInput: React.FC<{ label?: string }> = ({ label }) => (
    <div>
        {label && <label className="block text-gray-500 mb-1 text-xs font-medium">{label}</label>}
        <input type="text" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors" />
    </div>
);

const SelectInput: React.FC<{ label?: string, options?: string[], defaultValue?: string }> = ({ label, options=['Todos', 'Opção 1', 'Opção 2'], defaultValue }) => (
     <div>
        {label && <label className="block text-gray-500 mb-1 text-xs font-medium">{label}</label>}
        <div className="relative">
            <select defaultValue={defaultValue} className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors">
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
        {label && <label className="block text-gray-500 mb-1 text-xs font-medium">{label}</label>}
        <div className="relative">
             <input type="text" placeholder="dd/mm/aaaa" className="w-full p-2 border border-gray-300 rounded-md pr-10 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#005c9e] focus:border-[#005c9e] transition-colors" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <CalendarIcon className="h-5 w-5"/>
            </div>
        </div>
     </div>
);

export default QueueManagement;


import React, { useState } from 'react';
import { Manager, User, AssignedDoc } from '../types';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, AssignIcon, CloseIcon, SlidersIcon } from './Icons';
import DocumentAssignment from './DocumentAssignment';
import QueueManagement from './QueueManagement';

const managersData: Manager[] = [
  {
    id: 1,
    name: 'Guilherme Calabresi',
    users: [
      { 
        matricula: 'daniel.f.souza', 
        nomeCompleto: 'Daniel Souza', 
        email: 'daniel.f.souza@caixa.gov.br', 
        local: 'SP', 
        docsAtribuidos: [
            { id: '535', name: '02105164179_00024_1304001403211_1.pdf' },
            { id: '536', name: '05114601576_24_2904000702413_1.pdf' },
            { id: '542', name: '97101_9001319718908_00024_1347000904229_1.pdf' },
        ] 
      },
      { 
        matricula: 'eduardo.bexiga', 
        nomeCompleto: 'Eduardo Bexiga', 
        email: 'eduardo.bexiga@caixa.gov.br', 
        local: 'SP', 
        docsAtribuidos: [
            { id: '472', name: '9001318223195_85058_9923810062231_1.pdf' },
            { id: '474', name: '9001318223195_85058_9923810062231_1.pdf' },
        ]
      },
      { matricula: 'elvio.trindade', nomeCompleto: 'Elvio Trindade', email: 'elvio.trindade@caixa.gov.br', local: 'SP', docsAtribuidos: '-' },
      { matricula: 'karina.ramos', nomeCompleto: 'Karina Ramos', email: 'karina.ramos@caixa.gov.br', local: 'SP', docsAtribuidos: '-' },
    ],
  },
  {
    id: 2,
    name: 'Tarsila Correa',
    users: [
       { matricula: 'tarsila.c', nomeCompleto: 'Tarsila Correa', email: 'tarsila.correa@caixa.gov.br', local: 'RJ', docsAtribuidos: '-' },
    ],
  },
  {
    id: 3,
    name: 'Celeste Mayumi Teraoka Garcia',
    users: [
      { matricula: 'celeste.garcia', nomeCompleto: 'Celeste Garcia', email: 'celeste.garcia@caixa.gov.br', local: 'MG', docsAtribuidos: '-' },
      { matricula: 'joao.silva', nomeCompleto: 'João Silva', email: 'joao.silva@caixa.gov.br', local: 'MG', docsAtribuidos: '-' },
      { matricula: 'ana.pereira', nomeCompleto: 'Ana Pereira', email: 'ana.pereira@caixa.gov.br', local: 'MG', docsAtribuidos: '-' },
    ],
  },
];

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Análise');
  const [openManagerId, setOpenManagerId] = useState<number | null>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [managingQueueFor, setManagingQueueFor] = useState<Manager | null>(null);

  const toggleManager = (id: number) => {
    setOpenManagerId(openManagerId === id ? null : id);
  };

  const handleAssignClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleManageQueueClick = (manager: Manager) => {
    setManagingQueueFor(manager);
  };
  
  const handleBackFromQueue = () => {
    setManagingQueueFor(null);
  };

  if (managingQueueFor) {
    return <QueueManagement manager={managingQueueFor} onBack={handleBackFromQueue} />;
  }

  if (selectedUser) {
    return <DocumentAssignment user={selectedUser} onBack={handleBack} />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('Gestão Documental')}
            className={`py-2 px-1 text-sm font-medium ${activeTab === 'Gestão Documental' ? 'border-b-2 border-[#005c9e] text-[#005c9e]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Gestão Documental
          </button>
          <button
            onClick={() => setActiveTab('Análise')}
            className={`py-2 px-1 text-sm font-medium ${activeTab === 'Análise' ? 'border-b-2 border-[#005c9e] text-[#005c9e]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Análise
          </button>
        </nav>
      </div>

      <div className="mt-6 mb-4">
        <div className="flex items-center max-w-sm rounded-md focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-[#005c9e]">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none bg-gray-100 placeholder-gray-500"
            />
          </div>
          <button className="bg-[#005c9e] text-white p-[9px] rounded-r-md hover:bg-[#004a7c] border border-[#005c9e]">
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {managersData.map((manager) => (
          <AccordionItem
            key={manager.id}
            manager={manager}
            isOpen={openManagerId === manager.id}
            onToggle={() => toggleManager(manager.id)}
            onAssignClick={handleAssignClick}
            onManageQueueClick={handleManageQueueClick}
          />
        ))}
      </div>
    </div>
  );
};

interface AccordionItemProps {
    manager: Manager;
    isOpen: boolean;
    onToggle: () => void;
    onAssignClick: (user: User) => void;
    onManageQueueClick: (manager: Manager) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ manager, isOpen, onToggle, onAssignClick, onManageQueueClick }) => {
    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-4 bg-[#e6f2fa] rounded-t-lg"
            >
                <div className="flex items-center space-x-3">
                    {isOpen ? <ChevronUpIcon className="h-5 w-5 text-[#005c9e]" /> : <ChevronDownIcon className="h-5 w-5 text-[#005c9e]" />}
                    <span className="font-semibold text-gray-800">{manager.name}</span>
                    <span className="text-gray-500 text-sm">({manager.users.length} usuários)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                      className="bg-gray-600 text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-700"
                      onClick={(e) => { e.stopPropagation(); onManageQueueClick(manager); }}
                    >
                        <SlidersIcon className="h-4 w-4" />
                        <span>Gerenciar Fila</span>
                    </button>
                    <button 
                      className="bg-[#005c9e] text-white text-sm px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#004a7c]"
                      onClick={(e) => { e.stopPropagation(); onAssignClick(manager.users[0]); /* For demo, assign to first user */ }}
                    >
                        <AssignIcon className="h-4 w-4" />
                        <span>Atribuir</span>
                    </button>
                </div>
            </button>
            {isOpen && (
                <div className="bg-white rounded-b-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['Matrícula', 'Nome completo', 'E-mail', 'Local', 'Docs. atribuídos', 'Ação'].map((header) => (
                                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {manager.users.map((user) => (
                                    <tr key={user.matricula}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.matricula}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.nomeCompleto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.local}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {Array.isArray(user.docsAtribuidos) ? (
                                                <div className="flex items-center space-x-2">
                                                    {user.docsAtribuidos.slice(0, 2).map((doc) => (
                                                        <div key={doc.id} className="bg-[#e6f2fa] text-[#005c9e] rounded-md px-2 py-1 text-xs flex items-center space-x-1.5">
                                                            <span><span className="font-bold">{doc.id}</span>- {doc.name}</span>
                                                            <button className="hover:text-red-600">
                                                                <CloseIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {user.docsAtribuidos.length > 2 && (
                                                        <div className="bg-gray-100 text-gray-500 rounded-md px-2 py-1 text-xs font-medium">
                                                            (+{user.docsAtribuidos.length - 2}...)
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                user.docsAtribuidos
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button 
                                              className="bg-[#005c9e] text-white px-3 py-1.5 rounded-md flex items-center space-x-1.5 text-xs hover:bg-[#004a7c]"
                                              onClick={(e) => { e.stopPropagation(); onAssignClick(user); }}
                                            >
                                                <AssignIcon className="h-3.5 w-3.5" />
                                                <span>Atribuir</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                         <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <span>Mostrar</span>
                            <select className="border-2 border-[#005c9e] rounded-md px-2 py-1 text-center bg-white appearance-none">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span>usuários por página</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button className="p-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="px-3 py-1 bg-[#005c9e] text-white rounded-md text-xs font-bold">1</span>
                             <button className="p-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

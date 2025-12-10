
import React from 'react';
import Header from './components/Header';
import UserManagement from './components/UserManagement';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Breadcrumbs />
        <UserManagement />
      </main>
    </div>
  );
};

const Breadcrumbs: React.FC = () => {
  return (
    <div className="mb-4 text-sm text-gray-600">
      <span>Gestão</span>
      <span className="mx-2 text-gray-400">&gt;</span>
      <span className="font-semibold text-gray-800">Filas</span>
    </div>
  );
};

export default App;

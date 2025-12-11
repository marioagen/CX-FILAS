
import React, { useState } from 'react';
import Header from './components/Header';
import UserManagement from './components/UserManagement';
import DocumentAnalysisPage from './components/DocumentAnalysisPage';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'queueManagement' | 'documentAnalysis'>('documentAnalysis');
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Analista Teste', role: 'analyst' });

  const handlePageChange = (page: 'queueManagement' | 'documentAnalysis') => {
    setCurrentPage(page);
  };

  const toggleUserProfile = () => {
    setUserProfile(currentProfile => 
      currentProfile.role === 'analyst' 
        ? { name: 'Gestor Teste', role: 'manager' }
        : { name: 'Analista Teste', role: 'analyst' }
    );
  };

  const breadcrumbs = currentPage === 'queueManagement'
    ? [{ label: 'Gestão', link: '#' }, { label: 'Filas', link: '#' }]
    : [{ label: 'Análise', link: '#' }, { label: 'Documentos análise', link: '#' }];

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <Header 
        onPageChange={handlePageChange} 
        userProfile={userProfile} 
        onToggleProfile={toggleUserProfile} 
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Breadcrumbs paths={breadcrumbs} />
        {currentPage === 'queueManagement' ? (
          <UserManagement />
        ) : (
          <DocumentAnalysisPage userProfile={userProfile} />
        )}
      </main>
    </div>
  );
};

interface BreadcrumbsProps {
  paths: { label: string; link: string; }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <div className="mb-4 text-sm text-gray-600 flex items-center">
      {paths.map((path, index) => (
        <React.Fragment key={path.label}>
          <a href={path.link} className={index === paths.length - 1 ? "font-semibold text-gray-800" : "hover:text-[#005c9e]"}>
            {path.label}
          </a>
          {index < paths.length - 1 && <span className="mx-2 text-gray-400">&gt;</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default App;
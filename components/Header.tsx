
import React, { useState } from 'react';
import { MenuIcon, UserRoundIcon, UsersIcon } from './Icons';
import { UserProfile } from '../types';

interface HeaderProps {
  onPageChange: (page: 'queueManagement' | 'documentAnalysis') => void;
  userProfile: UserProfile;
  onToggleProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPageChange, userProfile, onToggleProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (page: 'queueManagement' | 'documentAnalysis') => {
    onPageChange(page);
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <header className="bg-[#005c9e] text-white flex items-center justify-between p-3 shadow-md relative z-10">
      <div className="flex items-center">
        <button className="p-2 relative" onClick={handleMenuClick} aria-label="Open menu">
          <MenuIcon className="h-6 w-6" />
        </button>
        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg py-2 text-gray-800 z-20">
            <button
              onClick={() => handleNavigation('queueManagement')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Gestão de Filas
            </button>
            <button
              onClick={() => handleNavigation('documentAnalysis')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Documentos de Análise
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleProfile}
          title="Alternar perfil (demonstração)"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/10"
        >
          {userProfile.role === 'analyst' ? <UserRoundIcon className="h-5 w-5"/> : <UsersIcon className="h-5 w-5"/> }
          <span className="text-sm font-medium capitalize">{userProfile.role}</span>
        </button>
        <div className="w-px h-8 bg-white/20"></div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xl">
            W
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">mario@sophie.chat</p>
            <p className="text-xs text-gray-200">mario@sophie.chat</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm">14:30:11</p>
          <p className="text-xs text-gray-200">10/12/2025</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
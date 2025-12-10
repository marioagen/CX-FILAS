
import React from 'react';
import { MenuIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-[#005c9e] text-white flex items-center justify-between p-3 shadow-md">
      <div className="flex items-center">
        <button className="p-2">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
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


import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from './Icons';

interface MultiSelectProps {
  label: string;
  options: string[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleToggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayLabel = selectedOptions.length > 0
    ? `${selectedOptions.length} selecionado(s)`
    : label;

  return (
    <div>
        <label className="block text-gray-500 mb-1">{label}</label>
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 flex justify-between items-center text-left"
            >
                <span className={selectedOptions.length > 0 ? "font-medium text-gray-800" : "text-gray-500"}>{displayLabel}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <ul className="overflow-y-auto flex-grow">
                        {filteredOptions.map(option => (
                            <li key={option} className="p-2 hover:bg-blue-100 cursor-pointer flex items-center" onClick={() => handleToggleOption(option)}>
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={selectedOptions.includes(option)}
                                    className="appearance-none h-4 w-4 rounded-sm bg-gray-700 checked:bg-blue-600 mr-3 pointer-events-none"
                                />
                                <span className="w-full cursor-pointer select-none text-gray-800">
                                    {option}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
};

export default MultiSelect;

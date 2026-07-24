'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  isRtl?: boolean;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  isRtl = false,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHighlightedIndex(0);
    }
  };

  return (
    <div
      ref={selectRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label="Select option"
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          h-14
          w-full
          rounded-xl
          bg-card-bg
          border
          border-gray-700
          text-white
          outline-none
          transition-all
          duration-200
          cursor-pointer
          hover:border-primary/60
          focus:border-primary
          focus:ring-2
          focus:ring-primary/30
          focus:shadow-lg
          flex
          items-center
          justify-between
          px-4
          ${isOpen ? 'border-primary ring-2 ring-primary/30' : ''}
          ${isRtl ? 'text-right' : 'text-left'}
        `}
        aria-haspopup="true"
      >
        <span className="truncate text-sm md:text-base">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-primary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute
            z-50
            w-full
            mt-2
            max-h-60
            overflow-y-auto
            rounded-xl
            bg-card-bg
            border
            border-gray-700
            shadow-lg
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
            ${isRtl ? 'right-0' : 'left-0'}
          `}
          role="listbox"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                flex
                items-center
                justify-between
                px-4
                py-3
                cursor-pointer
                transition-colors
                duration-150
                text-sm
                ${
                  index === highlightedIndex
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-primary/10 hover:text-primary'
                }
                ${option.value === value ? 'bg-primary text-white' : ''}
              `}
              role="option"
              aria-selected={option.value === value}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <Check size={16} className="flex-shrink-0 ml-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

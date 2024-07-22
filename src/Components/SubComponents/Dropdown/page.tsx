import React, { useState, forwardRef, useImperativeHandle } from 'react';

interface DropdownProps {
  options: { id: number; descricao: string }[];
  onSelect?: (id: number) => void;
}

const Dropdown = forwardRef(({ options, onSelect }: DropdownProps, ref) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    setSelectedOption(selectedId);
    if (onSelect) {
      onSelect(selectedId);
    }
  };

  useImperativeHandle(ref, () => ({
    getSelectedOption: () => {
      const selected = options.find(option => option.id === selectedOption);
      return selected ? { id: selected.id, descricao: selected.descricao } : null;
    }
  }));

  return (
    <select value={selectedOption !== null ? selectedOption.toString() : ''} onChange={handleChange}>
      <option value="" disabled>Select an option</option>
      {options.map((option) => (
        <option key={option.id} value={option.id.toString()}>
          {option.descricao}
        </option>
      ))}
    </select>
  );
});

export default Dropdown;
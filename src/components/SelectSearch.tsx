import React from 'react';
import Select, { Props as SelectProps } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface SelectSearchProps extends Omit<SelectProps<Option, boolean>, 'classNames'> {
  label?: string;
  error?: string;
}

export default function SelectSearch({ label, error, ...props }: SelectSearchProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Select
        {...props}
        classNames={{
          control: (state) => 
            `!min-h-[38px] !bg-white !border-gray-300 !rounded-md !shadow-sm ${
              state.isFocused ? '!border-indigo-500 !ring-1 !ring-indigo-500' : ''
            } ${error ? '!border-red-500' : ''}`,
          option: (state) =>
            `!text-sm ${
              state.isSelected
                ? '!bg-indigo-500 !text-white'
                : state.isFocused
                ? '!bg-indigo-50'
                : ''
            }`,
          menu: () => '!bg-white !border !border-gray-200 !shadow-lg !rounded-md !z-50',
          multiValue: () => '!bg-indigo-100',
          multiValueLabel: () => '!text-indigo-800',
          multiValueRemove: () => '!text-indigo-500 !hover:text-indigo-700 !hover:bg-indigo-200',
          placeholder: () => '!text-gray-400',
          singleValue: () => '!text-gray-900',
        }}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: 'none',
          }),
          option: (base) => ({
            ...base,
            cursor: 'pointer',
          }),
        }}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
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

const SelectSearch = ({ label, error, ...props }: SelectSearchProps) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <Select
        {...props}
        classNames={{
          control: (state) => 
            `!min-h-[38px] !bg-white dark:!bg-gray-700 !border-gray-300 dark:!border-gray-600 !rounded-md !shadow-sm ${
              state.isFocused ? '!border-indigo-500 !ring-1 !ring-indigo-500' : ''
            } ${error ? '!border-red-500' : ''}`,
          option: (state) =>
            `!text-sm ${
              state.isSelected
                ? '!bg-indigo-500 !text-white'
                : state.isFocused
                ? '!bg-indigo-50 dark:!bg-indigo-900/20'
                : ''
            }`,
          menu: () => '!bg-white dark:!bg-gray-700 !border !border-gray-200 dark:!border-gray-600 !shadow-lg !rounded-md !z-50',
          multiValue: () => '!bg-indigo-100 dark:!bg-indigo-900/20',
          multiValueLabel: () => '!text-indigo-800 dark:!text-indigo-200',
          multiValueRemove: () => '!text-indigo-500 dark:!text-indigo-400 !hover:text-indigo-700 dark:!hover:text-indigo-300 !hover:bg-indigo-200 dark:!hover:bg-indigo-800',
          placeholder: () => '!text-gray-400 dark:!text-gray-500',
          singleValue: () => '!text-gray-900 dark:!text-white',
          input: () => '!text-gray-900 dark:!text-white',
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
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#4f46e5',
            primary75: '#6366f1',
            primary50: '#818cf8',
            primary25: '#c7d2fe',
          },
        })}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectSearch;
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Filter = ({ selectedFilter, onFilterChange, options, selectedFilterDebt }) => {
  const handleChange = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <FormControl size='small' fullWidth>
      <InputLabel>Фильтр</InputLabel>
      <Select
        fullWidth
        value={selectedFilter}
        onChange={handleChange}
        label="Сортировка"
        size='small'
      >
        {options?.map(option => (
          <MenuItem fullWidth key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Filter;

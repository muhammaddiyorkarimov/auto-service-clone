import React, { useState } from 'react';
import { TextField } from '@mui/material';

const SearchInput = ({ searchValue, onSearchChange }) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleChange = (event) => {
    setLocalSearchValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearchChange(localSearchValue);
      event.preventDefault();
    }
  };

  return (
    <TextField
      label="Поиск"
      variant="outlined"
      value={localSearchValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      size='small'
    />
  );
};

export default SearchInput;

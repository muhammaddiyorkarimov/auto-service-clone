import './addItemModal.css';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, FormHelperText, IconButton, Input } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import ExpensesType from '../../pages/expenses/expensesType/ExpensesType';

function AddItemModal({ name, open, onClose, onSave, formConfig, expensesType }) {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const initialData = formConfig?.reduce((acc, field) => {
      if (field.type === 'number' && (field.name === 'discount' || field.name === 'debt')) {
        acc[field.name] = '0';
      } else {
        acc[field.name] = '';
      }
      return acc;
    }, {});
    setFormData(initialData);
  }, [formConfig]);

  const formatNumberWithSpaces = (number) => {
    return number?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'text' && formConfig?.find((field) => field.name === name && field.type === 'number')) {
      const rawValue = value.replace(/\s/g, '');
      if (/^\d*$/.test(rawValue)) { 
        const formattedValue = formatNumberWithSpaces(rawValue);
        setFormData({ ...formData, [name]: formattedValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = () => {
    const errors = {};
    formConfig.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} поле обязательно для заполнения!`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Prepare the data for saving
    const rawData = { ...formData };
    Object.keys(rawData).forEach(key => {
      if (formConfig.some(f => f.type === 'number' && f.name === key)) {
        rawData[key] = rawData[key].replace(/\s/g, '');
      }
      if (key === 'discount' || key === 'debt') {
        rawData[key] = rawData[key] || '0';
      }
    });

    onSave(rawData, file);
  };

  const renderFields = () => {
    return formConfig?.map((field, index) => {
      switch (field.type) {
        case 'text':
        case 'number':
          return (
            <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
              <TextField
                margin="dense"
                label={field.label}
                name={field.name}
                type="text" 
                value={formData[field.name] || ''}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={field.type === 'number' ? { inputMode: 'numeric' } : {}}
              />
              <FormHelperText>{validationErrors[field.name]}</FormHelperText>
            </FormControl>
          );
        case 'textarea':
          return (
            <FormControl key={index} fullWidth margin="dense" error={!!validationErrors[field.name]}>
              <TextField
                margin="dense"
                label={field.label}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
              <FormHelperText>{validationErrors[field.name]}</FormHelperText>
            </FormControl>
          );
        case 'select':
          return (
            <FormControl className='flex-container' fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
              <div className='flex-content'>
                <Autocomplete
                  size='small'
                  options={field.options || []}
                  getOptionLabel={(option) => option.label}
                  value={field?.options?.find(option => option.value === formData[field.name]) || null}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, [field.name]: newValue ? newValue.value : '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={field.label}
                      error={!!validationErrors[field.name]}
                      helperText={validationErrors[field.name]}
                      fullWidth
                    />
                  )}
                />
                {expensesType ? <ExpensesType /> : null}
              </div>
            </FormControl>
          );
        case 'file':
          return (
            <div key={index} style={{ margin: '16px 0' }}>
              <Input
                type="file"
                onChange={handleFileChange}
                inputProps={{ accept: field.accept || 'image/*' }}
              />
              <IconButton component="label">
                <AddPhotoAlternate />
              </IconButton>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="dialog-wrapper">
        <DialogTitle>{name ? name : 'Добавить новый продукт'}</DialogTitle>
        <DialogContent>{renderFields()}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отменить</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default AddItemModal;

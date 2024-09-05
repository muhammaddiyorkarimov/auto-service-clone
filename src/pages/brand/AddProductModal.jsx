import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, FormHelperText, IconButton, Input } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import OurProduct from '../../services/landing/ourProduct';
import Provider from './../../services/landing/provider';

function AddItemModal({ name, open, onClose, onSave, providerById }) {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [provider, setProvider] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [formConfig, setFormConfig] = useState([]);

    const unitOptions = [
        {id: 1, name: 'Штука'},
        {id: 2, name: 'Комплект'},
        {id: 3, name: 'Литр'},
    ]
    
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await Provider.getProvider();
                setProvider(response);
                setFormConfig([
                    { type: 'text', label: 'Артикул', name: 'code' },
                    { type: 'text', label: 'Название', name: 'name', required: true },
                    { type: 'text', label: 'Количество', name: 'amount', required: true },
                    { type: 'number', label: 'Минимальное количество', name: 'min_amount', required: true },
                    { type: 'select', label: 'Единица измерения', name: 'unit', required: true, options: unitOptions.map(p => ({value: p.id, label: p.name}))},
                    // { type: 'number', label: 'Цена покупки', name: 'import_price', required: true },
                    // { type: 'number', label: 'Цена продажи', name: 'export_price' },
                    { type: 'number', label: 'Скидка', name: 'max_discount', value: 0 },
                ]);
            } catch (error) {
                alert("Ошибка при получении поставщиков:", error);
            }
        };

        fetchProvider();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' }); // Xatolikni tozalash
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async () => {
        const errors = {};
        formConfig.forEach((field) => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `${field.label} Поле обязательно для заполнения!`;
            }
        });
    
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
    
        try {
            // export_price va import_price ni 0 qilib qo'shamiz
            const dataToSend = {
                ...formData,
                provider: providerById,
                export_price: 0,  // qo'shilgan qator
                import_price: 0   // qo'shilgan qator
            };
    
            const newProduct = await OurProduct.postProduct(dataToSend);
            onSave(newProduct);
            setSuccessMsg("Успешно добавлено");
            setSnackbarOpen(true);
    
            const updatedProvider = await Provider.getProvider();
            setProvider(updatedProvider);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при добавлении продукта!");
            setSnackbarOpen(true);
        } finally {
            onClose();
        }
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
                                type={field.type}
                                value={formData[field.name] || field.value}
                                onChange={handleChange}
                                fullWidth
                                size="small"
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
                        <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
                            <Autocomplete
                                options={field.options || []} // Default to empty array if undefined
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
                                    />
                                )}
                            />
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
                <DialogContent className='dialog-content'>{renderFields()}</DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Отменить</Button>
                    <Button onClick={handleSave}>Сохранить</Button>
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default AddItemModal;

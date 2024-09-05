import React, { useEffect, useState } from 'react';
import AddItemBtn from '../addItemBtn/AddItemBtn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, AlertTitle } from '@mui/material';
import Provider from '../../services/landing/provider';

function AddProvider({ addProvider, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [formConfig] = useState([
        { type: 'text', label: 'Название', name: 'name' },
        { type: 'text', label: 'Номер телефона', name: 'phone_number' },
        { type: 'number', label: 'Задолженность', name: 'debt' },
    ]);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        debt: 0
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Это поле обязательно для заполнения';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await Provider.postProvider(formData);
            setSuccess(true);
            setOpen(false);
            onSuccess(response);  // Yangi ta'minotchini qaytarish
        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(false);
            }, 3000); // 3 soniyadan keyin alert o'chiriladi
            return () => clearTimeout(timer); // Timerni tozalash
        }
    }, [success, error]);

    const renderFields = () => {
        return formConfig.map((field, index) => (
            <TextField
                key={index}
                margin="dense"
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!validationErrors[field.name]}
                helperText={validationErrors[field.name]}
                required={field.name === 'name' || field.name === 'debt'}
            />
        ));
    };

    return (
        <div>
            {(success || error) && (
                <div style={{ position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)}>
                            <AlertTitle>Успешно</AlertTitle>
                            Поставщик успешно добавлен
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" onClose={() => setError(false)}>
                            <AlertTitle>Ошибка</AlertTitle>
                            Ошибка при добавлении поставщика
                        </Alert>
                    )}
                </div>
            )}
            {addProvider ? (
                <button
                    className='add-provider-btn'
                    onClick={() => setOpen(true)}
                >
                    +
                </button>
            ) : (
                <AddItemBtn
                    name="Provider qo'shish"
                    onClick={() => setOpen(true)}
                />
            )}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <div className="dialog-wrapper">
                    <DialogTitle>Добавить поставщика</DialogTitle>
                    <DialogContent className="dialog-content">{renderFields()}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Отменить</Button>
                        <Button onClick={handleSubmit}>Сохранить</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}

export default AddProvider;

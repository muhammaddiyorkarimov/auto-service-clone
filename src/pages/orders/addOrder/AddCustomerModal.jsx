import React, { useEffect, useState } from 'react';
import CustomersService from '../../../services/landing/customers';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function AddCustomerModal({ open, onClose, onSuccess }) {
    const [formConfig, setFormConfig] = useState([
        { type: 'text', label: 'Имя', name: 'first_name', required: true },
        { type: 'text', label: 'Фамилия', name: 'last_name', required: true },
        { type: 'text', label: 'Номер телефона', name: 'phone_number', required: true },
        { type: 'text', label: 'Дополнительный номер телефона', name: 'phone_number_extra' },
        { type: 'text', label: 'Серийные номера паспорта', name: 'passport_serial_numbers' },
        { type: 'text', label: 'Серийные буквы паспорта', name: 'passport_serial_letters' },
        { type: 'text', label: 'Адрес', name: 'address' },
        { type: 'number', label: 'Задолженность', name: 'debt', required: true, value: 0 },
    ]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        phone_number_extra: '',
        passport_serial_numbers: '',
        passport_serial_letters: '',
        address: '',
        debt: '',
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const errors = {};
        formConfig.forEach((field) => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `${field.label} обязательно к заполнению`;
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submit behavior
        if (!validateForm()) {
            return;
        }

        try {
            const response = await CustomersService.postCustomers(formData);
            if (response) {
                setSuccess(true);
                onClose();
                onSuccess(response);

                setFormData({
                    first_name: '',
                    last_name: '',
                    phone_number: '',
                    phone_number_extra: '',
                    passport_serial_numbers: '',
                    passport_serial_letters: '',
                    address: '',
                    debt: '',
                });
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(false);
            }, 3000);
            return () => clearTimeout(timer);
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
                value={formData[field.name] || field.value}
                onChange={handleChange}
                fullWidth
                size="small"
                error={!!validationErrors[field.name]}
                helperText={validationErrors[field.name]}
                required={field.required}
            />
        ));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Добавить клиента</DialogTitle>
            <DialogContent>
                {success && (
                    <Alert severity="success" onClose={() => setSuccess(false)}>
                        <AlertTitle>Успешно</AlertTitle>
                        Клиент успешно добавлен
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" onClose={() => setError(false)}>
                        <AlertTitle>Ошибка</AlertTitle>
                        Произошла ошибка при добавлении клиента
                    </Alert>
                )}
                {renderFields()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddCustomerModal;

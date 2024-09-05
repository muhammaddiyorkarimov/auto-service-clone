import React, { useEffect, useState } from 'react';
import CustomersService from '../../../services/landing/customers';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import OurCars from '../../ourCars/OurCars';
import CarsService from '../../../services/landing/carsService';

function AddCustomerCarModal({ open, onClose, onSuccess, selectedCustomerId }) {
    const [formConfig, setFormConfig] = useState([
        { type: 'text', label: 'VINCODE', name: 'code', required: true },
        { type: 'text', label: 'Название', name: 'name', required: true },
        { type: 'text', label: 'Бренд', name: 'brand', required: true },
        { type: 'text', label: 'Цвет', name: 'color', required: true },
        { type: 'text', label: 'Госномер', name: 'state_number', required: true },
    ]);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        brand: '',
        color: '',
        state_number: '',
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
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const postData = {
            code: formData.code,
            name: formData.name,
            brand: formData.brand,
            color: formData.color,
            state_number: formData.state_number,
            customer: selectedCustomerId,
        }

        try {
            const response = await CarsService.postCars(postData);
            if (response) {
                setSuccess(true);
                onClose();
                onSuccess(response);
            } else {
                setError(true);
            }
        } catch (error) {
            if (error.response.data.customer[0] === "Это поле не может быть пустым.") {
                setError("Пожалуйста, выберите клиента");
            }
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(false);
            }, 5000);
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
                value={formData[field.name]}
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
            <DialogTitle>Добавить автомобиль</DialogTitle>
            <DialogContent>
                {success && (
                    <Alert severity="success" onClose={() => setSuccess(false)}>
                        <AlertTitle>Успешно</AlertTitle>
                        Автомобиль успешно добавлен
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" onClose={() => setError(false)}>
                        <AlertTitle>Ошибка</AlertTitle>
                        Произошла ошибка при добавлении автомобиля. Пожалуйста, проверьте, выбран ли клиент!
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

export default AddCustomerCarModal;

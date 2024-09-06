import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Loader from '../../helpers/loader/Loader';
import './DataTable.css';
import NotAvailable from './../../helpers/notAvailable/NotAvailale';

function DataTable({showEdit, loading, error, tableHead, data, onDelete, onEdit, onRowClick, onSave, formConfig, dNone, showEditDelete, dDelete }) {
    const [inputValues, setInputValues] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const initialData = formConfig?.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setInputValues(initialData);
    }, [formConfig]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <NotAvailable message="Произошла ошибка, проблема с получением данных." />;
    }

    if (!data || data.length === 0) {
        return <NotAvailable message="Данные не найдены" />;
    }

    const handleInputChange = (name, value) => {
        setInputValues({
            ...inputValues,
            [name]: value,
        });
        setValidationErrors({ ...validationErrors, [name]: '' }); // Xatolikni tozalash
    };

    const handleAddRow = () => {
        const errors = {};
        formConfig.forEach((field) => {
            if (field.required && !inputValues[field.name]) {
                errors[field.name] = `${field.label} maydoni to'ldirilishi shart!`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        onSave(inputValues);
        setInputValues({});
    };
    return (
        <div className='data-table'>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        {tableHead && tableHead.map((name, index) => (
                            <th key={index}>{name}</th>
                        ))}
                        <th>
                        Действия
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {item.row}
                            <td className='table-actions'>
                                {showEditDelete ? <>
                                    <IconButton onClick={() => onEdit(item)}>
                                        {!showEdit && <i className="fa-regular fa-pen-to-square" style={{ color: 'orange', fontSize: '18px' }}></i>}
                                    </IconButton>
                                    {dDelete === false ? '' : <IconButton onClick={() => onDelete(item)}>
                                        <i className="fa-regular fa-trash-can" style={{ color: 'red', fontSize: '18px' }}></i>
                                    </IconButton>}
                                </> : ''}
                                {dNone === false ? '' : <IconButton onClick={() => onRowClick(item)}>
                                    <i className="fa-regular fa-eye" style={{ color: '#425BDD', fontSize: '18px' }}></i>
                                </IconButton>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;

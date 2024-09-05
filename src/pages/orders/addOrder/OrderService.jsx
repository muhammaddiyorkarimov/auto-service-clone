import React, { useCallback, useEffect, useState } from 'react';
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn';
import useFetch from '../../../hooks/useFetch';
import FormData from './FormData';
import AutoServices from './../../../services/landing/autoService';
import EmployeesService from './../../../services/landing/employees';

function OrderingService({ onTotalChange, onSave }) {
    const [formConfig, setFormConfig] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [price, setPrice] = useState(0);
    const [showAddButton, setShowAddButton] = useState(true);

    const fetchService = useCallback(() => {
        if (selectedServiceId) {
            return AutoServices.getAutoServiceById(selectedServiceId);
        }
    }, [selectedServiceId]);

    const { data: service } = useFetch(AutoServices.getAutoService);
    const { data: serviceById } = useFetch(fetchService);
    const { data: staffData } = useFetch(EmployeesService.getEmployees);

    useEffect(() => {
        if (service) {
            setServices(service);
        }
    }, [service]);

    useEffect(() => {
        if (serviceById) {
            setPrice(serviceById.price);
        }
    }, [serviceById]);

    useEffect(() => {
        const totalSum = formData.reduce((acc, product) => acc + product.total, 0);
        onTotalChange(totalSum);
    }, [formData, onTotalChange]);

    const handleAddService = () => {
        setFormConfig([
            {
                type: 'select', label: 'Сотрудник', name: 'worker', options: staffData?.map(p => ({
                    value: p.id,
                    label: p.first_name ? `${p.first_name} ${p.last_name}` : `Ismsiz`
                })), required: true
            },
            { type: 'select', label: 'Услуга', name: 'service', options: services?.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'text', label: 'Н/Ч', name: 'part', required: true },
            { type: 'number', label: 'Итого', name: 'total', required: true, disabled: true },
        ]);
        setShowAddButton(false);
    };

    const handleSave = (data) => {
        setFormData(prevData => {
            const updatedData = [...prevData, { ...data }];
            onSave(updatedData);
            return updatedData;
        });
        setFormConfig([]);
        setSelectedServiceId(null);
        setPrice(0);
        setShowAddButton(true);
    };

    const onServiceChange = (id) => {
        setSelectedServiceId(id);
    };

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <div className='order-service'>
            <div className="header">
                {showAddButton && <AddItemBtn name='Добавить услугу' onClick={handleAddService} />}
            </div>
            <div className="order-product-content">
                <FormData
                    formConfig={formConfig}
                    onSave={handleSave}
                    onServiceIdChange={onServiceChange}
                    price={price}
                />

                <table>
                    <thead>
                        <tr>
                            <th>Услуга</th>
                            <th>Сотрудник</th>
                            <th>Н/Ч</th>
                            <th>Итого</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.serviceName}</td>
                                <td>{item.workerName}</td>
                                <td>{item.part}</td>
                                <td>{formatNumberWithCommas(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderingService;

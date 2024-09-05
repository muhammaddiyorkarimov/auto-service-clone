import './brand.css'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import { Autocomplete, Box, Button, FormControl, FormHelperText, IconButton, TextField } from '@mui/material'
import { AddIcon } from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Provider from '../../services/landing/provider'
import OurProduct from '../../services/landing/ourProduct'
import AddProvider from './../../components/addProvider/AddProvider';
import ImportProduct from './../../services/landing/importProduct';
import AddItemModal from './AddProductModal';



function Import() {
    const [provider, setProvider] = useState([])
    const [providerById, setProviderById] = useState([])
    const [productById, setProductById] = useState([])
    const [product, setProduct] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [overallTotal, setOverallTotal] = useState(0);
    const [selectedProvider, setSelectedProvider] = useState(null)
    const [productId, setProductId] = useState(null)
    const [providerOptions, setProviderOptions] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false)
    const [addOpen, setAddOpen] = useState(false);

    const { data: providerData, loading: providerLoading, error: providerError } = useFetch(Provider.getProvider)

    useEffect(() => {
        if (selectedProvider) {
            Provider.getProviderById(selectedProvider)
                .then(response => {
                    setProviderById(response);
                })
                .catch(error => {
                    alert('Ошибка при получении поставщика по ID:', error.message);
                });
        }
        if (productId) {
            OurProduct.getProductById(productId)
                .then(response => {
                    if (response) {
                        setProductById(response);
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            export_price: response.export_price || '' // export_price ni value ga joylash
                        }));
                    } else {
                        alert('Продукт не найден или ID недействителен');
                    }
                })
                .catch(error => {
                    alert('Ошибка при получении продукта по ID:', error.message);
                });
        }
    }, [selectedProvider, productId]);


    const { data: productData, loading: productLoading, error: productError } = useFetch(OurProduct.getProduct)


    const [formData, setFormData] = useState({});
    const [openDetail, setOpenDetail] = useState(false)
    const [showAddProvider, setShowAddProvider] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const [formConfig, setFormConfig] = useState([])

    useEffect(() => {
        if (productData) {
            setProduct(productData.results)
        }
    }, [productData])

    useEffect(() => {
        if (providerData) {
            const options = providerData.map(provider => ({
                value: provider.id,
                label: provider.name,
            }));
            setProviderOptions(options);
        }
    }, [providerData]);


    useEffect(() => {
        if (productData && providerData) {
            setFormConfig([
                {
                    type: 'select',
                    label: 'Продукт',
                    name: 'product',
                    options: product?.length > 0 
                        ? product.map(p => ({ value: p.id, label: p.name }))
                        : [{label: 'не существует'}], // Bo'sh massivni qaytaradi
                    required: true
                },
                { type: 'number', label: 'Количество', name: 'amount' },
                { type: 'number', label: 'Цена покупки', name: 'import_price', required: true },
                { type: 'number', label: 'Цена продажи', name: 'export_price', required: true },
                { type: 'number', label: 'Итого', name: 'total', disabled: true }
            ]);
        }
    }, [product, providerData]);
    



    const handleAddProviderSuccess = (newProvider) => {
        const newOption = { value: newProvider.id, label: newProvider.name };
        setProviderOptions(prevOptions => [...prevOptions, newOption]);
        setSelectedProvider(newProvider.id);
    };


    const handleGetNewProduct = (newProduct) => {
        const updatedProducts = [newProduct, ...product];
        setProduct(updatedProducts);

        setFormConfig(prevConfig =>
            prevConfig.map(field =>
                field.name === 'product'
                    ? { ...field, options: updatedProducts.map(p => ({ value: p.id, label: p.name })) }
                    : field
            )
        );
        setProductById(newProduct.id);
    };





    const currentDate = new Date().toLocaleDateString();

    const handleClick = () => {
        setFormSubmitted(true);
        setOpenDetail(true);

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

    };


    useEffect(() => {
        const initialData = formConfig?.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setFormData(initialData);
    }, [formConfig]);

    const formatNumberWithCommas = (number) => {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Raqamlar va nuqta uchun faqat raqamlar va nuqtani olib tashlash
        const plainNumber = value.replace(/[^\d.]/g, ''); // Raqam va nuqtadan boshqa barcha belgilarni olib tashlaydi
    
        // Faqat raqamlar va bitta nuqtani qabul qilish
        if (/^\d*\.?\d*$/.test(plainNumber)) {
            setFormData(prevData => ({
                ...prevData,
                [name]: plainNumber  // Serverga ketayotgan qiymat
            }));
    
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };




    useEffect(() => {
        const calculateTotal = async () => {
            const amount = parseFloat(formData.amount) || 0;
            const importPrice = parseFloat(formData.import_price) || 0;
            const total = importPrice * amount;

            setFormData(prevFormData => ({ ...prevFormData, total }));
        };
        calculateTotal();
    }, [formData.amount, formData.import_price,]);



    const validateForm = () => {
        let errors = {};
        formConfig.forEach(field => {
            if (field.required && !formData[field.name]) {
                errors[field.name] = `${field.label} Обязательное для заполнения поле`;
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddProduct = () => {
        if (!isTableValid()) {
            alert('Заполните все необходимые поля в таблице');
            return;
        }
        if (!validateForm()) {
            return;
        }
        setSelectedProducts([...selectedProducts, formData]);

        const newOverallTotal = selectedProducts.reduce((acc, product) => acc + product.total, formData.total);
        setOverallTotal(newOverallTotal);

        setFormData({});
    };

    const handlePaidAmountChange = (event) => {
        const value = event.target.value.replace(/\s/g, '');

        if (/^\d*\.?\d*$/.test(value)) {
            const paidAmount = parseFloat(value) || 0;
            const newDebt = overallTotal - paidAmount;

            setFormData(prevData => ({
                ...prevData,
                paidAmount: value,
                debt: newDebt,
                productById
            }));
        }
    };



    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);

        const newOverallTotal = updatedProducts.reduce((acc, product) => acc + product.total, 0);
        setOverallTotal(newOverallTotal);

        const newDebt = newOverallTotal - (formData.paidAmount || 0);
    }

    const handleEditExportPrice = async () => {
        const postData = selectedProducts.map(product => {
            return (({

                id: product?.product.value,
                export_price: product.export_price
            }))
        });
        try {
            await Promise.all(postData.map(data =>
                OurProduct.putProductById(data.id, { export_price: data.export_price })
            ));

            // // Yangilanishdan keyin mahsulotlar ro'yxatini yangilash
            // fetchProducts();

        } catch (error) {
            alert('Ошибка:', error.message);
        }
    };

console.log(formData)
    const handleSubmit = async () => {
        const providerId = selectedProvider;

        // if (!formData.paidAmount || formData.paidAmount <= 0 || formData.paidAmount === 0) {
        //     alert("Пожалуйста, введите оплаченную сумму!");
        //     return;
        // }

        setLoading(true);
        const lastProductIndex = selectedProducts.length - 1;

        const postData = selectedProducts.map((product, index) => ({
            debt: index === lastProductIndex ? formData?.debt : 0,
            product: product.product?.value,
            amount: product.amount,
            import_price: product.import_price,
            total: product.total,
            provider: providerId
        }));


        try {
            for (const productData of postData) {
                const response = await ImportProduct.postImportProduct(productData);
                if (!response) {
                    alert('Не удалось отправить данные');
                    return;
                }
            }

            await handleEditExportPrice();
            alert('Успешно сохранено!');

            // setSelectedProducts([]);
            // setSelectedProvider(null);
            // setFormData({});
        } catch (error) {
            alert(`Ошибка при отправке данных: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleOpenAddProduct = () => {
        setAddOpen(true);
    }


    const renderFields = () => {
        if (productLoading || providerLoading) {
            return <div>Loading...</div>;
        }
        return formConfig?.map((field, index) => {
            switch (field.type) {
                case 'text':
                case 'number':
                    return (
                        <FormControl key={index} fullWidth margin="dense" size="small" error={formSubmitted && !!validationErrors[field.name]}>
                            <TextField
                                margin="dense"
                                label={field.label}
                                name={field.name}
                                type="text"
                                value={formatNumberWithCommas(formData[field.name] || '')} // Formatlangan qiymat
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                disabled={field.disabled}
                                error={formSubmitted && !!validationErrors[field.name]}
                            />
                        </FormControl>



                    );
                case 'select':
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FormControl key={index} fullWidth margin="dense" size="small" error={formSubmitted && !!validationErrors[field.name]}>
                                <Autocomplete
                                    sx={{ minWidth: '200px' }}
                                    size="small"
                                    options={field.options || []}
                                    getOptionLabel={(option) => option.label}
                                    value={field.options?.find(option => option.value === formData[field.name]?.value) || null}
                                    onChange={(event, newValue) => {
                                        setFormData({
                                            ...formData,
                                            [field.name]: newValue ? { value: newValue.value, label: newValue.label } : null
                                        });
                                        if (field.name === 'product') {
                                            setProductId(newValue ? newValue.value : null);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={field.label}
                                            error={formSubmitted && !!validationErrors[field.name]}
                                        />
                                    )}
                                />
                            </FormControl>
                            <button className='add-provider-btn' onClick={handleOpenAddProduct}>+</button>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    const isTableValid = () => {
        return selectedProducts?.every(product =>
            product.amount && product.import_price
        );
    };


    return (
        <div className='import-product'>
            <SideBar />
            <main>
                <Navbar title='Приход товаров' />
                <div className="extra-items">
                    {!openDetail && <div className="add-product-btn">
                        <Button onClick={handleClick} variant='outlined'>Новый чек</Button>
                    </div>}
                    {openDetail &&
                        <section className="order-details">
                            <div className="top-items">
                                <div className="title">Детали приходного заказа</div>
                                <div className="btns">
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? 'Отправляется...' : 'Сохранить'}
                                    </Button>
                                </div>

                            </div>
                            <div className="main-items">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>Оплаченная сумма</th>
                                            <th>Задолженность</th>
                                            <th>Итого</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{currentDate}</td>
                                            <td>
                                                <TextField
                                                    margin="dense"
                                                    label="Введите сумму *"
                                                    type="text" // Change to 'text' to allow formatted input
                                                    value={formatNumberWithCommas(formData.paidAmount || '')}
                                                    onChange={handlePaidAmountChange}
                                                    fullWidth
                                                    size="small"
                                                />

                                            </td>
                                            <td>{formatNumberWithCommas(formData.debt)}</td>
                                            <td>{formatNumberWithCommas(overallTotal)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="provider-about">
                                    <div className="header">
                                        <div className="title">Поставщик</div>
                                        <FormControl fullWidth margin="dense" size="small">
                                            <Autocomplete
                                                sx={{ minWidth: '150px' }}
                                                fullWidth
                                                size="small"
                                                disablePortal
                                                options={providerOptions || []}
                                                getOptionLabel={(option) => option.label}
                                                value={providerOptions?.find(option => option.value === selectedProvider) || null}
                                                onChange={(event, newValue) => {
                                                    setSelectedProvider(newValue ? newValue.value : '');
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Выберите" />}
                                            />
                                        </FormControl>


                                        <AddProvider onSuccess={handleAddProviderSuccess} addProvider={true} />
                                    </div>
                                    <div className="provider-info">
                                        {selectedProvider && <table>
                                            <thead>
                                                <tr>
                                                    <th>Имя</th>
                                                    <th>Номер телефона</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProvider &&
                                                    <tr>
                                                        <td>{providerById.name}</td>
                                                        <td>{providerById.phone_number}</td>
                                                    </tr>}
                                            </tbody>
                                        </table>}
                                    </div>
                                    {selectedProvider && <div className="enter-product">
                                        <div className="title">Добавить продукт</div>
                                        <div className="header">
                                            {renderFields()}
                                            <Button className='btn' variant='contained' onClick={handleAddProduct} >Подтвердить</Button>
                                        </div>
                                        <div className="render-fields-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Продукт</th>
                                                        <th>Количество</th>
                                                        <th>Цена покупки</th>
                                                        <th>Цена продажи</th>
                                                        <th>Итого</th>
                                                        <th>Действия</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts?.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product.product?.label || ''}</td>
                                                            <td>{product.amount || ''}</td>
                                                            <td>{formatNumberWithCommas(product.import_price) || ''}</td>
                                                            <td>{formatNumberWithCommas(product.export_price) || ''}</td>
                                                            <td>{formatNumberWithCommas(product.total) || ''}</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <Button
                                                                    onClick={() => handleRemoveProduct(index)}
                                                                    variant='contained'
                                                                    color='error'
                                                                    size='small'
                                                                >
                                                                    Удалить
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                        <div />
                                    </div>}
                                </div>
                            </div>
                        </section>}
                </div>
            </main>
            {addOpen &&
                <AddItemModal providerById={providerById?.id} onSave={handleGetNewProduct} open={addOpen} onClose={() => setAddOpen(false)} />
            }
        </div>
    )
}

export default Import
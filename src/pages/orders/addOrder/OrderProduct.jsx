import React, { useCallback, useEffect, useState } from 'react';
import AddItemBtn from '../../../components/addItemBtn/AddItemBtn';
import useFetch from '../../../hooks/useFetch';
import OurProduct from '../../../services/landing/ourProduct';
import FormData from './FormData';
import OrderProducts from '../../../services/landing/orderProduct';

function OrderProduct({ onTotalChange, orderId, onSave }) {
    const [formConfig, setFormConfig] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [price, setPrice] = useState(0);
    const [amountProduct, setAmountProduct] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    const fetchProduct = useCallback(() => {
        if (selectedProductId) {
            return OurProduct.getProductById(selectedProductId);
        }
    }, [selectedProductId]);

    const { data: product } = useFetch(OurProduct.getProduct);
    const { data: productById } = useFetch(fetchProduct);

    useEffect(() => {
        if (product) {
            setProducts(product.results);
        }
    }, [product]);

    useEffect(() => {
        const totalSum = formData.reduce((acc, product) => acc + product.total, 0);
        onTotalChange(totalSum);
    }, [formData, onTotalChange]);

    useEffect(() => {
        if (productById) {
            setPrice(productById.export_price);
        }
    }, [productById]);
    
    useEffect(() => {
        if (productById) {
            setAmountProduct(productById.amount);
        }
    }, [productById]);

    const handleSave = (data) => {
        setFormData(prevData => {
            const updatedData = [...prevData, { ...data }];
            onSave(updatedData);
            return updatedData;
        });
        setFormConfig([]);
        setSelectedProductId(null);
        setPrice(0);
        setAmountProduct(0);
        setIsAdding(false);
    };

    const handleAddProduct = () => {
        setFormConfig([
            { type: 'select', label: 'Товар', name: 'product', options: products?.map(p => ({ label: p.name, value: p.id })), required: true },
            { type: 'number', label: 'Количество', name: 'amount', required: true },
            { type: 'number', label: 'Скидка', name: 'discount' },
            { type: 'number', label: 'Итого', name: 'total', required: true, disabled: true },
        ]);
        setIsAdding(true);
    };

    const onProductChange = (id) => {
        setSelectedProductId(id);
    };

    const handleSubmit = async () => {
        if (!orderId) {
            alert('ID заказа не установлен');
            return;
        }

        const postData = formData.map(product => ({
            order: orderId,
            amount: product.amount,
            product: product.product,
            discount: product.discount,
            total: product.total,
        }));

        try {
            for (const productData of postData) {
                const response = await OrderProducts.postOrders(productData);
                if (!response) {
                    alert('Не удалось отправить данные');
                    return;
                }
            }
            alert('Данные успешно отправлены');
        } catch (error) {
            alert(`Ошибка при отправке данных: ${error.message}`);
        } 
    };

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <div className='order-product'>
            <div className="header">
                {!isAdding && (
                    <AddItemBtn name='Добавить товар' onClick={handleAddProduct} />
                )}
            </div>
            <div className="order-product-content">
                <FormData formConfig={formConfig} onSave={handleSave} onProductIdChange={onProductChange} productPrice={price} productAmount={amountProduct} />
                <table>
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Количество</th>
                            <th>Скидка</th>
                            <th>Итого</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData?.map(product => (
                            <tr key={product.product}>
                                <td>{product.productName}</td>
                                <td>{product.amount}</td>
                                <td>{product.discount}</td>
                                <td>{formatNumberWithCommas(product.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderProduct;

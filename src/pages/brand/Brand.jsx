import { useCallback, useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import SideBar from '../../components/sidebar/SideBar';
import useFetch from '../../hooks/useFetch';
import ImportProduct from '../../services/landing/importProduct';
import './brand.css';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import OurProduct from '../../services/landing/ourProduct';
import Provider from './../../services/landing/provider';
import EditItem from './EditItem';
import { Close, Edit } from '@mui/icons-material';
import SearchInput from './../../helpers/SearchInput';
import Filter from './../../helpers/Filter';
import { useNavigate } from 'react-router-dom';
import useQueryParams from '../../helpers/useQueryParams';
import CustomPagination from '../../helpers/CustomPagination';

function Brand() {
    const headers = tableHeaders['importProduct'];
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [product, setProduct] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [formConfig, setFormConfig] = useState([]);
    const [editFormConfig, setEditFormConfig] = useState([]);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(15);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
    const [selectedFilter, setSelectedFilter] = useState(params.get('order_by') || 'created_at');

    const fetchOrders = useCallback((query) => {
        return ImportProduct.getImportProduct(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders, { page, page_size: pageSize, search: searchQuery, order_by: selectedFilter });
    const { data: ourProduct, loading: ourProductLoading, error: ourProductError } = useFetch(OurProduct.getProduct);
    const { data: provider, loading: providerLoading, error: providerError } = useFetch(Provider.getProvider);

    useEffect(() => {
        if (data) {
            setProduct(data.results);
        }
    }, [data]);

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
        if (params.get('order_by') !== selectedFilter) {
            setQueryParams({ order_by: selectedFilter });
        }
    }, [page, searchQuery, selectedFilter, params, setQueryParams]);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setPage(1);
    };

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        setQueryParams({ order_by: value });
        setPage(1);
    };

    const sortedOptions = [
        { value: 'total', label: '-' },
        { value: 'created_at', label: 'По дате (+)' },
        { value: '-created_at', label: 'По дате (-)' },
        { value: 'amount', label: 'Количество' },
        { value: 'import_price', label: 'Цена покупки' },
        { value: 'debt', label: 'Задолженность' },
    ]

    // Handle deleting a product
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await ImportProduct.deleteImportProduct(currentItem);
            setProduct(product.filter((c) => c.id !== currentItem));
            setSuccessMsg('Успешно удалено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении продукта!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    // Handle adding a product
    const handleAdd = () => {
        setFormConfig([
            { type: 'number', label: 'Количество', name: 'amount', required: true },
            { type: 'number', label: 'Сумма закупки', name: 'import_price', required: true },
            { type: 'number', label: 'Задолженность', name: 'debt', value: 0 },
            { type: 'select', label: 'Продукт', name: 'product', options: ourProduct && ourProduct?.results?.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'select', label: 'Поставщик', name: 'provider', options: provider && provider.map(p => ({ value: p.id, label: p.name })), required: true },
            { type: 'number', label: 'Общий', name: 'total', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newProduct = await ImportProduct.postImportProduct(item);
            setProduct([...product, newProduct]);
            setSuccessMsg(" Продукт успешно добавлен!");
            setSnackbarOpen(true);

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при добавлении продукта!");
            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };

    // Handle editing a product
    const handleEdit = (item) => {
        setCurrentItem(item);
        const calculatedTotal = item.import_price * item.amount - item.debt;

        setEditFormConfig([
            { type: 'text', label: 'Количество', name: 'amount', value: item.amount, disabled: true },
            { type: 'number', label: 'Сумма закупки', name: 'import_price', value: item.import_price, disabled: true },
            { type: 'number', label: 'Задолженность', name: 'debt', value: item.debt },
            { type: 'select', label: 'Продукт', name: 'product', options: ourProduct && ourProduct?.results.map(p => ({ value: p.id, label: p.name })), value: item.product.id, disabled: true },
            { type: 'select', label: 'Поставщик', name: 'provider', value: item.provider.id, options: provider.map(p => ({ value: p.id, label: p.name })), disabled: true },
            { type: 'number', label: 'Общий', name: 'total', value: calculatedTotal, disabled: true },
        ]);
        setEditOpen(true);
    };


    const updateProduct = async (formData) => {
        try {
            const updatedData = {
                amount: formData.amount,
                import_price: formData.import_price,
                total: formData.total,
                debt: formData.debt,
                product: formData.product.id ? formData.product.id : formData.product,
                provider: formData?.provider.id ? formData.provider.id : formData.provider
            };

            await ImportProduct.putImportProduct(currentItem.id, updatedData);

            const updatedItem = await ImportProduct.getImportProductById(currentItem.id);

            setProduct(product.map((p) => (p.id === currentItem.id ? updatedItem : p)));
            setSuccessMsg("Продукт успешно обновлен!");
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при обновлении продукта!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    const formattedData = product?.map((item, index) => {
        return (
            {
                ...item,
                row: (
                    <>
                        <td>{index + 1}</td>
                        <td>{item.product ? item.product.name : ''}</td>
                        <td>{new Date(item.created_at).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })}</td>

                        <td>{item.amount}</td>
                        <td>{formatNumberWithCommas(item.import_price)}</td>
                        <td>{formatNumberWithCommas(item.debt)}</td>
                        <td>{item.provider ? item.provider.name : ''}</td>
                        <td>{formatNumberWithCommas(item.total)}</td>
                    </>
                ),
            }
        );
    });

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };


    return (
        <div className='brand'>
            <SideBar />
            <main>
                <Navbar title='История' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput
                                searchValue={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                            <Filter
                                selectedFilter={selectedFilter}
                                onFilterChange={handleFilterChange}
                                options={sortedOptions}
                            />
                        </div>
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            loading={loading}
                            error={error}
                            tableHead={headers}
                            data={formattedData}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onRowClick={handleRowClick}
                            formConfig={[
                                { type: 'text', label: 'Количество', name: 'amount', required: true },
                                { type: 'number', label: 'Сумма закупки', name: 'import_price', required: true },
                                { type: 'number', label: 'Задолженность', name: 'debt', value: 0 },
                                { type: 'select', label: 'Продукт', name: 'product', options: ourProduct && ourProduct?.results?.map(p => ({ value: p.id, label: p.name })), required: true },
                                { type: 'select', label: 'Поставщик', name: 'provider', options: provider && provider.map(p => ({ value: p.id, label: p.name })), required: true },
                                { type: 'number', label: 'Общий', name: 'total', required: true },
                            ]}
                            onSave={createProduct}
                            dDelete={false}
                            showEditDelete={false}
                        />
                    </section>
                    <CustomPagination
                        count={data?.count ? Math.ceil(data.count / pageSize) : 0}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            </main>

            {/* Add Item Modal */}
            {addOpen &&
                <AddItemModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createProduct}
                />
            }

            {/* Edit Item Modal */}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={editFormConfig}
                    onSave={updateProduct}
                    initialData={currentItem}
                />
            }

            {/* Delete Confirmation Dialog */}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            }

            {/* Snackbar for Success/Error Messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={successMsg ? "success" : "error"} sx={{ width: '100%' }}>
                    {successMsg || errorMsg}
                </Alert>
            </Snackbar>

            {rowDetailOpen && currentItem && (
                <Dialog
                    open={rowDetailOpen}
                    onClose={() => setRowDetailOpen(false)}
                    PaperProps={{
                        style: {
                            minWidth: '400px',
                            borderRadius: 15,
                            padding: '20px',
                            backgroundColor: '#f5f5f5',
                            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                        }
                    }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#1e88e5',
                        color: '#fff',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
                    }}>
                        <Typography variant="h6">Детали продукта</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="body1"><strong>Название продукта:</strong> {currentItem.name}</Typography>
                        <Typography variant="body1"><strong>Количество:</strong> {currentItem.amount}</Typography>
                        <Typography variant="body1"><strong>Цена покупки:</strong> {formatNumberWithCommas(currentItem.import_price)}</Typography>
                        <Typography variant="body1"><strong>Задолженность:</strong> {formatNumberWithCommas(currentItem.debt)}</Typography>
                        <Typography variant="body1"><strong>Общий:</strong> {formatNumberWithCommas(currentItem.total)}</Typography>
                        <Typography variant="body1"><strong>Поставщик:</strong> {currentItem.provider ? currentItem.provider.name : '0'}</Typography>
                        <Typography variant="body1"><strong>Дата создания:</strong> {new Date(currentItem.created_at).toLocaleDateString()}</Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-between', padding: '0 20px 20px 20px' }}>
                        <IconButton onClick={() => handleEdit(currentItem)}>
                            <Edit style={{ color: 'orange', fontSize: '28px' }} />
                        </IconButton>
                        <Button onClick={() => setRowDetailOpen(false)} sx={{ color: '#1e88e5', fontWeight: 'bold' }}>
                            Закрыть
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}

export default Brand;
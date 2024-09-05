import { useCallback, useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import SideBar from '../../components/sidebar/SideBar';
import useFetch from '../../hooks/useFetch';
import AddProvider from './../../components/addProvider/AddProvider';
import './providerC.css';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import Provider from './../../services/landing/provider';
import EditItem from '../../components/editItem/EditItem';
import { Close, Edit } from '@mui/icons-material';
import SearchInput from './../../helpers/SearchInput';
import Filter from './../../helpers/Filter';
import { useNavigate } from 'react-router-dom';
import useQueryParams from '../../helpers/useQueryParams';
import CustomPagination from '../../helpers/CustomPagination';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';

function ProviderC() {
    const headers = tableHeaders['provider'];
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
    const [pageSize] = useState(100);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
    const [selectedFilter, setSelectedFilter] = useState(params.get('debt') || '');

    const fetchOrders = useCallback((query) => {
        return Provider.getProvider(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders, { page, page_size: pageSize, search: searchQuery, debt: selectedFilter });

    useEffect(() => {
        if (data) {
            setProduct(data);
        }
    }, [data]);

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
        if (params.get('debt') !== selectedFilter) {
            setQueryParams({ debt: selectedFilter });
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
        setQueryParams({ debt: value });
        setPage(1);
    };

    const sortedOptions = [
        { value: '', label: 'Все' },
        { value: 'true', label: 'В Задолженность' },
        { value: 'false', label: 'Без Задолженностьа' },
    ]

    // Handle deleting a product
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await Provider.deleteProvider(currentItem);
            setProduct(product.filter((c) => c.id !== currentItem));
            setSuccessMsg('Успешно удалено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    // Handle adding a product
    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'Имя', name: 'name', required: true },
            { type: 'text', label: 'Номер телефона', name: 'phone_number', required: true },
            { type: 'number', label: 'Задолженность', name: 'debt', required: true },
        ]);
        setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newProduct = await Provider.postProvider(item);
            setProduct((prevProducts) => [...prevProducts, newProduct]); // Yangi mahsulotni jadvalga qo'shish
            setSuccessMsg("Поставщик успешно добавлен!");
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при добавлении поставщика!");
            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };


    // Handle editing a product
    const handleEdit = (item) => {
        setCurrentItem(item);
        setEditFormConfig([
            { type: 'text', label: 'Имя', name: 'name', value: item.name },
            { type: 'text', label: 'Номер телефона', name: 'phone_number', value: item.phone_number },
            { type: 'number', label: 'Задолженность', name: 'debt', required: true, value: item.debt },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (formData) => {
        try {
            const updatedData = {
                name: formData.name,
                phone_number: formData.phone_number,
                debt: formData.debt,
            };

            await Provider.putProviderById(currentItem.id, updatedData);

            const updatedItem = await Provider.getProviderById(currentItem.id);

            setProduct(product.map((p) => (p.id === currentItem.id ? updatedItem : p)));
            setSuccessMsg("Поставщик успешно обновлен!");
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при обновлении поставщика!");
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
                        <td>{item.name}</td>
                        <td>{item.phone_number}</td>
                        <td>{formatNumberWithCommas(item.debt)}</td>
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
                <Navbar title="Поставщик" />
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
                        <div className="header-items-add">
                            <AddItemBtn onClick={handleAdd} name="Поставщик" />
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
                            showEditDelete={true}
                        />
                    </section>
                    <CustomPagination
                        count={data?.length ? Math.ceil(data?.length / pageSize) : 0}
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
                    name="Добавить поставщика"
                />
            }

            {/* Edit Item Modal */}
            {editOpen &&
                <EditItem
                    name="Редактировать поставщика"
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
                    name="Этого поставщика"
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
                        <Typography variant="h6">Детали Поставщик</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="body1"><strong>Имя:</strong> {currentItem.name}</Typography>
                        <Typography variant="body1"><strong>Номер телефона:</strong> {currentItem.phone_number}</Typography>
                        <Typography variant="body1"><strong>Задолженность:</strong> {formatNumberWithCommas(currentItem.debt)}</Typography>
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

export default ProviderC;
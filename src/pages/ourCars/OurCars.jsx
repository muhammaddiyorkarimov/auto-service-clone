import React, { useState, useCallback, useEffect } from 'react';
import './ourCars.css';
import SideBar from '../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import { Close } from '@mui/icons-material';
import SearchInput from '../../helpers/SearchInput';
import DataTable from '../../components/dataTable/DataTable';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import EditItem from '../../components/editItem/EditItem';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material';
import CustomPagination from '../../helpers/CustomPagination';
import useQueryParams from '../../helpers/useQueryParams';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import CarsService from './../../services/landing/carsService';
import { tableHeaders } from '../../components/details/Details';
import CustomersService from '../../services/landing/customers';
import Filter from '../../helpers/Filter';

function OurCars() {
    const navigate = useNavigate();
    const location = useLocation();

    const headers = tableHeaders['cars']; // Jadval uchun sarlavhalar

    const [carsItem, setCarsItem] = useState([]);
    const [customerItem, setCustomerItem] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const [params, setQueryParams] = useQueryParams();
    const [selectedFilter, setSelectedFilter] = useState(params.get('order_by') || 'name');


    const sortedOptions = [
        { label: "Артикул", value: "code" },
        { label: "Название", value: "name" },
        { label: "Государственный номер", value: "state_number" },
    ];

    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(15);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');

    const fetchCars = useCallback((query) => {
        return CarsService.getCars(query);
    }, []);

    const { data, loading, error } = useFetch(fetchCars, { page, page_size: pageSize, search: searchQuery, order_by: selectedFilter });
    const { data: customersData } = useFetch(CustomersService.getCustomers);

    useEffect(() => {
        if (data) {
            setCarsItem(data.results)
        }
        if (customersData) {
            setCustomerItem(customersData.results)
        }
    }, [data])

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

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    // handle add
    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'Артикул', name: 'code', required: true },
            { type: 'text', label: 'Название', name: 'name', required: true },
            { type: 'text', label: 'Бренд', name: 'brand', required: true },
            { type: 'text', label: 'Цвет', name: 'color', required: true },
            { type: 'text', label: 'Государственный номер', name: 'state_number', required: true },
            { type: 'select', label: 'Клиент', name: 'customer', options: customersData?.results.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })), required: true },
        ]);
        setAddOpen(true);
    };

    const createCar = async (item) => {
        try {
            const newCar = await CarsService.postCars(item);
            setCarsItem([...carsItem, newCar]);
            setSuccessMsg('Автомобиль успешно добавлен!');
            setSnackbarOpen(true);
            setAddOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при добавлении автомобиля!');
            setSnackbarOpen(true);
        }
    };

    // handle edit
    const handleEdit = async (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'text', label: 'Артикул', name: 'code', value: item.code },
            { type: 'text', label: 'Название', name: 'name', value: item.name },
            { type: 'text', label: 'Бренд', name: 'brand', value: item.brand },
            { type: 'text', label: 'Цвет', name: 'color', value: item.color },
            { type: 'text', label: 'Государственный номер', name: 'state_number', value: item.state_number },
            { type: 'select', label: 'Клиент', name: 'customer', value: item.customer.id, options: customersData?.results.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })) },
        ]);
        setEditOpen(true);
    };

    const updateCar = async (updatedData) => {
        const formattedData = {
            code: updatedData.code,
            name: updatedData.name,
            brand: updatedData.brand,
            color: updatedData.color,
            state_number: updatedData.state_number,
            customer: updatedData.customer?.id ? updatedData.customer.id : updatedData.customer,
        };

        try {
            const updatedCar = await CarsService.putCarsById(currentItem.id, formattedData);
            setCarsItem(carsItem.map(o => o.id === currentItem.id ? updatedCar : o));
            setSuccessMsg('Автомобиль успешно обновлен!');
            setSnackbarOpen(true);
            setEditOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при обновлении автомобиля!');
            setSnackbarOpen(true);
        }
    };

    // handle delete
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await CarsService.deleteCars(currentItem);
            setCarsItem(carsItem.filter(o => o.id !== currentItem));
            setSuccessMsg('Автомобиль успешно удалён!');
            setSnackbarOpen(true);
            setDeleteOpen(false);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении автомобиля!');
            setSnackbarOpen(true);
        }
    };

    const formattedData = carsItem?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.brand}</td>
                <td>{item.color}</td>
                <td>{item.state_number}</td>
                <td>{item.customer ? item.customer.first_name + ' ' + item.customer.last_name : '0'}</td>
            </>
        )
    }));

    return (
        <div className='customers'>
            <SideBar />
            <main>
                <Navbar title='Автомобили' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            {/* Search komponenti */}
                            <SearchInput
                                searchValue={searchQuery}
                                onSearchChange={handleSearchChange}
                            />

                            {/* Filter komponenti */}
                            <Filter
                                selectedFilter={selectedFilter}
                                onFilterChange={handleFilterChange}
                                options={sortedOptions}
                            />
                        </div>
                        <div className="header-items-add">
                            <AddItemBtn name="Добавить автомобиль" onClick={handleAdd} />
                        </div>
                    </div>
                    <section className="details-wrapper">
                        <DataTable
                            error={error}
                            loading={loading}
                            tableHead={headers}
                            data={formattedData}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRowClick={handleRowClick}
                            showEditDelete={true}
                        />
                    </section>
                    <CustomPagination
                        count={Math.ceil(data?.count / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            </main>

            {addOpen &&
                <AddItemModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createCar}
                    name="Добавить автомобиль"
                />}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateCar}
                    initialData={currentItem}
                    name="Редактировать этот автомобиль"
                />}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    name="Этот автомобиль"
                />}

            {rowDetailOpen && (
                <Dialog
                    open={rowDetailOpen}
                    onClose={() => setRowDetailOpen(false)}
                    PaperProps={{
                        style: {
                            borderRadius: 15,
                            maxWidth: '600px'
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
                        <Typography variant="h6">Детали автомобиля</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" gutterBottom><strong>Артикул:</strong> {currentItem?.code}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Название:</strong> {currentItem?.name}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Бренд:</strong> {currentItem?.brand}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Цвет:</strong> {currentItem?.color}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Государственный номер:</strong> {currentItem?.state_number}</Typography>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={() => setRowDetailOpen(false)} color="primary">
                            Закрыть
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={errorMsg ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {errorMsg || successMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default OurCars;

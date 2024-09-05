import './customers.css'
import SideBar from '../../components/sidebar/SideBar'
import Navbar from '../../components/navbar/Navbar'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import { Close } from '@mui/icons-material'
import SearchInput from '../../helpers/SearchInput'
import DataTable from '../../components/dataTable/DataTable'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material'
import CustomPagination from '../../helpers/CustomPagination'
import useQueryParams from '../../helpers/useQueryParams'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomersService from '../../services/landing/customers'
import { useCallback, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Filter from './../../helpers/Filter';
import { tableHeaders } from '../../components/details/Details'

function Customers() {
    const navigate = useNavigate();
    const location = useLocation();

    const [customersItem, setCustomersItem] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const headers = tableHeaders['customers']; // Jadval uchun sarlavhalar

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(15);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');

    const fetchOrders = useCallback((query) => {
        return CustomersService.getCustomers(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders, { page, page_size: pageSize, search: searchQuery });

    useEffect(() => {
        if (data) {
            setCustomersItem(data.results)
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

    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
    }, [page, searchQuery, params, setQueryParams]);

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    // handle add
    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'Имя', name: 'first_name', required: true },
            { type: 'text', label: 'Фамилия', name: 'last_name', required: true },
            { type: 'text', label: 'Номер телефона', name: 'phone_number', required: true },
            { type: 'text', label: 'Дополнительный номер телефона', name: 'phone_number_extra' },
            { type: 'text', label: 'Серия паспорта', name: 'passport_serial_numbers' },
            { type: 'text', label: 'Номер паспорта', name: 'passport_serial_letters' },
            { type: 'text', label: 'Адрес', name: 'address' },
            { type: 'number', label: 'Задолженность', name: 'debt', required: true, value: 0 },
        ]);
        setAddOpen(true);
    };

    const createCustomer = async (item) => {
        try {
            const newCustomer = await CustomersService.postCustomers(item);
            setCustomersItem([...customersItem, newCustomer]);
            setSuccessMsg('Клиент успешно добавлен!');
            setSnackbarOpen(true);
            setAddOpen(false);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при добавлении клиента!');
            setSnackbarOpen(true);
        }
    };

    // handle edit
    const handleEdit = async (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'text', label: 'Имя', name: 'first_name', value: item.first_name },
            { type: 'text', label: 'Фамилия', name: 'last_name', value: item.last_name },
            { type: 'text', label: 'Номер телефона', name: 'phone_number', value: item.phone_number },
            { type: 'text', label: 'Дополнительный номер телефона', name: 'phone_number_extra', value: item.phone_number_extra },
            { type: 'text', label: 'Серия паспорта', name: 'passport_serial_numbers', value: item.passport_serial_numbers },
            { type: 'text', label: 'Номер паспорта', name: 'passport_serial_letters', value: item.passport_serial_letters },
            { type: 'text', label: 'Адрес', name: 'address', value: item.address },
            { type: 'number', label: 'Задолженность', name: 'debt', value: item.debt },
        ]);
        setEditOpen(true);
    };

    const updateCustomer = async (updatedData) => {
        const formattedData = {
            first_name: updatedData.first_name,
            last_name: updatedData.last_name,
            phone_number: updatedData.phone_number,
            phone_number_extra: updatedData.phone_number_extra,
            passport_serial_numbers: updatedData.passport_serial_numbers,
            passport_serial_letters: updatedData.passport_serial_letters,
            address: updatedData.address,
            debt: updatedData.debt,
        };

        try {
            const updatedCustomer = await CustomersService.putCustomersById(currentItem.id, formattedData);
            setCustomersItem(customersItem.map(o => o.id === currentItem.id ? updatedCustomer : o));
            setSuccessMsg('Клиент успешно обновлён!');
            setSnackbarOpen(true);
            setEditOpen(false);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при обновлении клиента!');
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
            await CustomersService.deleteCustomers(currentItem);
            setCustomersItem(customersItem?.filter(o => o.id !== currentItem));
            setSuccessMsg('Клиент успешно удалён!');
            setSnackbarOpen(true);
            setDeleteOpen(false);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении клиента!');
            setSnackbarOpen(true);
        }
    };

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const formattedData = customersItem?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{item.first_name + ' ' + item.last_name}</td>
                <td>{item.phone_number}</td>
                <td>{formatNumberWithCommas(item.debt)}</td>
                <td>{item.address}</td>
            </>
        )
    }));

    return (
        <div className='customers'>
            <SideBar />
            <main>
                <Navbar title='Клиенты' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput
                                searchValue={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                        </div>
                        <div className="header-items-add">
                            <AddItemBtn name="Добавить клиента" onClick={handleAdd} />
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
                    onSave={createCustomer}
                    name="Добавить клиента"
                />}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateCustomer}
                    initialData={currentItem}
                    name="Редактировать клиента"
                />}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    name="Этого клиента"
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
                        <Typography variant="h6">Детали клиента</Typography>
                        <IconButton onClick={() => setRowDetailOpen(false)} style={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Add details here */}
                        <Typography variant="h6" sx={{ marginTop: '18px' }}>{currentItem?.first_name} {currentItem?.last_name}</Typography>
                        <Divider />
                        <Typography><strong>Номер телефона:</strong> {currentItem?.phone_number}</Typography>
                        <Typography><strong>Дополнительный номер телефона:</strong> {currentItem?.phone_number_extra}</Typography>
                        <Typography><strong>Серия паспорта:</strong> {currentItem?.passport_serial_numbers}</Typography>
                        <Typography><strong>Номер паспорта:</strong> {currentItem?.passport_serial_letters}</Typography>
                        <Typography><strong>Адрес:</strong> {currentItem?.address}</Typography>
                        <Typography><strong>Задолженность:</strong> {formatNumberWithCommas(currentItem?.debt)}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRowDetailOpen(false)}>Закрыть</Button>
                    </DialogActions>
                </Dialog>
            )}

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
        </div>

    )
}

export default Customers
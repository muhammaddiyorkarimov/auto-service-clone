import './orders.css';
import { useEffect, useState, useCallback } from 'react';
import SideBar from './../../components/sidebar/SideBar';
import Navbar from '../../components/navbar/Navbar';
import DataTable from '../../components/dataTable/DataTable';
import { tableHeaders } from '../../components/details/Details';
import useFetch from '../../hooks/useFetch';
import OrdersSerivce from './../../services/landing/orders';
import AddItemBtn from '../../components/addItemBtn/AddItemBtn';
import CustomerService from './../../services/landing/customers';
import AddItemModal from '../../components/addItemModal/AddItemModal';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteProduct from '../../components/deleteProduct/DeleteProduct';
import EditItem from '../../components/editItem/EditItem';
import useQueryParams from './../../helpers/useQueryParams';
import CustomPagination from '../../helpers/CustomPagination';
import SearchInput from './../../helpers/SearchInput';

function Orders() {
    const navigate = useNavigate();
    const headers = tableHeaders['orders'];

    const [ordersC, setOrdersC] = useState([]);
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(15);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');

    const fetchOrders = useCallback((query) => {
        return OrdersSerivce.getOrders(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders, { page, page_size: pageSize, search: searchQuery });
    const { data: customersData, loading: customersLoading, error: customersError } = useFetch(CustomerService.getCustomers);

    useEffect(() => {
        setOrdersC(data?.results || []);
    }, [data]);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
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
        navigate(`/orders/${item.id}`);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setPage(1);
    };

    const handleAdd = () => {
        setFormConfig([
            { type: 'number', label: "Оплачено", name: 'paid', required: true },
            { type: 'number', label: 'Задолженность', name: 'debt', required: true },
            { type: 'select', label: 'Клиент', name: 'customer', options: customersData?.results?.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })), required: true },
            { type: 'number', label: 'Общий', name: 'total', required: true },
        ]);
        navigate('/add-order')
        // setAddOpen(true);
    };

    const createProduct = async (item) => {
        try {
            const newOrder = await OrdersSerivce.postOrders(item);
            setOrdersC([...ordersC, newOrder]);
            setSuccessMsg("Успешно добавлено");
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            setErrorMsg(error.message || "Произошла ошибка!");
            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };

    const handleEdit = (item) => {
        const computedTotal = item.debt + item.paid;
        const updatedItem = {
            ...item,
            total: computedTotal
        };
        setCurrentItem(updatedItem);
        setFormConfig([
            { type: 'number', label: "Оплачено", name: 'paid', value: item.paid },
            { type: 'number', label: 'Задолженность', name: 'debt', value: item.debt },
            { type: 'select', label: 'Клиент', name: 'customer', value: item.customer.id, options: customersData?.results?.map(c => ({ value: c.id, label: (c.first_name + ' ' + c.last_name) })) },
            { type: 'number', label: 'Общий', name: 'total', value: computedTotal },
        ]);
        
        setEditOpen(true);
    };
    

    const updateProduct = async (updatedData) => {
        const formattedData = {
            total: updatedData.total,
            paid: updatedData.paid,
            debt: updatedData.debt,
            customer: updatedData.customer.id ? updatedData.customer.id : updatedData.customer
        };

        try {
            const updatedOrder = await OrdersSerivce.putOrdersById(currentItem.id, formattedData);
            setOrdersC(ordersC.map(o => o.id === currentItem.id ? updatedOrder : o));
            setSuccessMsg('Успешно обновлено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при обновлении!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };

    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            await OrdersSerivce.deleteOrders(currentItem);
            setOrdersC(ordersC?.filter(o => o.id !== currentItem));
            setSuccessMsg('Успешно удалено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }    

    const formattedData = ordersC?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{formatNumberWithCommas(item.paid)}</td>
                <td>{formatNumberWithCommas(item.debt)}</td>
                <td>{item.customer ? item.customer.first_name + ' ' + item.customer.last_name : '0'}</td>
                <td>{formatNumberWithCommas(item.debt + item.paid)}</td>
            </>
        )
    }));

    return (
        <div className="orders">
            <SideBar />
            <main>
                <Navbar title="Заказы"/>
                <div className="extra-items">
                    <div className="header-items">
                        <SearchInput searchValue={searchQuery} onSearchChange={handleSearchChange} />
                        <AddItemBtn name="Добавить заказ" onClick={handleAdd} />
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
                            dDelete={false}
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
                    name="Добавить новый заказ"
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createProduct}
                />}
            {editOpen &&
                <EditItem
                    name="Редактировать заказ"
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateProduct}
                    initialData={currentItem}
                />}
            {deleteOpen &&
                <DeleteProduct
                    name="Этот заказ"
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />}

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
    );
}

export default Orders;

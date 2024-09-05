import { useCallback, useEffect, useState } from 'react'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import { tableHeaders } from '../../components/details/Details'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import './employees.css'
import useFetch from '../../hooks/useFetch'
import EmployeesService from '../../services/landing/employees'
import DataTable from '../../components/dataTable/DataTable'
import useQueryParams from '../../helpers/useQueryParams'
import SearchInput from '../../helpers/SearchInput'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'
import { Alert, Snackbar } from '@mui/material'
import { useSelector } from 'react-redux'

function Employees() {
    const headers = tableHeaders['employees']
    const [employessData, setEmployeesData] = useState([])
    const [formConfig, setFormConfig] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [params, setQueryParams] = useQueryParams();
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');

    const fetchOrders = useCallback((query) => {
        return EmployeesService.getEmployees(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrders)

    useEffect(() => {
        if (data) {
            setEmployeesData(data)
        }
    }, [data])

    useEffect(() => {
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
    }, [searchQuery, params, setQueryParams]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: "Логин", name: 'username', required: true },
            { type: 'text', label: "Пароль", name: 'password', required: true },
            { type: 'text', label: "Имя", name: 'first_name' },
            { type: 'text', label: "Фамилия", name: 'last_name' },
            { type: 'text', label: "Номер телефона", name: 'phone_number' },
            { type: 'text', label: "Профессия", name: 'position' },
        ])
        setAddOpen(true);
    }

    const createStaff = async (item) => {
        try {
            const staffWithPassword = { ...item, password: '12345678' };
            const newStaff = await EmployeesService.postEmployees(item);
            setEmployeesData([...employessData, newStaff]);
            setSuccessMsg("Сотрудник добавлен");
            setSnackbarOpen(true);
        } catch (error) {
            console.log(error.response.data);

            if (error.response && Array.isArray(error.response.data)) {
                const errorMessages = error.response.data.map(err => err).join(', ');
                setErrorMsg(errorMessages);
            } else {
                setErrorMsg(error.message || "Ошибка при добавлении сотрудника!");
            }

            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'text', label: "Имя пользователя", name: 'username', value: 'username' },
            { type: 'text', label: "Имя", name: 'first_name', value: 'first_name' },
            { type: 'text', label: "Фамилия", name: 'last_name', value: 'last_name' },
            { type: 'text', label: "Номер телефона", name: 'phone_number', value: 'phone_number' },
            { type: 'text', label: "Профессия", name: 'position', value: 'position' },
        ])
        setEditOpen(true);
    };

    const updateProduct = async (updatedData) => {
        const formattedData = {
            username: updatedData.username,
            first_name: updatedData.first_name,
            last_name: updatedData.last_name,
            phone_number: updatedData.phone_number,
            position: updatedData.position,
            salary: updatedData.salary,
            part: updatedData.part,
        };

        try {
            const updatedStaff = await EmployeesService.putEmployeesById(currentItem.id, formattedData);
            setEmployeesData(employessData.map(o => o.id === currentItem.id ? updatedStaff : o));
            setSuccessMsg('Успешно обновлено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при обновлении!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };

    const formattedData = employessData?.map((employee, index) => ({
        ...employee,
        row: (
            <>
                <td>{index + 1}</td>
                <td>{employee.username}</td>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.position}</td>
            </>
        )
    }))

    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            await EmployeesService.deleteEmployees(currentItem);
            setEmployeesData(employessData?.filter(o => o.id !== currentItem));
            setSuccessMsg('Успешно удалено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    const { user } = useSelector((state) => state.auth);

    return (
        <div className='employees'>
            <SideBar />
            <main>
                <Navbar title='Сотрудники' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            {/* <SearchInput searchValue={searchQuery} onSearchChange={handleSearchChange} /> */}
                        </div>
                        <div className="header-items-add">
                            <AddItemBtn name="Добавить сотрудника" onClick={handleAdd} />
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
                            // onRowClick={handleRowClick}
                            dNone={false}
                            showEditDelete={user?.role === 'Admin'}
                        />
                    </section>
                </div>
            </main>

            {addOpen &&
                <AddItemModal
                    name="Добавить сотрудника"
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createStaff}
                />}
            {editOpen &&
                <EditItem
                    name="Редактировать существующего сотрудника"
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateProduct}
                    initialData={currentItem}
                />}
            {deleteOpen &&
                <DeleteProduct
                    name="Этого сотрудника"
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

    )
}

export default Employees
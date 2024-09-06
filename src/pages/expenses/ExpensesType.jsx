import { useCallback, useEffect, useState } from 'react'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import DataTable from '../../components/dataTable/DataTable'
import { tableHeaders } from '../../components/details/Details'
import Navbar from '../../components/navbar/Navbar'
import SideBar from '../../components/sidebar/SideBar'
import CustomPagination from '../../helpers/CustomPagination'
import SearchInput from '../../helpers/SearchInput'
import useQueryParams from '../../helpers/useQueryParams'
import './expenses.css'
import ExpensesService from './../../services/landing/expensesSerive';
import ExpensesTypeService from './../../services/landing/expensesTypeSerive';
import useFetch from '../../hooks/useFetch'
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Snackbar, Typography } from '@mui/material'
import { Close, Edit } from '@mui/icons-material'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'
import ExpensesType from './expensesType/ExpensesType'
import { useNavigate } from 'react-router-dom'

function ExpensesTypeC({handleAddE}) {

    const navigate = useNavigate()

    const headers = tableHeaders['expensesType']

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
    const [expensesTypeData, setExpensesTypeData] = useState([]);
    const [checked, setChecked] = useState(true);

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(15);
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');

    const fetchExpensesType = useCallback((query) => {
        return ExpensesTypeService.getExpensesTypeService(query);
    }, []);

    const { data: expensesType, loading, error } = useFetch(fetchExpensesType, {page, page_size: pageSize, search: searchQuery})

    useEffect(() => {
        if (expensesType) {
            setExpensesTypeData(expensesType.results)
        }
    }, [expensesType]);


    useEffect(() => {
        if (params.get('page') !== page.toString()) {
            setQueryParams({ page });
        }
        if (params.get('search') !== searchQuery) {
            setQueryParams({ search: searchQuery });
        }
    }, [page, searchQuery, params, setQueryParams]);

    const handlePageChange = (event, value) => {
        setPage(value);
        setQueryParams({ page: value });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setPage(1);
    };

    // Handle deleting a product
    const handleDelete = (item) => {
        setCurrentItem(item.id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await ExpensesTypeService.deleteExpensesTypeService(currentItem);
            setExpensesTypeData(expensesTypeData.filter((c) => c.id !== currentItem));
            setSuccessMsg('Успешно удалено!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || 'Ошибка при удалении!');
            setSnackbarOpen(true);
        } finally {
            setDeleteOpen(false);
        }
    };

    const handleNewExpensesType = (item) => {
        setExpensesTypeData((prevExpenses) => [item, ...prevExpenses]);
    };

    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'тип расхода', name: 'name', required: true },
        ]);
        setAddOpen(true);
    };


    const createProduct = async (item) => {

        const postProduct = {
            name: item.name,
        }
        try {
            const newProduct = await ExpensesTypeService.postExpensesTypeService(postProduct);
            setExpensesTypeData([...expensesTypeData, newProduct]);
            setSuccessMsg("Расход успешно добавлен!");
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при добавлении расхода!");
            setSnackbarOpen(true);
        } finally {
            setAddOpen(false);
        }
    };

    // Handle editing a product
    const handleEdit = (item) => {
        setCurrentItem(item);
        setEditFormConfig([
            { type: 'text', label: 'тип расхода', name: 'name', value: item.name, required: true },
        ]);
        setEditOpen(true);
    };

    const updateProduct = async (formData) => {
        console.log(formData);
        try {
            const updatedData = {
                name: formData.name ? formData.name : formData.name,
            };
            console.log(updatedData);
            
            await ExpensesService.putExpensesService(currentItem.id, updatedData);

            const updatedItem = await ExpensesService.getExpensesServiceById(currentItem.id);

            setExpensesTypeData(expensesTypeData.map((p) => (p.id === currentItem.id ? updatedItem : p)));
            setSuccessMsg("Расход успешно обновлен!");
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при обновлении расхода!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }
    };
    
    const formattedData = expensesTypeData?.map((item, index) => {
        return {
            ...item,
            row: (
                <>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                </>
            ),
        };
    });


    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked); // Checkboxning holatini yangilash
    };

   
    useEffect(() => {
        if (checked) {
            navigate('/expenses-type'); 
        } else {
            navigate('/expenses');
        }
    }, [checked, navigate]); 

    return (
        <div className='expenses'>
            <SideBar />
            <main>
                <Navbar title='Расходы' />
                <div className="extra-items">
                    <div className="header-items">
                        {/* <div>
                            <SearchInput
                                searchValue={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                        </div> */}
                        <div className="header-items-add">
                            <FormGroup>
                                <FormControlLabel onChange={handleCheckboxChange} control={<Checkbox defaultChecked />} label="тип расхода" labelPlacement='start'/>
                            </FormGroup>
                            <ExpensesType onNewExpenseType={handleNewExpensesType} />
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
                            showEdit={true}
                            dNone={false}
                        />
                    </section>
                    <CustomPagination
                        count={expensesType?.count ? Math.ceil(expensesType.count / pageSize) : 0}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            </main>

            {/* Add Item Modal */}
            {addOpen &&
                <AddItemModal
                    // expensesType={true}
                    name="Добавить расход"
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
                    name="Изменить эту расход"
                />
            }

            {/* Delete Confirmation Dialog */}
            {deleteOpen &&
                <DeleteProduct
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    name='Этот расход'
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
        </div>

    )
}

export default ExpensesTypeC
import SearchInput from '../../helpers/SearchInput'
import './income.css'
import AddProvider from '../../components/addProvider/AddProvider'
import AddItemBtn from '../../components/addItemBtn/AddItemBtn'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import useQueryParams from '../../helpers/useQueryParams'
import useFetch from '../../hooks/useFetch'
import OurProductService from '../../services/landing/ourProduct'
import Provider from '../../services/landing/provider'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, Typography } from '@mui/material'
import SideBar from '../../components/sidebar/SideBar'
import Navbar from '../../components/navbar/Navbar'
import { tableHeaders } from '../../components/details/Details'
import DataTable from '../../components/dataTable/DataTable'
import CustomPagination from '../../helpers/CustomPagination'
import AddItemModal from '../../components/addItemModal/AddItemModal'
import EditItem from '../../components/editItem/EditItem'
import DeleteProduct from '../../components/deleteProduct/DeleteProduct'
import Filter from '../../helpers/Filter'
import { Close, Edit } from '@mui/icons-material'

function OurProduct() {
    const headers = tableHeaders['ourProduct'];

    const [ourProduct, setOurProduct] = useState([])
    const [provider, setProvider] = useState([])
    const [formConfig, setFormConfig] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [rowDetailOpen, setRowDetailOpen] = useState(false);

    const [params, setQueryParams] = useQueryParams();
    const [page, setPage] = useState(Number(params.get('page')) || 1);
    const [pageSize] = useState(15);

    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
    const [selectedFilter, setSelectedFilter] = useState(params.get('order_by') || 'name');
    const [selectedFilterDebt, setSelectedFilterDebt] = useState(params.get('order_by') || '');
    const [availableFilter, setAvailableFilter] = useState(params.get('import_required') || 'false');

    const fetchOrderProduct = useCallback((query) => {
        return OurProductService.getProduct(query);
    }, []);

    const { data, loading, error } = useFetch(fetchOrderProduct, { page, page_size: pageSize, search: searchQuery, import_required: availableFilter, order_by: selectedFilter });
    const { data: providersData } = useFetch(Provider.getProvider);

    useEffect(() => {
        if (data) {
            setOurProduct(data.results);
        }
        if (providersData) {
            setProvider(providersData);
        }
    }, [data, providersData]);

    const sortedOptions = [
        { value: 'name', label: 'Название' },
        { value: 'code', label: 'Артикул' },
        { value: 'amount', label: 'Количество' },
        { value: 'max_discount', label: 'Скидка' }
    ]

    const debtOptions = [
        { value: 'false', label: '-' },
        { value: 'true', label: 'Заканчивающиеся товары' },
    ]
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
        if (params.get('import_required') !== availableFilter) {
            setQueryParams({ import_required: availableFilter });
        }
    }, [page, searchQuery, selectedFilter, params, setQueryParams, availableFilter]);

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
    const handleFilterChange2 = (value) => {
        setAvailableFilter(value)
        setQueryParams({ import_required: value });
        setPage(1);
    };

    const unitOptions = [
        { id: 1, name: 'Штука' },
        { id: 2, name: 'Комплект' },
        { id: 3, name: 'Литр' },
    ]

    const handleAdd = () => {
        setFormConfig([
            { type: 'text', label: 'Артикул', name: 'code' },
            { type: 'text', label: 'Название', name: 'name', required: true },
            { type: 'number', label: 'Количество', name: 'amount', required: true },
            { type: 'number', label: 'Минимальное количество', name: 'min_amount', required: true },
            { type: 'select', label: 'Единица', name: 'unit', required: true, options: unitOptions.map(p => ({ value: p.id, label: p.name })) },
            { type: 'number', label: 'Цена покупки', name: 'import_price', required: true },
            { type: 'number', label: 'Цена продажи', name: 'export_price' },
            { type: 'number', label: 'Макс. скидка', name: 'max_discount', required: true,  },
            {
                type: 'select', label: 'Поставщик', name: 'provider', required: true, options: provider?.map(p => ({ value: p.id, label: p.name }))
            }
        ]);
        setAddOpen(true);
    }

    const createProduct = async (item) => {
        try {
            const newProduct = await OurProductService.postProduct(item);
            setOurProduct([...ourProduct, newProduct]);
            const updatedProvider = await Provider.getProvider(); // Yangi ma'lumotlarni olish
            setProvider(updatedProvider);
            setSuccessMsg("Успешно добавлено");
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

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormConfig([
            { type: 'text', label: 'Артикул', name: 'code', value: item.code },
            { type: 'text', label: 'Название', name: 'name', value: item.name },
            { type: 'number', label: 'Количествоr', name: 'min_amount', value: item.min_amount },
            { type: 'number', label: 'Минимальное количество', name: 'amount', value: item.amount },
            { type: 'select', label: 'Единица', name: 'unit', required: true, options: unitOptions.map(p => ({ value: p.id, label: p.name })), value: item.unit },
            { type: 'number', label: 'Цена покупки', name: 'import_price', value: item.import_price },
            { type: 'number', label: 'Цена продажи', name: 'export_price', value: item.export_price },
            { type: 'number', label: 'Скидка', name: 'max_discount', value: item.max_discount },
            {
                type: 'select', label: 'Поставщик', name: 'provider', value: item.provider?.id, options: provider?.map(p => ({ value: p.id, label: p.name }))
            }
        ]);
        setEditOpen(true);
    }

    const updateProduct = async (updatedData) => {
        const formattedData = {
            code: updatedData.code,
            name: updatedData.name,
            min_amount: updatedData.min_amount,
            amount: updatedData.amount,
            unit: updatedData.unit,
            import_price: updatedData.import_price,
            export_price: updatedData.export_price,
            max_discount: updatedData.max_discount,
            provider: updatedData?.provider.id ? updatedData.provider.id : updatedData.provider
        }
        try {
            const updatedProduct = await OurProductService.putProductById(currentItem.id, formattedData);
            setOurProduct(ourProduct.map(o => o.id === currentItem.id ? updatedProduct : o));
            setSuccessMsg('Продукт успешно обновлен!');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 500);
            setSuccessMsg('Продукт успешно обновлен!');
            setSnackbarOpen(true);
        } catch (error) {
            setErrorMsg(error.message || "Ошибка при обновлении продукта!");
            setSnackbarOpen(true);
        } finally {
            setEditOpen(false);
        }

    }

    const handleDelete = (item) => {
        setCurrentItem(item.id)
        setDeleteOpen(true)
    }

    const handleDeleteConfirm = async (item) => {
        try {
            await OurProductService.deleteProduct(currentItem);
            setOurProduct(ourProduct.filter(o => o.id !== currentItem));
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


    const formattedData = ourProduct?.map((item, index) => ({
        ...item,
        row: (
            <>
                <td>{index + 1}</td>
                <td style={{ color: item.amount < item.min_amount ? 'red' : 'inherit' }}>
                    {item.name}
                </td>
                <td>{item.code}</td>
                <td>{item.amount}</td>
                <td>{item.unit}</td>
                <td>{formatNumberWithCommas(item.import_price)}</td>
                <td>{formatNumberWithCommas(item.export_price)}</td>
                <td>{item.max_discount}%</td>
                <td>{formatNumberWithCommas(item.export_price * item.max_discount / 100)}</td>
                <td>{item.provider ? item.provider.name : '0'}</td>
                <td>{formatNumberWithCommas(item.total_benefit ? item.total_benefit : '0')}</td>
            </>
        )
    }));

    const handleRowClick = (item) => {
        setCurrentItem(item);
        setRowDetailOpen(true);
    };

    return (
        <div className='income'>
            <SideBar />
            <main>
                <Navbar title='Товары' />
                <div className="extra-items">
                    <div className="header-items">
                        <div>
                            <SearchInput searchValue={searchQuery} onSearchChange={handleSearchChange} />
                            <Filter selectedFilter={selectedFilter} onFilterChange={handleFilterChange} options={sortedOptions} />
                            <Filter selectedFilterDebt={selectedFilterDebt} onFilterChange={handleFilterChange2} options={debtOptions} />
                        </div>
                        <div className="header-items-add">
                            <AddItemBtn name="Добавить продукт" onClick={handleAdd} />
                        </div>
                    </div>
                    <section className='details-wrapper'>
                        <DataTable
                            loading={loading}
                            error={error}
                            tableHead={headers}
                            data={formattedData}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
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
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    formConfig={formConfig}
                    onSave={createProduct}
                />}
            {editOpen &&
                <EditItem
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    formConfig={formConfig}
                    onSave={updateProduct}
                    initialData={currentItem}
                />}
            {deleteOpen &&
                <DeleteProduct
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
                        <Typography variant="body1"><strong>Код:</strong> {currentItem.code}</Typography>
                        <Typography variant="body1"><strong>Количество:</strong> {currentItem.amount}</Typography>
                        <Typography variant="body1"><strong>Единица:</strong> {currentItem.unit}</Typography>
                        <Typography variant="body1"><strong>Цена покупки:</strong> {formatNumberWithCommas(currentItem.import_price)}</Typography>
                        <Typography variant="body1"><strong>Цена продажи:</strong> {formatNumberWithCommas(currentItem.export_price)}</Typography>
                        <Typography variant="body1"><strong>Макс. скидка:</strong> {currentItem.max_discount}%</Typography>
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

    )
}

export default OurProduct
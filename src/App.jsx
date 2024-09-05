import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import PrivateRoute from './routes/PrivateRoute';
import { SidebarProvider } from './context/SidebarContext';
import Orders from './pages/orders/Orders';
import Brand from './pages/brand/Brand';
import DetailView from './pages/orders/detailView/DetailView';
import AutoService from './pages/autoService/AutoService';
import Customers from './pages/customers/Customers';
import OurProduct from './pages/income/OurProduct';
import OurCars from './pages/ourCars/OurCars';
import Employees from './pages/employees/Employees';
import Expenses from './pages/expenses/Expenses';
import ProviderC from './pages/provider/ProviderC';
import Import from './pages/brand/ImportProduct';
import AddOrder from './pages/orders/addOrder/AddOrder';
import Managers from './pages/managers/Managers';
import Workers from './pages/workers/Workers';
import Salary from './pages/salary/Salary';

function App() {
    const routes = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product" element={<OurProduct />} />
                    <Route path="/import" element={<Brand />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<DetailView />} />
                    {/* <Route path="/order-services" element={<OrderService />} /> */}
                    {/* <Route path="/order-products" element={<OrderProduct />} /> */}
                    <Route path="/auto-services" element={<AutoService />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/cars" element={<OurCars />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/managers" element={<Managers />} />
                    <Route path="/workers" element={<Workers />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/provider" element={<ProviderC />} />
                    <Route path="/add-order" element={<AddOrder />} />
                    <Route path="/adding-order" element={<AddOrder />} />
                    <Route path="/import-products" element={<Import />} />
                    <Route path="/salary" element={<Salary />} />
                </Route>

            </>
        )
    );

    return (
        <div className="App">
            <SidebarProvider>
                <RouterProvider router={routes} />
            </SidebarProvider>
        </div>
    );
}

export default App;

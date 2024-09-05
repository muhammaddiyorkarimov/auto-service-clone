import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

function PrivateRoute() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default PrivateRoute;

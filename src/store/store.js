import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/slice/authSlice'
import expensesTypeReducer from "../features/slice/expensesTypeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        expensesType: expensesTypeReducer,
    },
    devTools: process.env.NODE_ENV !== "production"
});

export default store;

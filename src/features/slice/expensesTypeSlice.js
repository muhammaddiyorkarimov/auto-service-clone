import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ExpensesTypeService from './../../services/landing/expensesTypeSerive';

// Ma'lumotlarni olish uchun thunk yaratamiz
export const fetchExpensesTypes = createAsyncThunk(
    'expensesType/fetchExpensesTypes',
    async () => {
        const response = await ExpensesTypeService.getExpensesTypeService();
        return response;
    }
);

// Ma'lumot qo'shish uchun thunk yaratamiz
export const addExpensesType = createAsyncThunk(
    'expensesType/addExpensesType',
    async (formData) => {
        const response = await ExpensesTypeService.postExpensesTypeService(formData);
        return response;
    }
);

const expensesTypeSlice = createSlice({
    name: 'expensesType',
    initialState: {
        types: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpensesTypes.fulfilled, (state, action) => {
                state.types = action.payload;
                state.status = 'succeeded';
            })
            .addCase(addExpensesType.fulfilled, (state, action) => {
                state.types.push(action.payload);
            })
            .addCase(fetchExpensesTypes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExpensesTypes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default expensesTypeSlice.reducer;

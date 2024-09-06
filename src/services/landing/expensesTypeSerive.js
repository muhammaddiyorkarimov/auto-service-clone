import axios from '../api'

const ExpensesTypeService = {
    async getExpensesTypeService(searchQuery = '') {
        try {
            const response = await axios.get(`/stats/expense-types/?${searchQuery}&order_by=-created_at`);
            return {
                results: response.data.results,
                count: response.data.count
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },    

    async deleteExpensesTypeService(id) {
        try {
            const response = await axios.delete(`/stats/expense-types/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postExpensesTypeService(item) {
        try {
            const { data } = await axios.post('/stats/expense-types/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getExpensesTypeServiceById(id) {
        try {
            const { data } = await axios.get(`/stats/expense-types/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putExpensesTypeService(id, item) {
        try {
            const { data } = await axios.patch(`/stats/expense-types/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default ExpensesTypeService

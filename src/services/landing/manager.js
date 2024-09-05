import axios from '../api';

const OrdersManagers = {
    async getOrders(searchQuery = '') {
        try {
            const response = await axios.get(`/users/managers/?${searchQuery}`);
            return {
                results: response.data.results,
                count: response.data.count
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },

    // qolgan metodlar o'sha-o'sha...
    async deleteOrders(id) {
        try {
            const response = await axios.delete(`/users/managers/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error')
        }
    },

    async postOrders(item) {
        try {
            const { data } = await axios.post('/users/managers/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getOrdersById(id) {
        try {
            const { data } = await axios.get(`/users/managers/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async putOrdersById(id, item) {
        try {
            const { data } = await axios.patch(`/users/managers/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OrdersManagers;

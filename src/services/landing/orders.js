import axios from '../api';

const OrdersService = {
    async getOrders(query = '') {
        try {
            const response = await axios.get(`/stats/orders/?${query}&order_by=-created_at`);
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
            const response = await axios.delete(`/stats/orders/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error')
        }
    },

    async postOrders(item) {
        try {
            const { data } = await axios.post('/stats/orders/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getOrdersById(id) {
        try {
            const { data } = await axios.get(`/stats/orders/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async putOrdersById(id, item) {
        try {
            const { data } = await axios.patch(`/stats/orders/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OrdersService;

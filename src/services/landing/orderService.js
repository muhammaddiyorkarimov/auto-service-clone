import axios from '../api';

const OrderServices = {
    async getOrders() {
        try {
            const response = await axios.get(`/stats/order-services/&order_by=-created_at`);
            return {
                results: response.data
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },

    // qolgan metodlar o'sha-o'sha...
    async deleteOrders(id) {
        try {
            const response = await axios.delete(`/stats/order-services/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error')
        }
    },

    async postOrders(item) {
        try {
            const { data } = await axios.post('/stats/order-services/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getOrdersById(id) {
        try {
            const { data } = await axios.get(`/stats/order-services/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async putOrdersById(id, item) {
        try {
            const { data } = await axios.patch(`/stats/order-services/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OrderServices;

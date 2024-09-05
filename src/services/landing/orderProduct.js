import axios from '../api';

const OrderProducts = {
    async getOrders() {
        try {
            const response = await axios.get(`/stats/order-products/&order_by=-created_at`);
            return {
                results: response.data,
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteOrders(id) {
        try {
            const response = await axios.delete(`/stats/order-products/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error')
        }
    },

    async postOrders(item) {
        try {
            const { data } = await axios.post('/stats/order-products/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getOrdersById(id) {
        try {
            const { data } = await axios.get(`/stats/order-products/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async putOrdersById(id, item) {
        try {
            const { data } = await axios.patch(`/stats/order-products/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OrderProducts;

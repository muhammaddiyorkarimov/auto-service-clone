import axios from '../api'

const Provider = {
    async getProvider(searchQuery = '') {
        try {
            const response = await axios.get(`/main/providers/?${searchQuery}&order_by=-created_at`)
            return response.data.results
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async deleteProvider(id) {
        try {
            const response = await axios.delete(`/main/providers/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postProvider(item) {
        try {
            const { data } = await axios.post('/main/providers/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getProviderById(id) {
        try {
            const { data } = await axios.get(`/main/providers/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putProviderById(id, item) {
        try {
            const { data } = await axios.put(`/main/providers/${id}/`, item, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default Provider
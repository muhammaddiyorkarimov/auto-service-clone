import axios from '../api';

const AutoServices = {
    async getAutoService(orderBy = 'created_at') {
        try {
            const response = await axios.get(`/main/services/?${orderBy}`);
            return response.data.results;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    

    // qolgan metodlar o'sha-o'sha...
    async deleteAutoService(id) {
        try {
            const response = await axios.delete(`/main/services/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error')
        }
    },

    async postAutoService(item) {
        try {
            const { data } = await axios.post('/main/services/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAutoServiceById(id) {
        try {
            const { data } = await axios.get(`/main/services/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async putAutoServiceById(id, item) {
        try {
            const { data } = await axios.patch(`/main/services/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default AutoServices;

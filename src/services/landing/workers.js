import axios from '../api'

const WorkersService = {
    async getWorkers(searchQuery = '') {
        try {
            const response = await axios.get(`/users/workers/?${searchQuery}`);
            return response.data;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteWorkers(id) {
        try {
            const response = await axios.delete(`/users/workers/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postWorkers(item) {
        try {
            const { data } = await axios.post('/users/workers/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getWorkersById(id) {
        try {
            const { data } = await axios.get(`/users/workers/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putWorkersById(id, item) {
        try {
            const { data } = await axios.patch(`/users/workers/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default WorkersService

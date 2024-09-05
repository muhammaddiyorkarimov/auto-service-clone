import axios from '../api'

const EmployeesService = {
    async getEmployees(searchQuery = '') {
        try {
            const response = await axios.get(`/users/staff/?${searchQuery}`);
            return response.data.results;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteEmployees(id) {
        try {
            const response = await axios.delete(`/users/staff/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postEmployees(item) {
        try {
            const { data } = await axios.post('/users/staff/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getEmployeesById(id) {
        try {
            const { data } = await axios.get(`/users/staff/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putEmployeesById(id, item) {
        try {
            const { data } = await axios.patch(`/users/staff/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default EmployeesService

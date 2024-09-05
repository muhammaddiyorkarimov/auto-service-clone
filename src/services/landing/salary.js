import axios from '../api'

const SalaryService = {
    async getSalary() {
        try {
            const response = await axios.get(`/stats/salaries/`)
            return response.data.results
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async deleteSalary(id) {
        try {
            const response = await axios.delete(`/stats/salaries/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postSalary(item) {
        try {
            const { data } = await axios.post('/stats/salaries/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getSalaryById(id) {
        try {
            const { data } = await axios.get(`/stats/salaries/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putSalaryById(id, item) {
        try {
            const { data } = await axios.put(`/stats/salaries/${id}/`, item, {
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

export default SalaryService
import axios from '../api'

const CarsService = {
    async getCars(searchQuery = '') {
        try {
            const response = await axios.get(`/main/cars/?${searchQuery}`);
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async getCarsForCustomer(id) {
        try {
            const response = await axios.get(`/main/cars/?customer_id=${id}`);
            return response.data.results
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteCars(id) {
        try {
            const response = await axios.delete(`/main/cars/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postCars(item) {
        try {
            const { data } = await axios.post('/main/cars/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getCarsById(id) {
        try {
            const { data } = await axios.get(`/main/cars/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putCarsById(id, item) {
        try {
            const { data } = await axios.patch(`/main/cars/${id}/`, item);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default CarsService

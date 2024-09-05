import axios from '../api'

const OurProduct = {
    async getProduct(searchQuery = '') {
        try {    
            const response = await axios.get(`/main/products/?${searchQuery}&order_by=-created_at`);
            return {
                results: response.data.results,
                count: response.data.count
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    
    async deleteProduct(id) {
        try {
            const response = await axios.delete(`/main/products/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postProduct(item) {
        try {
            const { data } = await axios.post('/main/products/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getProductById(id) {
        try {
            const { data } = await axios.get(`/main/products/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putProductById(id, item) {
        try {
            const { data } = await axios.patch(`/main/products/${id}/`, item);

            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default OurProduct

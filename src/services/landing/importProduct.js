import axios from '../api'

const ImportProduct = {
    async getImportProduct(searchQuery = '') {
        try {
            const response = await axios.get(`/main/import-products/?${searchQuery}&order_by=-created_at`);
            return {
                results: response.data.results,
                count: response.data.count
            };
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },    

    async deleteImportProduct(id) {
        try {
            const response = await axios.delete(`/main/import-products/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postImportProduct(item) {
        try {
            const { data } = await axios.post('/main/import-products/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getImportProductById(id) {
        try {
            const { data } = await axios.get(`/main/import-products/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putImportProduct(id, item) {
        try {
            const { data } = await axios.patch(`/main/import-products/${id}/`, item);

            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default ImportProduct

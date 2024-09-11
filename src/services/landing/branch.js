import axios from '../api'

const Branch = {
    async getbranch() {
        try {
            // Parametrlarni URL-encode qilib, so'rov yuborish
            const response = await axios.get(`/main/branches/`);
            return response.data.results;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    },
    async deleteBranch(id) {
        try {
            const response = await axios.delete(`/main/branchs/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postBranch(item) {
        try {
            const { data } = await axios.post('/main/branchs/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getBranchById(id) {
        try {
            const { data } = await axios.get(`/main/branchs/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putBranchById(id, item) {
        try {
            const { data } = await axios.patch(`/main/branchs/${id}/`, item);

            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default Branch

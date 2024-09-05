import axios from '../api'

const Users = {
    async getUser() {
        try {
            const response = await axios.get(`/users/`)
            return response.data.results
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async deleteUser(id) {
        try {
            const response = await axios.delete(`/users/${id}/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async postUser(item) {
        try {
            const { data } = await axios.post('/users/', item);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getUserById(id) {
        try {
            const { data } = await axios.get(`/users/${id}/`);
            return data;
        } catch (error) {
            throw error;
        }
    },
    async putUserById(id, item) {
        try {
            const { data } = await axios.put(`/users/${id}/`, item, {
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

export default Users
import axios from '../api'

const Statistics = {
    async getWallet() {
        try {
            const response = await axios.get(`/main/get-wallet/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async getActiveReports() {
        try {
            const response = await axios.get(`/statistics/monthly-total/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
    async pieChart(startDate, endDate) {
        try {
            const response = await axios.get('/statistics/expenses/', {
                params: {
                    start_date: startDate, // Parametr nomlari server talabiga mos bo'lishi kerak
                    end_date: endDate,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response || new Error('Unknown error');
        }
    }
    ,
    async getTopProducts() {
        try {
            const response = await axios.get(`/statistics/top-sale-products/`)
            return response.data
        } catch (error) {
            throw error.response || new Error('Unknow error')
        }
    },
        async getTopCustomers() {
    try {
        const response = await axios.get(`/statistics/top-customers/`)
        return response.data
    } catch (error) {
        throw error.response || new Error('Unknow error')
    }
},
    async getTopCalculate() {
    try {
        const response = await axios.get(`/statistics/calculate/`)
        return response.data
    } catch (error) {
        throw error.response || new Error('Unknow error')
    }
},

}

export default Statistics
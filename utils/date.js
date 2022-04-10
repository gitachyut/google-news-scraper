const axios = require('axios');
const DATE_MICROSERVICE = "http://localhost:8989/";

const date_service = async (date_string) => {
    try {
        const date = await axios.post(DATE_MICROSERVICE, {
            "datestring": date_string
        });
        return date.data 
    } catch (error) {
        return {
            date_time: date_string,
            date: date_string
        }
    }

} 

module.exports = date_service;
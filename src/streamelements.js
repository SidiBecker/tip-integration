const axios = require('axios');
require('dotenv').config();

// Add the authorization token to every Axios request.
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.STREAMELEMENTS_JWT_TOKEN}`;


module.exports = {

    importDonate: async function (user, email, amount, message) {

        if (!user || !email || !amount ) return console.log('Data is invalid');
        try {
            var body = {
                user: {
                    userId: process.env.STREAMELEMENTS_CHANNEL_ID,
                    username: user,
                    email: email
                },
                provider: "streamlabs", //Fixed
                message: message,
                amount: amount,
                currency: "BRL", //Fixed
                imported: true
            }
            const userAPI = `https://api.streamelements.com/kappa/v2/tips/${process.env.STREAMELEMENTS_CHANNEL_ID}`;
            const response = await axios.post(userAPI, body);

            console.log('API Response:', response.data);
        } catch (error) {
            console.log(error);
        }

    }

}
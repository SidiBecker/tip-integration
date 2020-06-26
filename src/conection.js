const axios = require('axios');
const config = require('./config/config.json');

// Add the authorization token to every Axios request.
axios.defaults.headers.common['Authorization'] = `Bearer ${config.TOKEN}`;


async function importDonate(user, email, amount, message) {

    if (!user || !email || !amount || !message) return console.log('Data is invalid');
    try {
        var body = {
            user: {
                userId: config.CHANNELID,
                username: user,
                email: email
            },
            provider: "streamlabs", //Fixed
            message: message,
            amount: amount,
            currency: "BRL", //Fixed
            imported: true
        }
        const userAPI = `https://api.streamelements.com/kappa/v2/tips/${config.CHANNELID}`;
        const response = await axios.post(userAPI, body);

        console.log('API Response:', response.data);
    } catch (error) {
        console.log(error);
    }

}

importDonate("user", "email@gmail.com", 2.22, "Tip message");
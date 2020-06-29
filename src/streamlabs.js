const axios = require('axios');
require('dotenv').config();


module.exports = {
    token: function (code, res) {

        console.log(`Parâmetro code: ${code}`)

        console.log(process.env.TESTE)

        console.log(process.env.CLIENT_ID);

        axios.post(`${process.env.STREAMLABS_API}/token?`, {
            'grant_type': 'authorization_code',
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'redirect_uri': `${process.env.URL}:${process.env.PORT}/connect`,
            'code': code
        }).then((response) => {
            console.log('Token autorizado');

            console.log(response.data);
            //socket();
            getSocketToken(response.data.access_token, res);
        }).catch((error) => {
            console.log(error)
        })
    }

}


function getSocketToken(acesstoken, res) {

    axios.get(`${process.env.STREAMLABS_API}/socket/token?access_token=${acesstoken}`).then((response) => {
        console.log('socket autorizado');
        console.log(response.data);

        socket(response.data.socket_token);
        res.redirect(`${process.env.URL}:${process.env.PORT}/success`);
        return;
    }).catch((error) => {
        console.log(error)
        console.log('erro socket token')
    })

}

function socket(token) {

    //Connect to socket\
    const io = require('socket.io-client');
    const socket = io(`https://sockets.streamlabs.com?token=${token}`, {
        transports: ['websocket']
    });

    //Perform Action on event
    socket.on('event', (eventData) => {

        if (!(eventData.message != null && eventData.message.length > 0)) {
            return;
        }

        const event = eventData.message[0];

        if (event.isTest) {
            console.log(event);
            console.log('It\'s a test. Ignoring integration...');
            return;
        }

        if (!eventData.for && eventData.type === 'donation') {

            //code to handle donation events
            console.log(eventData.message);

            console.log('Its a donation!')
        }
        if (eventData.for === 'twitch_account') {
            switch (eventData.type) {
                case 'follow':
                    //code to handle follow events
                    console.log(eventData.message);
                    break;
                case 'host':
                    //code to handle follow events
                    console.log(eventData.message);
                    break;
                case 'subscription':
                    //code to handle subscription events
                    console.log(eventData.message);
                    break;
                case 'donation':
                    //code to handle subscription events
                    console.log(eventData.message);
                    console.log('Its a donation!')
                    break;
                default:
                    //default case
                    console.log(eventData.message);
            }
        }

        if (eventData.for === 'streamlabs') {
            switch (eventData.type) {
                case 'donation':
                    //code to handle subscription events
                    console.log(eventData.message);

                    const streamelements = require('./streamelements');
                    //TODO: Email
                    streamelements.importDonate(event.name, event.name + '@gmail.com', event.amount, event.message);
                    console.log('Its a donation!')
                    break;
                default:
                    //default case
                    console.log(eventData.message);
            }
        }
    });
}
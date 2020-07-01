const axios = require('axios');
const io = require('socket.io-client');
require('dotenv').config();


module.exports = {
    token: function (code, res) {

        console.log('\nAutorizando token...')

        axios.post(`${process.env.STREAMLABS_API}/token?`, {
            'grant_type': 'authorization_code',
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'redirect_uri': `${process.env.URL}:${process.env.PORT}/connect`,
            'code': code
        }).then((response) => {
            console.log('Token autorizado com sucesso!');
            getSocketToken(response.data.access_token, res);
        }).catch((error) => {
            console.log(error)
            console.log('Houve um erro ao adquirir o token!');
        })
    }

}


function getSocketToken(acesstoken, res) {

    console.log('\nAdquirindo token de acesso...');
    axios.get(`${process.env.STREAMLABS_API}/socket/token?access_token=${acesstoken}`).then((response) => {
        console.log('Token de acesso adquirido com sucesso!');

        initSocket(response.data.socket_token, res);

        return;
    }).catch((error) => {
        console.log(error)
        console.log('Erro ao adquirir o token de acesso.')
    })

}

function initSocket(token, res) {

    //Connect to socket\

    console.log('\nIniciando socket...');

    const socket = io(`https://sockets.streamlabs.com?token=${token}`, {
        transports: ['websocket']
    });

    socket.on('connect', function () {
        console.log('Socket iniciado com sucesso!');
        console.log('Você pode fechar a aba do seu navegador.');
        console.log('\n\nATENÇÃO: Você deve manter esse programa aberto!');
        res.redirect(`${process.env.URL}:${process.env.PORT}/success`);
    });

    //Perform Action on event
    socket.on('event', (eventData) => {

        function importDonate(name, email, amount, message) {

            const streamelements = require('./streamelements');
            streamelements.importDonate(name, email, amount, message);
            console.log('Its a donation!')

        }

        if (!(eventData.message != null && eventData.message.length > 0)) {
            return;
        }

        const event = eventData.message[0];

        if (event.isTest) {
            console.log(event);
            console.log('Teste recebido. Ignorando integração...');
            return;
        }

        if (!eventData.for && eventData.type === 'donation') {

            //code to handle donation events
            console.log(eventData.message);

            importDonate(event.name, event.name + '@gmail.com', event.amount, event.message);
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
                    importDonate(event.name, event.name + '@gmail.com', event.amount, event.message);
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

                    //TODO: Donation
                    importDonate(event.name, event.name + '@gmail.com', event.amount, event.message);
                    break;
                default:
                    //default case
                    console.log(eventData.message);
            }
        }
    });
}
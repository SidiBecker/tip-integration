require('dotenv').config()

module.exports = function (app) {


    app.get('/connect', function (req, res) {

        if (!req.query.code) {
            return;
        }

        const streamlabs = require('./../../../streamlabs');
        streamlabs.token(req.query.code, res);
    });

    app.get('/auth/streamlabs', (req, res) => {

        let authorize_url = `${process.env.STREAMLABS_API}/authorize?`

        let params = {
            'client_id': process.env.STREAMLABS_CLIENT_ID,
            'redirect_uri': `${process.env.STREAMLABS_CALLBACK_URL}`,
            'response_type': 'code',
            'scope': 'donations.read socket.token',
        }
        debugger

        authorize_url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&')

        console.log(`Abra seu navegador no endereço: ${process.env.URL}:${process.env.PORT} e autorize o StreamLabs!`);

        res.send(`<a href="${authorize_url}">Authorize with Streamlabs!</a>`)
    });


}
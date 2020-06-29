require('dotenv').config()

module.exports = function (app) {


    app.get('/connect', function (req, res) {

        if (!req.query.code) {
            return;
        }

        const streamlabs = require('./../../../streamlabs');
        streamlabs.token(req.query.code, res);
    });

    app.get('/', (req, res) => {

        let authorize_url = `${process.env.STREAMLABS_API}/authorize?`

        let params = {
            'client_id': process.env.CLIENT_ID,
            'redirect_uri': `${process.env.URL}:${process.env.PORT}/connect`,
            'response_type': 'code',
            'scope': 'donations.read socket.token',
        }

        // not encoding params
        authorize_url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&')

        res.send(`<a href="${authorize_url}">Authorize with Streamlabs!</a>`)
    });

}
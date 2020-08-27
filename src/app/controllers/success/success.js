module.exports = function(app) {
    
    app.get('/success', function (req, res) {
        res.send('Authorized successfully. You can close this window!');
    });

}
const app = require('./src/config/custom-express')();
require('dotenv').config();
const opn = require('opn');

app.listen(process.env.PORT, function () {
    console.log(`Server running on port ${process.env.PORT}`);

    //opn(`${process.env.URL}:${process.env.PORT}`);
    
});
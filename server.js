const express = require('express');
const app = express();

app.use(express.static((process.argv.slice(2)[0])?(process.argv.slice(2)[0]):'dist'));

app.get('/', (req, res) => {
    res.send('Js server is up and runnning!');
});

app.listen(3333, () => console.log('Server running on port 3333!\nAccess it using http://localhost:3333'));
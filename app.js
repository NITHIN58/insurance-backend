const express = require('express');

const uploadRoutes = require('./routes/index');

const app = express();



app.use(express.json({
    limit: '15kb'
}));

app.use('/api/v1/documents', uploadRoutes);

module.exports = app;
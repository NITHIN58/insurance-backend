const mongoose = require('mongoose');
const dotenv = require('dotenv');
const os = require('os-utils');

dotenv.config({
    path: './config.env'
});



const app = require('./app');

const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect the database
mongoose.connect(database).then(con => {
    console.log('DB connection Successfully!');
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    process.exit(1);
    
});



//Track real-time CPU utilization of the node server and on 70% usage restart the server.
// setInterval(() => {
//     os.cpuUsage((v) => {
//         console.log("CPU Usage: " + (v * 100).toFixed(2) + "%");
//         if ((v * 100).toFixed(2) > 70) {
//             console.log('CPU Usage is high. Restarting...');
//             process.exit(0);
            
//         }
//     });
// }, 10000)
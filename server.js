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

setInterval(() => {
    os.cpuUsage((v) => {
      if (v > 0.7) {
        console.log('CPU usage high. Restarting server...');
        process.exit(1);
      }
    });
  }, 10000);

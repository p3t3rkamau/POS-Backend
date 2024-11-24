const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/User');  // Adjust the path to your User model

// MongoDB connection URL (change this to your DB connection string)
const mongoURI = 'mongodb://127.0.0.1:27017/Pos_Offline?directConnection=true&serverSelectionTimeoutMS=2000'; // Replace with your DB details

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            mongoose.connection.close();
            return;
        }

        // Admin user details
        const username = 'admin';
        const password = '12345678';  // Change this to a secure password
        const admin = true;

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new admin user
        const adminUser = new User({
            username,
            password: hashedPassword,
            admin
        });

        // Save the admin user to the database
        await adminUser.save();
        console.log('Admin user created successfully!');

        // Close the DB connection
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

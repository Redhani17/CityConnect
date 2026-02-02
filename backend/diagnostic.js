import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cityconnect');
        const latestUser = await User.findOne().sort({ createdAt: -1 });
        console.log('Latest User:', {
            name: latestUser.name,
            email: latestUser.email,
            role: latestUser.role,
            department: latestUser.department
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();

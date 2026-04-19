import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from 'mongoose';
import 'dotenv/config';
import Transport from './models/Transport.js';
import connectDB from './config/db.js';

const seed = async () => {
    try {
        await connectDB();
        await Transport.deleteMany(); // Clear existing

        await Transport.create([
            {
                busNumber: 11,
                destination: 'Bangarpet',
                areasServed: ['Bangarpet', 'BEML Nagar', 'KGF'],
                driverName: 'Ramesh',
                driverContact: '9876543210',
                schedule: '08:00 AM - 05:00 PM'
            },
            {
                busNumber: 3,
                destination: 'Mulbagal',
                areasServed: ['Mulbagal', 'Nangali', 'Byrakur'],
                driverName: 'Suresh',
                driverContact: '9876543211',
                schedule: '07:30 AM - 04:30 PM'
            },
            {
                busNumber: 1,
                destination: 'Kolar Sub-Urban',
                areasServed: ['Kolar Town', 'PC Extension', 'Doom Light Circle'],
                driverName: 'Harish',
                driverContact: '9876543212',
                schedule: '08:30 AM - 05:30 PM'
            }
        ]);

        console.log('Transport Seeded!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();

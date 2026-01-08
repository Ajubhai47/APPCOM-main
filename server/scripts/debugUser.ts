import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import Student from '../models/Student';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const debugUser = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI missing');

        await mongoose.connect(uri);

        const users = await Student.find({});
        console.log('--- RAW USERS ---');
        users.forEach(u => {
            console.log(`Name: '${u.name}', Pass: '${u.password}', ID: ${u.studentId}`);
        });
        console.log('-----------------');

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

debugUser();

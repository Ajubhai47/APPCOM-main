const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethicproctor';

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    
    // Test by creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({
      name: 'MongoDB Connection Test'
    });
    
    testDoc.save()
      .then(() => {
        console.log('Test document saved successfully');
        
        // Clean up by deleting the test document
        TestModel.deleteOne({ _id: testDoc._id })
          .then(() => {
            console.log('Test document cleaned up');
            mongoose.connection.close();
          })
          .catch(err => {
            console.error('Error cleaning up test document:', err);
            mongoose.connection.close();
          });
      })
      .catch(err => {
        console.error('Error saving test document:', err);
        mongoose.connection.close();
      });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
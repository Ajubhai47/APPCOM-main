from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection URI
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/ethicproctor')

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client['ethicproctor']
students_collection = db['students']

print("Connected to MongoDB Atlas")

# Check if student "Muzzamil" exists
student = students_collection.find_one({"name": "Muzzamil", "exam": "C"})

if student:
    print(f"Student 'Muzzamil' found in database:")
    print(f"  ID: {student['studentId']}")
    print(f"  Name: {student['name']}")
    print(f"  Exam: {student['exam']}")
    print(f"  Password: {student['password']}")
    print(f"  Status: {student['status']}")
else:
    print("Student 'Muzzamil' not found in database")

# Close connection
client.close()
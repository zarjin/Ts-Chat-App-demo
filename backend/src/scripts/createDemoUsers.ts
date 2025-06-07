import 'dotenv/config';
import { connectDB } from '../configs/connectdb.config';
import { userModel } from '../models/user.models';
import { hashPassword } from '../utils/bcrypt.utils';

const createDemoUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing demo users
    await userModel.deleteMany({ email: { $in: ['alice@demo.com', 'bob@demo.com', 'charlie@demo.com'] } });
    
    const demoUsers = [
      {
        fullName: 'Alice Johnson',
        email: 'alice@demo.com',
        password: await hashPassword('password123'),
        profilePic: '',
      },
      {
        fullName: 'Bob Smith',
        email: 'bob@demo.com',
        password: await hashPassword('password123'),
        profilePic: '',
      },
      {
        fullName: 'Charlie Brown',
        email: 'charlie@demo.com',
        password: await hashPassword('password123'),
        profilePic: '',
      },
    ];

    const createdUsers = await userModel.insertMany(demoUsers);
    
    console.log('Demo users created successfully:');
    createdUsers.forEach(user => {
      console.log(`- ${user.fullName} (${user.email})`);
    });
    
    console.log('\nYou can now login with any of these accounts using password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
};

createDemoUsers();

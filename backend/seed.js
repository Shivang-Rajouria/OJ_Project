// seed.js
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Problem.deleteMany({});

  await Problem.create({
    title: 'Sum of Two Numbers',
    description: 'Read two integers from input and print their sum.',
    testCases: [
      { input: '1 2', output: '3' },
      { input: '10 5', output: '15' },
      { input: '100 200', output: '300' }
    ]
  });

  await Problem.create({
    title: 'Double It',
    description: 'Read one integer and print its double.',
    testCases: [
      { input: '3', output: '6' },
      { input: '7', output: '14' }
    ]
  });

  console.log('Seed done');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });

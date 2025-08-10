// seed.js
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Problem.deleteMany({});

  await Problem.create([
    {
      title: 'Sum of Two Numbers',
      description: 'Read two integers from input and print their sum.',
      testCases: [
        { input: '1 2', output: '3' },
        { input: '10 5', output: '15' },
        { input: '100 200', output: '300' }
      ]
    },
    {
      title: 'Double It',
      description: 'Read one integer and print its double.',
      testCases: [
        { input: '3', output: '6' },
        { input: '7', output: '14' }
      ]
    },
    {
      title: 'Check Even or Odd',
      description: 'Read an integer and print "Even" if it is even, else print "Odd".',
      testCases: [
        { input: '4', output: 'Even' },
        { input: '7', output: 'Odd' },
        { input: '0', output: 'Even' }
      ]
    },
    {
      title: 'Factorial',
      description: 'Read an integer n and print its factorial.',
      testCases: [
        { input: '3', output: '6' },
        { input: '5', output: '120' },
        { input: '0', output: '1' }
      ]
    },
    {
      title: 'Find Maximum',
      description: 'Read three integers and print the maximum of them.',
      testCases: [
        { input: '1 2 3', output: '3' },
        { input: '10 5 7', output: '10' },
        { input: '4 4 4', output: '4' }
      ]
    },
    {
      title: 'Palindrome Check',
      description: 'Read a string and print "Yes" if it is palindrome else "No".',
      testCases: [
        { input: 'madam', output: 'Yes' },
        { input: 'hello', output: 'No' },
        { input: 'racecar', output: 'Yes' }
      ]
    },
    {
      title: 'Fibonacci Series',
      description: 'Read an integer n and print first n Fibonacci numbers separated by space.',
      testCases: [
        { input: '5', output: '0 1 1 2 3' },
        { input: '1', output: '0' },
        { input: '7', output: '0 1 1 2 3 5 8' }
      ]
    },
    {
      title: 'Sum of Digits',
      description: 'Read an integer and print the sum of its digits.',
      testCases: [
        { input: '123', output: '6' },
        { input: '0', output: '0' },
        { input: '999', output: '27' }
      ]
    },
    {
      title: 'Count Vowels',
      description: 'Read a string and print the number of vowels in it.',
      testCases: [
        { input: 'hello', output: '2' },
        { input: 'xyz', output: '0' },
        { input: 'aeiouAEIOU', output: '10' }
      ]
    },
    {
      title: 'Reverse String',
      description: 'Read a string and print its reverse.',
      testCases: [
        { input: 'hello', output: 'olleh' },
        { input: 'abc', output: 'cba' },
        { input: 'racecar', output: 'racecar' }
      ]
    },
    {
      title: 'Sum of Array',
      description: 'Read an integer n followed by n integers. Print the sum of the array elements.',
      testCases: [
        { input: '5\n1 2 3 4 5', output: '15' },
        { input: '3\n10 10 10', output: '30' }
      ]
    },
    {
      title: 'Prime Check',
      description: 'Read an integer and print "Prime" if it is a prime number, else "Not Prime".',
      testCases: [
        { input: '7', output: 'Prime' },
        { input: '10', output: 'Not Prime' },
        { input: '2', output: 'Prime' }
      ]
    },
    {
      title: 'GCD of Two Numbers',
      description: 'Read two integers and print their greatest common divisor.',
      testCases: [
        { input: '12 15', output: '3' },
        { input: '100 80', output: '20' }
      ]
    },
    {
      title: 'Count Words',
      description: 'Read a sentence and print the number of words.',
      testCases: [
        { input: 'Hello world', output: '2' },
        { input: 'This is a test', output: '4' }
      ]
    },
    {
      title: 'Square of a Number',
      description: 'Read an integer and print its square.',
      testCases: [
        { input: '5', output: '25' },
        { input: '10', output: '100' }
      ]
    },
    {
      title: 'Lowercase to Uppercase',
      description: 'Read a lowercase character and print its uppercase equivalent.',
      testCases: [
        { input: 'a', output: 'A' },
        { input: 'z', output: 'Z' }
      ]
    },
    {
      title: 'Sum of Even Numbers',
      description: 'Read an integer n followed by n integers. Print the sum of even numbers.',
      testCases: [
        { input: '5\n1 2 3 4 5', output: '6' },
        { input: '4\n2 4 6 8', output: '20' }
      ]
    },
    {
      title: 'Count Digits',
      description: 'Read an integer and print the number of digits.',
      testCases: [
        { input: '12345', output: '5' },
        { input: '0', output: '1' }
      ]
    },
    {
      title: 'Check Leap Year',
      description: 'Read a year and print "Leap Year" if it is leap year else "Not Leap Year".',
      testCases: [
        { input: '2020', output: 'Leap Year' },
        { input: '1900', output: 'Not Leap Year' },
        { input: '2000', output: 'Leap Year' }
      ]
    },
    {
      title: 'Power of a Number',
      description: 'Read two integers a and b, print a raised to the power b.',
      testCases: [
        { input: '2 3', output: '8' },
        { input: '5 0', output: '1' }
      ]
    }
  ]);

  console.log('Seed done');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});

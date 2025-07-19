// import express from 'express'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import User from '../models/User.js'
// import dotenv from 'dotenv'
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const dotenv = require('dotenv');

dotenv.config()
const router = express.Router()

router.post('/signup', async (req, res) => {
  console.log('signup endpoint hit')
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ msg: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({ name, email, passwordHash })
    await newUser.save()

    res.status(201).json({ msg: 'User created successfully' })
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating
      }
    })
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router;

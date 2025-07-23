const express = require('express');
const mongoose = require('mongoose'); // ✅ Fixed this line
// Removed unused import: jobSeeker (already defining it below)

const jobSeekerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true, 
    unique: true
  },
  education: {
    type: String,
    required: true 
  },
  phone: {
    type: String
  },
  skills: [String],
  jobprofile: {
    type: String,
    required: true // ✅ Fixed
  },
  resume: {
    type: String,
    required: true // ✅ Fixed
  }
});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);

const mongoose = require('mongoose');
const employer = require('./companyProfile');
// Embedded Job Schema
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  salary: Number,
  location: String,
  postedAt: {
    type: Date,
    default: Date.now
  }
});
const employerSchema = new mongoose.Schema({
  userId: {
    type: String,
   
  },
    name:{type:String ,required:true} ,
    companyName: {type:String ,required:true} ,
    email:{
        type:String , required:true, unique:true
    },
    phone: {
    type: String
  },
  jobs: [JobSchema],
    numberOfVacancies: { type: Number, required: true },
  salary: { type: Number, required: true },
  isHiring: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
    
      
});
employerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model('Employer',employerSchema);
const mongoose = require('mongoose');
const employer = require('./employer');
const employerSchema = new mongoose.Schema({
    name:{type:String ,required:true} ,
    companyName: {type:String ,required:true} ,
    email:{
        type:String , required:true, unique:true
    },
    phone: {
    type: String
  },
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
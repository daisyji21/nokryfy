const mongoose = require('mongoose');
const User = require('./users');

const userSchema = new mongoose.Schema({
  name: {type:String, require:true},
  email: {type:String, require:true, unique:true},
  password:{type: String, require:true},

role:{
  type:String,
  enum: ['admin', 'employer', 'jobSeeker'],
  default:'jobSeeker'
},
userId :{
//default uuid import
}

});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const User = require('./users');
const { v4: uuidv4 } = require('uuid'); 

const userSchema = new mongoose.Schema({
    userId: {
    type: String,
    default: uuidv4,  // Generate UUID on creation
    unique: true
  },
  name: {type:String, require:true},
  email: {type:String, require:true, unique:true},
  password:{type: String, require:true},

role:{
  type:String,
  enum: ['admin', 'employer', 'jobSeeker'],
  default:'jobSeeker'
},
phone: {
  type: String
},
profileImage: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/026/619/142/original/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg"
},

  address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String }
    },
education: {
  degree: {type:String},
  passout:String

},

 profilesummary:{ type: String},
resumeLink:{
  type:String
}, 
noticeperiod:{ type: String},
currentsalary:{
  type:String,
  
},
 employementstatus:{ 
  type: String,
  enum: [ "Fresher","Employed", "Unemployed"],
   default:'Fresher'
 
 },
resumeheadline:{type: String },
IT_Skills:{ type:String},
softSkills :{
  type:String
},
projects: { type:String},
Achievement:{ type: String},
profileLastUpdated:{
  updateAt: { type: Date }
 
},
PersonalDetail:{
  type: String
},

createdAt: {
  type: Date,
  default: Date.now
}

}); 
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    //  ret.userId = ret._id;
         ret.userId = ret.userId || ret._id;  // Assign userId from UUID (or fallback _id)
    delete ret._id;                      
     
    delete ret.password;  // Remove password field
    delete ret.__v;       // Remove __v field (version key)
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);

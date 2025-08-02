// models/User.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// ==========================
// Company (Employer) Details
// ==========================
const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    website: String,
    industry: String,
    companyDescription: String,
    numberOfEmployees: Number,
    logoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/026/619/142/original/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    isHiring: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// =========================
// Job Seeker Details
// =========================
const JobSeekerSchema = new mongoose.Schema(
  {
    education: [
      {
        degree: String,
        institution: String,
        passout: String,
        fieldOfStudy: String,
      },
    ],
    profileSummary: String,
    resumeLink: String,
    noticePeriod: String,
    currentSalary: String,
    employmentStatus: {
      type: String,
      enum: ["Fresher", "Employed", "Unemployed"],
      default: "Fresher",
    },
    resumeHeadline: String,
    skills: [String], // Both technical and soft skills in one array for searchability
    projects: [
      {
        name: String,
        description: String,
        link: String,
        technologies: [String],
      },
    ],
    achievements: String,
    profileLastUpdated: Date,
    personalDetail: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ==========================
// Main User Schema
// ==========================
const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "employer", "jobSeeker"],
    default: "jobSeeker",
  },
  phone: String,
  profileImage: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/026/619/142/original/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg",
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  company: CompanySchema, // Employer fields
  jobSeeker: JobSeekerSchema, // Jobseeker fields

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Output cleanup (hide internals/sensitive)
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.userId = ret.userId || ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);

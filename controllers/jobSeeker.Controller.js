// const cloudinary = require('../config/cloudinary'); // make sure this is correct
// const JobSeeker = require('../models/jobSeeker');

// exports.createJobSeeker = async (req, res) => {
//   try {
//     // Step 1: Check if resume file is uploaded
//     if (!req.files || !req.files.resume) {
//       return res.status(400).json({ message: 'Resume file is required' });
//     }

//     const resumeFile = req.files.resume;

//     // Step 2: Upload file to Cloudinary
//     const result = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
//       resource_type: 'raw', // use raw for .pdf, .docx, etc.
//       folder: 'resumes'
//     });

//     // Step 3: Get other fields from req.body
//     const { name, email, education, phone, skills, jobprofile } = req.body;

//     const newSeeker = new JobSeeker({
//       name,
//       email,
//       education,
//       phone,
//       skills: skills ? skills.split(',') : [],
//       jobprofile,
//       resume: result.secure_url // ✅ store uploaded file URL
//     });

//     await newSeeker.save();

//     res.status(201).json({ message: 'Job Seeker added successfully!', data: newSeeker });

//   } catch (err) {
//     console.error('Error uploading resume:', err);
//     res.status(500).json({ error: err.message });
//   }
// };
// // UPDATE Job Seeker Profile (optionally upload new resume)
// exports.updateJobSeekerProfile = async (req, res) => {
//   try {
//     const seekerId = req.params.id;
//     const updates = { ...req.body };

//     // If skills are comma-separated, split into array
//     if (updates.skills && typeof updates.skills === 'string') {
//       updates.skills = updates.skills.split(',').map(skill => skill.trim());
//     }

//     // If resume file is uploaded, upload new one to Cloudinary
//     if (req.files && req.files.resume) {
//       const resumeFile = req.files.resume;
//       const result = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
//         resource_type: 'raw',
//         folder: 'resumes',
//       });
//       updates.resume = result.secure_url;
//     }

//     const updatedSeeker = await JobSeeker.findByIdAndUpdate(seekerId, updates, { new: true });

//     if (!updatedSeeker) {
//       return res.status(404).json({ message: 'Job Seeker not found' });
//     }

//     res.json({ message: 'Profile updated successfully!', data: updatedSeeker });

//   } catch (err) {
//     console.error('Error updating profile:', err);
//     res.status(500).json({ error: err.message });
//   }
// };
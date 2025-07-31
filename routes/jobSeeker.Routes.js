// const express = require('express');
// const router = express.Router();
// const fileUpload = require('express-fileupload');
// const cloudinary = require('../config/cloudinary');
// const jobSeekerController = require('../controllers/jobSeeker.Controller');

// // Enable file upload (in app.js you should already have this middleware)
// router.use(fileUpload({ useTempFiles: true }));

// // POST route to create job seeker and upload resume to Cloudinary
// router.post('/create', async (req, res) => {
//   try {
//     if (!req.files || !req.files.resume) {
//       return res.status(400).json({ message: 'Resume file is required' });
//     }

//     const resumeFile = req.files.resume;

//     // Upload resume to Cloudinary (as raw type, for PDF/DOC)
//     const result = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
//       resource_type: 'raw',
//       folder: 'resumes'
//     });

//     // Add the uploaded resume URL to the request body
//     req.body.resumeUrl = result.secure_url;

//     // Call your controller to save data
//     await jobSeekerController.createJobSeeker(req, res);

//   } catch (error) {
//     console.error('Upload error:', error.message);
//     res.status(500).json({ message: 'Resume upload failed', error: error.message });
//   }
// });
// router.put('/profile/:id', async (req, res) => {
//   try {
//     if (req.files && req.files.resume) {
//       const resumeFile = req.files.resume;

//       const result = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
//         resource_type: 'raw',
//         folder: 'resumes'
//       });

//       req.body.resumeUrl = result.secure_url;
//     }

//     await jobSeekerController.updateJobSeekerProfile(req, res);

//   } catch (error) {
//     console.error('Profile update error:', error.message);
//     res.status(500).json({ message: 'Profile update failed', error: error.message });
//   }
// });
// // Get all job seekers
// // router.get('/', jobSeekerController.getAllJobSeekers);

// module.exports = router;

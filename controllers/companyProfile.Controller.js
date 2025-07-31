//  Employer = require('../models/companyProfile');

// // Create a new job post
// exports.createEmployer = async (req, res) => {
//   try {
//     const { name, companyName, numberOfVacancies, salary, isHiring } = req.body;
//     console.log(req.body);
  
//     const newEmployer = new Employer({ name, companyName, numberOfVacancies, salary, isHiring:true });
//     await newEmployer.save();
//     res.status(201).json({ message: 'Job posted successfully', data: newEmployer });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all job posts / employers/ company profile
// exports.getAllEmployers = async (req, res) => {
//   try {
//     const employers = await Employer.find();
//     res.status(200).json(employers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// // POST: Add Job to Employer
// exports.addJobToEmployer = async (req, res) => {
//   const employerId = req.params.employerId;
//   const jobData = req.body;

//   try {
//     // Check if Employer Exists
//     const employer = await Employer.findById(employerId);
//     if (!employer) {
//       return res.status(404).json({ message: 'Employer not found' });
//     }

  

//     // Add Job ID to Employer's jobs array
//     employer.jobs.push(jobData);
//     await employer.save();

//     res.status(201).json({ message: 'Job added to Employer Successfully', job: jobData });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to add job to employer', error: err.message });
//   }
// };
// //GET: Get Jobs by Employer ID
// exports.getJobsByEmployer = async (req, res) => {
//   const employerId = req.params.employerId;

//   try {
//     //  Find Employer by ID
//     const employer = await Employer.findById(employerId);

//     if (!employer) {
//       return res.status(404).json({ message: 'Employer not found' });
//     }

//     // Return Employer's Jobs Array
//     res.status(200).json({ jobs: employer.jobs });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
//   }
// };
// // DELETE: Remove Job from Employer's Jobs Array
// exports.deleteJobFromEmployer = async (req, res) => {
//   const employerId = req.params.employerId;
//   const jobId = req.params.jobId;

//   try {
//     // Find Employer by ID
//     const employer = await Employer.findById(employerId);
//     if (!employer) {
//       return res.status(404).json({ message: 'Employer not found' });
//     }

//     // Remove Job by Job ID from jobs array
//     employer.jobs = employer.jobs.filter(job => job._id.toString() !== jobId);

//     await employer.save();

//     res.status(200).json({ message: 'Job deleted successfully', jobs: employer.jobs });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete job', error: error.message });
//   }
// };


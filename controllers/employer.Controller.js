const Employer = require('../models/employer');

// Create a new job post
exports.createEmployer = async (req, res) => {
  try {
    const { name, companyName, numberOfVacancies, salary, isHiring } = req.body;
    const newEmployer = new Employer({ name, companyName, numberOfVacancies, salary, isHiring:true });
    await newEmployer.save();
    res.status(201).json({ message: 'Job posted successfully', data: newEmployer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all job posts
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find();
    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

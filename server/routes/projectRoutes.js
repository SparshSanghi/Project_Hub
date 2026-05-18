const express = require('express');
const router = express.Router();

const Project = require('../models/Project');
const Request = require('../models/Request');
const auth = require('../middleware/auth');


// =======================
// CREATE PROJECT
// =======================
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, domain } = req.body;

    const project = new Project({
      title,
      description,
      domain,
      owner: req.user.id,
      members: []
    });

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// GET ALL PROJECTS
// =======================
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name')
      .populate('members', 'name');

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// GET MY PROJECTS
// =======================
router.get('/my', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate('owner', 'name')
      .populate('members', 'name');

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// SEND JOIN REQUEST
// =======================
router.post('/:id/join', auth, async (req, res) => {
  try {
    const existing = await Request.findOne({
      user: req.user.id,
      project: req.params.id,
      status: 'pending'
    });

    if (existing) return res.json("Already requested");

    const request = new Request({
      user: req.user.id,
      project: req.params.id
    });

    await request.save();

    res.json("Request sent");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// GET OWNER REQUESTS
// =======================
router.get('/requests', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    const projectIds = projects.map(p => p._id);

    const requests = await Request.find({
      project: { $in: projectIds },
      status: 'pending'
    })
    .populate('user', 'name')
    .populate('project', 'title');

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// APPROVE REQUEST
// =======================
router.post('/requests/:id/approve', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json("Request not found");

    const project = await Project.findById(request.project);

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json("Not allowed");
    }

    request.status = 'approved';
    await request.save();

    if (!project.members.includes(request.user)) {
      project.members.push(request.user);
      await project.save();
    }

    res.json("Approved");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// REJECT REQUEST
// =======================
router.post('/requests/:id/reject', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json("Request not found");

    request.status = 'rejected';
    await request.save();

    res.json("Rejected");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// GET SINGLE PROJECT
// =======================
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name')
      .populate('members', 'name');

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


// =======================
// DELETE PROJECT
// =======================
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json("Not allowed");
    }

    await project.deleteOne();
    res.json("Deleted");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
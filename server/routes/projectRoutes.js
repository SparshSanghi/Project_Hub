const router = require('express').Router();

const Project = require('../models/Project');
const Request = require('../models/Request');
const auth = require('../middleware/auth');


// =======================
// CREATE PROJECT (Protected)
// =======================
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user.id
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// GET ALL PROJECTS (Public)
// =======================
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email')
      .populate('members', 'name');

    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// DELETE PROJECT (Owner Only)
// =======================
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json("Project not found");

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json("Not allowed");
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// SEND JOIN REQUEST
// =======================
router.post('/:id/join', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Prevent owner from joining own project
    if (project.owner.toString() === req.user.id) {
      return res.json({ message: "Owner cannot join own project" });
    }

    const existing = await Request.findOne({
      user: req.user.id,
      project: req.params.id
    });

    if (existing) {
      return res.json({ message: "Already requested" });
    }

    const request = new Request({
      user: req.user.id,
      project: req.params.id
    });

    await request.save();

    res.json({ message: "Request sent" });

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// ACCEPT REQUEST (Owner Only)
// =======================
router.post('/request/:id/accept', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('project');

    if (!request) return res.status(404).json("Request not found");

    if (request.project.owner.toString() !== req.user.id) {
      return res.status(403).json("Not allowed");
    }

    request.status = 'accepted';
    await request.save();

    const project = await Project.findById(request.project._id);

    if (!project.members.includes(request.user)) {
      project.members.push(request.user);
      await project.save();
    }

    res.json({ message: "Request accepted" });

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// REJECT REQUEST (Owner Only)
// =======================
router.post('/request/:id/reject', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('project');

    if (!request) return res.status(404).json("Request not found");

    if (request.project.owner.toString() !== req.user.id) {
      return res.status(403).json("Not allowed");
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: "Request rejected" });

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// GET ALL PENDING REQUESTS (Owner Dashboard)
// =======================
router.get('/requests', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });

    const projectIds = projects.map(p => p._id);

    const requests = await Request.find({
      project: { $in: projectIds },
      status: 'pending'
    }).populate('user project');

    res.json(requests);

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// GET MY PROJECTS (Personalized)
// =======================
router.get('/my', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate('members', 'name');

    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});
// =======================
// REMOVE MEMBER (Owner Only)
// =======================
router.post('/:projectId/remove/:userId', auth, async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json("Project not found");

    // Only owner can remove
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json("Not allowed");
    }

    // Remove user from members array
    project.members = project.members.filter(
      m => m.toString() !== userId
    );

    await project.save();

    res.json({ message: "Member removed" });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
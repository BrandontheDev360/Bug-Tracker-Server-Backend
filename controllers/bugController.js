const Express = require('express');
const { validateSession } = require('../middlewares');
const router = Express.Router();
const { models } = require('../models');

// Create Bug Ticket
router.post('/create', validateSession, async (req, res) => {
    const {title, description, priority } = req.body.bug
    
    try {
        await models.BugModel.create({
            title: title,
            description: description,
            priority: priority,
            userId: req.user.id
        })
        .then(
            bug => {
                res.status(201).json({
                    bug: bug,
                    message: 'Bug Ticket created'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create bug ticket: ${err}`
        })
    }
})

// Get all Bugs 
router.get('/all', async (req, res) => {
    const { id } = req.user
    try {
        const allBugs = await models.BugModel.findAll({
            where: {
                userId: id
            }
        })
        res.status(200).json(allBugs)
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

// Delete A Bug by id aka bugId
router.delete('/:id', validateSession, async (req, res) => {
    try {
        await models.BugModel.destroy({
            where: {
                id: req.params.id
            }
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: 'Bug Ticket Successfully Deleted!',
                    deletedBug : req.params.id

                })
            } else {
                res.status(400).json({
                    message: 'Bug Ticket does not exist'
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete Bug Source: ${err}`
        })
    }
})

// Update a Bug Ticket bearer token has to match user id that made the bug
router.put('/:id', validateSession, async (req, res) => {
    const {
        title,
        description,
        priority
    } = req.body.bug

    const bugId = req.params.id
    const userId = req.user.id

    const query = {
        where: {
            id: bugId,
            userId: userId
        }
    }

    const updatedModel = {
        title,
        description,
        priority
    }
    
    try {
        await models.BugModel.update(updatedModel, query)
        res.status(200).json({
            message: "Bug Ticket Successfully Updated",
            updatedBug: bugId,
            updatedModel
        })
    } catch (err) {
        res.status(500).json({
            message: `The error is : ${err}`
        })
    }
})

// GET ALL BUGS

router.get('/allbugs', async (req, res) => {
    try {
        const bugs = await models.BugModel.findAll()
        res.status(200).json({
            message: 'All bugs successfully retrieved',
            bugs
        })
    } catch (err) {
        res.status(500).json({
            err: err
        })
    }
})

module.exports = router;
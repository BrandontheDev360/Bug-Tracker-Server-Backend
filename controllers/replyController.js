const Express = require('express');
const { validateSession } = require('../middlewares');
const router = Express.Router();
const { models } = require('../models');

// Create Reply
router.post(`/create`, validateSession, async (req, res) => {
    const { reply, bugId } = req.body.reply;

    const userId = req.user.id
    try {
        await models.ReplyModel.create({
            reply: reply,
            bugId: bugId,
            userId: userId
        })
        .then(
            reply => {
                res.status(201).json({
                    reply: reply,
                    message: `Reply created`
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create reply: ${err}`
        })
    }
})

//Update Reply bearer token that goes with user and specific bug ticket
router.put('/:id', validateSession, async (req, res) => {
    const { reply, bugId } = req.body.reply

    const replyId = req.params.id
    const userId = req.user.id

    const query = {
        where : {
            id: replyId
        }
    }

    const updatedModel = {
        reply,
        bugId,
        userId,
        replyId
    }

    try {
        await models.ReplyModel.update(updatedModel, query)
        res.status(200).json({
            message: 'Reply successfully updated',
            updatedModel
        })
    } catch (err) {
        res.status(500).json({
            message: `The error is : ${err}`
        })
    }
})

// DELETE A REPLY
router.delete('/:id', validateSession, async (req, res) => {
    try {
        await models.ReplyModel.destroy({
            where: {
                id: req.params.id
            }
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: 'Reply successfully deleted',
                    deleteReplyId: req.params.id
                })
            } else {
                res.status(400).json({
                    message: 'Reply does not exist'
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete Reply Source: ${err}`
        })
    }
})

// GET ALL REPLIES
router.get('/all', validateSession, async (req, res) => {
    try {
        const replies = await models.ReplyModel.findAll()
        res.status(200).json({
            message: 'All replies retrieved',
            replies
        })
    } catch (err) {
        res.status(500).json({
            err: err
        })
    }
})

module.exports = router;
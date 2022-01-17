const Express = require('express')
const { UniqueConstraintError } = require('sequelize/lib/errors')
const router = Express.Router()
const { models } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

// USER REGISTER ROUTE
router.post('/register', async (req, res) => {
    let { firstName, lastName, email, password } = req.body.user
    try{
    const User = await models.UserModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email ,
        password: bcrypt.hashSync(password, 10)
    })
    let token = jwt.sign({ id: User.id, firstName: User.firstName, lastName: User.lastName, email: User.email, password: User.password }, process.env.JWT, { expiresIn: 60 * 60 * 24 });
    res.status(201).json({
        message: "User Successfully Registered :)",
        user: User,
        sessionToken: `Bearer ${token}`
    })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email is already in use"
            })
        } else {
            res.status(500).json({
                message: "Failed to Register"
            })
        }
    }
})

// USER INFO ROUTE
router.get('/info', async (req, res) => {
    try {
        await models.UserModel.findAll({
            include: [
                {
                    model: models.BugModel,
                    include: [
                        {
                            model: models.ReplyModel
                        }
                    ]
                }
            ]
        })
        .then(
            users => {
                res.status(200).json({
                    users: users
                })
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        })
    }
})

// USER LOGIN ROUTE
router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
    try {
        let login = await models.UserModel.findOne({
            where: {
                email: email,
            },
        })
        if (login) {
            let passwordComparison = await bcrypt.compare(password, login.password);
            if (passwordComparison) {
                let token = jwt.sign({
                    id: login.id, 
                    firstName: login.firstName, 
                    lastName: login.lastName, 
                    email: login.email, 
                    loginpassword: login.password  
                }, process.env.JWT, { expiresIn: 60 * 60 * 24 });
                res.status(200).json({
                    user: login,
                    message: "User successfully logged in!",
                    sessionToken: `Bearer ${token}`
                });
            } else {
                res.status(402).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;
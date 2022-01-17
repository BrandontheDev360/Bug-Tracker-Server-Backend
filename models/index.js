const db = require('../db')
const UserModel = require('./user')
const BugModel = require('./bug')
const ReplyModel = require('./reply')

// Associations
UserModel.hasMany(BugModel)
UserModel.hasMany(ReplyModel)

BugModel.belongsTo(UserModel)
BugModel.hasMany(ReplyModel)

ReplyModel.belongsTo(BugModel)

module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        BugModel,
        ReplyModel
    }
}
const { DataTypes } = require('sequelize')
const db = require('../db')

const Replies = db.define('reply', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    reply: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Replies;
const { DataTypes } = require('sequelize')
const db = require('../db')

const Bugs = db.define('bug', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    priority: {
        type: DataTypes.STRING,
        allowNull: true
    }

})

module.exports = Bugs
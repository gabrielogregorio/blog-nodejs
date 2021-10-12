const Sequielize = require('sequelize');

const connection = new Sequielize('guiapress', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection;

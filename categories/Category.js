const Sequelize = require('sequelize');
const connection = require('../database/database');


const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Força atualização para novos schemas
//Category.sync({force: true})

module.exports = Category;
/*
slug = Endereco da catergoria
Categoria tem o titulo:
* Desenvolvimento de Software
Slug:
* Desenvolvimento-de-Software
*/

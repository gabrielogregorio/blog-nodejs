// Libs Instaladas
const Sequelize = require('sequelize');

// Funções e arquivos gerais
const connection = require('../database/database');
const Category = require('../categories/Category');


const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// belongsTo => Pertence a
// 1 artigo pertence a uma categoria
Article.belongsTo(Category);

// 1 Categoria tem muitos artigos
Category.hasMany(Article);
// Somente especificar 1 já atende, não precisa dos dois

// Força atualização para novos schemas
//Article.sync({force: true})

module.exports = Article;
/*
slug = Endereco da catergoria
Categoria tem o titulo:
* Desenvolvimento de Software
Slug:
* Desenvolvimento-de-Software
*/

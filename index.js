const express = require('express');
const app = express();
const session = require('express-session');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./user/UsersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./user/User');

// View Engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public')); // Arquivos Estáticos

// Salva a sessão na memória RAM
// PARA APLICAÇÃO DE LARGA ESCALA, USE ALGO COMO O REDIS, UM DB De seção
app.use(session({
    secret: "Palavras chaves para o express criptar a sessão",
    cookie: { maxAge: 2592000000002 } // em ms => 30 dias
}))


// Database
connection.authenticate().then(() => {
    console.log('Conectado ao banco')
}).catch((error) => {
    console.log(error);
})

// Rotas externas
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/test', (req, res) => {
    res.json({status: 'on'})
});

// Rotas locais
app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']
    ],
    limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories:categories});
        })
    })
})

// Leitura individual de artigos
app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {slug: slug}
    }).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render('article', {article:article, categories:categories});
            })

        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {slug: slug},
        include: [{model: Article}] // join
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            })
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    })
})

app.listen(3000, () => {
    console.log('servidor is running!');
})

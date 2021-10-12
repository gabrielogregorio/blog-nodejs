// Libs Instaladas
const express = require('express');
const slugify = require('slugify');

// Funções e arquivos gerais
const adminAuth = require('../middlewares/adminAuth');
const Category = require('../categories/Category');
const Article = require('./Article');
const {isValidNumber, isValidString} = require('../util/validarEntrada');

// Instanciação do express
const router = express.Router();


// ==================== ROTAS PRIVADAS ===============================//
router.get('/admin/articles', adminAuth, (req, res) => {
    /* Rota que exibe os artigos publicados */
    Article.findAll({
        include: [{model: Category}] // Join
    }).then(articles => {
        res.render('admin/articles/index', {articles});
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    /* Rota de exibição para um admin criar um novo artigo */
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories});
    })
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    /* Rota de exibição para um admin editar um artigo publicado */
    var id = req.params.id;
    id = isValidNumber(id);

    if (!id) {
        res.redirect('/');
    } else {
        Article.findByPk(id).then(article => {
            if (article != undefined) {
                Category.findAll().then(categories => {
                    res.render('admin/articles/edit', {categories: categories, article: article});
                })
            } else {
                res.redirect('/')
            }
        }).catch(error => {
            res.redirect('/');
        })
    }
})

router.post('/articles/save', adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    title = isValidString(title);
    body = isValidString(body);
    category = isValidString(category);

    if (title && body && category) {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect('/admin/articles')
        });
    } else {
        res.redirect('/admin/articles/');
    }
});

// Deletar categorias
router.post('/articles/delete', adminAuth, (req, res) => {
    var id = req.body.id;
    id = isValidNumber(id);

    if(id) {
        Article.destroy({
            where: {id: id}
        }).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect('/admin/articles')
    }
})

// Update Artigos
router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    id = isValidNumber(id);
    title = isValidString(title);
    body = isValidString(body);
    category = isValidString(category);

    if (title && body && category && id) {
        Article.update({title: title, body: body, categoryId: category, slug: slugify(title)},{
            where: {id:id}
        }).then(() => {
            res.redirect('/admin/articles');
        })
    } else {
        res.redirect('/');
    }
})


// Paginação
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var limit = 4;
    page = isValidNumber(page);


    if (!page) {
        page = 1;
    } else {
        if (page < 1) {
            page = 1;
        }
    }

    var offset = (page-1) * limit;

    Article.findAndCountAll({
        limit: limit, // Limite de artigos
        offset: offset, // Onde a contagem começa
        order: [['id', 'DESC']]
    }).then(articles => {
        var next;

        var next = true;
        if (offset + limit >= articles.count) {
            next = false; // Não há mais proximo artigo
        }
        var result = {
            next: next, // Tem ou não proxima página?
            articles: articles,
            page: page
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result, categories})
        })
    })
})

module.exports = router;

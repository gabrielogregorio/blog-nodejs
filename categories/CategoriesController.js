const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const {isValidNumber, isValidString} = require('../util/validarEntrada');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new');
});

router.post('/categories/save', adminAuth, (req, res) => {
    var title = req.body.title;
    title = isValidString(title);

    if (!title) {
        res.redirect('/admin/categories/new');
    } else {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        })
    }
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories});
    });
})

router.post("/categories/delete", adminAuth, (req, res) => {
    var id = req.body.id;
    id = isValidNumber(id);

    if(!id) { // id inválido
        res.redirect('/admin/categories');
    } else {
        Category.destroy({
            where: {id}
        }).then(() => {
            res.redirect('/admin/categories');
        })
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;
    id = isValidNumber(id);

    if (!id) {
        res.redirect('/admin/categories');
    } else {
        Category.findByPk(id).then(category => {
            res.render('admin/categories/edit', {category:category})
        })
    }
})

router.post('/categories/update', adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    id = isValidNumber(id);
    title = isValidString(title)

    if (id && title) {
        Category.update({title:title, slug:slugify(title)}, {
            where: {id:id}
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories');
    }

})

module.exports = router;

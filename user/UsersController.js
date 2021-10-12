const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');
const {isValidNumber, isValidString} = require('../util/validarEntrada');


router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users});
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    email = isValidString(email);
    password = isValidString(password);

    if (password && email) {
        User.findOne({where: {email: email}}).then(user => {
            if(user == undefined) {
                // E-mail não está cadastrado
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);

                User.create({
                    email: email,
                    password: hash
                }).then(() => {
                    res.redirect('/');
                })
            } else { // Usuário Registrado no banco de dados
                res.redirect('/admin/users/create');
            }
        })

    } else { // Dados Inválidos
        res.redirect('/admin/users/create');
    }
})

router.get('/login', (req, res) => {
    res.render("admin/users/login");
})

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    email = isValidString(email);
    password = isValidString(password);

    if (email && password) {
        User.findOne({
            where: {email}
        }).then(user => {
            if (user == undefined) { // Usuário não cadastrado!
                res.redirect("/login");
            } else {
                var valid = bcrypt.compareSync(password, user.password);

                if (valid) { // Senha está correta

                    // Adição na seção
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }
                    res.redirect('/admin/articles');
                } else { // Senha incorreta
                    res.redirect("/login");
                }
            }
        })

    } else { // Dados Inválidos
        res.redirect("/login");
    }
})


router.get('/logout', adminAuth,  (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
})

module.exports = router;

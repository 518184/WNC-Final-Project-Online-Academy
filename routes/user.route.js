const express = require('express');
const bcrypt = require('bcryptjs')
const user_schema = require('../schemas/user.json');
const user_register_schema = require('../schemas/user_register.json');
const userModel = require('../models/user.model');
const auth = require('../middlewares/auth.mdw');
const validate = require('../middlewares/validate.mdw');
const router = express.Router();

router.post('/', validate(user_register_schema), async function (req, res) {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    user.id = await userModel.add(user);
    delete user.password;
    res.status(201).json(user);
})

router.get('/', auth, async function (req, res) {
    const list = await userModel.all();
    res.json(list);
});

router.get('/:id', auth, async function (req, res) {
    const id = req.params.id || 0;
    const customerSpec = await userModel.single(id);
    if (customerSpec === null) {
        return res.status(204).end();
    }
    res.json(customerSpec);
});

router.put('/:id', auth, validate(user_schema), async function (req, res) {
    const id = req.params.id;
    const customer = req.body;
    const id_list = await userModel.update(customer, id);
    customer.customer_id = id_list[0];
    res.status(200).json(customer);
});

router.delete('/:id', auth, async function (req, res) {
    const id = req.params.id || 0;
    if (id === 0) {
        return res.status(304).end();
    }
    await userModel.del(id);
    res.status(200).json({
        message: 'Delete Complete!'
    });
});

module.exports = router;
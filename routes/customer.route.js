const express = require('express');
const customerModel = require('../models/customer.model');
const customer_schema = require('../schemas/customer.json');
const validate = require('../middlewares/validate.mdw');
const router = express.Router();

router.get('/', async function(req, res){
    const list = await customerModel.all();
    res.json(list);
});

router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const customerSpec = await customerModel.single(id);
    if(customerSpec === null){
        return res.status(204).end();
    }
    res.json(customerSpec);
});

router.post('/', validate(customer_schema), async function(req, res){
    const customer = req.body;
    const id_list = await customerModel.add(customer);
    customer.customer_id = id_list[0];
    res.status(201).json(customer);
});

router.put('/:id', validate(customer_schema), async function(req, res){
    const id = req.params.id;
    const customer = req.body;
    const id_list = await customerModel.update(customer, id);
    customer.customer_id = id_list[0];
    res.status(200).json(customer);
});

router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    if(id===0){
        return res.status(304).end();
    }
    await customerModel.del(id);
    res.status(200).json({
        message: 'Delete Complete!'
    });
});

module.exports = router;
const express = require('express');
const categoryModel = require('../models/category.model');
const category_schema = require('../schemas/category.json');
const validate = require('../middlewares/validate.mdw');

const router = express.Router();

router.get('/', async function(req, res){
    var title, result;
    if(typeof req.query.title !== 'undefined'){
        title = req.query.title;
        result = await categoryModel.singleByCategoryTitle(title);
    }
    else{
        result = await categoryModel.all();
    }
    res.json(result);
});

router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const category = await categoryModel.single(id);
    if (category === null){
        return res.status(204).end();
    }
    res.json(category);
});

router.post('/', validate(category_schema), async function(req, res){
    const category = req.body;
    const id_list = await categoryModel.add(category);
    category.id = id_list[0];
    res.status(201).json(category);
});

router.put('/:id', validate(category_schema), async function(req, res){
    const id = req.params.id || 0;
    if (id === 0){
        return res.status(304).end();
    }
    const category = req.body;
    const id_list = await categoryModel.update(category, id);
    category.id = id_list[0];
    res.status(201).json(category);
});

router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    if (id === 0){
        return res.status(304).end();
    }
    await categoryModel.del(id);
    res.json({
        message: 'OK'
    });
});

module.exports = router;

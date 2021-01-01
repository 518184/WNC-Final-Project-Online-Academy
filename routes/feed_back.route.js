const express = require('express');
const feedBackModel = require('../models/feed_back.model');
const feedBack_schema = require('../schemas/feed_back.json');
const validate = require('../middlewares/validate.mdw');

const router = express.Router();

router.get('/', async function(req, res){
    var point, result;
    if(typeof req.query.point !== 'undefined'){
        point = req.query.point;
        result = await feedBackModel.singleByPoint(point);
    }
    else{
        result = await feedBackModel.all();
    }
    res.json(result);
});

router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const feedBack = await feedBackModel.single(id);
    if (feedBack === null){
        return res.status(204).end();
    }
    res.json(feedBack);
});

router.post('/', validate(feedBack_schema), async function(req, res){
    const feedBack = req.body;
    const id_list = await feedBackModel.add(feedBack);
    feedBack.id = id_list[0];
    res.status(201).json(feedBack);
});

router.put('/:id', validate(feedBack_schema), async function(req, res){
    const id = req.params.id || 0;
    if (id === 0){
        return res.status(304).end();
    }
    const feedBack = req.body;
    const id_list = await feedBackModel.update(feedBack, id);
    feedBack.id = id_list[0];
    res.status(201).json(feedBack);
});

router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    if (id === 0){
        return res.status(304).end();
    }
    await feedBackModel.del(id);
    res.json({
        message: 'OK'
    });
});

module.exports = router;

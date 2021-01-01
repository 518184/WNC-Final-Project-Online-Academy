const express = require('express');
const subjectModel = require('../models/subject.model');
const subject_schema = require('../schemas/subject.json');
const validate = require('../middlewares/validate.mdw');

const router = express.Router();

router.get('/', async function(req, res){
    const list = await subjectModel.all();
    res.json(list);
});

router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const subject = await subjectModel.single(id);
    if (subject === null){
        return res.status(204).end();
    }
    res.json(subject);
});

router.get('/titles/:title', async function(req, res){
    const title = req.params.title || 0;
    const subject = await subjectModel.singleBySubjectTitle(title);
    if (subject === null){
        return res.status(204).end();
    }
    res.json(subject);
});

router.post('/', validate(subject_schema), async function(req, res){
    const subject = req.body;
    const id_list = await subjectModel.add(subject);
    subject.id = id_list[0];
    res.status(201).json(subject);
});

router.put('/:id', validate(subject_schema), async function(req, res){
    const id = req.params.id || 0;
    if (id === 0){
        return res.status(304).end();
    }
    const subject = req.body;
    const id_list = await subjectModel.update(subject, id);
    subject.id = id_list[0];
    res.status(201).json(subject);
});

router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    if (id === 0){
        return res.status(304).end();
    }
    await subjectModel.del(id);
    res.json({
        message: 'OK'
    });
});



module.exports = router;

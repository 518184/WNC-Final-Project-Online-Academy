const express = require('express');
const courseModel = require('../models/course.model');
const course_schema = require('../schemas/course.json');
const validate = require('../middlewares/validate.mdw');
const router = express.Router();

router.get('/', async function(req, res){
    const list = await courseModel.all();
    res.json(list);
});

router.get('/:id', async function(req, res){
    const id = req.params.id || 0;
    const courseSpec = await courseModel.single(id);
    if(courseSpec === null){
        return res.status(204).end();
    }
    res.json(courseSpec);
});

router.post('/', validate(course_schema), async function(req, res){
    const course = req.body;
    const id_list = await courseModel.add(course);
    course.id = id_list[0];
    res.status(201).json(course);
});

router.put('/:id', validate(course_schema), async function(req, res){
    const id = req.params.id;
    const course = req.body;
    const id_list = await courseModel.update(course, id);
    course.id = id_list[0];
    res.status(200).json(course);
});

router.delete('/:id', async function(req, res){
    const id = req.params.id || 0;
    if(id===0){
        return res.status(304).end();
    }
    await courseModel.del(id);
    res.status(200).json({
        message: 'Delete Complete!'
    });
});

module.exports = router;
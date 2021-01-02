const express = require('express');
const courseModel = require('../models/course.model');
const course_schema = require('../schemas/course.json');
const validate = require('../middlewares/validate.mdw');
const feedback_schema = require('../schemas/feed_back.json');
const feedbackModel = require('../models/feed_back.model');

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

router.post('/:courseId/feedbacks', validate(feedback_schema), async function (req, res) {
    const courseId = +req.params.courseId;
    const userId = req.headers.userId;
    const course = await courseModel.single(courseId);
    if (course === null) {
        return res.status(404).json({
            message: 'CourseId: ' + courseId + ' doesn\'t exist'
        });
    }
    const feedback = req.body;
    feedback.courseId = courseId;
    feedback.userId = userId;

    const dbFeedback = await feedbackModel.singleByUserIdAndCourseId(userId, courseId);
    if(dbFeedback === null){
        const ids = await feedbackModel.add(feedback);
        feedback.id = ids[0];
        return res.status(201).json(feedback);
    }
    const ids = await feedbackModel.update(feedback, dbFeedback.id);
    feedback.id = ids[0];
    return res.status(200).json(feedback);
});

module.exports = router;
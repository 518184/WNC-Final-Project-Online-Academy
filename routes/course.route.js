const express = require('express');
const courseModel = require('../models/course.model');
const userModal = require('../models/user.model');
const categoryModel = require('../models/category.model');
const course_schema = require('../schemas/course.json');
const validate = require('../middlewares/validate.mdw');
const feedback_schema = require('../schemas/feedback.json');
const feedbackModel = require('../models/feedback.model');
const auth = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await courseModel.all();
    res.json(list);
});

router.get('/:id', async function (req, res) {
    const id = req.params.id || 0;
    const courseSpec = await courseModel.single(id);
    if (courseSpec === null) {
        return res.status(204).end();
    }
    res.status(200).json(courseSpec);
});

router.get('/category/:id', async function (req, res) {
    const id = req.params.id || 0;
    const courseSpec = await courseModel.singleCategoryID(id);
    if (courseSpec === null) {
        return res.status(204).end();
    }
    res.status(200).json(courseSpec);
});

router.post('/', auth(2), validate(course_schema), async function (req, res) {
    const course = req.body;
    course.teacherId = req.headers.userId;
    let userid = await userModal.singleIDTeacher(course.teacherId);
    if (!userid) {
        return res.status(404).json({
            message: 'Not allow user ID: ' + course.teacherId
        });
    }
    let categoryid = await categoryModel.single(course.categoryId);
    if (!categoryid) {
        return res.status(404).json({
            message: 'Category: ' + course.categoryId + ' doesn\'t exist'
        });
    }
    const id_list = await courseModel.add(course);
    course.id = id_list[0];
    res.status(201).json(course);
});

router.put('/:id', auth(2), validate(course_schema), async function (req, res) {
    const id = +req.params.id;
    const course = req.body;
    let dbCourse = await courseModel.single(id);
    if (!dbCourse) {
        return res.status(404).json({
            message: 'CourseId: ' + id + ' doesn\'t exist'
        });
    }
    if (req.headers.userId !== dbCourse.teacherId && req.headers.userType !== 3) {
        return res.status(403).json({
            message: 'Can\'t edit other user course'
        });
    }
    let userid = await userModal.singleIDTeacher(course.teacherId);
    if (!userid) {
        return res.status(404).json({
            message: 'Not allow user ID: ' + course.teacherId
        });
    }
    let categoryid = await categoryModel.single(course.categoryId);
    if (!categoryid) {
        return res.status(404).json({
            message: 'Category: ' + course.categoryId + ' doesn\'t exist'
        });
    }
    
    const id_list = await courseModel.update(course, id);
    course.id = id_list[0];
    res.status(200).json(course);
});

router.delete('/:id', auth(3), async function (req, res) {
    const id = req.params.id || 0;
    if (id === 0) {
        return res.status(304).end();
    }
    await courseModel.del(id);
    res.status(200).json({
        message: 'Delete Complete!'
    });
});

router.post('/:courseId/feedbacks', auth(1), validate(feedback_schema), async function (req, res) {
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
    if (dbFeedback === null) {
        const ids = await feedbackModel.add(feedback);
        feedback.id = ids[0];
        return res.status(201).json(feedback);
    }
    const ids = await feedbackModel.update(feedback, dbFeedback.id);
    feedback.id = ids[0];
    return res.status(200).json(feedback);
});

router.get('/:courseId/feedbacks', async function (req, res) {
    const courseId = +req.params.courseId;
    const course = await courseModel.single(courseId);
    if (course === null) {
        return res.status(404).json({
            message: 'CourseId: ' + courseId + ' doesn\'t exist'
        });
    }
    const feedbacks = await feedbackModel.findByCourseId(courseId);
    return res.status(200).json(feedbacks);
});

module.exports = router;
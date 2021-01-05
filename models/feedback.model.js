const db = require('../utils/db')

module.exports = {
    all(){
        return db('feedback');
    },

    async single(id){
        const feedbacks = await db('feedback').where('id', id);
        if(feedbacks.length === 0){
            return null;
        }
        return feedbacks[0];
    },

    findByCourseId(courseId){
        return db('feedback').where('courseId', courseId);
    },

    async singleByPoint(point){
        const feedbacks = await db('feedback').where('point', point);
        if(feedbacks.length === 0){
            return null;
        }
        return feedbacks[0];
    },

    async singleByUserIdAndCourseId(userId, courseId){
        const feedbacks = await db('feedback').where('userId', userId).andWhere('courseId', courseId).andWhere('isDeleted', false);
        if(feedbacks.length === 0){
            return null;
        }
        return feedbacks[0];
    },

    async add(feedback){
        feedback.createdDate = new Date();
        const ids = await db('feedback').insert(feedback);
        return ids[0];
    },

    update(feedback, id){
        feedback.modifiedDate = new Date();
        return db('feedback').where('id', id).update(feedback);
    },

    del(id){
        return db('feedback').where('id', id).update('isDeleted', true);
    }
};
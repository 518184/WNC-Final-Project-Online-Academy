const db = require('../utils/db')

module.exports = {
    all(){
        return db('feed_back');
    },

    async single(id){
        const feedBacks = await db('feed_back').where('id', id);
        if(feedBacks.length === 0){
            return null;
        }
        return feedBacks[0];
    },

    async singleByPoint(point){
        const feedBacks = await db('feed_back').where('point', point);
        if(feedBacks.length === 0){
            return null;
        }
        return feedBacks[0];
    },

    async singleByUserIdAndCourseId(userId, courseId){
        const feedbacks = await db('feed_back').where('userId', userId).andWhere('courseId', courseId).andWhere('isDeleted', false);
        if(feedbacks.length === 0){
            return null;
        }
        return feedbacks[0];
    },

    async add(feedBack){
        feedBack.createdDate = new Date();
        const ids = await db('feed_back').insert(feedBack);
        return ids[0];
    },

    update(feedBack, id){
        feedBack.modifiedDate = new Date();
        return db('feed_back').where('id', id).update(feedBack);
    },

    del(id){
        return db('feed_back').where('id', id).update('isDeleted', true);
    }
};
const db = require('../utils/db');

module.exports = {
    all(){
        return db('course');
    },

    async single(id){
        const courseSpec = await db('course').where('id', id).andWhere('isDeleted', false);
        if(courseSpec.length === 0){
            return null;
        }
        return courseSpec[0];
    },

    add(course){
        course.createdDate = new Date();
        return db('course').insert(course);
    },

    del(id){
        return db('course').where('id', id).del();
    },
    
    update(course, id){
        course.modifiedDate = new Date();
        return db('course').where('id', id).update(course);
    }
};
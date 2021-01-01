const { max } = require('../utils/db');
const db = require('../utils/db');

module.exports = {
    all(){
        return db('course');
    },

    async single(id){
        const courseSpec = await db('course').where('id', id);
        if(courseSpec.length === 0){
            return null;
        }
        return courseSpec[0];
    },

    add(course){
        return db('course').insert(course);
    },

    del(id){
        return db('course').where('id', id).del();
    },
    
    update(course, id){
        return db('course').where('id', id).update(course);
    }
};
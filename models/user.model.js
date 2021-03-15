const { json } = require('express');
const db = require('../utils/db')

module.exports = {
    async all(){
        return await db('user').where('isDeleted', false);
    },
    async allTeacher(){
        return await db('user').where('isDeleted', false).andWhere('type', 2);
    },
    async allStudent(){
        return await db('user').where('isDeleted', false).andWhere('type', 1);
    },

    async single(id){
        const users = await db('user').where('id', id).andWhere('isDeleted', false);
        if(users.length === 0){
            return null;
        }
        return users[0];
    },
    async singleIDTeacher(id){
        const users = await db('user').where('id', id).andWhere('isDeleted', false).andWhere('type', 2);
        if(users.length === 0){
            return null;
        }
        return users[0];
    },
    async singleByEmail(email){
        const users = await db('user').where('email', email).andWhere('isDeleted', false);
        if(users.length === 0){
            return null;
        }
        return users[0];
    },

    async add(user){
        user.createdDate = new Date();
        const ids = await db('user').insert(user);
        return ids[0];
    },

    async update(user, id){
        user.modifiedDate = new Date();
        return await db('user').where('id', id).update(user);
    },

    del(id){
        return db('user').where('id', id).update('isDeleted', true);
    },

    updateRefreshToken(id, refreshToken){
      return db('user').where('id', id).update('rfToken', refreshToken).update('modifiedDate', new Date());
    },

    async isValidRefreshToken(id, refreshToken) {
        const list = await db('user').where('id', id).andWhere('rfToken', refreshToken);
        if(list.length > 0) {
            return true;
        }
        return false;
    },

    async addWatchList(userId, courseId){
        const getListCourse = await db('user').where('id', userId).select('watchlist');
        const list = JSON.parse(JSON.stringify(getListCourse));
        
        if(list[0].watchlist === null){
            listCourse = {courseId};
            return await db('user').where('id', userId).update('watchlist', JSON.stringify(listCourse));
        }
        var listCourse = list[0].watchlist;
        let checkCourse = listCourse.search('"courseId": ' + courseId);
        if(checkCourse != -1){
            return null;
        } else {
            listCourse = listCourse.replace('}', ', "courseId": ' + courseId + '}');
            return await db('user').where('id', userId).update('watchlist', listCourse);
        }
    }
};
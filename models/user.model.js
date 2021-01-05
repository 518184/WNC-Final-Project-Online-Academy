const db = require('../utils/db')

module.exports = {
    all(){
        return db('user');
    },

    async single(id){
        const users = await db('user').where('id', id).andWhere('isDeleted', false);
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
    }
};
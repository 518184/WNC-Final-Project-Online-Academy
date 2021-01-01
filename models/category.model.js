const db = require('../utils/db')

module.exports = {
    all(){
        return db('category');
    },

    async single(id){
        const category = await db('category').where('id', id);
        if(category.length === 0){
            return null;
        }
        return category[0];
    },

    async singleByCategoryTitle(title){
        const category = await db('category').where('title', title);
        if(category.length === 0){
            return null;
        }
        return category[0];
    },

    async add(category){
        category.createdDate = new Date();
        const ids = await db('category').insert(category);
        return ids[0];
    },

    update(category, id){
        category.modifiedDate = new Date();
        return db('category').where('id', id).update(category);
    },

    del(id){
        return db('category').where('id', id).update('isDeleted', true);
    }
};
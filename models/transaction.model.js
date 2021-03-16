const db = require('../utils/db')

module.exports = {
    all() {
        return db('transaction');
    },
    async allWithUser(userId) {
        return await db('transaction').where('userId', userId).andWhere('isDeleted', false).andWhere('isPayment', true);
    },

    async single(id){
        const transactionSpec = await db('transaction').where('id', id).andWhere('isDeleted', false);
        if(transactionSpec.length === 0){
            return null;
        }
        return transactionSpec[0];
    },

    add(userId, transaction) {
        transaction.createdDate = new Date();
        transaction.userId = userId;
        return db('transaction').insert(transaction);
    },

    async updatePayment(id){
        return await db('transaction').where({'id': id, 'isDeleted': false}).update('isPayment', true).update('modifiedDate', new Date());
    },

    async updateDel(id){
        return await db('transaction').where('id', id).update('isDeleted', true).update('modifiedDate', new Date());
    }
};
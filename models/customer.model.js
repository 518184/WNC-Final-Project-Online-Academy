const { update } = require('../utils/db');
const db = require('../utils/db')

module.exports = {
    all(){
        return db('customer');
    },

    async single(id){
        const customerSpec = await db('customer').where('customer_id', id);
        if(customerSpec.length === 0){
            return null;
        }
        return customerSpec[0];
    },

    add(customer){
        return db('customer').insert(customer);
    },

    del(id){
        return db('customer').where('customer_id', id).del();
    },
    
    update(customer, id){
        return db('customer').where('customer_id', id).update(customer);
    }
};
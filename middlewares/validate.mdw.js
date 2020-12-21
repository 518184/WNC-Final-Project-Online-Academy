const ajv = require('ajv');
module.exports = function(schema){
    return function(req, res, next){
        const dateTimeRegex = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]) (2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?$');
        const validator = new ajv({ allErrors: true });
        validator.addFormat('date-time', {
            validate: (dateTimeString) => dateTimeRegex.test(dateTimeString)
        })
        const fn_validate = validator.compile(schema);
        const is_valid = fn_validate(req.body);
        if(!is_valid){
            return res.status(400).json(fn_validate.errors);
        }
        next();
    }
}
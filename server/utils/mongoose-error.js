import Boom from '@hapi/boom';

const codes = {
    ValidationError: 422,
};

const getMongooseStatusCode = (errorName) => codes[errorName] || 400;

const handleMongooseError = (err, ctx) => {
    const statusCode = getMongooseStatusCode(err.name);

    ctx.status = statusCode;
    ctx.body = Boom.boomify(err, { statusCode }).output;
};

export default handleMongooseError;

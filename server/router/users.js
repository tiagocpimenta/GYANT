import Router from 'koa-router';
import bcrypt from 'bcrypt';
import Boom from '@hapi/boom';
import { UserModel } from '../db';
import { handleMongooseError } from '../utils';

const router = new Router({ prefix: '/users' });

router.post('/login', async (ctx) => {
    const { email, password } = ctx.request.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw Boom.notFound(`User with email: "${email}" not found.`);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw Boom.badRequest(`Password invalid for email: "${email}"`);
        }

        ctx.body = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

router.post('/register', async (ctx) => {
    const { name, email, password } = ctx.request.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const _user = new UserModel({ name, email, password: hashPassword });

    try {
        ctx.body = await _user.save();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

export default router;

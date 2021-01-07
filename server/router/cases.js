import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import Boom from '@hapi/boom';
import { CaseModel } from '../db';
import { handleMongooseError } from '../utils';

const router = new Router({ prefix: '/cases' });

router.get('/unreviewed/:userId', async (ctx) => {
    const { userId } = ctx.params;

    try {
        const _cases = await CaseModel.find({ 'reviews.userId': { $ne: userId } });

        ctx.body = _cases;
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

router.post('/import', async (ctx) => {
    const dir = path.resolve('./server/data/cases');
    const fileNames = fs.readdirSync(dir);
    const files = fileNames.map((fileName) => {
        const id = fileName.replace('.txt', '');
        const description = fs.readFileSync(path.resolve(`${dir}/${fileName}`), 'utf8');

        return { id, description };
    });

    const updates = files.map(({ id, description }) => ({
        updateOne: {
            filter: { id },
            update: { id, description },
            upsert: true,
        },
    }));

    try {
        ctx.body = await CaseModel.collection.bulkWrite(updates);
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

router.put('/review', async (ctx) => {
    const { id, review } = ctx.request.body;
    const { userId, conditionId, date = Date.now() } = review;

    try {
        const _case = await CaseModel.findOne({ id });

        if (!_case) {
            throw Boom.notFound(`Case with id: "${id}" not found.`);
        }

        const _review = _case.reviews.find((r) => r.userId.toString() === userId);

        if (_review) {
            _review.conditionId = conditionId;
            _review.date = date;
        } else {
            _case.reviews.push({ userId, conditionId, date });
        }

        ctx.body = await _case.save();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

router.delete('/', async (ctx) => {
    try {
        ctx.body = await CaseModel.collection.drop();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

export default router;

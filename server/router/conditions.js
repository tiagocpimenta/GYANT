import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import neatCsv from 'neat-csv';
import { ConditionModel } from '../db';
import { handleMongooseError } from '../utils';

const router = new Router({ prefix: '/conditions' });

router.get('/', async (ctx) => {
    try {
        ctx.body = await ConditionModel.find();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

router.post('/', async (ctx) => {
    const { code, description } = ctx.request.body;

    const _condition = new ConditionModel({ code, description });

    try {
        ctx.body = await _condition.save();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

router.post('/import', async (ctx) => {
    const filePath = path.resolve('./server/data/conditions.csv');
    const conditionsCsv = fs.readFileSync(filePath);
    const conditions = await neatCsv(conditionsCsv, {
        mapHeaders: ({ index }) => ['code', 'description'][index],
        separator: '\t',
    });

    const replacements = conditions.map(({ code, description }) => ({
        replaceOne: {
            filter: { code },
            replacement: { code, description },
            upsert: true,
        },
    }));

    try {
        ctx.body = await ConditionModel.collection.bulkWrite(replacements);
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

export default router;

import Router from 'koa-router';
import casesRouter from './cases';
import conditionsRouter from './conditions';
import usersRouter from './users';

const router = new Router();

router.use(casesRouter.routes());
router.use(conditionsRouter.routes());
router.use(usersRouter.routes());

export default router;

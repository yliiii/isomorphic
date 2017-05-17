import Router from 'koa-router'
import usersCtrl from '../controller/users'

const router = new Router()

router.prefix('/api')

router.get('/user/:userId', usersCtrl)

export default router

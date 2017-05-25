import Router from 'koa-router'
import usersCtrl from '../controller/users'

const router = new Router()

router.prefix('/api')

router.get('/user', usersCtrl.info)
router.get('/user/list', usersCtrl.list)

export default router

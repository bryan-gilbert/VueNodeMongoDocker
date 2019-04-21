import BaseController from './base'
import User from '../models/user'

export default class UserController extends BaseController {
  constructor () {
    super(User, '_id')
  }

  route () {
    const router = super.route()
    // ... can add class specific routing here

    return router
  }
}

import BaseController from './base'
import Seedlings from '../models/seedlings'

export default class SeedlingsController extends BaseController {
  constructor () {
    super(Seedlings, '_id')
  }
}

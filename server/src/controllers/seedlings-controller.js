import Seedlings from '../models/seedlings'
import BaseController from './base'

export default class SeedlingsController extends BaseController {
  constructor() {
    super(Seedlings, '_id')
  }
}

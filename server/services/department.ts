import { provide } from 'ioc/ioc';
import Department, { IDepartment } from 'models/department';
import TYPES from 'constant/types';
import BaseService from './base';

@provide(TYPES.DepartmentService)
export default class DepartmentService extends BaseService<typeof Department, IDepartment> {
  constructor() {
    super(Department);
  }
}

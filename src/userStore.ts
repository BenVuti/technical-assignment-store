import { Restrict, Store } from './store';

export class UserStore extends Store {
  @Restrict('rw')
  name = 'John Doe';

  constructor() {
    super();
    this.defaultPolicy = 'rw';
  }
}

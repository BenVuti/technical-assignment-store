import { AdminStore } from './src/adminStore';
import { JSONObject } from './src/json-types';
import { Restrict, Store } from './src/store';
import { UserStore } from './src/userStore';

const userStore = new UserStore();

// console.log(userStore.allowedToRead("name"));
// console.log(userStore.allowedToWrite("name"));
// userStore.write("name", "Jhone Known");
// console.log(userStore.read("name"));
// console.log(userStore.allowedToRead("nonExistingKey"));
// console.log(userStore.allowedToWrite("nonExistingKey"))

const adminStore = new AdminStore(userStore);

try {
  console.log(adminStore.read('name'));
} catch (error) {
  console.log('happy');
}
console.log(adminStore.allowedToRead('nonExistingKey'));
console.log(adminStore.allowedToWrite('name'));
console.log(adminStore.allowedToWrite('nonExistingKey'));
userStore.write('profile:name', 'John Smith');
console.log(userStore.write('profile:name', 'John Smith'));
console.log(userStore.read('profile:name'));

console.log('-------------------');

adminStore.write('user:profile:name', 'John Smith');
console.log(adminStore.read('user:profile:name'));

console.log('-------------------');

try {
  adminStore.write('profile:name', 'John Smith');
} catch (error) {
  console.log('happy');
}

console.log('-------------------');

let store = new Store();
let entries: JSONObject = { a: 'value1', b: { c: 'value2' } };
store.writeEntries(entries);
console.log(store.read('a'));
console.log(store.read('b:c'));

console.log('-------------------');

store = new Store();
entries = { value: 'value', store: { value: 'value' } };
store.write('deep', entries);
const cStore = store.read('deep:store') as Store;
cStore.write('deep', entries);
console.log(store.read('deep:store:deep:store:value'));

console.log('-------------------');

console.log(adminStore.read('getCredentials:username'));

console.log('-------------------');

store = new Store();
store.defaultPolicy = 'none'; // Restrict all keys

try {
  store.write('restrictedKey', 'testValue');
} catch (error) {
  console.log('happy');
}

console.log('-------------------');

class TestStore extends Store {
  @Restrict('none')
  public restrictedProp?: string;
}
const testStore = new TestStore();

try {
  testStore.write('restrictedProp', 'new value');
} catch (error) {
  console.log('happy');
}

console.log('-------------------');

class TestStore3 extends Store {
  @Restrict('rw')
  public prop?: string;
}
const testStore3 = new TestStore3();
testStore3.write('prop', 'value1');
console.log(testStore3.allowedToRead('prop'), true);
console.log(testStore3.allowedToWrite('prop'), true);

// Change permissions
Restrict('r')(testStore3, 'prop');

console.log(testStore3.allowedToRead('prop'), true);
console.log(testStore3.allowedToWrite('prop'), false);

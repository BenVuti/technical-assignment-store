import { AdminStore } from './src/adminStore';
import { JSONObject } from './src/json-types';
import { Store } from './src/store';
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

const store = new Store();
const entries: JSONObject = { a: 'value1', b: { c: 'value2' } };
store.writeEntries(entries);
console.log(store.read('a'));
console.log(store.read('b:c'));

console.log('-------------------');

// const store = new Store();
// const entries: JSONObject = { value: 'value', store: { value: 'value' } };
// store.write('deep', entries);
// const cStore = store.read('deep:store') as Store;
// console.log(cStore, cStore instanceof Store);

// cStore.write('deep', entries);
// store.read('deep:store:deep:store:value');

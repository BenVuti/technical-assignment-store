import { AdminStore } from './src/adminStore';
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
// console.log(  adminStore.allowedToWrite("nonExistingKey"));

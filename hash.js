// hash.js
import bcrypt from 'bcrypt';

const password = 'cse340!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Hashed password:', hash);
});

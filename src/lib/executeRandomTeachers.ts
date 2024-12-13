import { runRandomTeachers } from "./runRandomTeachers";

console.log('Starting execution of random teachers creation...');
runRandomTeachers()
  .then(() => {
    console.log('Successfully completed random teachers creation');
  })
  .catch((error) => {
    console.error('Error executing random teachers:', error);
  });
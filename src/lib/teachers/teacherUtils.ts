import { faker } from "@faker-js/faker";

export const getRandomPrice = () => Math.floor(Math.random() * (80 - 30) + 30);

export const generateTeacherData = () => ({
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  facebook_profile: faker.internet.url(),
  show_email: faker.datatype.boolean(),
  show_phone: faker.datatype.boolean(),
  show_facebook: faker.datatype.boolean(),
  bio: faker.lorem.paragraph(),
  subscription_status: 'active' // Set status to active by default
});
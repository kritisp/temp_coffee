require('dotenv').config();
const mongoose = require('mongoose');
const Drink = require('./models/Drink');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coffeeDB';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to seed MongoDB');

  await Drink.deleteMany({});
  await Customer.deleteMany({});
  await Order.deleteMany({});

  const drinksData = [
    { name: 'Espresso', description: 'Strong, short shot of pure coffee', price: 120, image: '/images/espresso.png', stock: 30 },
    { name: 'Americano', description: 'Espresso topped with hot water', price: 150, image: '/images/americano.png', stock: 25 },
    { name: 'Cappuccino', description: 'Equal parts espresso, milk and foam', price: 180, image: '/images/cappuccino.png', stock: 25 },
    { name: 'Latte', description: 'Smooth espresso with lots of steamed milk', price: 190, image: '/images/latte.png', stock: 40 },
    { name: 'Mocha', description: 'Espresso with chocolate and milk', price: 200, image: '/images/mocha.png', stock: 0 },
    { name: 'Cold Coffee', description: 'Chilled blended coffee with milk and ice', price: 210, image: '/images/cold-coffee.png', stock: 20 },
  ];

  const createdDrinks = await Drink.insertMany(drinksData);
  console.log('Drinks seeded:', createdDrinks.length);

  const customer1 = await Customer.create({
    name: 'Bhagyashri Valecha',
    mobile: '9999999999',
    address: 'd19/8',
  });

  const customer2 = await Customer.create({
    name: 'Demo Customer',
    mobile: '5555555555',
    address: 'lh-1',
  });

  const espresso = createdDrinks.find(d => d.name === 'Espresso');
  const latte = createdDrinks.find(d => d.name === 'Latte');
  const americano = createdDrinks.find(d => d.name === 'Americano');

  await Order.create([
    {
      _id: '6aca586d54cca9557dfd406a',
      customer: customer1._id,
      customerName: 'Bhagyashri Valecha',
      mobile: '9999999999',
      drink: espresso._id,
      drinkName: 'Espresso',
      size: 'Medium',
      quantity: 2,
      unitPrice: espresso.price,
      totalAmount: espresso.price * 2,
      deliveryAddress: 'd19/8',
      status: 'Received',
    },
    {
      _id: '6aca2cd516b8535cde1ad343',
      customer: customer2._id,
      customerName: 'Demo Customer',
      mobile: '9999999999',
      drink: latte._id,
      drinkName: 'Latte',
      size: 'Medium',
      quantity: 2,
      unitPrice: latte.price,
      totalAmount: latte.price * 2,
      deliveryAddress: '12 MG Road, Bhubaneswar',
      status: 'Being Prepared',
    },
    {
      _id: '6aca79c354cca9557dfd40c2',
      customer: customer2._id,
      customerName: 'Demo Customer',
      mobile: '5555555555',
      drink: americano._id,
      drinkName: 'Americano',
      size: 'Medium',
      quantity: 1,
      unitPrice: americano.price,
      totalAmount: americano.price,
      deliveryAddress: 'lh-1',
      status: 'Received',
    }
  ]);

  console.log('Orders seeded successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

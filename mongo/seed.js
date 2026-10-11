// Seeds coffeeDB and demonstrates CRUD with mongosh.
//
// Run from the project root (with the MongoDB container running):
//   mongosh "mongodb://localhost:27017/coffeeDB" mongo/seed.js
//
// WARNING: this clears the drinks, customers and orders collections first.

// ---------- CREATE: drinks (with a stock field) ----------
print('--- CREATE: seeding drinks ---');
db.drinks.drop();
db.customers.drop();
db.orders.drop();
db.drinks.createIndex({ name: 1 }, { unique: true });

db.drinks.insertMany([
  { name: 'Espresso', description: 'Strong, short shot of pure coffee', price: 120, image: '/images/espresso.svg', stock: 30 },
  { name: 'Americano', description: 'Espresso topped with hot water', price: 150, image: '/images/americano.svg', stock: 25 },
  { name: 'Cappuccino', description: 'Equal parts espresso, milk and foam', price: 180, image: '/images/cappuccino.svg', stock: 25 },
  { name: 'Latte', description: 'Smooth espresso with lots of steamed milk', price: 190, image: '/images/latte.svg', stock: 40 },
  { name: 'Mocha', description: 'Espresso with chocolate and milk', price: 200, image: '/images/mocha.svg', stock: 0 },
  { name: 'Cold Coffee', description: 'Chilled blended coffee with milk and ice', price: 210, image: '/images/cold-coffee.svg', stock: 20 },
]);

// ---------- READ: drinks that are in stock ----------
print('--- READ: drinks in stock ---');
db.drinks.find({ stock: { $gt: 0 } }, { _id: 0, name: 1, price: 1, stock: 1 }).forEach(printjson);

// ---------- UPDATE: restock Espresso by 5 ----------
print('--- UPDATE: restock Espresso by 5 ---');
db.drinks.updateOne({ name: 'Espresso' }, { $inc: { stock: 5 } });

// ---------- CREATE: a customer ----------
print('--- CREATE: a customer ---');
const customerId = db.customers.insertOne({
  name: 'Demo Customer',
  mobile: '9999999999',
  address: '12 MG Road, Bhubaneswar',
}).insertedId;

// ---------- CREATE: an order (same steps the app takes) ----------
print('--- CREATE: an order for 2 Lattes ---');
const latte = db.drinks.findOne({ name: 'Latte' });
const demoOrderId = db.orders.insertOne({
  customer: customerId,
  customerName: 'Demo Customer',
  mobile: '9999999999',
  drink: latte._id,
  drinkName: 'Latte',
  size: 'Medium',
  quantity: 2,
  unitPrice: latte.price,
  totalAmount: latte.price * 2,
  deliveryAddress: '12 MG Road, Bhubaneswar',
  status: 'Received',
  createdAt: new Date(),
  updatedAt: new Date(),
}).insertedId;
db.drinks.updateOne({ _id: latte._id }, { $inc: { stock: -2 } });

// ---------- READ: a customer's orders ----------
print('--- READ: orders for mobile 9999999999 ---');
db.orders.find({ mobile: '9999999999' }, { customerName: 1, drinkName: 1, quantity: 1, status: 1, _id: 0 }).forEach(printjson);

// ---------- UPDATE: kitchen moves the order forward ----------
print('--- UPDATE: status Received -> Being Prepared ---');
db.orders.updateOne({ _id: demoOrderId }, { $set: { status: 'Being Prepared', updatedAt: new Date() } });

// ---------- DELETE: cancel only works while status is Received ----------
print('--- DELETE: try to cancel (should delete 0 because it is already being prepared) ---');
const result = db.orders.deleteOne({ _id: demoOrderId, status: 'Received' });
print('deletedCount = ' + result.deletedCount);

print('--- Done. Demo order is kept so you can see it in the Kitchen page. ---');

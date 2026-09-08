// Run with: npm run seed  (from the backend folder)
// Populates the database with sample categories, foods, and an admin account.
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const categoryNames = ['Pizza', 'Burgers', 'BBQ', 'Pakistani Food', 'Chinese Food', 'Fast Food', 'Desserts', 'Drinks'];

const foodByCategory = {
  Pizza: [
    { name: 'Margherita Pizza', description: 'Classic pizza topped with fresh mozzarella, tomato sauce, and basil.', price: 1250, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600', isFeatured: true },
    { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, red onions, and mozzarella.', price: 1450, image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=600' },
    { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni and a blend of melted cheeses.', price: 1350, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600' },
  ],
  Burgers: [
    { name: 'Classic Beef Burger', description: 'Juicy beef patty with lettuce, tomato, cheese, and house sauce.', price: 850, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', isFeatured: true },
    { name: 'Zinger Burger', description: 'Crispy fried chicken fillet with spicy mayo and pickles.', price: 750, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600' },
    { name: 'Cheese Melt Burger', description: 'Double patty smothered in a triple cheese blend.', price: 950, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600' },
  ],
  BBQ: [
    { name: 'Seekh Kabab Platter', description: 'Char-grilled minced beef skewers served with naan and chutney.', price: 1100, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600' },
    { name: 'Chicken Malai Boti', description: 'Creamy marinated chicken chunks grilled to smoky perfection.', price: 1050, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600', isFeatured: true },
    { name: 'Mixed Grill Platter', description: 'A generous mix of kababs, tikka, and boti with sides.', price: 1950, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600' },
  ],
  'Pakistani Food': [
    { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and fried onions.', price: 650, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600' },
    { name: 'Beef Nihari', description: 'Slow-cooked beef stew in a rich, spiced gravy, served with naan.', price: 900, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600' },
    { name: 'Daal Makhani', description: 'Creamy black lentils simmered overnight with butter and spices.', price: 550, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', isFeatured: true },
  ],
  'Chinese Food': [
    { name: 'Chicken Manchurian', description: 'Crispy chicken tossed in a tangy, spicy Indo-Chinese sauce.', price: 800, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600' },
    { name: 'Vegetable Chow Mein', description: 'Stir-fried noodles with fresh seasonal vegetables.', price: 650, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600' },
    { name: 'Chili Garlic Fried Rice', description: 'Wok-tossed rice with garlic, chili, and spring onion.', price: 600, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600' },
  ],
  'Fast Food': [
    { name: 'Loaded Cheese Fries', description: 'Crispy fries topped with melted cheese and jalapenos.', price: 500, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600' },
    { name: 'Chicken Nuggets (8pc)', description: 'Golden, crispy chicken nuggets served with dip.', price: 550, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600' },
    { name: 'Club Sandwich', description: 'Triple-layered sandwich with chicken, egg, and fresh veggies.', price: 700, image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600' },
  ],
  Desserts: [
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey molten center.', price: 450, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', isFeatured: true },
    { name: 'New York Cheesecake', description: 'Rich and creamy cheesecake on a buttery biscuit base.', price: 500, image: 'https://images.unsplash.com/photo-1567327613485-fbc7bf196a7a?w=600' },
    { name: 'Gulab Jamun (4pc)', description: 'Soft milk-solid dumplings soaked in fragrant sugar syrup.', price: 350, image: 'https://images.unsplash.com/photo-1601303516361-1c1a9edb32c5?w=600' },
  ],
  Drinks: [
    { name: 'Fresh Mango Shake', description: 'Creamy shake blended with ripe seasonal mangoes.', price: 350, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600' },
    { name: 'Iced Lemon Mint', description: 'A refreshing blend of fresh lemon, mint, and soda.', price: 250, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600' },
    { name: 'Cold Coffee', description: 'Chilled coffee blended with milk and a scoop of ice cream.', price: 400, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600' },
  ],
};

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([Food.deleteMany(), Category.deleteMany()]);

  console.log('Seeding categories...');
  const categoryDocs = await Category.insertMany(
    categoryNames.map((name) => ({ name, slug: slugify(name) }))
  );
  const categoryMap = Object.fromEntries(categoryDocs.map((c) => [c.name, c._id]));

  console.log('Seeding food items...');
  const foods = Object.entries(foodByCategory).flatMap(([catName, items]) =>
    items.map((item) => ({ ...item, category: categoryMap[catName] }))
  );
  await Food.insertMany(foods);

  console.log('Ensuring admin account exists...');
  const adminEmail = 'admin@restaurant.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Restaurant Admin',
      email: adminEmail,
      phone: '03000000000',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin created -> email: ${adminEmail} | password: Admin@123`);
  } else {
    console.log('Admin account already exists, skipping.');
  }

  console.log('Seeding complete!');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';
import Review from '../models/Review.js';

dotenv.config();

const initialRooms = [
  {
    slug: 'renovated-double',
    title: 'Renovated Double Room',
    badge: '2 Guests',
    description: 'A calm, recently renovated room with a private en-suite bathroom, work desk, flat-screen TV and a dressing area.',
    features: ['Private bathroom', 'Work desk', 'Flat-screen TV', 'Wardrobe'],
    pricePerNight: 850,
    maxGuests: 2,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096030/edion_royal_guesthouse/rooms/room_renovated_double.jpg'
  },
  {
    slug: 'twin-kitchenette',
    title: 'Twin Room with Kitchenette',
    badge: '2 Guests · Kitchenette',
    description: 'Ideal for longer stays and colleagues travelling together — two beds plus a fridge, microwave and full kitchenware set.',
    features: ['Fridge & microwave', 'Kitchenware', 'Private bathroom', 'Free WiFi'],
    pricePerNight: 950,
    maxGuests: 2,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096031/edion_royal_guesthouse/rooms/room_twin_kitchenette.jpg'
  },
  {
    slug: 'triple-room',
    title: 'Triple Room',
    badge: '3 Guests',
    description: 'A spacious room with a large double bed, bathroom, and reliable WiFi. Great value with flexible cancellation.',
    features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Flexible cancellation'],
    pricePerNight: 1100,
    maxGuests: 3,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096032/edion_royal_guesthouse/rooms/room_triple.jpg'
  },
  {
    slug: 'budget-double',
    title: 'Budget Double Room',
    badge: '2 Guests · Budget',
    description: 'A compact, affordable room with a large double bed, private bathroom, and all standard amenities.',
    features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Budget-friendly'],
    pricePerNight: 750,
    maxGuests: 2,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096033/edion_royal_guesthouse/rooms/room_budget_double.jpg'
  },
  {
    slug: 'comfort-triple-shower',
    title: 'Comfort Triple Room with Shower',
    badge: '3 Guests · Shower',
    description: 'Comfortable triple room with shower, ideal for guests who want a little extra room and convenience.',
    features: ['Private bathroom', 'Shower', 'Flat-screen TV', 'Free WiFi'],
    pricePerNight: 1150,
    maxGuests: 3,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096033/edion_royal_guesthouse/rooms/room_comfort_triple_shower.jpg'
  },
  {
    slug: 'budget-triple',
    title: 'Budget Triple Room',
    badge: '3 Guests · Extra-Large Bed',
    description: 'A larger triple room with a single bed and an extra-large double bed, perfect for a small group.',
    features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Extra-large bed'],
    pricePerNight: 1050,
    maxGuests: 3,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096034/edion_royal_guesthouse/rooms/room_budget_triple.jpg'
  },
  {
    slug: 'family-room',
    title: 'Family Room',
    badge: '3–4 Guests · Family Layout',
    description: 'Family-friendly room with a single bed and a double bed, offering comfort and extra space.',
    features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Family layout'],
    pricePerNight: 1350,
    maxGuests: 4,
    imageUrl: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096035/edion_royal_guesthouse/rooms/room_family.jpg'
  }
];

const initialReviews = [
  {
    name: "Thandi M.",
    location: "Johannesburg",
    rating: 5.0,
    initials: "TM",
    quote: "Excellent location — an easy drive to the Waterfront and a short walk to the beachfront. The room was clean and the bed comfortable."
  },
  {
    name: "Daniel K.",
    location: "United Kingdom",
    rating: 5.0,
    initials: "DK",
    quote: "Great value for money. Reception was helpful at all hours and the parking behind the gate gave us real peace of mind."
  },
  {
    name: "Lerato S.",
    location: "Pretoria",
    rating: 5.0,
    initials: "LS",
    quote: "The kitchenette made our week-long stay so much easier. Quiet street, friendly hosts and strong WiFi for remote work."
  },
  {
    name: "Francois & Anke B.",
    location: "Durban",
    rating: 5.0,
    initials: "FA",
    quote: "Such a peaceful oasis in Milnerton. Watching the Table Mountain sunset from the beachfront just down the road was unforgettable. We'll definitely be back!"
  },
  {
    name: "Markus W.",
    location: "Munich, Germany",
    rating: 5.0,
    initials: "MW",
    quote: "Spotless en-suite room, very secure premises and super fast check-in. Perfect base for exploring Cape Town without city center traffic."
  },
  {
    name: "Naledi K.",
    location: "Gqeberha",
    rating: 5.0,
    initials: "NK",
    quote: "The braai area and shared kitchen are fantastic bonuses. Warm hospitality, daily housekeeping, and truly felt like a home away from home."
  }
];

import Content from '../models/Content.js';
import Lead from '../models/Lead.js';
import { seedInitialEmployees } from '../routes/employeeRoutes.js';
import { DEFAULT_GUESTHOUSE_CONTENT } from '../config/defaultContent.js';

const initialLeads = [];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edion_royal_guesthouse';
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB: ${mongoUri}`);

    // Clear existing
    await Room.deleteMany();
    await Review.deleteMany();
    await Content.deleteMany();
    await Lead.deleteMany();
    console.log('[Seed] Cleared existing rooms, reviews, content, and leads.');

    // Insert initial
    await Room.insertMany(initialRooms);
    console.log(`[Seed] Successfully inserted ${initialRooms.length} rooms.`);

    await Review.insertMany(initialReviews);
    console.log(`[Seed] Successfully inserted ${initialReviews.length} reviews.`);

    await Content.create({
      key: 'website_content',
      data: DEFAULT_GUESTHOUSE_CONTENT
    });
    console.log('[Seed] Successfully seeded website CMS content.');

    await Lead.insertMany(initialLeads);
    console.log(`[Seed] Successfully seeded ${initialLeads.length} initial leads.`);

    await seedInitialEmployees();
    console.log('[Seed] Successfully seeded initial staff & admin employees.');

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedData();

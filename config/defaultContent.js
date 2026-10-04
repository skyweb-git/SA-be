export const DEFAULT_GUESTHOUSE_CONTENT = {
  hero: {
    eyebrowBadge: 'Milnerton · Cape Town',
    title: 'A warm, quiet stay minutes from the sea',
    subheading: 'Comfortable, secure accommodation in Milnerton. Private rooms, Wi-Fi and everything you need for a relaxed stay.',
    description: 'Edion Royal Guesthouse offers 7 beautifully appointed en-suite rooms off the R27, close to Milnerton Beach, Canal Walk, and Cape Town city centre.',
    phone: '078 972 4254',
    callNumber: '+27 78 972 4254',
    whatsappNumber: '+27 78 972 4254',
    ctaPrimary: 'Check availability',
    ctaSecondary: 'View our rooms',
    directReservationsLabel: 'DIRECT RESERVATIONS & INQUIRIES',
    addressTitle: '7 Arum Street',
    addressSubtitle: 'Milnerton, Cape Town',
    bgImages: {
      custom: '/798129955.jpg',
      estate: '/513927625.jpg',
      surreal: '/798153808.jpg'
    }
  },
  stats: {
    locationScore: '8.8',
    locationLabel: 'Location',
    wifiScore: '8.8',
    wifiLabel: 'Free WiFi',
    cleanlinessScore: '7.7',
    cleanlinessLabel: 'Cleanliness',
    valueScore: '7.6',
    valueLabel: 'Value for Money'
  },
  about: {
    badge: 'Welcome',
    title: 'Comfortable, secure accommodation in the heart of Milnerton',
    description1: 'Edion Royal Guesthouse is a family-run home away from home on Arum Street, Milnerton. Every room has been recently renovated and comes with its own private bathroom, fridge, microwave, work desk and flat-screen TV — whether you are here for a week of meetings or a Cape Town summer holiday.',
    description2: 'Guests have full use of the shared kitchen, lounge and braai area, while daily housekeeping and a 24-hour reception keep everything simple from arrival to check-out.',
    amenityTags: [
      { name: 'Free High-Speed WiFi', icon: 'Wifi' },
      { name: 'Free Secure Parking', icon: 'Car' },
      { name: '24-Hour Reception', icon: 'Clock' },
      { name: 'Braai & BBQ Area', icon: 'Flame' },
      { name: 'Shared Kitchen', icon: 'UtensilsCrossed' },
      { name: 'Daily Housekeeping', icon: 'ShieldCheck' }
    ]
  },
  roomsSection: {
    tag: 'Our rooms',
    title: 'Renovated en-suite rooms for every kind of stay',
    subtitle: 'From calm renovated double rooms and kitchenette suites to spacious triple and family rooms — all with private bathrooms, WiFi and TV.',
    items: [
      {
        id: 'renovated-double',
        title: 'Renovated Double Room',
        badge: '2 Guests',
        stats: 'A calm, recently renovated room with a private en-suite bathroom, work desk, flat-screen TV and a dressing area.',
        pricePerNight: 850,
        maxGuests: 2,
        features: ['Private bathroom', 'Work desk', 'Flat-screen TV', 'Wardrobe'],
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop'
      },
      {
        id: 'twin-kitchenette',
        title: 'Twin Room with Kitchenette',
        badge: '2 Guests · Kitchenette',
        stats: 'Ideal for longer stays and colleagues travelling together — two beds plus a fridge, microwave and full kitchenware set.',
        pricePerNight: 950,
        maxGuests: 2,
        features: ['Fridge & microwave', 'Kitchenware', 'Private bathroom', 'Free WiFi'],
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop'
      },
      {
        id: 'triple-room',
        title: 'Triple Room',
        badge: '3 Guests',
        stats: 'A spacious room with a large double bed, bathroom, and reliable WiFi. Great value with flexible cancellation.',
        pricePerNight: 1100,
        maxGuests: 3,
        features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Flexible cancellation'],
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'
      },
      {
        id: 'budget-double',
        title: 'Budget Double Room',
        badge: '2 Guests · Budget',
        stats: 'A compact, affordable room with a large double bed, private bathroom, and all standard amenities.',
        pricePerNight: 750,
        maxGuests: 2,
        features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Budget-friendly'],
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop'
      },
      {
        id: 'comfort-triple-shower',
        title: 'Comfort Triple Room with Shower',
        badge: '3 Guests · Shower',
        stats: 'Comfortable triple room with shower, ideal for guests who want a little extra room and convenience.',
        pricePerNight: 1150,
        maxGuests: 3,
        features: ['Private bathroom', 'Shower', 'Flat-screen TV', 'Free WiFi'],
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop'
      },
      {
        id: 'budget-triple',
        title: 'Budget Triple Room',
        badge: '3 Guests · Extra-Large Bed',
        stats: 'A larger triple room with a single bed and an extra-large double bed, perfect for a small group.',
        pricePerNight: 1050,
        maxGuests: 3,
        features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Extra-large bed'],
        imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop'
      },
      {
        id: 'family-room',
        title: 'Family Room',
        badge: '3–4 Guests · Family Layout',
        stats: 'Family-friendly room with a single bed and a double bed, offering comfort and extra space.',
        pricePerNight: 1350,
        maxGuests: 4,
        features: ['Private bathroom', 'Flat-screen TV', 'Free WiFi', 'Family layout'],
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop'
      }
    ]
  },
  inclusions: {
    badge: 'Standard Inclusions',
    title: 'Included in every room at Edion Royal',
    description: 'We believe comfort should come standard. No hidden extra charges for essentials — every guest enjoys private, fully equipped accommodation backed by 24-hour reception and gated parking.',
    items: [
      {
        title: 'Private Bathroom',
        desc: 'Spotless private en-suite bathroom with fresh daily towels, hot shower, and toiletries.',
        icon: 'Bath'
      },
      {
        title: 'Uncapped WiFi & TV',
        desc: 'High-speed wireless internet with dedicated work desks and flat-screen televisions in all rooms.',
        icon: 'Wifi'
      },
      {
        title: 'Gated Peace of Mind',
        desc: '24-hour reception, remote-gated parking, daily housekeeping, and shared kitchen/braai access.',
        icon: 'ShieldCheck'
      }
    ]
  },
  amenitiesSection: {
    badge: 'Amenities Directory',
    title: 'All the comforts you need during your stay',
    subtitle: 'From fast WiFi to a shared kitchen and secure parking, our guesthouse is designed to keep your Cape Town holiday or business trip comfortable, relaxed, and easy.',
    items: [
      {
        id: 'amenity-wifi',
        name: 'Free high-speed WiFi',
        category: 'Connectivity',
        desc: 'Reliable connection for work and streaming.',
        icon: 'Wifi'
      },
      {
        id: 'amenity-parking',
        name: 'Secure parking',
        category: 'Parking & Security',
        desc: 'Off-street parking behind a gated entrance.',
        icon: 'Car'
      },
      {
        id: 'amenity-shuttle',
        name: 'Airport shuttle',
        category: 'Transport',
        desc: 'Convenient pickup service available on request.',
        icon: 'Plane'
      },
      {
        id: 'amenity-reception',
        name: '24-hour reception',
        category: 'Front Desk',
        desc: 'Late arrivals are welcome and assisted.',
        icon: 'Clock'
      },
      {
        id: 'amenity-kitchen',
        name: 'Shared kitchen',
        category: 'Dining & Kitchen',
        desc: 'Fully equipped kitchen for self-catering stays.',
        icon: 'UtensilsCrossed'
      },
      {
        id: 'amenity-braai',
        name: 'Braai facilities',
        category: 'Leisure',
        desc: 'Outdoor barbecue area for relaxed dinners.',
        icon: 'Flame'
      },
      {
        id: 'amenity-housekeeping',
        name: 'Daily housekeeping',
        category: 'Service',
        desc: 'Fresh towels and linen every day.',
        icon: 'Sparkles'
      },
      {
        id: 'amenity-security',
        name: '24/7 security',
        category: 'Safety',
        desc: 'Gated property with secure on-site monitoring.',
        icon: 'Lock'
      }
    ]
  },
  locationSection: {
    badge: 'Location',
    title: 'Table Mountain views, minutes from your door',
    subtitle: 'Find us right off the R27, just minutes from the beachfront and a short drive from Cape Town city centre.',
    address: '7 Arum Street, Milnerton, Cape Town, 7441',
    addressDetails1: 'Arum Street is a quiet residential road close to Milnerton Beach. The guesthouse is easy to reach from the R27 and has secure on-site parking.',
    addressDetails2: 'Cape Town city centre is about 15 minutes away by car. The airport is roughly 20 minutes from the guesthouse.',
    mapEmbedUrl: 'https://maps.google.com/maps?q=7%20Arum%20Street,%20Milnerton,%20Cape%20Town,%207441&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsLink: 'https://maps.google.com/?q=7+Arum+Street,+Milnerton,+Cape+Town,+7441',
    distances: [
      { name: 'Milnerton Beach & Lagoon', distance: '1.8 km (3 mins)' },
      { name: 'Century City / Canal Walk', distance: '7 km (8 mins)' },
      { name: 'CTICC Convention Centre', distance: '10 km (14 mins)' },
      { name: 'Robben Island Ferry', distance: '11 km (15 mins)' },
      { name: 'V&A Waterfront', distance: '13 km (16 mins)' },
      { name: 'Cape Town International Airport', distance: '18 km (20 mins)' }
    ]
  },
  reviewsSection: {
    badge: 'Guest reviews',
    title: 'What our guests say',
    items: [
      {
        id: 1,
        name: 'Thandi M.',
        location: 'Johannesburg',
        rating: 5.0,
        initials: 'TM',
        quote: 'Excellent location — an easy drive to the Waterfront and a short walk to the beachfront. The room was clean and the bed comfortable.'
      },
      {
        id: 2,
        name: 'Daniel K.',
        location: 'United Kingdom',
        rating: 5.0,
        initials: 'DK',
        quote: 'Great value for money. Reception was helpful at all hours and the parking behind the gate gave us real peace of mind.'
      },
      {
        id: 3,
        name: 'Lerato S.',
        location: 'Pretoria',
        rating: 5.0,
        initials: 'LS',
        quote: 'The kitchenette made our week-long stay so much easier. Quiet street, friendly hosts and strong WiFi for remote work.'
      },
      {
        id: 4,
        name: 'Francois & Anke B.',
        location: 'Durban',
        rating: 5.0,
        initials: 'FA',
        quote: "Such a peaceful oasis in Milnerton. Watching the Table Mountain sunset from the beachfront just down the road was unforgettable. We'll definitely be back!"
      },
      {
        id: 5,
        name: 'Markus W.',
        location: 'Munich, Germany',
        rating: 5.0,
        initials: 'MW',
        quote: 'Spotless en-suite room, very secure premises and super fast check-in. Perfect base for exploring Cape Town without city center traffic.'
      },
      {
        id: 6,
        name: 'Naledi K.',
        location: 'Gqeberha',
        rating: 5.0,
        initials: 'NK',
        quote: 'The braai area and shared kitchen are fantastic bonuses. Warm hospitality, daily housekeeping, and truly felt like a home away from home.'
      }
    ]
  },
  contact: {
    phone: '+27 78 972 4254',
    callNumber: '0789724254',
    whatsapp: '+27 78 972 4254',
    whatsappNumber: '27789724254',
    email: 'stay@edionroyal.co.za',
    address: '7 Arum Street, Milnerton, Cape Town, 7441',
    checkInTime: 'From 14:00 (24h assisted)',
    checkOutTime: 'By 10:00',
    websiteUrl: 'https://edionroyal.co.za'
  },
  footer: {
    copyright: '© 2026 Edion Royal Guesthouse, Milnerton, Cape Town.',
    badges: ['Free WiFi', 'Free parking', '24-hour reception']
  },
  theme: {
    presetName: 'Oceanic Sapphire (Default)',
    accentColor: '#2563eb',
    accentGlow: '#60a5fa',
    accentSubtle: '#dbeafe',
    darkPrimary: '#0f172a',
    darkNavy: '#102138',
    darkNavyLight: '#1e293b',
    pageBg: '#f8fafc',
    surfaceBg: '#ffffff',
    surfaceSubtle: '#f1f5f9',
    textColor: '#102138',
    textMuted: '#556c86',
    borderColor: '#e2e8f0'
  },
  customThemes: []
};

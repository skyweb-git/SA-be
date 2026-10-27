import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('=== Starting Cloudinary Image Seeder ===');

if (!isCloudinaryConfigured()) {
  console.error('[Error] Cloudinary is not configured. Please check your credentials in backend/.env');
  process.exit(1);
}

// 1. Define all assets to upload
const roomImages = [
  {
    id: 'renovated-double',
    title: 'Renovated Double Room',
    source: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_renovated_double'
  },
  {
    id: 'twin-kitchenette',
    title: 'Twin Room with Kitchenette',
    source: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_twin_kitchenette'
  },
  {
    id: 'triple-room',
    title: 'Triple Room',
    source: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_triple'
  },
  {
    id: 'budget-double',
    title: 'Budget Double Room',
    source: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_budget_double'
  },
  {
    id: 'comfort-triple-shower',
    title: 'Comfort Triple Room with Shower',
    source: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_comfort_triple_shower'
  },
  {
    id: 'budget-triple',
    title: 'Budget Triple Room',
    source: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_budget_triple'
  },
  {
    id: 'family-room',
    title: 'Family Room',
    source: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop',
    publicId: 'room_family'
  }
];

const websiteImages = [
  {
    key: 'custom',
    name: 'Guesthouse Hero 1',
    filePath: path.join(rootDir, 'my-app/public/798129955.jpg'),
    publicId: 'hero_custom_798129955'
  },
  {
    key: 'estate',
    name: 'Estate Exterior',
    filePath: path.join(rootDir, 'my-app/public/513927625.jpg'),
    publicId: 'hero_estate_513927625'
  },
  {
    key: 'surreal',
    name: 'Ambient 3D View',
    filePath: path.join(rootDir, 'my-app/public/798153808.jpg'),
    publicId: 'hero_surreal_798153808'
  },
  {
    key: 'location',
    name: 'Location Map Banner',
    filePath: path.join(rootDir, 'my-app/public/location-bg.jpg'),
    publicId: 'bg_location'
  },
  {
    key: 'hero_bg',
    name: 'Hero Background Vector',
    filePath: path.join(rootDir, 'my-app/public/hero-bg.png'),
    publicId: 'bg_hero'
  },
  {
    key: 'cta_bg',
    name: 'CTA Background',
    filePath: path.join(rootDir, 'my-app/public/cta-bg.webp'),
    publicId: 'bg_cta'
  }
];

const uploadFolder = path.join(rootDir, 'backend/uploads');
const localUploads = fs.existsSync(uploadFolder)
  ? fs.readdirSync(uploadFolder)
      .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
      .map(filename => ({
        filename,
        filePath: path.join(uploadFolder, filename),
        publicId: `upload_${path.parse(filename).name}`
      }))
  : [];

async function uploadToCloudinary(item, folder) {
  try {
    const target = item.filePath || item.source;
    console.log(`[Uploading] ${item.title || item.name || item.filename}...`);
    const res = await cloudinary.uploader.upload(target, {
      folder: `edion_royal_guesthouse/${folder}`,
      public_id: item.publicId,
      overwrite: true,
      resource_type: 'image'
    });
    console.log(`[✓ Uploaded] ${item.title || item.name || item.filename} -> ${res.secure_url}`);
    return {
      ...item,
      secure_url: res.secure_url,
      public_id: res.public_id,
      format: res.format,
      width: res.width,
      height: res.height,
      bytes: res.bytes
    };
  } catch (err) {
    console.error(`[✗ Failed] ${item.title || item.name || item.filename}:`, err.message);
    return {
      ...item,
      error: err.message
    };
  }
}

async function runSeeder() {
  const seededRooms = [];
  console.log('\n--- 1. Uploading Room Images ---');
  for (const r of roomImages) {
    const result = await uploadToCloudinary(r, 'rooms');
    seededRooms.push(result);
  }

  const seededWebsite = [];
  console.log('\n--- 2. Uploading Website / Background Images ---');
  for (const w of websiteImages) {
    if (fs.existsSync(w.filePath)) {
      const result = await uploadToCloudinary(w, 'backgrounds');
      seededWebsite.push(result);
    } else {
      console.warn(`[Skip] File not found: ${w.filePath}`);
    }
  }

  const seededLocalUploads = [];
  console.log('\n--- 3. Uploading Local Backend Uploads ---');
  for (const u of localUploads) {
    const result = await uploadToCloudinary(u, 'media');
    seededLocalUploads.push(result);
  }

  // Save the full mapping
  const manifest = {
    timestamp: new Date().toISOString(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    rooms: seededRooms,
    website: seededWebsite,
    uploads: seededLocalUploads
  };

  const manifestPath = path.join(__dirname, '../config/cloudinaryImages.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n[✓ Saved] Upload manifest written to ${manifestPath}`);

  return manifest;
}

runSeeder().then(() => {
  console.log('\n=== Cloudinary Seeding Complete! ===');
  process.exit(0);
}).catch(err => {
  console.error('\n[Error] Cloudinary Seeder failed:', err);
  process.exit(1);
});

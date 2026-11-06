// One-off: crops the source photos into src/assets/photos.
// Usage: node scripts/prepare-photos.mjs <folder-with-raw-photos>
import sharp from 'sharp';
import path from 'node:path';

const src = process.argv[2];
const jobs = [
  ['h55884.jpg', 'facade', null, 1],
  ['h55890.jpg', 'lobby', { left: 0, top: 560, width: 1512, height: 1456 }, 1],
  ['r126170.jpg', 'double', { left: 200, top: 420, width: 1336, height: 890 }, 1],
  ['r126175.jpg', 'twin', { left: 100, top: 500, width: 1436, height: 958 }, 1],
  ['r126179.jpg', 'triple', { left: 0, top: 480, width: 1536, height: 1024 }, 1],
  ['l1715585465.webp', 'terrace', { left: 0, top: 112, width: 1200, height: 372 }, 1],
  ['l1715585466.webp', 'apartment-bed', { left: 0, top: 300, width: 900, height: 720 }, 0.78],
  ['l1715585476.webp', 'apartment-living', { left: 0, top: 330, width: 900, height: 870 }, 0.78],
  ['w39949584.jpg', 'salon', { left: 0, top: 40, width: 2048, height: 1152 }, 1.06],
  ['w39949590.jpg', 'coffee', { left: 0, top: 420, width: 1536, height: 1000 }, 1.04],
];

for (const [file, name, crop, brightness] of jobs) {
  let image = sharp(path.join(src, file)).rotate();
  if (crop) image = image.extract(crop);
  await image.modulate({ saturation: 0.97, brightness })
    .jpeg({ quality: 88, mozjpeg: true }).toFile(`src/assets/photos/${name}.jpg`);
}

// Tiny blurred backdrop for the opening scene (depth 0).
await sharp(path.join(src, 'h55884.jpg')).rotate().resize(240).blur(6)
  .jpeg({ quality: 60 }).toFile('src/assets/photos/facade-blur.jpg');
console.log('done', jobs.length + 1);

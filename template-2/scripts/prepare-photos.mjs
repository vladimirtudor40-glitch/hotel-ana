// One-off: crops the source photos into src/assets/photos.
// Usage: node scripts/prepare-photos.mjs <folder-with-raw-photos>
import sharp from 'sharp';
import path from 'node:path';

const src = process.argv[2];
const jobs = [
  ['r126179.jpg', 'hero', { left: 0, top: 430, width: 1536, height: 1180 }],
  ['r126170.jpg', 'double-a', { left: 200, top: 330, width: 1336, height: 1000 }],
  ['r126173.jpg', 'double-b', { left: 0, top: 250, width: 1536, height: 1150 }],
  ['r126175.jpg', 'twin-a', { left: 100, top: 480, width: 1436, height: 1076 }],
  ['r126176.jpg', 'twin-b', { left: 0, top: 500, width: 1536, height: 1150 }],
  ['r126180.jpg', 'triple-a', { left: 0, top: 400, width: 1536, height: 1150 }],
  ['r126179.jpg', 'triple-b', { left: 560, top: 800, width: 560, height: 800 }],
  ['l1715585466.webp', 'apartment-a', { left: 0, top: 350, width: 900, height: 675 }],
  ['l1715585476.webp', 'apartment-b', { left: 0, top: 400, width: 900, height: 675 }],
  ['l1715585465.webp', 'terrace', { left: 0, top: 112, width: 1200, height: 372 }],
  ['w39949584.jpg', 'salon', { left: 200, top: 60, width: 1500, height: 1200 }],
  ['w39949582.jpg', 'reception', { left: 500, top: 100, width: 1400, height: 1050 }],
  ['h55890.jpg', 'mosaic', { left: 0, top: 1130, width: 1512, height: 886 }],
  ['w39949590.jpg', 'coffee', { left: 0, top: 420, width: 1536, height: 1000 }],
];

for (const [file, name, crop] of jobs) {
  await sharp(path.join(src, file)).rotate().extract(crop)
    .modulate({ saturation: 0.96, brightness: 1.02 })
    .jpeg({ quality: 88, mozjpeg: true }).toFile(`src/assets/photos/${name}.jpg`);
}
console.log('done', jobs.length);

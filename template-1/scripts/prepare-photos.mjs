// One-off: crops and lightly grades the source photos into src/assets/photos.
// Usage: node scripts/prepare-photos.mjs <folder-with-raw-photos>
import sharp from 'sharp';
import path from 'node:path';

const src = process.argv[2];
const out = 'src/assets/photos';
const jobs = [
  ['h55884.jpg', 'facade', null],
  ['h55890.jpg', 'lobby', { left: 0, top: 500, width: 1512, height: 1516 }],
  ['w39949584.jpg', 'salon', { left: 0, top: 60, width: 2048, height: 1152 }],
  ['w39949582.jpg', 'reception', { left: 500, top: 0, width: 1548, height: 1536 }],
  ['w39949590.jpg', 'coffee', { left: 0, top: 420, width: 1536, height: 1000 }],
  ['w39949588.jpg', 'stairs', { left: 0, top: 0, width: 1536, height: 1800 }],
  ['l1715585465.webp', 'terrace', { left: 0, top: 112, width: 1200, height: 372 }],
  ['r126170.jpg', 'room-double', { left: 200, top: 330, width: 1336, height: 1070 }],
  ['r126175.jpg', 'room-twin', { left: 150, top: 480, width: 1386, height: 1110 }],
  ['r126179.jpg', 'room-triple', { left: 0, top: 330, width: 1536, height: 1230 }],
  ['r126173.jpg', 'bath', { left: 0, top: 150, width: 1536, height: 1500 }],
  ['l1715585466.webp', 'apartment-bed', { left: 0, top: 300, width: 900, height: 720 }],
  ['l1715585476.webp', 'apartment-living', { left: 0, top: 330, width: 900, height: 870 }],
];

for (const [file, name, crop] of jobs) {
  let img = sharp(path.join(src, file)).rotate();
  if (crop) img = img.extract(crop);
  await img.modulate({ saturation: 0.93, brightness: 1.03 }).jpeg({ quality: 88, mozjpeg: true }).toFile(`${out}/${name}.jpg`);
}

await sharp(path.join(src, 'h55884.jpg')).rotate()
  .extract({ left: 0, top: 120, width: 1536, height: 806 })
  .resize(1200, 630).jpeg({ quality: 80, mozjpeg: true }).toFile('public/og.jpg');
console.log('done', jobs.length);

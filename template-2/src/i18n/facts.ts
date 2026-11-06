// All hotel facts live here. Sources and open questions: see PROIECT.md.

export type Lang = 'ro' | 'en';

export const hotel = {
  name: 'Hotel Ana',
  street: 'Str. Limanului, nr. 1',
  postal: '900635',
  city: 'Constanța',
  phoneMobile: '+40773822993',
  phoneMobileLabel: '0773 822 993',
  phoneDesk: '+40241650025',
  phoneDeskLabel: '0241 650 025',
  whatsapp: 'https://wa.me/40773822993',
  email: 'hotelana2000@yahoo.ro',
  company: 'Ana Prod 2000 SRL',
  cui: 'RO19126353',
  facebook: 'https://www.facebook.com/hotelanaconstanta',
  instagram: 'https://www.instagram.com/hotelana4/',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=44.1981709,28.6369761',
  lat: 44.1981709,
  lng: 28.6369761,
  booking: 'https://hotel-ana.pynbooking.direct',
};

// Official 2026 tariff list, published on hotelanaconstanta.ro/preturi. Lei per night, room only.
export const rates = [
  { from: '2026-01-05', to: '2026-04-09', single: 230, double: 250, triple: 290, apartment: 350 },
  { from: '2026-04-10', to: '2026-04-13', single: 260, double: 280, triple: 320, apartment: 400 },
  { from: '2026-04-14', to: '2026-04-30', single: 230, double: 250, triple: 300, apartment: 380 },
  { from: '2026-05-01', to: '2026-05-03', single: 280, double: 300, triple: 350, apartment: 450 },
  { from: '2026-05-04', to: '2026-05-28', single: 240, double: 270, triple: 320, apartment: 400 },
  { from: '2026-05-29', to: '2026-06-02', single: 300, double: 320, triple: 380, apartment: 450 },
  { from: '2026-06-03', to: '2026-06-18', single: 250, double: 260, triple: 330, apartment: 400 },
  { from: '2026-06-19', to: '2026-07-02', single: 270, double: 300, triple: 350, apartment: 420 },
  { from: '2026-07-03', to: '2026-07-16', single: 300, double: 320, triple: 370, apartment: 450 },
  { from: '2026-07-17', to: '2026-08-23', single: 320, double: 350, triple: 400, apartment: 480 },
  { from: '2026-08-24', to: '2026-09-03', single: 270, double: 300, triple: 350, apartment: 400 },
  { from: '2026-09-04', to: '2026-09-19', single: 240, double: 270, triple: 300, apartment: 380 },
  { from: '2026-09-20', to: '2026-12-24', single: 230, double: 250, triple: 280, apartment: 350 },
];

const lowest = (key: 'single' | 'double' | 'triple' | 'apartment') =>
  Math.min(...rates.map((r) => r[key]));

export const fromPrice = {
  single: lowest('single'),
  double: lowest('double'),
  triple: lowest('triple'),
  apartment: lowest('apartment'),
};


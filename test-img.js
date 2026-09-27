const https = require('https');
const fs = require('fs');

const urls = [
  'https://cdn.watchbase.com/watch/images/5441-9-0008-a8.jpg',
  'https://cdn.watchbase.com/watches/5441-9-0008-a8.jpg',
  'https://watchbase.com/watches/5441-9-0008-a8.jpg',
  'https://cdn2.chrono24.com/images/uhren/5441-9-0008-a8.jpg',
  'https://watch-database.com/images/5441-9-0008-a8.jpg',
  'https://images.watchbase.com/watches/5441-9-0008-a8.jpg',
  'https://watchbase.com/api/watches/image/model/5441-9-0008-a8.jpg',
  'https://cdn.watchbase.com/watch/rolex/cellini/5441-9-0008-a8.jpg'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function run() {
  let output = '';
  for (const url of urls) {
    const res = await checkUrl(url);
    output += `${res.status}: ${res.url}\n`;
  }
  fs.writeFileSync('out.txt', output);
}

run();

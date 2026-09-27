const https = require('https');

const options = {
  hostname: 'watch-database1.p.rapidapi.com',
  port: 443,
  path: '/search-watches-by-name',
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'x-rapidapi-host': 'watch-database1.p.rapidapi.com',
    'x-rapidapi-key': 'dcf5c4a77dmsh88d1a157fdb88a9p176572jsn587cd318ec5e'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  console.log('Status:', res.statusCode);
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write('searchTerm=rolex&limit=1&page=1');
req.end();

const fs = require('fs');
const https = require('https');
const url = require('url');

const pathDir = 'c:/wamp64/www/projetSoutenanceV2.1/public/mock/images/';
fs.mkdirSync(pathDir, { recursive: true });

const categories = ['agriculture', 'market', 'coffee', 'cocoa', 'farm', 'warehouse', 'logistics', 'pepper', 'spices', 'freight'];

function download(imageUrl, dest, cb) {
  const req = https.get(imageUrl, function(response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      // Handle relative redirects
      const redirectUrl = url.resolve(imageUrl, response.headers.location);
      return download(redirectUrl, dest, cb);
    }
    const file = fs.createWriteStream(dest);
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  }).on('error', function(err) {
    fs.unlink(dest, () => {});
    if (cb) cb(err.message);
  });
}

for(let i=1; i<=30; i++) {
  const keyword = categories[i % categories.length];
  const dest = pathDir + i + '.jpg';
  const sourceUrl = 'https://loremflickr.com/400/400/' + keyword + '?lock=' + i;
  download(sourceUrl, dest, (err) => {
    if (err) console.error('Error on image', i, err);
  });
}
console.log('Started downloading 30 realistic local images...');

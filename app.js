const express = require('express');
const app = express();
const fs = require('fs');
const pdf = require('./server/pdf');

const dir = './tmp';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.get('/', (req, res) => {
  res.send('use /download?source={html_page_url}&output={filename} to generate pdf and download it');
});

app.get('/download', (req, res) => {
  pdf.generateAndDownload(req, res, dir);
});

app.listen(3000, () => {
  console.log(`application is running at: http://localhost:3000`);
});

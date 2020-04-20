const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

const dummySource = 'https://www.example.com';
const dummyFile = 'example';

const dir = './tmp';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.get('/', (req, res) => {
  res.send('use /download?source={html_page_url}&output={filename} to generate pdf and download it');
});

app.get('/download', (req, res) => {
  generatePDF(req, res);
});

app.listen(3000, () => {
  console.log(`application is running at: http://localhost:3000`);
});

async function generatePDF(req, res) {
  let source = req.query.source || dummySource;
  let output = `${req.query.output || dummyFile}.pdf`;

  console.log(`Generating PDF "${output}" from "${source}"`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(source, {
    waitUntil: 'networkidle2',
  });
  await page.addStyleTag({ path: path.resolve(__dirname, 'print.css') });
  await page.pdf({ path: path.join(dir, output), format: 'A4' });
  await browser.close();

  let fileLocation = await path.join(dir, output);
  // await console.log(fileLocation);
  await res.download(fileLocation, output);
}

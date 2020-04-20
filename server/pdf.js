const path = require('path');
const puppeteer = require('puppeteer');

const dummySource = 'https://example.com';
const dummyFile = 'example';

const generateAndDownload = async function (req, res, dir) {
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

  console.log(`Generated PDF "${output}" saved in "${dir}"`);

  let fileLocation = await path.join(dir, output);
  await res.download(fileLocation, output);
  //res.send('success');
};

module.exports.generateAndDownload = generateAndDownload;

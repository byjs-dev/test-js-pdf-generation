const path = require('path');
const puppeteer = require('puppeteer');

const dummySource = 'https://www.zeppelin-cat.de/gebrauchtmaschinen/details/caterpillar-312el-pzl00979.html';
const dummyFile = 'caterpillar-312el-pzl00979';

const generateAndDownload = async function (req, res, dir) {
  let source = req.query.source || dummySource;
  let output = `${req.query.output || dummyFile}.pdf`;

  console.log(`Generating PDF "${output}" from "${source}"`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.on('console', (msg) => {
    for (let i = 0; i < msg.args().length; ++i) console.log(`${i}: ${msg.args()[i]}`);
  });
  await page.goto(source, {
    waitUntil: 'networkidle0',
  });
  // add images to DOM
  await page.addScriptTag({ path: path.resolve(__dirname, 'images.js') });

  // add print styles
  await page.addStyleTag({ path: path.resolve(__dirname, 'print.css') });

  // wait for added images
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll('#pdf-images img'));
    await Promise.all(
      selectors.map((img) => {
        if (img.complete) return;
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', reject);
        });
      })
    );
  });
  // await page.screenshot({ path: path.join(dir, 'screenshot.png'), fullPage: true });
  await page.pdf({ path: path.join(dir, output), format: 'A4' });
  await browser.close();
  console.log(`Generated PDF "${output}" saved in "${dir}"`);

  let fileLocation = await path.join(dir, output);
  await res.download(fileLocation, output);
  //await res.send('success');
};

module.exports.generateAndDownload = generateAndDownload;

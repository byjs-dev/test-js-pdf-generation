const express = require("express");
const app = express();
const path = require("path");
const puppeteer = require("puppeteer");

const dummySource =
  "https://www.zeppelin-cat.de/gebrauchtmaschinen/details/caterpillar-320fl-nhd10073.html";
const dummyFile = "example.pdf";

app.get("/download", (req, res) => {
  generatePDF(req, res);
});

app.listen(3000, () => {
  console.log(`application is running at: http://localhost:3000`);
});

async function generatePDF(req, res) {
  let source = req.query.source || dummySource;
  let output = `${req.query.output}.pdf` || dummyFile;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(source, {
    waitUntil: "networkidle2"
  });
  await page.pdf({ path: path.join("./pdf", output), format: "A4" });
  await browser.close();

  let fileLocation = await path.join("./pdf", output);
  await console.log(fileLocation);
  await res.download(fileLocation, output);
}

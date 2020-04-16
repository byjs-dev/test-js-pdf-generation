# Test JS PDF Generation

Raw basic node.js prototype to generate and download a PDF file of any website

## Dependencies

- puppeteer
- express

## Usage

1. Clone repo and enter project folder

2. Install dependencies

```
npm install
```

3. Start server on localhost:3000 with

```
npm start
```

4. Open **localhost:3000/download?source={source_url}&output={filename_of_generated_pdf}** in any browser

   e.g. _localhost:3000/download?source=http://example.com&output=example_

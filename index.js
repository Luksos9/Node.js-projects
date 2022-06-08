const fs = require("fs"); // we get access to reading data or calling data in file system
const http = require("http"); // gives us networking capabilities
const url = require("url"); // enables url handling
const replaceTemplate = require("./modules/replaceTemplate.js");

////////////////////
// FILES
/* // BLocking, synchronous way
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

var date = new Date();
console.log(date);

const textOut = `This is what we know about avocado: ${textIn}\nCreated on ${date}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!"); */

// Non-blocking, asynchronous way

/* fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log(`OMG ERROR!`);
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log(`Your file has been written 😁`);
      });
    });
  });
});
console.log("Will read file"); */

//////////////////////////
// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id]; // data Obj is array, we retrieve obj with matching query.id
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // Api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1"),
  () => {
    console.log("Listening to requests on port 8000");
  }; // this will start listening to incoming requests

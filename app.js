const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require("dotenv").config();
const http = require('http');
const https = require('https');
const mongo = require("./database/mongo");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const port = 3091;
const sslPort = 3090;

//Passport config
require("./database/passport")(passport)

//App Middleware
const userMiddle = require("./middleware/user");
const sessionMiddleware = require("./middleware/session");

//Session Store
const store = new MongoStore({
  collection: "session",
  uri: process.env.MONGO_URI || MONGO_URI,
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    sameSite: true,
    expiresIn: '1d',
    maxAge: 180 * 60 * 1000
  }
}));

//Passport middleware
app.use(passport.session());
app.use(passport.initialize());

//Middleware
app.use(userMiddle);
app.use(sessionMiddleware)


//App Routes
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const profileRoute = require("./routes/profile");
const createRoute = require("./routes/createprod");
const productsRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/orders");


const privateKey = fs.readFileSync('/etc/letsencrypt/live/rt-dev.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/rt-dev.xyz/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/rt-dev.xyz/fullchain.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const sslServer = https.createServer(credentials, app);
const server = http.createServer((req, res) => {
  res.writeHead(301, {
    'Location': 'https://rt-dev.xyz:3090'
  })
  res.end();
})

sslServer.listen(sslPort, function () {
  console.log(`Secure connection on port : ${sslPort}`)
})
server.listen(port)

app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));



app.use(express.static(path.join(__dirname +  "/public")))
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname , "../../public/index.html"))
})

//Routes
app.use('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html')
});
app.use("/mongo", mongo);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/profile", profileRoute);
app.use("/create-prod", createRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);

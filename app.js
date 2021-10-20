/**
 * Module dependencies.
 */
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const errorHandler = require("errorhandler");
const dotenv = require("dotenv");
const expressValidator = require("express-validator");
const api_routes = require("./routes/api")(express);
const morgan = require("morgan");
const app = express();
let Twitter = require("twitter");
const { Server } = require("socket.io");

/**
 * Middlewares
 */
const NotFoundMiddleware = require("./Middlewares/NotFoundlMiddleware");
const ServerErrorMiddleware = require("./Middlewares/ServerErrorMiddleware");
const EnablingCorsMiddleware = require("./Middlewares/EnablingCorsMiddleware");
const jwtMiddleware = require("./Middlewares/JwtMiddleware");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env" });

/**
 * Express configuration.
 */
app.set("host", process.env.HOST || "127.0.0.1");
app.set("port", process.env.PORT || 8080);

/**
 * Disable x-powered-by
 */
app.disable("x-powered-by");

/*
|--------------------------------------------------------------------------
|  Middlewares
|--------------------------------------------------------------------------
|  
|  
*/

// Compress Body
app.use(compression());

// Configure bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure bodyparser
app.use(expressValidator());

// Access-Control-Allow
app.use(EnablingCorsMiddleware);

// Routes
app.use("/api", api_routes);

//, jwtMiddleware.checkToken

/**
 * Switch between dev/prod
 * [ERROR HANDLER]
 */
if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(ServerErrorMiddleware); // Show detail about 500 error
  app.use(morgan("dev")); // Show all logs in console
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  });
}

// catch 404 errors to json
// app.use(NotFoundMiddleware);
/*
 ***************************************
 * END Middlewares
 ****************************************
 */

app.get("/", (req, res) => {
  res.json({ success: true, tweets: "works" });
});

/**
 * Socket IO
 */

// server.listen(app.get("port"), () => {
//   console.log("listening on *:3000");
// });

let client = new Twitter({
  consumer_key: "wGvstC7IYmO1KX7JT6ttBPEJ9",
  consumer_secret: "5PQpUzWUD9CoodpAYtr4H9L81XDHeOjCIkhclwj4fK81M3XUuO",
  access_token_key: "979706012918829056-mMTUdRtHBX8yRoy98W49fiHSjTwSlqd",
  access_token_secret: "1Pa6z4IRLPk1uirSn6p4zh6392aHR7eHqRMSfkOCfuMTO",
});

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "%s App is running at http://localhost:%d in %s mode",
    chalk.green("✓"),
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/searchTwitter", (req, res) => {
  console.log("last middleware", req.query.firstKyeword);

  // client.stream(
  //   "statuses/filter",
  //   { track: req.query.firstKyeword },
  //   (stream) => {
  //     stream.on("data", (tweet) => {
  //       console.log(tweet.text);
  //       io.on("connection", (socket) => {
  //         console.log("a user connected");
  //         socket.emit("news_by_server", tweet.text);
  //       });
  //       // console.log(tweet);
  //       // socket.emit("news_by_server", tweet.text);
  //     });
  //     stream.on("error", (error) => {
  //       console.log(error);
  //     });
  //   }
  // );

  io.on("connection", (socket) => {
    console.log("a user connected");

    // client.stream(
    //   "statuses/filter",
    //   { track: req.query.firstKyeword },
    //   (stream) => {
    //     stream.on("data", (tweet) => {
    //       console.log(tweet.text);
    //       // console.log(tweet);
    //       // socket.emit("news_by_server", tweet.text);
    //     });
    //     stream.on("error", (error) => {
    //       console.log(error);
    //     });
    //   }
    // );
    setInterval(() => {
      socket.emit("news_by_server", "Cow goes moo");
      console.log("Cow goes moo");
    }, 1000);
  });
  res.json({
    success: "true",
    message: "you can access",
    data: req.query.firstKyeword,
  });
});

var _stream1 = null;
var _stream2 = null;
var room = "twitter_search";

io.on("connection", (socket) => {
  console.log("a user connected", io.engine.clientsCount);

  socket.on("room", function (room) {
    socket.join(room);
  });

  socket.on("stop_search", function (data) {
    if (_stream1) _stream1.destroy();
    if (_stream2) _stream2.destroy();
  });

  socket.on("send_keywords", function ({ firstKeyword, secondeKeyword }) {
    console.log(`data received is==>`, firstKeyword, secondeKeyword);
    if (_stream1) _stream1.destroy();
    if (_stream2) _stream2.destroy();

    client.stream("statuses/filter", { track: firstKeyword }, (stream) => {
      _stream1 = stream;
      stream.on("data", (tweet) => {
        console.log(tweet);
        // socket.emit("news_by_server", tweet.text);
        io.sockets.in(room).emit("send_tweet_1", tweet.text);
      });
      stream.on("error", (error) => {
        console.log(error);
      });
    });

    client.stream("statuses/filter", { track: secondeKeyword }, (stream) => {
      _stream2 = stream;
      stream.on("data", (tweet) => {
        // console.log(tweet.text);
        // socket.emit("news_by_server", tweet.text);
        io.sockets.in(room).emit("send_tweet_2", tweet.text);
      });
      stream.on("error", (error) => {
        console.log(error);
      });
    });

    // setInterval(() => {
    //   console.log("111");
    //   socket.emit("news_by_server", data);
    // }, 2000);
  });
});

module.exports = app;

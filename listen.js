const app = require("./app");

// Alternate way of doing it could be to replace PORT in app.listen with the the following: process.env.PORT || 9090

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

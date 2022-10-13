const app = require("./app");

// Alternate way of doing it where you can just put PORT as first argument for the app.listen below
// const { PORT = 9090 } = process.env;

app.listen(process.env.PORT || 9090, () =>
	console.log(`Listening on ${PORT}...`)
);

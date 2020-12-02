const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

//define paths
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// set up handle engines and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//set up static directory to set
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather App',
		name: 'Michael Treny',
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Michael Sarzi',
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		message: 'We are here to help you',
		title: 'Help',
		name: 'Michael Sarzi',
	});
});

app.get('/weather', (req, res) => {
	const address = req.query.address;
	if (!address) {
		return res.send({
			error: 'You must provide an address to search for',
		});
	} else {
		geocode(address, (error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({ error });
			}

			forecast(latitude, longitude, (error, forecastData) => {
				if (error) {
					return res.send({ error });
				}
				res.send({
					address,
					forecast: forecastData,
					location,
				});
			});
		});
	}
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Michael',
		erroMessage: 'Help Page Not Found',
	});
});

app.get('/products', (req, res) => {
	console.log(req.query.search);
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term',
		});
	}
	res.send({
		products: [],
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Michael',
		erroMessage: 'Page Not Found',
	});
});

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});

const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=1f4c627cfa4c6051e3afb9b8e4965e30&query=${encodeURIComponent(
		latitude,
		longitude
	)}&units=m`;

	request({ url, json: true }, (error, { body } = {}) => {
		if (error) {
			callback('Unable to connect to weather service', undefined);
		} else if (body.error) {
			callback('Unable to find Location', undefined);
		} else {
			const currentTemperature = body.current.temperature;
			const feelsLikeTemperature = body.current.feelslike;
			const weather_descriptions = body.current.weather_descriptions[0];
			const humidity = body.current.humidity;
			const pressure = body.current.pressure;
			callback(
				undefined,
				`${weather_descriptions}. It is currently ${currentTemperature} degrees out. But it feels like ${feelsLikeTemperature} degree. The humidity is ${humidity}% and the wind pressure is ${pressure}`
			);
		}
	});
};

module.exports = forecast;

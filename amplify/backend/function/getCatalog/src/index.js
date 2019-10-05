/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */
const https = require('https')
exports.handler = function (event, context,callback) { //eslint-disable-line
  console.log(`value1 = ${event.key1}`);
  console.log(`value2 = ${event.key2}`);
  console.log(`value3 = ${event.key3}`);

  let catalog = {
  	author: {
  		name: "Evagrius",
  		works: [
  			{
  				name: "On Prayer",
  				sections: [
  					{
  						number: "1",
  						text: "If you wish to...",
  						url: "https://alexpoulos.com"
  					}
  				]
  			}
  		]
  	}
  };

  callback(catalog, 200) // SUCCESS with message
};

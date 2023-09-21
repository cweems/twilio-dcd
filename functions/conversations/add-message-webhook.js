exports.handler = async function(context, event, callback) {
  
  // Pull the response object from helper library
  const response = new Twilio.Response();

  
  let newEvent = event;

  console.log('Modifying attributes')
  newEvent['Identity'] = 'Charlie Weems'
  newEvent['Attributes'] = "TESTING"
  newEvent['Test'] = 'test';
  console.log('Version 1')
  console.log(newEvent);
  
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type'); 
  response.setBody(newEvent); 
  callback(null, response);               
};
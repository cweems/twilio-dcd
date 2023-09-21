exports.handler = async function(context, event, callback) {
    
    // The Twilio node Client library 
    const client = context.getTwilioClient();

    // Pull the response object from helper library
    const response = new Twilio.Response();

    client.messages
      .create({
        body: `Your shopper is requesting help with your order. Chat with them here: https://dcd-3523-dev.twil.io/clients/end-user-view/index.html#/conversation/${event.conversationSid}`,
        from: '+18775640808',
        to: '+14136587734'
      })
      .then(message => {
          response.appendHeader('Content-Type', 'application/json');
          response.appendHeader('Access-Control-Allow-Origin', '*');
          response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
          response.appendHeader('Access-Control-Allow-Headers', 'Content-Type'); 
          response.setBody({sid:message.sid}); 
          console.log(message.sid)     
          callback(null, response);               
      })
      .catch(err => {
          console.log(err.status);      
          response.appendHeader('Content-Type', 'application/json');
          response.appendHeader('Access-Control-Allow-Origin', '*');
          response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
          response.appendHeader('Access-Control-Allow-Headers', 'Content-Type'); 
          response.setBody(err);
          response.setStatusCode(err.status);
          return callback(null, response);
      });
};
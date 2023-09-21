# Twilio Conversations Auto Response Code Samples
This guide walks through the code samples in sequential order:

1. The Customer Sends a Message
1. The Agent Receives a Message
1. The Agent UI Renders the auto-response options
1. The Agent sends an auto-response message

## Agent Receives an Auto Response Message
When the agent joins a conversation, their UI is subscribed to a specific `twilioConverastion`.

`twilioConversation` emits events in real-time as they happen within the conversation, so for example we can listen for the `messageAdded` event and then add a new message to a list (`messages`) that will update our view.

We can also use this event to take additional actions like scroll the UI to the most recent message.
```javascript
let messages = [];

const connectToConversation = async () => {        
    conversationsClient = await new Client(agentStore.agent.accessToken);
  
    twilioConversation = await conversationsClient.getConversationBySid(conversationId);
        
    twilioConversation.on('messageAdded', message => {
                                
        messages.value.push(message);
        bottomEl.value.scrollIntoView();  
    });
}
```

## Example Message Data
The following data is passed to the view every time a customer adds a message to the conversation. Note the presence of a `suggestedResponses` list in the `attributes` value.

In this case the values are:

```[\"Certainly, let me check.\", \"Sure, one moment.\", \"Checking your order.\"]```

```json
{
  "accountSid": "ACead3a8c1616a12584f93194066d03c97",
  "conversationSid": "CHf88e1bac053d485d870a2ffd985472ef",
  "sid": "IMc8fd84f0d6564fb58cb6cc6c8588ffe6",
  "index": 1,
  "author": "Charlie",
  "body": "Hmm is there anything else available?",
  "media": null,
  "attributes": "{\"mType\":\"clientChat\",\"author\":\"Charlie\",\"suggestedResponses\": [\"Certainly, let me check.\", \"Sure, one moment.\", \"Checking your order.\"]}",
  "participantSid": null,
  "dateCreated": "2023-08-09T15:29:11.000Z",
  "dateUpdated": "2023-08-14T16:54:05.000Z",
  "url": "https://conversations.twilio.com/v1/Conversations/CHf88e1bac053d485d870a2ffd985472ef/Messages/IMc8fd84f0d6564fb58cb6cc6c8588ffe6",
  "delivery": null,
  "links": {
    "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHf88e1bac053d485d870a2ffd985472ef/Messages/IMc8fd84f0d6564fb58cb6cc6c8588ffe6/Receipts",
    "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHf88e1bac053d485d870a2ffd985472ef/Messages/IMc8fd84f0d6564fb58cb6cc6c8588ffe6/ChannelMetadata"
  },
  "contentSid": null
}
```

# Example Message View Code
The following renders the message using a Vue.js, a popular front-end framework. Your application does not need to use Vue.

```html
<div class="message">                                  
    <span class="message-body"> 
        <span v-if="!isMedia" class="">{{content}}</span>
        <span v-if="isMedia"><img :src="imageUrl" style="max-height:300px;max-width:300px;" class="img-fluid rounded" /></span>
    </span>
    <p>
        <small>
            <span>{{author}} - {{formatDate(dateCreated)}}</span>
        </small>
    </p>
</div>

<div class="suggestedResponse" v-if="mAttributes.suggestedResponses &&    isAgent === false">
    <button 
        v-for="response in mAttributes.suggestedResponses"
        class="btn btn-outline-primary m-1"
        @click="$emit('sendResponse', response)"
    >
        {{ response }}
    </button>
</div>
```
With styling the UI might look like this:

<img width="580" alt="Screen Shot 2023-08-14 at 11 00 29 AM" src="https://github.com/danbartlett-twilio/twilio-dcd/assets/1418949/1bff6a63-8217-4bff-89be-e67d3f49bc71">

In this example, the suggestedResponses `div` is only rendered if the message data attributes includes a `suggestedResponses` key. It then creates buttons for each response, so that agents can tap to select their response.

`@click="$emit('sendResponse', response)` is a Vue convention that tells our UI controller to run the `sendResponse` function, which we will look at in the next step.


## Sending the Suggested Response
We can send the auto-response by using the `twilioConversation` client that the agent subscribed to when they joined the conversation:

```javascript
const sendResponse = async (response) => {
    try {     
      let attributes = {
        mType: 'agentChat',
        agentMessage: true,
        agentIdentity: agentStore.agent.identity        
      }

      await twilioConversation
        .prepareMessage()
        .setBody(response)
        .setAttributes(attributes)
        .build()
        .send();   
   
      console.log("Sent Message...");
    } catch (e) {       
      isConnected.value = false;
      console.log("sendMessage error => ", e); 
    }
  }
```



<script setup>
  import { onBeforeRouteLeave, useRoute } from 'vue-router'
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'

  const router = useRouter();


  import { useAgentStore } from '../stores/agentStore'  
  const agentStore = useAgentStore(); 


  const createNewConversation = async () => {

    let attributes = {
      conversationType: 'Support',
      createdBy: agentStore.agent.identity
    }

    try {                
      let url = `${import.meta.env.VITE_DATA_URL}/conversations/conversation-create`;
      const res = await fetch(url, { method: "POST", headers: {'Content-type': 'application/json'}, body: JSON.stringify({"payload": {conversationName: 'Order 18127', attributes:attributes} }) });
      if (res.ok) {          
        console.log("Success! Created a new conversation...");
        const conversation = await res.json();             
        console.log(conversation);
        return conversation.sid     
      } else {
        console.log("Error! Unable to create new conversation...");                
      }             
      
    } catch (e) { console.log("createNewConversation error => ", e); }  

  }


  const addAgentToConversation = async (conversationSid) => {
    let attributes = {
        displayName: 'Shopper',
        avatar: 'avatar',
        sms:false,
        chat:true,
        whatsapp:false,
        enduser:false,
        agent:true
    };


    try {                
      let url = `${import.meta.env.VITE_DATA_URL}/conversations/conversation-add-participant`;
      const res = await fetch(url, { method: "POST", headers: {'Content-type': 'application/json'}, body: JSON.stringify({"payload": {conversationSid: conversationSid, identity:agentStore.agent.identity, attributes:attributes} }) });
      if (res.ok) {          
        console.log("Success! Added Agent to conversation...");                               
      } else {
        console.log("Error! Unable to add End User to conversation...");                
      }             
      
    } catch (e) { console.log("addEndUserToConversation error => ", e); }      

  }

  const addCustomerToConversation = async (conversationSid) => {
    let attributes = {
        displayName: 'Charlie - Customer',
        avatar: 'avatar',
        sms:false,
        chat:true,
        whatsapp:false,
        enduser:true,
        agent:false
    };


    try {                
      let url = `${import.meta.env.VITE_DATA_URL}/conversations/conversation-add-participant`;
      const res = await fetch(url, { method: "POST", headers: {'Content-type': 'application/json'}, body: JSON.stringify({"payload": {conversationSid: conversationSid, identity:'Charlie', attributes:attributes} }) });
      if (res.ok) {          
        console.log("Success! Added End User to conversation...");                               
      } else {
        console.log("Error! Unable to add End User to conversation...");                
      }             
      
    } catch (e) { console.log("addEndUserToConversation error => ", e); }      

  }

  const sendSMSInvite = async (conversationSid) => {
    try {
      let url = `${import.meta.env.VITE_DATA_URL}/conversations/sms-invite?conversationSid=${conversationSid}`;
      const res = await fetch(url, { method: "GET", headers: {'Content-type': 'application/json'}});

      if (res.ok) {          
        console.log("Sent SMS invite to customer...");                               
      } else {
        console.log("Error! Unable to send SMS invite...");                
      }
    } catch(err) {
      console.log("addEndUserToConversation error => ", err);
    }
  };


  const startConversation = async () => {
    console.log('Starting conversation...')
    const conversationSid = await createNewConversation();
    await addAgentToConversation(conversationSid);
    await addCustomerToConversation(conversationSid);
    await sendSMSInvite(conversationSid)

    router.push({ name: 'conversation', params: { sid: conversationSid } })
  }

</script>

<template>
  <div class="alert">
    <h1>Current Order</h1>
    <p>Order Number: #18127</p>
    <p>Customer Name: Charlie</p>
  </div>
  <table class="table table-striped mt-4 mb-5 fs-4">
      <thead>
        <tr>
          <th class="text-center">Photo</th>
          <th class="text-center">Item</th>                  
          <th class="text-center">Picked</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/960109440?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">USDA Choice Beef Top Sirloin Steak Boneless Value Pack - 3.5 Lb</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked></td>          
          <td class="text-center">                
            <button class="btn btn-primary disabled">
              <i class="bi-shuffle"></i>
              Substitute
            </button>
              <!-- <router-link :to="{ name: 'conversation', params: { sid: c.sid } }" custom v-slot="{ navigate }">
              </router-link>
              <button class="btn btn-danger ms-2" @click="deleteConversation(c.sid)">
                <i class="bi-trash"></i>
              </button> -->
          </td>
        </tr>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/960327842-ECOM?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">Starbucks Breakfast Blend 100% Arabica Medium Roast K Cup</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked></td>          
          <td class="text-center">                
            <button class="btn btn-primary disabled">
              <i class="bi-shuffle"></i>
              Substitute
            </button>
          </td>
        </tr>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/960050143-ECOM?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">FAGE Total 0% Milkfat Plain Greek Yogurt - 32 Oz</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked></td>          
          <td class="text-center">                
            <button class="btn btn-primary disabled">
              <i class="bi-shuffle"></i>
              Substitute
            </button>
          </td>
        </tr>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/138350091-ECOM?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">Lucerne Eggs Large Grade A Family Pack - 18 Count</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked></td>          
          <td class="text-center">                
            <button class="btn btn-primary disabled">
              <i class="bi-shuffle"></i>
              Substitute
            </button>
          </td>
        </tr>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/136010121-ECOM?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">Lucerne Milk Whole 1 Gallon - 128 Fl. Oz.</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked></td>          
          <td class="text-center">                
            <button class="btn btn-primary disabled">
              <i class="bi-shuffle"></i>
              Substitute
            </button>
          </td>
        </tr>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/184020020?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">Honeycrisp Apple</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked></td>          
          <td class="text-center">                
            <button class="btn btn-primary disabled">
              <i class="bi-shuffle"></i>
              Substitute
            </button>
          </td>
        </tr>
        <tr>
          <td class="text-center"><img height="50px" width="auto" src="https://images.albertsons-media.com/is/image/ABS/960041097-ECOM?$ng-ecom-pdp-tn$&defaultImage=Not_Available" /></td>
          <td class="text-center">Pepperidge Farm Goldfish Cheddar Cheese Crackers - 9-1 Oz</td>                    
          <td class="text-center"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></td>          
          <td class="text-center">
              <button class="btn btn-primary" @click="startConversation()">
                <i class="bi-shuffle"></i>
                Substitute
              </button>
          </td>
        </tr>
      </tbody>
  </table> 

</template>
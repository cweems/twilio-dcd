<script>
    import { ref, computed, onMounted, toRaw } from 'vue'
    import { formatDate } from '../composables/formatDate.js'
    import { formatAuthor } from '../composables/formatAuthor.js'
    import { getMediaUrl } from '../composables/getMediaUrl.js'
    import { useMessageComputed } from '../composables/messageComputed.js'
    import { useEndUserStore } from '../stores/endUserStore' 

    export default {
    
        props: ['author','content','dateCreated','cSid','participant', 'mSid', 'pSid','media', 'mAttributes'],
        setup(props, ctx) {            

            const endUserStore = useEndUserStore();

            const author = props.author;
            const content = props.content;
            const media = props.media;
            const dateCreated = props.dateCreated;
            const cSid = props.cSid;
            const mSid = props.mSid;
            const pSid = props.pSid;
            const mAttributes = props.mAttributes;
            const participant = props.participant;

            const imageUrl = ref("/placeholder.png");

            let { isChatButton, isCustomer, isChat, isBot, isAgent, isSms, isWhatsapp, isMedia } = useMessageComputed(participant, author, mAttributes, cSid, content, media)

            onMounted(async () => {
                if (content === null && media !== null) {
                    let mediaSid = null;                    
                    
                    let mcopy = toRaw(media);
                    if (mcopy[0] !== undefined) {
                        mediaSid = mcopy[0].sid;
                    } else if (mcopy.state !== undefined) {
                        mediaSid = mcopy.state.sid;
                    }

                    if (mediaSid !== null && mediaSid !== undefined) {
                        imageUrl.value = await getMediaUrl(mediaSid);    
                    }

                }                
            });

            function answerQuestion(id,title,answer,style, messageSid) {
                console.log({mAttributes})                
                ctx.emit('sendAnswer', {
                    id: id, 
                    title: title,
                    answer: answer,
                    person: endUserStore.endUser.name, 
                    style,
                    messageSid
                });                
            }
            
            return {
                author, content, dateCreated, participant,
                mSid, pSid, isMedia, mAttributes, imageUrl,
                isChatButton, isSms, isChat, isCustomer, isBot, isWhatsapp, isAgent,
                formatDate:formatDate, formatAuthor:formatAuthor,
                answerQuestion

            }
        }
    }

</script>
<template>
    <div>        
        <!--<p>
            participant => {{participant}}<br />
            isCustomer => {{isCustomer}}<br />
            isAgent => {{isAgent}}<br />
            isBot => {{isBot}}<br />
            pSid => {{pSid}}<br />
            msid => {{mSid}}<br />
            mAttributes => {{mAttributes}} <br />
            isChatButton => {{isChatButton}} 
        </p>-->

        <div v-if="!isChatButton" class="text-start mb-2" :class="{ 'text-start': isCustomer,'text-end': !isCustomer  }">                                  
            <span class="message fs-4 badge text-wrap" :class="{ 'text-start': isCustomer,'text-end': !isCustomer,'customer': isCustomer,'customer': isCustomer, 'agent': isAgent, 'bg-secondary': isBot  }">
                <span v-if="!isMedia">{{content}}</span>
                <span v-if="isMedia"><img :src="imageUrl" style="max-height:300px;max-width:300px;" class="ms-2 img-fluid rounded" /></span>
            </span>
            <p class="mt-1">
                <small>
                    <span v-if="isCustomer" class="fst-italic">{{author}} - {{formatDate(dateCreated)}}</span>
                    <span v-else class="fst-italic">Shopper - {{formatDate(dateCreated)}}</span>
                </small>
            </p>            
        </div>  
        <div v-if="isChatButton" class="button-message text-start mb-4 p-4">                                  
            <div v-if="mAttributes.mType === 'chatButton'">
                <h5>{{mAttributes.question}}</h5>
                <div class="mb-4">
                    <div class="mb-4">
                        <p class="text-secondary">Item out of stock:</p>
                        <img class="product-image" src="https://images.albertsons-media.com/is/image/ABS/960041097-ECOM?$ng-ecom-pdp-tn$&defaultImage=Not_Available" />
                        <p class="p-4 d-inline">Pepperidge Farm Goldfish Cheddar Cheese Crackers - 9-1 Oz</p>
                    </div>
                    <div class="mb-2">
                        <p class="text-secondary">Substitute with:</p>
                            <img class="product-image" src="https://images.albertsons-media.com/is/image/ABS/960049994?$ng-ecom-pdp-tn$&defaultImage=Not_Available" />
                            <p class="p-4 d-inline">Pepperidge Farm Goldfish Cheddar Cheese Crackers - 30 Oz</p>
                    </div>
                </div>
                <div v-if="mAttributes.showButtons !== false" class="btn-group d-flex " role="group" aria-label="...">
                    <button @click="answerQuestion(mAttributes.id,mAttributes.question,b.value,b.style, mSid)" v-for="b in mAttributes.options" v-bind:key="b.value" class="btn border" :class="[b.style]">{{b.label}}</button>
                </div>            
            </div>
            <div v-if="mAttributes.mType === 'chatButtonResponse'">
                <h5>
                    {{mAttributes.person}} replied:                
                    <button disabled class="btn" :class="[mAttributes.style]">{{mAttributes.answer}}</button>
                </h5>                            
            </div>            
        </div>        

    </div>
</template>
<style scoped>
    .message {
      border-radius: 50px;
      font-weight: 400;
      color: #341A1F;
      background-color: #FCE6E3;

      &.customer {
          background-color: #FAF8F7;
      }
    }

    .button-message {
        background-color: #FAF8F7;
        border-radius: 10px;
    }
    .product-image {
        width: 75px;
        height: auto;
        border-radius: 50px;
    }
</style>



<script>
    import { ref, computed, onMounted, toRaw } from 'vue'
    import { formatDate } from '../composables/formatDate.js'
    import { formatAuthor } from '../composables/formatAuthor.js'
    import { getMediaUrl } from '../composables/getMediaUrl.js'

    export default {
    
        props: ['author','content','dateCreated','cSid','participant', 'mSid', 'pSid','media', 'mAttributes'],
        setup(props) {            

            const author = props.author;
            const content = props.content;
            const media = props.media;
            const dateCreated = props.dateCreated;
            const cSid = props.cSid;
            const mSid = props.mSid;
            const pSid = props.pSid;
            const mAttributes = props.mAttributes;
            const participant = props.participant;
            const mIndex = props.mIndex;
            const cLength = props.cLength

            const confirmDelete = ref(false);

            const imageUrl = ref("/placeholder.png");


            const isChatButton = computed(() => {
                //console.log("mAttributes => ", mAttributes)
                if(Object.keys(mAttributes).length === 0) {
                    //console.log("mAttributes.mType no keys ")
                    return false;
                } else {
                    if (mAttributes.mType !== undefined &&  mAttributes.mType.startsWith("chatButton") ) {    
                        //console.log("t mAttributes.mType => ", mAttributes.mType)
                        return true;
                    } else {
                        return false;
                        //console.log("t mAttributes.mType => ", mAttributes.mType)
                    }
                }
                     
            });

            const isCustomer = computed(() => {
                if (
                    (participant != undefined && participant.enduser != undefined && participant.enduser) || 
                    ( ( author.startsWith("+") || author.startsWith("whatsapp") ) && !participant.agent ) ||
                    (mAttributes.mType !== undefined && mAttributes.mType === "clientChat") ) 
                {                    
                    return true;
                } else {
                    return false;
                }        
            });

            const isChat = computed(() => {
                if (
                    (participant != undefined && participant.chat != undefined && participant.chat) ||
                    (mAttributes.mType !== undefined && mAttributes.mType === "agentChat") ||
                    (mAttributes.mType !== undefined && mAttributes.mType === "clientChat") )
                {                    
                    return true;
                } else {
                    return false;
                }        
            });
            
            const isBot = computed(() => {
                if (author === cSid) {
                    return true;
                } else {
                    return false;
                }        
            });
            
            const isAgent = computed(() => {
                if (
                    (participant != undefined && participant.agent != undefined && participant.agent) ||
                    (mAttributes.mType !== undefined && mAttributes.agentMessage === true))

                {                                    
                    return true;
                } else {
                    return false;
                }        
            });            
            

            const isSms = computed(() => {
                if ((participant != undefined && participant.sms != undefined && participant.sms) || ( author.startsWith("+") ) ) {                    
                    return true;
                } else {
                    return false;
                }        
            });

            const isWhatsapp = computed(() => {
                if ((participant != undefined && participant.whatsapp != undefined && participant.whatsapp) || ( author.startsWith("whatsapp") ) ) {                    
                    return true;
                } else {
                    return false;
                }        
            });

            const isMedia = computed(() => {
                if (content === null && media !== null) {                
                    return true;
                } else {
                    return false;
                }        
            });        
           
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

            function sendResponse(response) {
                console.log({mAttributes})
                console.log('ChatMessage - Send Response')
                //alert(`Optionally trigger action in web browser.\n\nfn("${endUserStore.endUser.name}","${id}","${title}","${answer}")`)
                ctx.emit('sendResponse', response);
            }
                        
            return {
                author, content, dateCreated, participant,
                mSid, pSid, isMedia, mAttributes, imageUrl,
                isChatButton, isSms, isChat, isCustomer, isBot, isWhatsapp, isAgent, mIndex, cLength,
                formatDate:formatDate, formatAuthor:formatAuthor, confirmDelete
            }
        }
    }

</script>
<template>
    <div>        
        <!-- <p>
            participant => {{participant}}<br />
            isCustomer => {{isCustomer}}<br />
            isAgent => {{isAgent}}<br />
            isBot => {{isBot}}<br />
            pSid => {{pSid}}<br />
            msid => {{mSid}}<br />
            mAttributes => {{mAttributes}} <br />
            mIndex => {{ mIndex }}<br />
            cLength => {{ cLength }}<br />
            isChatButton => {{isChatButton}} 
        </p> -->
        <div v-if="!isChatButton" class="text-start mb-2" :class="{ 'text-start': isCustomer,'text-end': !isCustomer  }">                                  
            <span class="message fs-4 badge text-wrap"
                :class="{ 'text-start': isCustomer,'text-end': !isCustomer,'customer': isCustomer, 'agent': isAgent, 'bg-secondary': isBot  }"> 
                <span v-if="!isMedia" class="">{{content}}</span>
                <span v-if="isMedia"><img :src="imageUrl" style="max-height:300px;max-width:300px;" class="img-fluid rounded" /></span>
            </span>
            <p class="mt-1">
                <small>
                    <span class="fst-italic">{{author}} - {{formatDate(dateCreated)}}</span>
                    <button v-show="!confirmDelete && !isCustomer" @click="confirmDelete = true" class="btn btn-link"><i class="bi-trash"></i></button>                                    
                    <button v-show="confirmDelete" @click="$emit('removeMessage',mSid)" class="btn btn-danger ms-2 me-2">Delete?</button>
                    <button v-show="confirmDelete" @click="confirmDelete = false" class="btn btn-light">Cancel</button>
                </small>
            </p>
        </div>        
        <div v-if="mAttributes.suggestedResponses && isAgent === false">
            <button 
                v-for="response in mAttributes.suggestedResponses"
                class="btn btn-outline-primary m-1 mb-4"
                @click="$emit('sendResponse', response)"
            >
                {{ response }}
            </button>
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
                    <button disabled @click="answerQuestion(mAttributes.id,mAttributes.question,b.value,b.style)" v-for="b in mAttributes.options" v-bind:key="b.value" class="border btn" :class="[b.style]">{{b.label}}</button>
                </div>            
            </div>
            <div v-if="mAttributes.mType === 'chatButtonResponse'">
                <h5>
                    <span class="fst-italic">{{mAttributes.title}}</span> {{mAttributes.person}} replied:                
                    <button disabled class="btn" :class="[mAttributes.style]">{{mAttributes.answer}}</button>
                </h5>                                    
            </div>                        
        </div>          

    </div>
</template>
<style scoped>
    .message {
        border-radius: 20px;
        font-weight: 400;
        color: #341A1F;
        background-color: #FCE6E3;

        &.customer {
            background-color: #FAF8F7;
        }
    }

    .bi-trash {
        color: #712329;
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


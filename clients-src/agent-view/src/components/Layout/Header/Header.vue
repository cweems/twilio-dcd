<script>
import { RouterLink } from 'vue-router'
import { useAgentStore } from '../../../stores/agentStore'  

export default {
    name: 'Header',
    setup() {      
        const agentStore = useAgentStore();     
        return {
            agentStore
        }
    }
}
</script>

<template>

    <div class="container-fluid">

        <header class="d-flex flex-wrap justify-content-center py-3 mb-2 border-bottom">
            
            <router-link class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none" to="/">
                <img class="me-4" width="60" height="32" src="https://logos-world.net/wp-content/uploads/2022/01/Safeway-Symbol.png"/>    
                <span class="fs-4">Shopper Inbox</span>
            </router-link>
            <ul class="nav nav-pills">        
                <li class="nav-item"><router-link class="nav-link" to="/"><i class="bi-house"></i> Home</router-link></li>
                <li v-if="agentStore.agent.identity != null" class="nav-item"><router-link class="nav-link" to="/current-order"><i class="bi-basket-fill"></i> Current Order</router-link></li>
                <li v-if="agentStore.agent.identity != null" class="nav-item"><router-link class="nav-link" to="/conversations"><i class="bi-chat-left-dots-fill"></i> Conversations</router-link></li>
                <li v-if="agentStore.agent.identity != null" class="nav-item"><router-link class="nav-link" to="/agent"><i class="bi-person"></i> {{agentStore.agent.identity}}</router-link></li>
                <li v-if="agentStore.agent.identity === null" class="nav-item"><router-link class="btn btn-warning btn-sm" to="/login"><i class="bi-box-arrow-in-right"></i> Login</router-link></li>                
            </ul>
        </header>
    </div>

</template>
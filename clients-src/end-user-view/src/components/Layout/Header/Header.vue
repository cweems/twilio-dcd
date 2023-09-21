<script>
import { RouterLink } from 'vue-router'

export default {
    name: 'Header',
    setup() {      

        return {

        }
    }
}
</script>

<template>

    <div class="container-fluid">
        <div class="row">
            <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                <router-link class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none" to="/">
                    <img class="me-4" width="60" height="32" src="https://logos-world.net/wp-content/uploads/2022/01/Safeway-Symbol.png"/>    
                    <span class="fs-4">Messages</span>
                </router-link>
                <ul class="nav nav-pills">        
                    <li class="nav-item"><router-link class="btn btn-link" to="/"><i class="bi-house"></i><span class ="p-1">Home</span></router-link></li>
                </ul>            
            </header>
        </div>
        
    </div>

</template>


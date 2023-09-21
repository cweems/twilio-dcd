<script>
import Layout from '../components/Layout/Layout.vue'
import CurrentOrder from '../components/CurrentOrder.vue'

export default {
  name: 'App',
  components: {
    Layout, CurrentOrder
  }
}
</script>

<template>  
  <Layout>
    <CurrentOrder />
  </Layout>  
</template>
<template>
    <v-container>
        <pre v-if="pedidoLoaded">{{ this.pedido }}</pre>
        <p v-else>Loading...</p>
    </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    props: ["idp"],
    data: () => ({
      pedido: {},
      pedidoLoaded: false
    }),
    mounted: function (){
        axios
            .get('http://localhost:7778/api/pedidos/' + this.idp)
            .then(response => {
                this.pedido = response.data;
                this.pedidoLoaded = true;
            })
            .catch(error => { return(error)})
    }
  }
</script>

<style>

</style>

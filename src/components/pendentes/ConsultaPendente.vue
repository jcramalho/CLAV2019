<template>
  <div v-if="pendenteLoaded">
    <ShowPendente :p="selectedPendente" />
  </div>

  <div v-else style="text-align:center;" class="mt-4">
    <p>A carregar informação...</p>
    <v-progress-circular indeterminate size="100" width="10" color="blue" />
  </div>
</template>

<script>
import ShowPendente from "@/components/pedidos/consulta/ShowPendente.vue";

export default {
  props: ["idp"],

  components: { ShowPendente },

  data: () => ({
    selectedPendente: {},
    pendenteLoaded: false
  }),

  mounted: function() {
    this.$request("get", "/pendentes/" + this.idp)
      .then(response => {
        this.selectedPendente = response.data;
        this.pendenteLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<template>
  <v-container grid-list-md fluid>
    <v-row row wrap justify-center>
      <v-col cols="11" v-if="erro == '' && invs.length > 0 && !loading">
        <div v-for="(inv, index) in invs" :key="index">
          <TabelaErros :inv="inv" />
          <br />
        </div>
      </v-col>
      <v-col v-else-if="!loading">
        <v-alert :value="erro == ''" color="success">
          Não há erros após testar todos os invariantes!
        </v-alert>
        <v-alert :value="erro != ''" type="error">
          {{ erro }}
        </v-alert>
      </v-col>
      <v-col cols="12" v-else>
        <div class="text-center">
          <br /><br /><br />
          <div class="display-1 font-weight-black indigo--text">
            A testar invariantes
          </div>
          <br />
          <v-progress-circular
            :size="100"
            :width="10"
            indeterminate
            color="indigo"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TabelaErros from "@/components/invariantes/TabelaErros.vue";

export default {
  data: () => ({
    invs: [],
    erro: "",
    loading: true
  }),
  components: {
    TabelaErros
  },

  mounted: function() {
    this.$request("get", "/invariantes/testarTodos")
      .then(response => {
        this.invs = response.data;
        this.loading = false;
      })
      .catch(error => {
        this.erro =
          "Não foi possível testar os invariantes... Tente novamente mais tarde.";
        this.loading = false;
      });
  }
};
</script>

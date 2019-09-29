<template>
  <v-container fluid>
    <v-row row wrap justify-center>
      <v-col cols="11" v-if="erro == ''">
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Invariantes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn text @click="testarTodos()">
                Testar todos os invariantes
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list>
            <v-list-group v-for="rel in invariantes" :key="rel.idRel">
              <template v-slot:activator>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="rel.desc"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <v-card
                text
                hover
                v-for="inv in rel.invs"
                :key="inv.idInv"
                @click="goToInvariante(rel.idRel, inv.idInv)"
                class="ml-5 mr-4 elevation-2"
              >
                <v-row row wrap class="ma-1 pa-2" align-center>
                  <v-col cols="10">
                    <span v-html="inv.desc"></span>
                  </v-col>
                  <v-col class="text-right">
                    <DialogQuery
                      :title="rel.desc"
                      :subtitle="inv.desc"
                      :query="inv.query"
                      :idRel="rel.idRel"
                      :idInv="inv.idInv"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col v-else>
        <v-alert :value="erro != ''" type="error">
          {{ erro }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DialogQuery from "@/components/invariantes/DialogQuery.vue";

export default {
  data: () => ({
    invariantes: [],
    erro: ""
  }),

  components: {
    DialogQuery
  },

  mounted: async function() {
    try {
      var response = this.$request("get", "/api/invariantes");
      this.invariantes = response.data;
    } catch (e) {
      this.erro =
        "Não foi possível obter os invariantes... Tente novamente mais tarde.";
    }
  },

  methods: {
    goToInvariante: function(idRel, idInv) {
      this.$router.push("/invariantes?idRel=" + idRel + "&idInv=" + idInv);
    },
    testarTodos: function() {
      this.$router.push("/invariantes/testarTodos");
    }
  }
};
</script>

<style scoped>
.v-card:hover {
  background-color: grey;
  color: white;
}
</style>

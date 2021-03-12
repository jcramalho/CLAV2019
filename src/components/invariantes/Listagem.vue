<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Invariantes</p>
    <v-row justify="center">
      <v-btn
        class="white--text clav-linear-background my-5"
        rounded
        @click="testarTodos()"
      >
        Testar todos os invariantes
      </v-btn>
    </v-row>
    <v-list v-if="erro === ''">
      <v-list-group v-for="rel in invariantes" :key="rel.idRel">
        <template v-slot:activator>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title v-text="rel.desc"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-card
          v-for="inv in rel.invs"
          :key="inv.idInv"
          @click="goToInvariante(rel.idRel, inv.idInv)"
          flat
          hover
          class="ma-2 pa-2"
        >
          <v-row>
            <v-col cols="10">
              <span v-html="inv.desc"></span>
            </v-col>
            <v-col cols="2">
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
    <v-alert v-else :value="erro != ''" type="error">
      {{ erro }}
    </v-alert>
    <v-alert :value="invariantes.length == 0" type="warning" color="warning">
      Não foram encontrados invariantes...
    </v-alert>
  </v-card>
</template>

<script>
import DialogQuery from "@/components/invariantes/DialogQuery.vue";

export default {
  data: () => ({
    invariantes: [],
    erro: "",
  }),

  components: {
    DialogQuery,
  },

  mounted: async function () {
    try {
      var response = await this.$request("get", "/invariantes");
      this.invariantes = response.data;
    } catch (e) {
      this.erro = "Não foi possível obter os invariantes... Tente novamente mais tarde.";
    }
  },

  methods: {
    goToInvariante: function (idRel, idInv) {
      this.$router.push("/invariantes?idRel=" + idRel + "&idInv=" + idInv);
    },
    testarTodos: function () {
      this.$router.push("/invariantes/testarTodos");
    },
  },
};
</script>

<style scoped></style>

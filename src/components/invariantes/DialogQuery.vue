<template>
  <v-dialog v-model="dialog" width="700">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small color="indigo darken-4" dark>
        Ver query
      </v-btn>
    </template>

    <v-card color="#E0F2F1">
      <v-card-title>
        <div class="display-1 font-weight-light" v-html="title"></div>
        <br />
        <div class="headline font-weight-light" v-html="subtitle"></div>
      </v-card-title>

      <v-card-text>
        <!-- eslint-disable-next-line -->
        <span class="subheading" style="white-space: pre-wrap">{{ query }}</span>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="red darken-4" flat @click="goToInvariante()">
          Correr query
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red darken-4" flat @click="dialog = false">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["title", "subtitle", "query", "idRel", "idInv"],
  data() {
    return {
      dialog: false
    };
  },

  methods: {
    goToInvariante: function() {
      this.$router.push(
        "/invariantes?idRel=" + this.idRel + "&idInv=" + this.idInv
      );
    }
  }
};
</script>

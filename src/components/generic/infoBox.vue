<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" small color="#00695c" dark>help</v-icon>
    </template>

    <v-card color="#E0F2F1">
      <v-card-title>
        <span class="title font-weight-light">{{ header }}</span>
      </v-card-title>

      <v-card-text>
        <!--{{ text }}-->
        <div v-html="text" />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
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
  props: ["text", "header"],
  data() {
    return {
      dialog: false
    };
  }
};
</script>

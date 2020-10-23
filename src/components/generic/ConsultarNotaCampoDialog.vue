<template>
  <v-card>
    <v-card-title class="indigo darken-4 white--text">
      Nota
    </v-card-title>

    <v-card-text>
      <v-textarea
        class="mt-4"
        :value="nota"
        label="Nota"
        shaped
        rounded
        filled
        readonly
        hide-details
        no-resize
        auto-grow
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text rounded color="indigo" dark @click="fechar()">
        Fechar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["nota"],

  methods: {
    fechar() {
      this.$emit("fecharDialog");
    },
  },
};
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" align="center">
      <v-btn
        @click="expandAll"
        rounded
        class="white--text ma-1"
        color="success"
        id="botao-shadow"
      >
        <unicon
          name="expand-all-icon"
          width="20"
          height="20"
          viewBox="0 0 20.714 20.71"
          fill="#ffffff"
        />
        <p class="ml-2">Expandir Tudo</p>
      </v-btn>
      <v-btn
        @click="closeAll"
        rounded
        class="white--text ma-1"
        color="error"
        id="botao-shadow"
      >
        <unicon
          name="close-all-icon"
          width="20"
          height="20"
          viewBox="0 0 20.71 20.818"
          fill="#ffffff"
        />
        <p class="ml-2">Fechar Tudo</p>
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["n"],
  methods: {
    // Abrir todos os v-expansion-panel
    expandAll() {
      const res = [...Array(this.n).keys()].map((k, i) => i);
      this.$emit("alternar", res);
    },
    // Fechar todos os v-expansion-panel
    closeAll() {
      this.$emit("alternar", []);
    },
  },
};
</script>

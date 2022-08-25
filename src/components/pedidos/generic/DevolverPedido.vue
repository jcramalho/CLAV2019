<template>
  <v-card>
    <v-card-title  class="mb-5 clav-linear-background white--text">
      Insira uma mensagem para devolução
      <v-spacer></v-spacer>
      <unicon
        name="devolver-icon"
        width="25"
        height="25"
        viewBox="0 0 20.71 12.943"
        fill="white"
      />
    </v-card-title>

    <v-card-text>
      <!-- Menssagem -->
      <Campo nome="Mensagem" infoHeader="Mensagem" color="neutralpurple">
        <template v-slot:conteudo>
          <v-textarea 
            clearable 
            filled 
            auto-grow 
            color="indigo" 
            v-model="mensagemDespacho"
            label="Mensagem para devolução" />
        </template>
      </Campo>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="error" rounded text @click="cancelar()"> Cancelar </v-btn>
      <v-btn class="primary" rounded @click="despacho()"> Devolver </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";

export default {
  data() {
    return {
      mensagemDespacho: null,
    };
  },
  components: {
    Campo,
  },

  methods: {
    cancelar() {
      this.mensagemDespacho = null;
      this.$emit("fecharDialog");
    },

    despacho() {
      const despacho = {};

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;

      this.$emit("devolverPedido", despacho);

      this.mensagemDespacho = null;
    },
  },
};
</script>

<style></style>

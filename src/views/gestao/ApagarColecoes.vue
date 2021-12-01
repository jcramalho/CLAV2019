<template>
  <v-card flat class="pa-3">
    <v-card-title class="clav-content-title-1" dark> Apagar Coleções </v-card-title>
    <v-card-text>
      <div class="subtitle-1">
        Aqui pode
        <span style="color: var(--v-error-base)" class="font-weight-black">apagar</span> a
        coleção selecionada. Esta operação
        <span style="color: var(--v-error-base)" class="font-weight-black">
          elimina todos os documentos da coleção
        </span>
        escolhida.
      </div>
      <br />
      <v-form ref="form">
        <v-autocomplete
          :items="eliminacoesDisponiveis"
          label="Coleção a apagar"
          v-model="colecao"
          :rules="regraColecao"
          required
        >
        </v-autocomplete>
      </v-form>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" dark rounded @click="cancelar"> Cancelar </v-btn>
        <v-btn color="primary" dark rounded @click="apagar"> Apagar </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card-text>
    <v-alert :value="text != ''" :type="alertType">
      {{ text }}
    </v-alert>
  </v-card>
</template>

<script>
export default {
  data: () => {
    return {
      eliminacoesDisponiveis: [
        { text: "AuthCalls", value: "auth" },
        { text: "Logs", value: "logs" },
        { text: "Logs Agregados", value: "logsAgregados" },
        { text: "Pedidos", value: "pedidos" },
        { text: "Trabalhos Pendentes", value: "pendentes" },
      ],
      colecao: "",
      regraColecao: [(v) => !!v || "Coleção a apagar é obrigatório."],
      text: "",
      alertType: "success",
    };
  },

  methods: {
    cancelar() {
      this.$router.push("/");
    },
    async apagar() {
      if (this.$refs.form.validate()) {
        try {
          var response = await this.$request("delete", "/" + this.colecao);
          this.text = response.data;
          this.alertType = "success";
        } catch (erro) {
          if (erro.response && erro.response.data) {
            this.text = erro.response.data[0].msg || erro.response.data;
          } else {
            this.text = erro;
          }
          this.alertType = "error";
        }
      }
    },
  },
};
</script>

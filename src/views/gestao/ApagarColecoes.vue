<template>
  <v-container fluid>
    <v-row row wrap justify-center>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Apagar Coleções</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div class="subtitle-1 font-weight-black">
              Aqui pode <span style="color:red">apagar</span> a coleção
              selecionada. Esta operação
              <span style="color:red">
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
              <v-btn color="indigo darken-4" dark @click="cancelar">
                Cancelar
              </v-btn>
              <v-btn color="indigo darken-4" dark @click="apagar">
                Apagar
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-alert :value="text != ''" :type="alertType">
          {{ text }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
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
        { text: "Trabalhos Pendentes", value: "pendentes" }
      ],
      colecao: "",
      regraColecao: [v => !!v || "Coleção a apagar é obrigatório."],
      text: "",
      alertType: "success"
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
    }
  }
};
</script>

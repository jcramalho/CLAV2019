<template>
  <v-layout row wrap ma-2 justify-center>
    <v-flex xs9>
      <v-dialog v-model="erroDialog" width="700">
        <v-card color="error">
          <v-card-title class="headline font-weight-light">
            Não foi possível criar o pedido de criação de tabela de seleção a
            partir do ficheiro importado...
          </v-card-title>

          <v-card-text>
            <span
              class="subtitle-1"
              style="white-space: pre-wrap"
              v-html="erro"
            >
            </span>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="indigo darken-4" text @click="erroDialog = false">
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="successDialog" width="700">
        <v-card color="success">
          <v-card-title class="headline font-weight-light">
            Pedido de criação de tabela de seleção criado com sucesso a partir
            do ficheiro importado.
          </v-card-title>

          <v-card-text>
            <span
              class="subtitle-1"
              style="white-space: pre-wrap"
              v-html="success"
            >
            </span>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="indigo darken-4" text @click="successDialog = false">
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-file-input
        v-model="file"
        label="Importar CSV/Excel"
        placeholder="Escolha o seu ficheiro"
        show-size
        accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple
      ></v-file-input>
      <div class="text-center">
        <v-btn
          class="white--text ma-2"
          color="indigo darken-4"
          @click="cancelar()"
          :disabled="loading"
        >
          Voltar
        </v-btn>
        <v-btn
          class="white--text ma-2"
          color="indigo darken-4"
          @click="enviarFicheiro()"
          :loading="loading"
          :disabled="file == null"
        >
          Enviar
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  data: () => ({
    file: null,
    erro: "",
    erroDialog: false,
    success: "",
    successDialog: false,
    loading: false
  }),

  methods: {
    enviarFicheiro: async function() {
      try {
        this.erro = "";
        this.erroDialog = false;
        this.successDialog = false;
        this.success = "";
        this.loading = true;
        var formData = new FormData();
        formData.append("file", this.file[0]);

        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

        formData.append("email", userBD.data.email);

        var response = await axios.post(
          lhost + "/api/tabelasSelecao/CSV",
          formData
        );
        this.loading = false;

        var stats = "<ul>";
        for (var k in response.data.stats) {
          switch (k) {
            case "processos":
              stats +=
                "<li>Número de Processos: " + response.data.stats[k] + "</li>";
              break;
            case "donos":
              stats +=
                "<li>Número de Processos Donos: " +
                response.data.stats[k] +
                "</li>";
              break;
            case "participantes":
              stats +=
                "<li>Número de Processos Participantes: " +
                response.data.stats[k] +
                "</li>";
              break;
            default:
              stats += "<li>Entidade: " + k + "<ul>";
              for (var kb in response.data.stats[k]) {
                switch (kb) {
                  case "processos":
                    stats +=
                      "<li>Número de Processos: " +
                      response.data.stats[k][kb] +
                      "</li>";
                    break;
                  case "donos":
                    stats +=
                      "<li>Número de Processos Donos: " +
                      response.data.stats[k][kb] +
                      "</li>";
                    break;
                  case "participantes":
                    stats +=
                      "<li>Número de Processos Participantes: " +
                      response.data.stats[k][kb] +
                      "</li>";
                    break;
                  default:
                    break;
                }
              }
              stats += "</ul>";
          }
        }
        stats += "</ul>";

        this.success = `Código do pedido: ${
          response.data.codigo
        }\nEstatísticas:\n${stats}`;

        this.successDialog = true;
      } catch (e) {
        this.loading = false;
        this.erro = e.response.data;
        this.erroDialog = true;
      }
    },
    cancelar: function() {
      this.$router.push("/");
    }
  }
};
</script>

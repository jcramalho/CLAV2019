<template>
  <div class="ma-2">
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Não foi possível criar o pedido de criação de tabela de seleção
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro">
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="successDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Pedido de criação de tabela de seleção criado com sucesso
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
          <v-btn color="green darken-4" text @click="$router.push('/')">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="ma-2 mx-auto" outlined width="60%">
      <v-card-title>Seleção do ficheiro</v-card-title>
      <v-card-text>
        <v-select
          :items="['Organizacional', 'Pluriorganizacional']"
          label="Tipo de Tabela de Seleção"
          v-model="tipo"
          @change="entidade_tipologia = null"
        >
        </v-select>
        <v-select
          v-if="tipo == 'Organizacional'"
          :items="entidades_tipologias"
          label="Entidade/Tipologia"
          v-model="entidade_tipologia"
          prepend-icon="account_balance"
        >
        </v-select>
        <v-file-input
          v-model="file"
          label="Importar CSV/Excel"
          placeholder="Selecione o ficheiro com a Tabela de Seleção"
          show-size
          accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
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
          :disabled="
            file.length == 0 ||
              tipo == null ||
              (tipo == 'Organizacional' && entidade_tipologia == null)
          "
        >
          Enviar
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  data: () => ({
    file: [],
    erro: "",
    erroDialog: false,
    success: "",
    successDialog: false,
    loading: false,
    entidades_tipologias: [],
    entidade_tipologia: null,
    tipo: null
  }),

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/entidades");
      var entidades = response.data.map(ent => {
        return {
          text: ent.sigla + " - " + ent.designacao,
          value: ent.sigla
        };
      });

      response = await axios.get(lhost + "/api/tipologias");
      var tipologias = response.data.map(tip => {
        return {
          text: tip.sigla + " - " + tip.designacao,
          value: tip.sigla
        };
      });

      this.entidades_tipologias = entidades.concat(tipologias);
      this.entidades_tipologias = this.entidades_tipologias.sort((a, b) => {
        return a.text.localeCompare(b.text);
      });
    } catch (e) {
      this.erro =
        "Não foi possível obter as entidades ou as tipologias... Realize reload da página.";
    }
  },

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
        formData.append("entidade_user", userBD.data.entidade.split("_")[1]);
        formData.append("entidade_ts", this.entidade_tipologia);
        formData.append("tipo_ts", "TS " + this.tipo);

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

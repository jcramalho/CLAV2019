<template>
  <v-container fluid>
    <v-row row wrap justify-center>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Exportação de Coleções</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-autocomplete
              :items="exportacoesDisponiveis"
              label="Coleção a exportar"
              v-model="tipo"
              :rules="regraTipo"
              required
              @change="id = ''"
            >
            </v-autocomplete>

            <v-card v-if="tipo != '' && tipo.path.includes('/')" class="mb-4">
              <v-card-title class="indigo darken-4 white--text subtitle-1">
                Parâmetros do pedido
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-form ref="id">
                      <v-autocomplete
                        :items="this[singToPlu(tipo.filename)]"
                        label="Identificador"
                        v-model="id"
                        :rules="regraId"
                        required
                      >
                      </v-autocomplete>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="indigo darken-4" dark @click="cancelar">
                Cancelar
              </v-btn>
              <v-btn color="indigo darken-4" dark @click="executar">
                Exportar
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
import InfoBox from "@/components/generic/infoBox.vue";
const lhost = require("@/config/global").host;

export default {
  data: () => {
    return {
      pedidos: [],
      pendentes: [],
      users: [],
      exportacoesDisponiveis: [
        { text: "Pedidos", value: { filename: "pedidos", path: "pedidos" } },
        { text: "Pedido", value: { filename: "pedido", path: "pedidos/" } },
        {
          text: "Pendentes",
          value: { filename: "pendentes", path: "pendentes" }
        },
        {
          text: "Pendente",
          value: { filename: "pendente", path: "pendentes/" }
        },
        {
          text: "Utilizadores",
          value: { filename: "users", path: "users" }
        },
        {
          text: "Utilizador",
          value: { filename: "user", path: "users/" }
        }
      ],
      tipo: "",
      id: "",
      regraTipo: [v => !!v || "Tipo de dados a exportar é obrigatório."],
      regraId: [v => !!v || "Identificador é obrigatório."],
      text: "",
      alertType: "success"
    };
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/pedidos");
      this.pedidos = response.data.map(p => p.codigo).sort();

      response = await this.$request("get", "/pendentes");
      this.pendentes = response.data
        .map(p => {
          return {
            text:
              p.acao +
              " de " +
              p.tipo +
              " por " +
              p.criadoPor +
              " a " +
              p.dataCriacao,
            value: p._id
          };
        })
        .sort((a, b) => a.text.localeCompare(b.text));

      response = await this.$request("get", "/users");
      this.users = response.data
        .map(u => {
          return { text: u.email, value: u._id };
        })
        .sort((a, b) => a.text.localeCompare(b.text));
    } catch (erro) {
      if (erro.response && erro.response.data) {
        this.text = erro.response.data[0].msg || erro.response.data;
      } else {
        this.text = erro;
      }
      this.alertType = "error";
    }
  },

  methods: {
    cancelar() {
      this.$router.push("/");
    },
    download(path, filename) {
      var element = document.createElement("a");

      element.setAttribute("href", path);
      element.setAttribute("download", filename);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    downloadData(filename, content, format) {
      var blob = new Blob([content], {
        type: format + ";charset=utf-8;"
      });

      if (window.navigator.msSaveBlob) {
        // FOR IE BROWSER
        navigator.msSaveBlob(blob, filename);
      } else {
        // FOR OTHER BROWSERS
        var url = URL.createObjectURL(blob);
        this.download(url, filename);
      }
    },
    async executar() {
      this.text = "";

      if (!this.$refs.id || this.$refs.id.validate()) {
        var path = "/" + this.tipo.path + this.id;

        //obter dados
        try {
          var response = await this.$request("get", path);
        } catch (erro) {
          if (erro.response && erro.response.data) {
            this.text = erro.response.data[0].msg || erro.response.data;
          } else {
            this.text = erro;
          }
          this.alertType = "error";
          return;
        }

        var filename = this.tipo.filename + ".json";
        var content = JSON.stringify(response.data, null, 4);
        var format = "application/json";

        //criar ficheiro e devolver ao user
        this.downloadData(filename, content, format);

        this.text = "Exportação realizada com sucesso!";
        this.alertType = "success";
      }
    },
    singToPlu(word) {
      var ret = "";

      switch (word) {
        case "legislacao":
          ret = "legislacoes";
          break;
        default:
          ret = word + "s";
          break;
      }

      return ret;
    }
  }
};
</script>

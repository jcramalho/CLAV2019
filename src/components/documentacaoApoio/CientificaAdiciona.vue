<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Nova Entrada na Documentação Técnica/Científica</v-toolbar-title
          >
        </v-app-bar>
        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Visível</div>
            </v-col>
            <v-col>
              <v-radio-group v-model="documento.visivel" row>
                <v-radio label="Sim" :value="true"></v-radio>
                <v-radio label="Não" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Subsecção</div>
            </v-col>
            <v-col>
              <v-select
                v-model="documento.classe"
                searchable="true"
                filterable="true"
                close-on-select="true"
                dir="ltr"
                :items="tipos"
                solo
                single-line
              >
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Título</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="documento.titulo"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Formato</div>
            </v-col>
            <v-col>
              <v-radio-group v-on:change="changeInfo" v-model="content" row>
                <v-radio label="URL" value="url"></v-radio>
                <v-radio label="Ficheiro" value="ficheiro"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-if="this.content == 'url'">
            <v-col cols="2">
              <div class="info-label">URL</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="documento.url"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="this.content == 'ficheiro'">
            <v-col cols="2">
              <div class="info-label">Ficheiro</div>
            </v-col>
            <v-col>
              <v-file-input
                v-model="documento.ficheiro"
                placeholder="Selecione o ficheiro a submeter"
                show-size
                clearable
                single-line
                accept="*"
                solo
              ></v-file-input>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Local</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="documento.local"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Ano</div>
            </v-col>
            <v-col>
              <v-select
                v-model="documento.ano"
                searchable="true"
                filterable="true"
                close-on-select="true"
                dir="ltr"
                :items="opcoes_ano"
                solo
                single-line
              >
              </v-select>
            </v-col>
          </v-row>

          <div
            class="form-group"
            v-for="(input, k) in documento.autores"
            :key="k"
          >
            <v-row>
              <v-col cols="2">
                <div class="info-label" v-if="k == 0">Autor(es)</div>
              </v-col>
              <v-col>
                <v-text-field
                  solo
                  clearable
                  color="indigo"
                  counter="150"
                  single-line
                  v-model="input.nome"
                  maxlength="150"
                  auto
                >
                  <template v-slot:append>
                    <v-btn
                      small
                      text
                      @click="remove(k)"
                      v-show="k || (!k && documento.autores.length > 1)"
                      ><v-icon>remove</v-icon></v-btn
                    >
                    <v-btn
                      small
                      text
                      @click="add(k)"
                      v-show="k == documento.autores.length - 1"
                      ><v-icon>add</v-icon></v-btn
                    >
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
      <PainelOperacoesDocumentacaoCientifica :t="documento" :acao="'Criação'" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOperacoesDocumentacaoCientifica from "@/components/documentacaoApoio/PainelOperacoesDocumentacaoCientifica";

export default {
  components: {
    PainelOperacoesDocumentacaoCientifica
  },
  data: nt => ({
    opcoes: [{ key: "Sim", value: true }, { key: "Não", value: false }],
    documento: {
      classe: "",
      titulo: "",
      url: "",
      local: "",
      autores: [{ nome: "" }],
      ano: new Date().getFullYear(),
      visivel: false,
      ficheiro: null
    },
    tipos: [],
    opcoes_ano: [],
    content: "empty"
  }),
  methods: {
    add(index) {
      this.documento.autores.push({ nome: "" });
    },
    remove(index) {
      this.documento.autores.splice(index, 1);
    },
    async changeInfo() {
      if (this.content == "ficheiro") {
        this.documento.url = "FICHEIRO";
        this.documento.ficheiro = null;
      }
      if (this.content == "url") {
        this.documento.url = "";
        this.documento.ficheiro = null;
      }
    }
  },
  created: async function() {
    /*
    let response = await this.$request(
      "get",
      "/documentacaoCientifica/classes"
    );

    this.tipos = response.data;
    */
    this.tipos = ["Comunicações e Artigos", "Provas Académicas"];
    try {
      for (var i = 2030; i >= 2010; i--) {
        this.opcoes_ano.push(i);
      }
    } catch (e) {
      return e;
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>

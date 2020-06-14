<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Edição de Entrada na Documentação
            Técnica/Científica</v-toolbar-title
          >
        </v-app-bar>
        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Visível</div>
            </v-col>
            <v-col>
              <v-radio-group v-model="doc.visivel" row>
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
                v-model="doc.classe"
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
                v-model="doc.titulo"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="this.confirmaEditarInformacao === false">
            <v-col cols="2">
              <div class="info-label">Documento</div>
            </v-col>
            <v-col>
              <v-text-field
                v-if="doc.ficheiro !== undefined"
                solo
                color="indigo"
                single-line
                readonly
                v-model="ficheiro_pre"
              >
                <template v-slot:append-outer>
                  <v-btn small text @click="editarInformacao"
                    ><v-icon>edit</v-icon></v-btn
                  >
                </template>
              </v-text-field>
              <v-text-field
                v-if="doc.url !== 'FICHEIRO'"
                solo
                color="indigo"
                single-line
                readonly
                v-model="url_pre"
              >
                <template v-slot:append-outer>
                  <v-btn small text @click="editarInformacao"
                    ><v-icon>edit</v-icon></v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <template v-else>
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
                  v-model="doc.url"
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
                  v-model="doc.ficheiro"
                  placeholder="Selecione o ficheiro a submeter"
                  show-size
                  clearable
                  single-line
                  accept="*"
                  solo
                ></v-file-input>
              </v-col>
            </v-row>
          </template>

          <v-dialog v-model="editaInformacao" width="50%">
            <v-card>
              <v-card-title>Editar informação</v-card-title>
              <v-card-text>
                <p>
                  Pretende alterar a informação que já foi submetida neste
                  documento científico?
                </p>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  dark
                  class="blue darken-4"
                  @click="confirmarEditarInformacao"
                  >Editar Informação</v-btn
                >
                <v-btn
                  dark
                  class="red darken-4"
                  @click="cancelarEditarInformacao"
                  >Cancelar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

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
                v-model="doc.local"
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
                v-model="doc.ano"
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

          <div class="form-group" v-for="(autor, k) in autores" :key="k">
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
                  v-model="doc.autores[k]"
                  maxlength="150"
                  auto
                >
                  <template v-slot:append>
                    <v-btn
                      small
                      text
                      @click="remove(k)"
                      v-show="k || (!k && autores.length > 1)"
                      ><v-icon>remove</v-icon></v-btn
                    >
                    <v-btn
                      small
                      text
                      @click="add(k)"
                      v-show="k == autores.length - 1"
                      ><v-icon>add</v-icon></v-btn
                    >
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
      <PainelOperacoesDocumentacaoCientifica :t="doc" :acao="'Alteração'" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOperacoesDocumentacaoCientifica from "@/components/documentacaoApoio/PainelOperacoesDocumentacaoCientifica";

export default {
  components: {
    PainelOperacoesDocumentacaoCientifica
  },
  props: ["doc"],
  data: nt => ({
    opcoes: [
      { key: "Sim", value: true }, 
      { key: "Não", value: false }
    ],
    tipos: [],
    opcoes_ano: [],
    confirmaEditarInformacao: false,
    editaInformacao: false,
    content: "empty"
  }),
  computed: {
    autores: function() {
      try {
        return this.doc.autores.map(function(autor) {
          return { nome: autor };
        });
      } catch (e) {
        return [];
      }
    },
    url_pre: function() {
      try {
        return "URL: " + this.doc.url;
      } catch (e) {
        return "";
      }
    },
    ficheiro_pre: function() {
      try {
        return "Ficheiro: " + this.doc.ficheiro.nome;
      } catch (e) {
        return "";
      }
    }
  },
  methods: {
    add(index) {
      this.doc.autores.push("");
    },
    remove(index) {
      this.doc.autores.splice(index, 1);
    },
    editarInformacao() {
      this.editaInformacao = true;
    },
    confirmarEditarInformacao() {
      this.confirmaEditarInformacao = true;
      this.editaInformacao = false;
      this.doc.url = "";
      this.doc.ficheiro = null;
    },
    cancelarEditarInformacao() {
      this.editaInformacao = false;
      this.confirmaEditarInformacao = false;
    },
    async changeInfo() {
      if (this.content == "ficheiro") {
        this.doc.url = "FICHEIRO";
        this.doc.ficheiro = null;
      }
      if (this.content == "url") {
        this.doc.url = "";
        this.doc.ficheiro = null;
      }
    }
  },
  created: async function() {
    this.tipos = ["Comunicações e Artigos", "Provas Académicas"];

    try {
      for (var i = 2030; i >= 2010; i--) {
        this.opcoes_ano.push(i.toString());
      }
      /*
      this.doc.autores = this.doc.autores.map(function(autor) {
        return { nome: autor };
      });
      */
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

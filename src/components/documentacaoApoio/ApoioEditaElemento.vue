<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Edita Elemento na Documentação de Apoio</v-toolbar-title
          >
        </v-app-bar>
        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Texto:</div>
            </v-col>
            <Editor v-model="item.texto"></Editor>
          </v-row>

          <v-row v-if="this.confirmaEditarInformacao === false">
            <v-col cols="2">
              <div class="info-label">Ficheiro</div>
            </v-col>
            <v-col>
              <v-text-field
                v-if="item.ficheiro !== undefined"
                solo
                color="indigo"
                single-line
                readonly
                v-model="item.ficheiro.nome"
              >
                <template v-slot:append-outer>
                  <v-btn small text @click="editarInformacao"
                    ><v-icon>edit</v-icon></v-btn
                  >
                </template>
              </v-text-field>
              <v-text-field
                v-else
                solo
                color="indigo"
                single-line
                readonly
                v-model="textNoFile"
              >
                <template v-slot:append-outer>
                  <v-btn small text @click="editarInformacao"
                    ><v-icon>edit</v-icon></v-btn
                  >
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="this.confirmaEditarInformacao === true">
            <v-col cols="2">
              <div class="info-label">Ficheiro</div>
            </v-col>
            <v-col>
              <v-file-input
                @change="changeStatus()"
                v-model="item.ficheiro"
                placeholder="Selecione o ficheiro a submeter"
                show-size
                clearable
                single-line
                accept="*"
                solo
              ></v-file-input>
            </v-col>
          </v-row>

          <v-dialog v-model="editaInformacao" width="50%">
            <v-card>
              <v-card-title>Editar ficheiro</v-card-title>
              <v-card-text>
                <p>
                  Pretende alterar o ficheiro que já foi submetido neste
                  documento do apoio?
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
              <div class="info-label">Visível:</div>
            </v-col>
            <v-col>
              <v-select
                v-model="item.visivel"
                searchable="true"
                filterable="true"
                close-on-select="true"
                dir="ltr"
                :items="opcoes"
                item-text="key"
                item-value="value"
                solo
                single-line
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <PainelOperacoesElementoDocumentacaoApoio :t="item" :acao="'Alteração'" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOperacoesElementoDocumentacaoApoio from "@/components/documentacaoApoio/PainelOperacoesElementoDocumentacaoApoio";
import Editor from "@/components/generic/EditorMarkdown.vue";

export default {
  props: ["t"],
  components: {
    PainelOperacoesElementoDocumentacaoApoio,
    Editor
  },
  data: nt => ({
    opcoes: [
      { key: "Sim", value: true },
      { key: "Não", value: false }
    ],
    textNoFile: "Sem Ficheiro Associado",
    confirmaEditarInformacao: false,
    editaInformacao: false,
    item: {
      idDoc: "",
      idEntrada: "",
      idElemento: "",
      texto: "",
      ficheiro: "",
      visivel: true,
      eraseFile: false,
      initFile: false
    }
  }),
  methods: {
    changeStatus() {
      if (this.item.ficheiro == null && this.item.initFile == true) {
        this.item.eraseFile = true;
      } else {
        this.item.eraseFile = false;
      }
    },
    confirmarEditarInformacao() {
      this.confirmaEditarInformacao = true;
      this.editaInformacao = false;
      this.item.ficheiro = null;
      if (this.item.initFile == true) {
        this.item.eraseFile = true;
      }
    },
    cancelarEditarInformacao() {
      this.editaInformacao = false;
      this.confirmaEditarInformacao = false;
    },
    editarInformacao() {
      this.editaInformacao = true;
    }
  },
  created: async function() {
    this.item = this.t;
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

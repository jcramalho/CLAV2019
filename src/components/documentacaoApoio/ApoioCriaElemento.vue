<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Novo Elemento na Documentação de Apoio</v-toolbar-title
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

          <v-row>
            <v-col cols="2">
              <div class="info-label">Ficheiro</div>
            </v-col>
            <v-col>
              <v-file-input
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
      <PainelOperacoesElementoDocumentacaoApoio :t="item" :acao="'Criação'" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOperacoesElementoDocumentacaoApoio from "@/components/documentacaoApoio/PainelOperacoesElementoDocumentacaoApoio";
import Editor from "@/components/generic/EditorMarkdown.vue";

export default {
  components: {
    PainelOperacoesElementoDocumentacaoApoio,
    Editor
  },
  data: nt => ({
    opcoes: [
      { key: "Sim", value: true },
      { key: "Não", value: false }
    ],
    item: {
      texto: "",
      ficheiro: null,
      visivel: true
    }
  })
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

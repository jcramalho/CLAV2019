<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Nova Secção de Documentação de Apoio</v-toolbar-title
          >
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Designação</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="t.classe"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <PainelOperacoesClasseDocumentacaoApoio :t="t" :acao="'Criação'" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOperacoesClasseDocumentacaoApoio from "@/components/documentacaoApoio/PainelOperacoesClasseDocumentacaoApoio";

export default {
  components: {
    PainelOperacoesClasseDocumentacaoApoio
  },
  data: nt => ({
    t: {
      classe: ""
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

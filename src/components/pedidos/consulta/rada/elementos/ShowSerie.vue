<template>
  <v-dialog v-model="dialogSerie">
    <template v-slot:activator="{ on }">
      <b text depressed @click="getSerie" v-on="on">
        {{ treeview_object.titulo }}
      </b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ "Série: " + treeview_object.titulo }}</b>
      </v-card-title>
      <v-card-text>
        <Identificacao :classe="serie" />

        <v-expansion-panels accordion>
          <v-expansion-panel popout focusable>
            <v-expansion-panel-header class="expansion-panel-heading">
              <b>Zona Descritiva</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ZonaDescritiva :classe="serie" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel popout focusable>
            <v-expansion-panel-header class="expansion-panel-heading">
              <b>Zona de Contexto de Avaliação</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ZonaContexto :classe="serie" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel
            popout
            focusable
            v-if="!!!treeview_object.children[0]"
          >
            <v-expansion-panel-header class="expansion-panel-heading">
              <b>Zona de Decisões de Avaliação</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ZonaDecisoesAvaliacao
                :classe="serie"
                :formaContagem="formaContagem"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-row v-else>
            <v-col md="3" sm="3">
              <div class="info-label">Notas</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-text-field
                solo
                readonly
                v-model="serie.notas"
                label="Notas"
                placeholder="Notas"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panels>
        <br />
        <h5>Hierarquia</h5>
        <v-divider></v-divider>
        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Classe Pai</div>
          </v-col>
          <v-col sm="9" md="9">
            <v-combobox
              readonly
              v-model="treeview_object.eFilhoDe"
              :items="[]"
              item-value="codigo"
              item-text="searchField"
              solo
              chips
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="indigo darken-4"
          outlined
          text
          @click="dialogSerie = false"
          >Voltar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "./partes/ZonaDescritiva";
import ZonaContexto from "./partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "./partes/ZonaDecisoesAvaliacao";

export default {
  props: ["treeview_object", "classes", "formaContagem"],
  data: () => ({
    serie: {},
    dialogSerie: false
  }),
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  methods: {
    getSerie() {
      this.serie = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}
</style>

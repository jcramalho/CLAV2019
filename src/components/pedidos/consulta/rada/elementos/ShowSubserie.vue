<template>
  <v-dialog v-model="dialogSubserie">
    <template v-slot:activator="{ on }">
      <b text depressed @click="getSerie" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ "Subsérie: " + treeview_object.titulo }}</b>
      </v-card-title>
      <v-card-text>
        <Identificacao :classe="subserie" />

        <v-expansion-panels accordion>
          <v-expansion-panel popout focusable>
            <v-expansion-panel-header class="expansion-panel-heading">
              <b>Zona Descritiva</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ZonaDescritiva :classe="subserie" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel popout focusable>
            <v-expansion-panel-header class="expansion-panel-heading">
              <b>Zona de Contexto de Avaliação</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ZonaContexto :classe="subserie" />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel popout focusable>
            <v-expansion-panel-header class="expansion-panel-heading">
              <b>Zona de Decisões de Avaliação</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ZonaDecisoesAvaliacao :classe="subserie" :formaContagem="formaContagem" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <br />

        <h5>Hierarquia</h5>
        <v-divider></v-divider>
        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Classe Pai</div>
          </v-col>
          <v-col cols="12" sm="9" md="0">
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
        <v-btn color="indigo darken-4" outlined text @click="dialogSubserie = false">Voltar</v-btn>
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
    subserie: {},
    dialogSubserie: false
  }),
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  methods: {
    getSerie() {
      this.subserie = this.classes.find(
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
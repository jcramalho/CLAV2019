<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">{{ treeview_object.titulo }}</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ 'Alterar a série: ' + treeview_object.titulo }}</b>
      </v-card-title>
      <br />
      <v-card-text>
        <v-form ref="formSerie" :lazy-validation="false">
          <Identificacao :newSerie="serie" />

          <v-expansion-panels accordion>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="serie" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="serie"
                  :entidades="entidades"
                  :classes="classesNomes"
                  :legislacao="legislacao"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao :newSerie="serie" />
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
            <v-col sm="9" md="9">
              <v-autocomplete
                disabled
                v-model="serie.eFilhoDe"
                :items="classesFiltradas"
                :rules="[v => !!v || 'Campo obrigatório!']"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
              >
                <template v-slot:item="{ item }">{{ item.codigo }} - {{ item.titulo }}</template>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ item.codigo }} - {{ item.titulo }}</v-chip>
                </template>
                <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert
                      :value="true"
                      color="red lighten-3"
                      icon="warning"
                    >Sem classes Área Orgânico-Funcional! Adicione primeiro.</v-alert>
                  </v-container>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>-->
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Cancelar</v-btn>

        <v-btn color="success" class="mr-4" @click="save">Atualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./serie/Identificacao";
import ZonaDescritiva from "../criacao/classes/partes/ZonaDescritiva";
import ZonaContexto from "../criacao/classes/partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "../criacao/classes/partes/ZonaDecisoesAvaliacao";

export default {
  props: ["treeview_object", "classes", "entidades", "legislacao"],
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  data: () => ({
    dialog: false,
    serie: {},
    classesFiltradas: [],
    classesNomes: []
  }),
  methods: {
    filterSeries: async function() {
      // ir buscar o verdadeiro objeto
      let serie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // DEEP CLONE do objetos
      this.serie = Object.assign({}, serie_real);
      this.serie.relacoes = [...serie_real.relacoes];
      this.serie.produtoras = [...serie_real.produtoras];
      this.serie.legislacao = [...serie_real.legislacao];
      this.serie.localizacao = [...serie_real.localizacao];

      // Classes para definir a hierarquia
      this.classesFiltradas = this.classes.filter(
        classe => classe.tipo != "Série" && classe.tipo != "Subsérie"
      );

      // Classes para as relações
      this.classesNomes = this.classes.filter(
        e => e.tipo == "Série" || e.tipo == "Subsérie"
      );
    },
    save: function() {
      this.$emit("atualizacao", this.serie);
      this.dialog = false;
    }
  }
};
</script>
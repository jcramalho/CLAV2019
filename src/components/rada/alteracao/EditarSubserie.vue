<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
      <b
        v-if="treeview_object.eFilhoDe == '' || !treeview_object.temUIs_ou_datas"
        style="color:red"
      >*</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ 'Alterar a subsérie: ' + treeview_object.titulo }}</b>
      </v-card-title>
      <br />
      <v-card-text>
        <v-form ref="formSubserie" :lazy-validation="false">
          <Identificacao :newSerie="subserie" :classes="classes" />

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="subserie" :UIs="UIs" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto :newSerie="subserie" :classes="classes" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao :newSerie="subserie" :classes="classes" />
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
              <v-autocomplete
                v-model="subserie.eFilhoDe"
                :items="classesHierarquia"
                :rules="[v => !!v || 'Este campo é obrigatório.']"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
              >
                <template v-slot:item="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ item.codigo + ' - ' + item.titulo}}</v-chip>
                </template>
                <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert
                      :value="true"
                      color="red lighten-3"
                      icon="warning"
                    >Sem classes Série! Adicione primeiro.</v-alert>
                  </v-container>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Voltar</v-btn>

        <v-btn color="success" class="mr-4" @click="save">Atualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "../criacao/classes/partes/ZonaDescritiva";
import ZonaContexto from "../criacao/classes/partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "../criacao/classes/partes/ZonaDecisoesAvaliacao";

export default {
  props: ["treeview_object", "classes", "UIs"],
  data: () => ({
    dialog: false,
    subserie: {},
    panels: [0, 0, 0],
    isMultiple: false,
    classesHierarquia: []
  }),
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  methods: {
    filterSeries: function() {
      this.panels = [0, 0, 0];
      this.isMultiple = false;
      // ir buscar o verdadeiro objeto
      let subserie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // DEEP CLONE do objetos
      this.subserie = Object.assign({}, subserie_real);
      this.subserie.relacoes = [...subserie_real.relacoes];
      this.subserie.UIs = [...subserie_real.UIs];
      this.subserie.justificacaoDF = [...subserie_real.justificacaoDF];

      // Classes para definir a hierarquia
      this.classesHierarquia = this.classes.filter(
        classe => classe.tipo == "Série"
      );
    },
    save: function() {
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(() => {
        if (this.$refs.formSubserie.validate()) {
          this.$emit("atualizacao", this.subserie);
          this.dialog = false;
        }
      }, 1);
    }
  }
};
</script>
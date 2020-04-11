<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
      <b
        v-show="treeview_object.eFilhoDe == null || !treeview_object.temUIs_ou_datas || treeview_object.temDF"
        style="color:red"
      >*</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ 'Alterar a subsérie: ' + treeview_object.titulo }}</b>
        <v-spacer />
        <v-icon @click="toDelete = true" dark color="red" right>delete_sweep</v-icon>
      </v-card-title>
      <br />
      <v-card-text>
        <v-row>
          <v-dialog v-model="toDelete" width="50%">
            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >Pretende mesmo eliminar a classe {{ treeview_object.titulo }} ?</v-card-title>

              <v-card-text align="center">
                <br />
                <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
                <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarClasse">Sim</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
        <v-form ref="formSubserie" :lazy-validation="false">
          <Identificacao :newSerie="subserie" :classes="classes" />

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="subserie" :UIs="UIs" :RE="RE" />
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
                <ZonaDecisoesAvaliacao
                  :rules="true"
                  :newSerie="subserie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
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
                :disabled="temCriterioLegal"
                v-model="subserie.eFilhoDe"
                :items="classesHierarquia"
                :rules="[v => !!v || 'Este campo é obrigatório.']"
                item-value="codigo"
                item-text="searchField"
                solo
                clearable
                placeholder="Classe Pai"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      <strong>Classe Série</strong> em questão não existe!
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-alert width="100%" :value="existe_erros" outlined type="error" prominent border="left">
          É necessário preencher os campos seguintes:
          <ul>
            <li v-for="(erro, i) in erros" :key="i">{{erro}}</li>
          </ul>
        </v-alert>
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
  props: ["treeview_object", "classes", "UIs", "formaContagem", "RE"],
  data: () => ({
    existe_erros: false,
    erros: [],
    toDelete: false,
    dialog: false,
    subserie: {
      justificacaoDF: [],
      justificacaoPCA: []
    },
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
  computed: {
    temCriterioLegal() {
      return (
        this.subserie.justificacaoDF.some(e => e.tipo == "Critério Legal") ||
        this.subserie.justificacaoPCA.some(e => e.tipo == "Critério Legal")
      );
    }
  },
  methods: {
    clonePCA(serie_real) {
      // DEEP CLONE DOS CRITÉRIOS JUSTIFICACAO PCA
      let newJustificacaoPCA = [];

      for (let i = 0; i < serie_real.justificacaoPCA.length; i++) {
        let criterio = Object.assign({}, serie_real.justificacaoPCA[i]);

        if (serie_real.justificacaoPCA[i].tipo != "Critério Gestionário") {
          criterio.relacoes = [...serie_real.justificacaoPCA[i].relacoes];
        }

        newJustificacaoPCA.push(criterio);
      }

      return newJustificacaoPCA;
    },
    cloneDF(serie_real) {
      // DEEP CLONE DOS CRITÉRIOS JUSTIFICACAO DF
      let newJustificacaoDF = [];

      for (let i = 0; i < serie_real.justificacaoDF.length; i++) {
        let criterio = Object.assign({}, serie_real.justificacaoDF[i]);
        criterio.relacoes = [...serie_real.justificacaoDF[i].relacoes];

        newJustificacaoDF.push(criterio);
      }

      return newJustificacaoDF;
    },
    buscarTitulosClasses() {
      this.subserie.relacoes.forEach(rel => {
        let classe_relacionada = this.classes.find(
          cl => cl.codigo == rel.serieRelacionada.codigo
        );

        rel.serieRelacionada["titulo"] = classe_relacionada.titulo;

        let criterio = null;

        if (rel.relacao == "Suplemento para") {
          criterio = this.subserie.justificacaoPCA.find(
            e => e.tipo == "Critério de Utilidade Administrativa"
          );
        }

        if (rel.relacao == "Complementar de") {
          criterio = this.subserie.justificacaoDF.find(
            e => e.tipo == "Critério de Complementaridade Informacional"
          );
        }

        if (rel.relacao == "Síntese de" || rel.relacao == "Sintetizado por") {
          criterio = this.subserie.justificacaoDF.find(
            e => e.tipo == "Critério de Densidade Informacional"
          );
        }

        if (criterio != null) {
          let relacaoCriterio = criterio.relacoes.find(
            e => e.codigo == classe_relacionada.codigo
          );

          relacaoCriterio["titulo"] = classe_relacionada.titulo;
        }
      });
    },
    async filterSeries() {
      this.existe_erros = false;
      this.erros = [];
      this.panels = [0, 0, 0];
      this.isMultiple = false;

      // ir buscar o verdadeiro objeto
      let subserie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // DEEP CLONE do objetos
      this.subserie = Object.assign({}, subserie_real);
      this.subserie.UIs = [...subserie_real.UIs];
      this.subserie.justificacaoPCA = await this.clonePCA(subserie_real);
      this.subserie.justificacaoDF = await this.cloneDF(subserie_real);
      this.subserie.formaContagem = Object.assign(
        {},
        subserie_real.formaContagem
      );
      this.subserie.relacoes = [...subserie_real.relacoes];
      this.buscarTitulosClasses();

      // Classes para definir a hierarquia
      this.classesHierarquia = this.classes
        .filter(classe => classe.tipo == "Série")
        .sort((a, b) => a.codigo.localeCompare(b.codigo))
        .map(classe => {
          return {
            searchField: classe.codigo + " - " + classe.titulo,
            codigo: classe.codigo
          };
        });
    },
    eliminarClasse() {
      let subserie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      this.$emit("remover", subserie_real);
      this.dialog = false;
    },
    recolherErros() {
      this.existe_erros = true;

      if (!this.subserie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.subserie.descricao) {
        this.erros.push("Descrição;");
      }

      if (
        !!this.subserie.UIs[0] == false &&
        (!this.subserie.dataInicial || !this.subserie.dataFinal)
      ) {
        this.erros.push("Datas ou Unidades de Instalação;");
      }

      if (!!this.subserie.relacoes[0] == false) {
        this.erros.push("Relações;");
      }

      if (!this.subserie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }
      if (!this.subserie.pca) {
        this.erros.push("Prazo de Conservação Administrativa;");
      }

      if (!!this.subserie.justificacaoPCA[0] == false) {
        this.erros.push("Justificação do PCA;");
      }

      if (!!this.subserie.justificacaoDF[0] == false) {
        this.erros.push("Justificação do DF;");
      }

      if (!this.subserie.df) {
        this.erros.push("Destino Final;");
      }

      if (!this.subserie.formaContagem.forma) {
        this.erros.push("Forma de Contagem;");
      } else {
        if (
          this.subserie.formaContagem.forma ==
            "vc_pcaFormaContagem_disposicaoLegal" &&
          !this.subserie.formaContagem.subforma
        ) {
          this.erros.push("Subforma de Contagem;");
        }
      }
    },
    save() {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(() => {
        if (this.$refs.formSubserie.validate()) {
          this.$emit("atualizacao", this.subserie);
          this.dialog = false;
        } else {
          this.isMultiple = false;
          this.panels = [0, 0, 0];
          this.recolherErros();
        }
      }, 1);
    }
  }
};
</script>
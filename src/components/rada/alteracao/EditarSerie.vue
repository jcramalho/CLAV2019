<template>
  <v-dialog v-model="dialogSerie" persistent>
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
      <b
        v-show="treeview_object.eFilhoDe == null || !treeview_object.temUIs_ou_datas || (treeview_object.temDF && !(!!(treeview_object.children[0])))"
        style="color:red"
      >*</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ "Alterar a série: " + treeview_object.titulo }}</b>
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
        <v-form ref="formSerie" :lazy-validation="false">
          <Identificacao :newSerie="serie" />

          <v-expansion-panels v-model="panels" accordion :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="serie" :UIs="UIs" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="serie"
                  :classes="classes"
                  :legislacao="legislacao"
                  :RE="RE"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable v-if="!(!!(treeview_object.children[0]))">
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao
                  :rules="true"
                  :newSerie="serie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-row v-else>
              <v-col md="3" sm="3">
                <div class="info-label">Notas</div>
              </v-col>
              <v-col sm="9" md="9">
                <v-text-field solo clearable v-model="serie.notas" label="Notas"></v-text-field>
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
              <v-autocomplete
                v-model="serie.eFilhoDe"
                :items="classesHierarquia"
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
        <v-alert width="100%" :value="existe_erros" outlined type="error" prominent border="left">
          É necessário preencher os campos seguintes:
          <ul>
            <li v-for="(erro, i) in erros" :key="i">{{erro}}</li>
          </ul>
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="dialogSerie = false">Voltar</v-btn>

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
  props: [
    "treeview_object",
    "classes",
    "legislacao",
    "RE",
    "UIs",
    "formaContagem"
  ],
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  data: () => ({
    existe_erros: false,
    erros: [],
    toDelete: false,
    panels: [0, 0, 0],
    isMultiple: false,
    dialogSerie: false,
    serie: {},
    classesHierarquia: []
  }),
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
    eliminarClasse() {
      // Buscar a classe original pois é a que temos que eliminar, o clone pode estar desatualizado
      let serie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );
      this.$emit("remover", serie_real);
      this.dialogSerie = false;
    },
    async filterSeries() {
      this.existe_erros = false;
      this.erros = [];
      this.panels = [0, 0, 0];
      this.isMultiple = false;
      // ir buscar o verdadeiro objeto
      let serie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // DEEP CLONE do objetos
      this.serie = Object.assign({}, serie_real);
      this.serie.tipologiasProdutoras = [...serie_real.tipologiasProdutoras];
      this.serie.entProdutoras = [...serie_real.entProdutoras];
      this.serie.legislacao = [...serie_real.legislacao];
      this.serie.localizacao = [...serie_real.localizacao];
      this.serie.relacoes = [...serie_real.relacoes];
      this.serie.formaContagem = Object.assign({}, serie_real.formaContagem);
      this.serie.justificacaoPCA = await this.clonePCA(serie_real);
      this.serie.justificacaoDF = await this.cloneDF(serie_real);
      this.serie.UIs = [...serie_real.UIs];

      // Classes para definir a hierarquia
      this.classesHierarquia = this.classes
        .filter(classe => classe.tipo != "Série" && classe.tipo != "Subsérie")
        .sort((a, b) => a.codigo.localeCompare(b.codigo));
    },
    recolherErros() {
      this.existe_erros = true;

      if (!this.serie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.serie.descricao) {
        this.erros.push("Descrição;");
      }

      if (
        !!this.serie.UIs[0] == false &&
        (!this.serie.dataInicial || !this.serie.dataFinal)
      ) {
        this.erros.push("Datas ou Unidades de Instalação;");
      }

      if (!!this.serie.relacoes[0] == false) {
        this.erros.push("Relações;");
      }

      if (!this.serie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }

      if (!this.serie.tUA) {
        this.erros.push("Tipo de Unidade Arquivistica;");
      }

      if (!this.serie.suporte) {
        this.erros.push("Suporte;");
      }

      if (!this.serie.medicao) {
        this.erros.push("Medição;");
      }

      if (!!this.serie.localizacao[0] == false) {
        this.erros.push("Localização;");
      }

      if (
        !!this.serie.entProdutoras[0] == false &&
        !!this.serie.tipologiasProdutoras[0] == false
      ) {
        this.erros.push("Produtoras;");
      }

      if (!!this.serie.legislacao[0] == false) {
        this.erros.push("Legislação;");
      }
      if (!!this.treeview_object.children[0] == 0) {
        if (!this.serie.pca) {
          this.erros.push("Prazo de Conservação Administrativa;");
        }

        if (!!this.serie.justificacaoPCA[0] == false) {
          this.erros.push("Justificação do PCA;");
        }

        if (!!this.serie.justificacaoDF[0] == false) {
          this.erros.push("Justificação do DF;");
        }

        if (!this.serie.df) {
          this.erros.push("Destino Final;");
        }

        if (!this.serie.formaContagem.forma) {
          this.erros.push("Forma de Contagem;");
        } else {
          if (
            this.serie.formaContagem.forma ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            !this.serie.formaContagem.subforma
          ) {
            this.erros.push("Subforma de Contagem;");
          }
        }
      }
    },
    save() {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(() => {
        if (this.$refs.formSerie.validate()) {
          this.$emit("atualizacao", this.serie);
          this.dialogSerie = false;
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

<template>
  <v-container
    v-if="c.temSubclasses4NivelPCA || c.temSubclasses4NivelDF"
    fluid
    class="pa-0 ma-0"
    style="max-width:100%;"
  >
    <!-- SUBCLASSES 4º NÍVEL -->
    <v-row>
      <v-col class="mx-1">
        <v-toolbar
          color="#083581"
          class="caption mt-5 font-weight-bold"
          dark
          height="50"
          style="border-radius: 10px;"
        >
          <v-toolbar-title
            :class="{
              'mx-auto': $vuetify.breakpoint.smAndDown,
              'mx-0': $vuetify.breakpoint.mdAndUp
            }"
          >
            Subclasses de nível 4
          </v-toolbar-title>
          <template v-slot:extension>
            <v-tabs
              v-model="active"
              show-arrows
              grow
              hide-slider
              dark
              background-color="#083581"
              style="border-radius: 10px !important;"
              class="mx-0"
            >
              <v-tab
                v-for="subClasse in c.subclasses"
                :key="subClasse.codigo"
                ripple
                class="my-2"
                active-class="active-tab"
                >{{ subClasse.codigo }}</v-tab
              >
              <v-tooltip top color="info" open-delay="600">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="success"
                    icon
                    @click="addSubclasse"
                    class="mx-auto"
                  >
                    <unicon
                      name="adicionar-icon"
                      width="15"
                      height="15"
                      viewBox="0 0 20.71 20.71"
                      fill="#4caf50"
                    />
                  </v-btn>
                </template>
                <span>Adicionar subclasse</span>
              </v-tooltip>
            </v-tabs>
          </template>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-items v-model="active">
          <v-tab-item
            v-for="subClasse in c.subclasses"
            :key="subClasse.codigo"
            :class="{
              'mt-8': $vuetify.breakpoint.smAndDown,
              'mt-6': $vuetify.breakpoint.mdAndUp
            }"
          >
            <v-row class="mt-n6 mx-2">
              <v-col cols="12" lg="2">
                <div class="info-label">Código:</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content pa-4 px-5"
                  style="min-height: 40px; font-weight:bold;"
                >
                  <span class="px-3"> {{ subClasse.codigo }} </span>
                </div>
              </v-col>
            </v-row>
            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-0': $vuetify.breakpoint.mdAndUp
              }"
              class="mx-2"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Código do pai:</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content pa-4 px-5"
                  style="min-height: 40px; font-weight:bold;"
                >
                  <span class="px-3"> {{ c.codigo }} </span>
                </div>
              </v-col>
            </v-row>
            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-0': $vuetify.breakpoint.mdAndUp
              }"
              class="mx-2"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Título:</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content pa-4 px-5 pb-3"
                  style="min-height: 40px;"
                >
                  <v-text-field
                    v-model="subClasse.titulo"
                    label="Título"
                    clearable
                    class="px-3 mt-n2"
                    color="blue darken-3"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-0': $vuetify.breakpoint.mdAndUp
              }"
              class="mx-2"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Descrição:</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content pa-4 px-5 pb-3"
                  style="min-height: 40px;"
                >
                  <v-text-field
                    v-model="subClasse.descricao"
                    label="Descrição"
                    clearable
                    class="mt-n2 px-3"
                    color="blue darken-3"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <hr class="ml-2 mr-4" style="border-top: 2px dashed #dee2f8;" />
            <v-row class="mx-6">
              <TermosIndiceOps :c="subClasse" />
            </v-row>
            <BlocoDecisoes4Nivel
              :c="subClasse"
              :semaforos="semaforos"
              :pcaFormasContagem="pcaFormasContagem"
              :pcaSubFormasContagem="pcaSubFormasContagem"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";
import BlocoDecisoes4Nivel from "@/components/classes/criacao/BlocoDecisoes4Nivel.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    TermosIndiceOps,
    BlocoDecisoes4Nivel
  },

  data: function() {
    return {
      active: null,

      destinoFinalTipos: [
        { label: "Não Especificado (NE)", value: "NE" },
        { label: "Conservação (C)", value: "C" },
        { label: "Conservação Parcial (CP)", value: "CP" },
        { label: "Eliminação (E)", value: "E" }
      ],

      destinoFinalLabels: {
        NE: "Não Especificado (NE)",
        C: "Conservação (C)",
        CP: "Conservação Parcial (CP)",
        E: "Eliminação (E)"
      }
    };
  },

  methods: {
    // Adiciona um critério à lista de critérios do PCA ou do DF....................
    adicionarCriterio: function(
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      let myProcRel = JSON.parse(JSON.stringify(procRel));
      let myLeg = JSON.parse(JSON.stringify(legislacao));

      var indice = justificacao.findIndex(crit => crit.tipo === tipo);
      if (indice == -1) {
        justificacao.push({
          tipo: tipo,
          label: label,
          notas: notas,
          procRel: myProcRel,
          legislacao: myLeg
        });
      } else {
        justificacao[indice].procRel = justificacao[indice].procRel.concat(
          myProcRel
        );
        justificacao[indice].legislacao = justificacao[
          indice
        ].legislacao.concat(myLeg);
      }
    },

    adicionarCriterioLegalPCA: function(
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(
        justificacao,
        tipo,
        label,
        notas,
        procRel,
        legislacao
      );
      this.semaforos.critLegalAdicionadoPCA = true;
    },

    adicionarCriterioGestionario: function(
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(
        justificacao,
        tipo,
        label,
        notas,
        procRel,
        legislacao
      );
      this.semaforos.critGestionarioAdicionado = true;
    },

    // Remove um critério completo duma vez
    removerCriterioTodo: function(justificacao, i, PCAouDF) {
      this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
      justificacao.splice(i, 1);
    },

    // Atualiza as flags que controlam os botões de adicionar e remover critérios
    atualizaFlagsCriterios(tipo, PCAouDF) {
      if (tipo == "CriterioJustificacaoLegal") {
        if (PCAouDF == "PCA") this.semaforos.critLegalAdicionadoPCA = false;
        else this.semaforos.critLegalAdicionadoDF = false;
      } else if (tipo == "CriterioJustificacaoGestionario") {
        this.semaforos.critGestionarioAdicionado = false;
      }
    },

    unselectProcesso: function(proc, listaProc) {
      var index = listaProc.findIndex(p => p.id === proc.id);
      listaProc.splice(index, 1);
    },

    // Calcula o destino final para o contexto do momento
    calcDF: function(listaProc) {
      var res = "NE";

      if (!this.c.temSubclasses4NivelDF) {
        var complementar = listaProc.findIndex(
          p => p.relacao == "eComplementarDe"
        );
        if (complementar != -1) {
          res = "C";
        } else {
          var sinteseDe = listaProc.findIndex(p => p.relacao == "eSinteseDe");
          if (sinteseDe != -1) {
            res = "C";
          } else {
            var sintetizado = listaProc.findIndex(
              p => p.relacao == "eSintetizadoPor"
            );
            if (sintetizado != -1) {
              res = "E";
            } else {
              res = "NE";
            }
          }
        }
      }
      return res;
    },

    procHeranca: function(procRel, novaClasse) {
      for (var i = 0; i < procRel.length; i++) {
        // Tratamento do invariante: se é Suplemento Para então cria-se um critério de Utilidade Administrativa
        if (procRel[i].relacao == "eSuplementoPara") {
          this.adicionarCriterio(
            novaClasse.pca.justificacao,
            "CriterioJustificacaoUtilidadeAdministrativa",
            "Critério de Utilidade Administrativa",
            this.textoCriterioUtilidadeAdministrativa,
            [procRel[i]],
            []
          );
        }
        // Tratamento do invariante: se é Suplemento De então cria-se um critério Legal com toda a legislação selecionada associada
        else if (procRel[i].relacao == "eSuplementoDe") {
          this.adicionarCriterio(
            novaClasse.pca.justificacao,
            "CriterioJustificacaoLegal",
            "Critério Legal",
            this.textoCriterioLegal,
            [procRel[i]],
            this.classe.legislacao
          );
          this.critLegalAdicionadoPCA = true;
        }
        // Tratamento do invariante: se é Síntese De então cria-se um critério de Densidade Informacional
        else if (procRel[i].relacao == "eSinteseDe") {
          this.adicionarCriterio(
            novaClasse.df.justificacao,
            "CriterioJustificacaoDensidadeInfo",
            "Critério de Densidade Informacional",
            this.textoCriterioDensidadeSinDe,
            [procRel[i]],
            []
          );
        }
        // Tratamento do invariante: se é Síntetizado Por então cria-se um critério de Densidade Informacional
        else if (procRel[i].relacao == "eSintetizadoPor") {
          this.adicionarCriterio(
            novaClasse.df.justificacao,
            "CriterioJustificacaoDensidadeInfo",
            "Critério de Densidade Informacional",
            this.textoCriterioDensidadeSinPor,
            [procRel[i]],
            []
          );
        }
        // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
        else if (procRel[i].relacao == "eComplementarDe") {
          this.adicionarCriterio(
            novaClasse.df.justificacao,
            "CriterioJustificacaoComplementaridadeInfo",
            "Critério de Complementaridade Informacional",
            this.textoCriterioComplementaridade,
            [procRel[i]],
            []
          );
        }
      }
      if (!this.c.temSubclasses4NivelDF) {
        novaClasse.df.valor = this.calcDF(novaClasse.processosRelacionados);
      }
    },

    pad: function(num, size) {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    },

    showSubs: function() {
      alert(JSON.stringify(this.c.subclasses));
    },

    addSubclasse: function() {
      var novaSubclasse = {
        nivel: 4,
        pai: this.c.codigo,
        codigo: this.c.codigo + "." + this.pad(this.c.subclasses.length + 1, 2),
        titulo: this.c.titulo + ": ",
        descricao: "",
        termosInd: [],

        // Bloco de contexto de avaliação

        processosRelacionados: JSON.parse(
          JSON.stringify(this.c.processosRelacionados)
        ),
        legislacao: JSON.parse(JSON.stringify(this.c.legislacao)),

        // Bloco de decisão de avaliação: PCA e DF

        pca: {
          valor: null,
          formaContagem: "",
          subFormaContagem: "",
          justificacao: []
        },

        df: {
          valor: "NE",
          notas: null,
          justificacao: []
        },
        // Contexto para controlar a interface de cada subclasse
        semaforos: {
          critLegalAdicionadoPCA: false,
          critLegalAdicionadoDF: false,
          critGestionarioAdicionado: false
        }
      };

      this.procHeranca(this.c.processosRelacionados, novaSubclasse);
      this.c.subclasses.push(novaSubclasse);
    }
  }
};
</script>
<style scoped>
.active-tab {
  color: #1a237e !important;
  padding: 8px;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(255, 255, 255, 0.22) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 30px;
}
#subclass-tab {
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.theme--dark.v-tabs > .v-tabs-bar {
  background-color: #083581 !important;
}
.separador {
  color: white;
  padding: 5px;
  margin: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1a237e;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 3px;
}

.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>

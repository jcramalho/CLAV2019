<template>
  <!-- DF -->
  <v-card class="ma-2" >
    <v-card-title class="teal darken-4 subtitle-1 white--text" dark>Destino Final</v-card-title>
    <v-card-text>
      <v-row class="ma-2">
        <v-col cols="2">
          <div class="info-label">Destino</div>
        </v-col>
        <v-col>
          <SelectValueFromList
              v-if="c.df.valor == 'NE'"
              :initial-value="c.df.valor"
              :options="destinoFinalTipos"
              @value-change="c.df.valor = $event"
          />
          <span v-else>
              {{ destinoFinalLabels[c.df.valor] }}
          </span>
        </v-col>
      </v-row>

      <v-row class="ma-2">
        <v-col cols="2">
          <div class="info-label">Notas</div>
        </v-col>
        <v-col>
          <v-textarea
          solo
          label="Notas ao destino final"
          v-model="c.df.notas"
          rows="2"
        ></v-textarea>
        </v-col>
      </v-row>

      <hr style="border-top: 2px dashed green;" />


    </v-card-text>

      <!-- JUSTIFICAÇÂO DO DF -->
      <v-row class="ma-2">
        <v-col cols="3">
          <div class="ma-2 info-label">Justificação do DF</div>

          <div class="ma-2">
            <v-btn
              color="green darken-2"
              dark
              rounded
              @click="adicionarCriterioLegalPCA( c.df.justificacao, 'CriterioJustificacaoLegal',
                                                  'Critério Legal', '', [], c.legislacao )"
              v-if="!semaforos.critLegalAdicionadoDF"
            >
              Critério Legal
              <v-icon dark right>add_circle_outline</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col>
          <v-row class="ma-2" v-for="(crit, cindex) in c.df.justificacao" :key="cindex">
            <v-col cols="3">
              <div class="info-label">
                {{ crit.label }}
                <v-icon
                  color="red darken-2"
                  dark
                  small
                  @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')"
                  >remove_circle</v-icon>
              </div>
            </v-col>
            <!-- Se existir um critério Legal ..............................................-->
            <v-col v-if="crit.tipo == 'CriterioJustificacaoLegal'">
              <div class="info-content" v-if="crit.legislacao.length > 0">
                <v-textarea
                  auto-grow
                  clearable
                  single-line
                  rows="1"
                  :value="crit.notas"
                  v-model="crit.notas"
                ></v-textarea>
                <span v-for="(l, i) in crit.legislacao" :key="l.id">
                  <a :href="'/legislacao/' + l.id">
                    {{ l.tipo }} {{ l.numero }}
                  </a>
                  <v-icon
                    color="red darken-2"
                    dark
                    small
                    @click="crit.legislacao.splice(i, 1)"
                    >remove_circle</v-icon>
                  <span v-if="i == crit.legislacao.length - 1">.</span>
                  <span v-else>, </span>
                </span>
              </div>
              <div class="info-content" v-if="crit.legislacao.length == 0">
                Sem legislação associada. Pode associar legislação na área de
                contexto.
              </div>
            </v-col>
            <!-- Se existir um critério de densidade ou de complementaridade ..................-->
            <v-col v-else>
              <div class="info-content">
                {{ crit.notas }}
                <a
                  :href="'/classes/consultar/' + p.id"
                  v-for="(p, i) in crit.procRel"
                  :key="p.id"
                >
                  {{ p.codigo }}: {{ p.titulo }}
                  <span v-if="i == crit.procRel.length - 1">.</span>
                  <span v-else>, </span>
                </a>
              </div>
            </v-col>

            <hr
              v-if="cindex < c.df.justificacao.length"
              style="border-top: 2px dotted green; width: 100%;"
            />
          </v-row>
        </v-col>
      </v-row>
  </v-card>
</template>

<script>
import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";
import SelectValueFromList from "@/components/generic/SelectValueFromList.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    ProcessosRelacionadosOps,
    LegislacaoOps,
    SelectValueFromList
  },

  data: function() {
    return {
      destinoFinalTipos: [
        { label: "Não Especificado", value: "NE" },
        { label: "Conservação", value: "C" },
        { label: "Conservação Parcial", value: "CP" },
        { label: "Eliminação", value: "E" }
      ],

      destinoFinalLabels: {
        NE: "Não Especificado",
        C: "Conservação",
        CP: "Conservação Parcial",
        E: "Eliminação"
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
          label,
          label,
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

    unselectDiploma: function(diploma, listaLeg) {
      var index = listaLeg.findIndex(e => e.id === diploma.id);
      listaLeg.splice(index, 1);
      if(listaLeg.length == 0){
        this.semaforos.critLegalAdicionadoDF = false
      }
    }
  }
};
</script>

<template>
  <!-- DF -->
  <v-container fluid v-if="!c.temSubclasses4Nivel">
    <v-layout ma-2 wrap>
      <v-flex xs12>
        <v-toolbar color="teal darken-4 font-weight-medium" dark height="30">
          <v-toolbar-title>Destino Final</v-toolbar-title>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout ma-2 wrap>
      <v-flex xs2>
        <div class="info-label">Destino</div>
      </v-flex>
      <v-flex xs10>
        <SelectValueFromList
          v-if="c.df.valor == 'NE'"
          :initial-value="c.df.valor"
          :options="destinoFinalTipos"
          @value-change="c.df.valor = $event"
        />

        <span v-else>
          {{ destinoFinalLabels[c.df.valor] }}
        </span>
      </v-flex>
    </v-layout>
    
    <v-layout ma-2 wrap>
      <v-flex xs2>
        <div class="info-label">Notas</div>
      </v-flex>
      <v-flex xs10>
        <v-textarea
          solo
          label="Notas ao destino final"
          v-model="c.df.notas"
          rows="2"
        ></v-textarea>
      </v-flex>
    </v-layout>

    <hr style="border-top: 2px dashed green;" />

    <!-- JUSTIFICAÇÂO DO DF -->
    <v-layout row wrap>
      <v-flex xs3>
        <v-layout row wrap>
          <v-flex xs12>
            <div class="info-label">Justificação do DF</div>
          </v-flex>
          <v-flex xs12>
            <v-btn
              color="green darken-2"
              dark
              round
              @click="
                adicionarCriterioLegalPCA(
                  c.df.justificacao,
                  'CriterioJustificacaoLegal',
                  'Critério Legal',
                  textoCriterioLegal,
                  [],
                  c.legislacao
                )
              "
              v-if="!semaforos.critLegalAdicionadoDF"
            >
              Critério Legal
              <v-icon dark right>add_circle_outline</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs9>
        <v-layout
          row
          wrap
          v-for="(crit, cindex) in c.df.justificacao"
          :key="cindex"
        >
          <v-flex xs3>
            <div class="info-label">
              {{ crit.label }}
              <v-icon
                color="red darken-2"
                dark
                small
                @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')"
                >remove_circle</v-icon
              >
            </div>
          </v-flex>

          <v-flex
            xs9
            v-if="crit.tipo == 'CriterioJustificacaoComplementaridadeInfo'"
          >
            <div class="info-content">
              {{ crit.notas }}
              <span v-for="(p, i) in crit.procRel" :key="p.id">
                <a :href="'/classes/consultar/' + p.id">
                  {{ p.codigo }}: {{ p.titulo }}
                </a>
                <v-icon
                  color="red darken-2"
                  dark
                  small
                  @click="crit.procRel.splice(i, 1)"
                  >remove_circle</v-icon
                >
                <span v-if="i == crit.procRel.length - 1">.</span>
                <span v-else>, </span>
              </span>
            </div>
          </v-flex>

          <v-flex xs9 v-else-if="crit.tipo == 'CriterioJustificacaoLegal'">
            <div class="info-content" v-if="crit.legislacao.length > 0">
              {{ crit.notas }}
              <span v-for="(l, i) in crit.legislacao" :key="l.id">
                <a :href="'/legislacao/' + l.id">
                  {{ l.tipo }} {{ l.numero }}
                </a>
                <v-icon
                  color="red darken-2"
                  dark
                  small
                  @click="crit.legislacao.splice(i, 1)"
                  >remove_circle</v-icon
                >
                <span v-if="i == crit.legislacao.length - 1">.</span>
                <span v-else>, </span>
              </span>
            </div>
            <div class="info-content" v-if="crit.legislacao.length == 0">
              Sem legislação associada. Pode associar legislação na área de
              contexto.
            </div>
          </v-flex>

          <v-flex xs9 v-if="crit.tipo == 'CriterioJustificacaoDensidadeInfo'">
            <div class="info-content">
              <p v-if="crit.procRel.filter(p => p.relacao == 'eSinteseDe').length > 0">
                <span
                  >Informação pertinente não recuperável noutro PN. Sintetiza a
                  informação de:
                </span>
                <span
                  v-for="(p, i) in crit.procRel.filter(
                    p => p.relacao == 'eSinteseDe'
                  )"
                  :key="p.id"
                >
                  <a :href="'/classes/consultar/' + p.id">
                    {{ p.codigo }}: {{ p.titulo }}
                  </a>
                  <v-icon
                    color="red darken-2"
                    dark
                    small
                    @click="crit.procRel.splice(i, 1)"
                    >remove_circle</v-icon
                  >
                  <span v-if="i == crit.procRel.length - 1">.</span>
                  <span v-else>, </span>
                </span>
              </p>
              <p  v-if="crit.procRel.filter(p => p.relacao == 'eSintetizadoPor').length > 0">
                <span>Informação sintetizada em: </span>
                <span
                  v-for="(p, i) in crit.procRel.filter(
                    p => p.relacao == 'eSintetizadoPor'
                  )"
                  :key="p.id"
                >
                  <a :href="'/classes/consultar/' + p.id">
                    {{ p.codigo }}: {{ p.titulo }}
                  </a>
                  <v-icon
                    color="red darken-2"
                    dark
                    small
                    @click="crit.procRel.splice(i, 1)"
                    >remove_circle</v-icon
                  >
                  <span v-if="i == crit.procRel.length - 1">.</span>
                  <span v-else>, </span>
                </span>
              </p>
            </div>
          </v-flex>

          <hr style="border-top: 2px dotted green; width: 100%;" />
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";
import SelectValueFromList from "@/components/generic/SelectValueFromList.vue";

export default {
  props: ["c", "semaforos"],

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
      },

      textoCriterioLegal:
        'Prazo prescricional estabelecido em "diplomas selecionados no contexto de avaliação": '
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
      this.semaforos.critLegalAdicionadoDF = true;
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

<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE AVALIAÇÂO DA CLASSE -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>Contexto de Avaliação</div>
    </v-expansion-panel-header>
    <v-expansion-panel-content v-if="c.nivel == 3">
      <!-- TIPO DE PROCESSO -->
      <v-row>
        <v-col cols="2">
          <div class="info-label">Tipo de Processo:</div>
        </v-col>
        <v-col>
          <v-select
            item-text="label"
            item-value="value"
            v-model="c.tipoProc"
            :items="processoTipos"
            label="Selecione o tipo de processo:"
            solo
            dense
          />
        </v-col>
      </v-row>

      <!-- PROCESSO TRANVERSAL -->
      <v-row>
        <v-col cols="2">
          <div class="info-label">Processo Transversal:</div>
        </v-col>
        <v-col>
          <v-select
            item-text="label"
            item-value="value"
            v-model="c.procTrans"
            :items="simNao"
            label="Indique se o processo é transversal:"
            solo
            dense
          />
        </v-col>
      </v-row>

      <hr style="border: 3px solid indigo; border-radius: 2px;" />

      <!-- DONOS -->
      <DonosOps
        :entidades="c.donos"
        @unselectEntidade="unselectEntidade($event)"
      />

      <v-row>
        <v-col>
          <hr style="border-top: 1px dashed indigo;" />
        </v-col>
      </v-row>

      <DonosNew
        @newEntidade="newEntidade($event, c.donos)"
        :entidadesReady="semaforos.entidadesReady"
        :entidades="donos"
      />

      <v-snackbar
        v-model="erroEntidadeDuplicada"
        :color="'error'"
        :timeout="60000"
      >
        {{ mensagemEntidadeDuplicada }}
        <v-btn dark text @click="erroEntidadeDuplicada = false">Fechar</v-btn>
      </v-snackbar>

      <v-row>
        <v-col>
          <hr style="border-top: 1px dashed indigo;" />
        </v-col>
      </v-row>

      <DonosSelect
        :entidadesReady="semaforos.entidadesReady"
        :entidades="donos"
        @selectEntidade="selectEntidade($event)"
      />

      <hr style="border: 3px solid indigo; border-radius: 2px;" />

      <!-- PARTICIPANTES -->
      <div v-if="c.procTrans != 'N'">
        <ParticipantesOps
          :entidades="c.participantes"
          @unselectParticipante="unselectParticipante($event)"
        />

        <hr style="border-top: 1px dashed indigo;" />

        <ParticipantesNew
          @newEntidade="newEntidade($event, c.participantes)"
          :entidadesReady="semaforos.entidadesReady"
          :entidades="participantes"
        />

        <hr style="border-top: 1px dashed indigo;" />

        <ParticipantesSelect
          :entidadesReady="semaforos.entidadesReady"
          :entidades="participantes"
          @selectParticipante="selectParticipante($event)"
        />

        <v-snackbar
          v-model="erroIntervencaoIndefinida"
          :color="'error'"
          :timeout="60000"
        >
          {{ mensagemIntervencaoIndefinida }}
          <v-btn dark text @click="erroIntervencaoIndefinida = false"
            >Fechar</v-btn
          >
        </v-snackbar>

        <hr style="border: 3px solid indigo; border-radius: 2px;" />
      </div>

      <!-- PROCESSOS RELACIONADOS -->
      <ProcessosRelacionadosOps
        :processos="c.processosRelacionados"
        @unselectProcRel="unselectProcesso($event)"
      />

      <hr style="border-top: 1px dashed indigo;" />

      <ProcessosRelacionadosSelect
        :procReady="semaforos.classesReady"
        :processos="procRel"
        @selectProcesso="selectProcesso($event)"
      />

      <hr style="border: 3px solid indigo; border-radius: 2px;" />

      <!-- LEGISLAÇÂO -->
      <LegislacaoOps
        :legs="c.legislacao"
        @unselectDiploma="unselectDiploma($event)"
      />

      <v-row ma-2>
        <v-col>
          <hr style="border-top: 1px dashed #1A237E;" />
        </v-col>
      </v-row>

      <LegislacaoNew
        :legislacao="c.legislacao"
        @newLegislacao="newLegislacao($event, c.legislacao)"
      />

      <hr style="border-top: 1px dashed #1A237E;" />

      <LegislacaoSelect
        :legs="legs"
        :legislacaoReady="semaforos.legislacaoReady"
        @selectDiploma="selectDiploma($event)"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");

import DonosOps from "@/components/classes/criacao/DonosOps.vue";
import DonosNew from "@/components/classes/criacao/DonosNew.vue";
import DonosSelect from "@/components/classes/criacao/DonosSelect.vue";
import ParticipantesOps from "@/components/classes/criacao/ParticipantesOps.vue";
import ParticipantesNew from "@/components/classes/criacao/ParticipantesNew.vue";
import ParticipantesSelect from "@/components/classes/criacao/ParticipantesSelect.vue";
import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import ProcessosRelacionadosSelect from "@/components/classes/criacao/ProcessosRelacionadosSelect.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";
import LegislacaoNew from "@/components/classes/criacao/LegislacaoNew.vue";
import LegislacaoSelect from "@/components/classes/criacao/LegislacaoSelect.vue";

export default {
  props: ["c", "semaforos", "donos", "participantes", "procRel", "legs"],

  components: {
    DonosOps,
    DonosNew,
    DonosSelect,
    ParticipantesOps,
    ParticipantesNew,
    ParticipantesSelect,
    ProcessosRelacionadosOps,
    ProcessosRelacionadosSelect,
    LegislacaoOps,
    LegislacaoNew,
    LegislacaoSelect
  },

  data: () => {
    return {
      processoTipos: [
        { label: "Processo Comum", value: "PC" },
        { label: "Processo Específico", value: "PE" }
      ],

      erroEntidadeDuplicada: false,
      mensagemEntidadeDuplicada: "Entidade duplicada! Não será adicionada.",

      erroIntervencaoIndefinida: false,
      mensagemIntervencaoIndefinida:
        "Tem de selecionar uma intervanção para o participante!",

      simNao: [{ label: "Não", value: "N" }, { label: "Sim", value: "S" }],

      textoCriterioUtilidadeAdministrativa:
        "Prazo decorrente da necessidade de consulta para apuramento da " +
        "responsabilidade em sede de: ",
      textoCriterioComplementaridade: "É complementar de: ",
      textoCriterioDensidadeSinPor: "Informação sintetizada em: ",
      textoCriterioDensidadeSinDe:
        "Informação pertinente não recuperável noutro PN. Sintetiza a informação de: ",
      textoCriterioLegal:
        'Prazo prescricional estabelecido em "diplomas selecionados no contexto de avaliação": '
    };
  },

  methods: {
    unselectEntidade: function(entidade) {
      // Recoloca a entidade nos selecionáveis
      if (entidade.estado && entidade.estado != "Nova") {
        this.donos.push(entidade);
      } else if (!entidade.estado) {
        this.donos.push(entidade);
      }
      var index = this.c.donos.findIndex(e => e.id === entidade.id);
      this.c.donos.splice(index, 1);
    },

    selectEntidade: function(entidade) {
      this.c.donos.push(entidade);
      // Remove dos selecionáveis
      var index = this.donos.findIndex(e => e.id === entidade.id);
      this.donos.splice(index, 1);
    },

    newEntidade: function(entidade, lista) {
      var index = lista.findIndex(e => e.id === entidade.id);
      if (index == -1) lista.push(entidade);
      else this.erroEntidadeDuplicada = true;
    },

    newLegislacao: function(leg, lista) {
      lista.push(leg);
    },

    unselectParticipante: function(entidade) {
      entidade.intervencao = "Indefinido";
      // Recoloca a entidade nos selecionáveis
      this.participantes.push(entidade);
      var index = this.c.participantes.findIndex(e => e.id === entidade.id);
      this.c.participantes.splice(index, 1);
    },

    selectParticipante: function(entidade) {
      if (entidade.intervencao == "Indefinido")
        this.erroIntervencaoIndefinida = true;
      else {
        this.c.participantes.push(entidade);
      }
    },

    verificaCriteriosPCA: function(proc) {
      var i = 0,
        index = -1,
        j = 0;
      var criterios = [];
      // Sem subdivisão
      if (!this.c.temSubclasses4Nivel) {
        criterios = this.c.pca.justificacao;
        for (i = 0; i < criterios.length; i++) {
          if (
            criterios[i].tipo == "CriterioJustificacaoUtilidadeAdministrativa"
          ) {
            if (criterios[i].procRel.length > 0) {
              index = criterios[i].procRel.findIndex(p => p.id == proc.id);
              if (index != -1) {
                criterios[i].procRel.splice(index, 1);
                if (criterios[i].procRel.length == 0) {
                  criterios.splice(i, 1);
                }
              }
            }
          } else if (criterios[i].tipo == "CriterioJustificacaoLegal") {
            if (criterios[i].legislacao.length > 0) {
              index = criterios[i].legislacao.findIndex(p => p.id == proc.id);
              if (index != -1) {
                criterios[i].legislacao.splice(index, 1);
                if (criterios[i].legislacao.length == 0) {
                  criterios.splice(i, 1);
                  this.semaforos.critLegalAdicionadoPCA = false;
                }
              }
            }
          }
        }
      }
      // Com subdivisão
      else {
        for (j = 0; j < this.c.subclasses.length; j++) {
          criterios = this.c.subclasses[i].pca.justificacao;
          for (i = 0; i < criterios.length; i++) {
            if (
              criterios[i].tipo == "CriterioJustificacaoUtilidadeAdministrativa"
            ) {
              if (criterios[i].procRel.length > 0) {
                index = criterios[i].procRel.findIndex(p => p.id == proc.id);
                if (index != -1) {
                  criterios[i].procRel.splice(index, 1);
                  if (criterios[i].procRel.length == 0) {
                    criterios.splice(i, 1);
                  }
                }
              }
            } else if (criterios[i].tipo == "CriterioJustificacaoLegal") {
              if (criterios[i].legislacao.length > 0) {
                index = criterios[i].legislacao.findIndex(p => p.id == proc.id);
                if (index != -1) {
                  criterios[i].legislacao.splice(index, 1);
                  if (criterios[i].legislacao.length == 0) {
                    criterios.splice(i, 1);
                  }
                }
              }
            }
          }
        }
      }
    },

    verificaCriteriosDF: function(proc) {
      var criterios = [];
      var i, j, indexCriterio, indexProc;
      // Sem subdivisão
      if (!this.c.temSubclasses4Nivel) {
        criterios = this.c.df.justificacao;

        for (j = 0; j < criterios.length; j++) {
          if (criterios[j].tipo == "CriterioJustificacaoLegal") {
            if (criterios[j].legislacao.length > 0) {
              index = criterios[j].legislacao.findIndex(p => p.id == proc.id);
              if (index != -1) {
                criterios[j].legislacao.splice(index, 1);
                if (criterios[j].legislacao.length == 0) {
                  criterios.splice(i, 1);
                }
              }
            }
          }
        }

        if (proc.relacao == "eSinteseDe" || proc.relacao == "eSintetizadoPor") {
          indexCriterio = criterios.findIndex(
            c => c.tipo == "CriterioJustificacaoDensidadeInfo"
          );
          if (indexCriterio != -1) {
            indexProc = criterios[indexCriterio].procRel.findIndex(
              p => p.id == proc.id
            );
            criterios[indexCriterio].procRel.splice(indexProc, 1);
            if (criterios[indexCriterio].procRel.length == 0) {
              criterios.splice(indexCriterio, 1);
            }
          }
        }
        if (proc.relacao == "eComplementarDe") {
          indexCriterio = criterios.findIndex(
            c => c.tipo == "CriterioJustificacaoComplementaridadeInfo"
          );
          if (indexCriterio != -1) {
            indexProc = criterios[indexCriterio].procRel.findIndex(
              p => p.id == proc.id
            );
            criterios[indexCriterio].procRel.splice(indexProc, 1);
            if (criterios[indexCriterio].procRel.length == 0) {
              criterios.splice(indexCriterio, 1);
            }
          }
        }
      }
      // Com subdivisão
      else {
        for (j = 0; j < this.c.subclasses.length; j++) {
          criterios = this.c.subclasses[j].df.justificacao;

          for (i = 0; i < criterios.length; i++) {
            if (criterios[i].tipo == "CriterioJustificacaoLegal") {
              if (criterios[i].legislacao.length > 0) {
                index = criterios[i].legislacao.findIndex(p => p.id == proc.id);
                if (index != -1) {
                  criterios[i].legislacao.splice(index, 1);
                  if (criterios[i].legislacao.length == 0) {
                    criterios.splice(i, 1);
                  }
                }
              }
            }
          }

          if (
            proc.relacao == "eSinteseDe" ||
            proc.relacao == "eSintetizadoPor"
          ) {
            indexCriterio = criterios.findIndex(
              c => c.tipo == "CriterioJustificacaoDensidadeInfo"
            );
            if (indexCriterio != -1) {
              indexProc = criterios[indexCriterio].procRel.findIndex(
                p => p.id == proc.id
              );
              criterios[indexCriterio].procRel.splice(indexProc, 1);
              if (criterios[indexCriterio].procRel.length == 0) {
                criterios.splice(indexCriterio, 1);
              }
            }
          }
          if (proc.relacao == "eComplementarDe") {
            indexCriterio = criterios.findIndex(
              c => c.tipo == "CriterioJustificacaoComplementaridadeInfo"
            );
            if (indexCriterio != -1) {
              indexProc = criterios[indexCriterio].procRel.findIndex(
                p => p.id == proc.id
              );
              criterios[indexCriterio].procRel.splice(indexProc, 1);
              if (criterios[indexCriterio].procRel.length == 0) {
                criterios.splice(indexCriterio, 1);
              }
            }
          }
        }
      }
    },

    unselectProcesso: function(proc) {
      proc.idRel = "Indefinido";
      this.procRel.push(proc);
      var index = this.c.processosRelacionados.findIndex(p => p.id === proc.id);
      this.c.processosRelacionados.splice(index, 1);

      // Remover os critérios quando já não há relações que os suportem
      this.verificaCriteriosPCA(proc);
      this.verificaCriteriosDF(proc);
    },

    selectProcesso: function(proc) {
      this.c.processosRelacionados.push(proc);
      for (var i = 0; i < this.c.subclasses.length; i++) {
        this.c.subclasses[i].processosRelacionados.push(proc);
      }
      this.c.df.valor = this.calcDF(this.c.processosRelacionados);

      if (!this.c.temSubclasses4Nivel) {
        // Tratamento do invariante: se é Suplemento Para então cria-se um critério de Utilidade Administrativa
        if (proc.relacao == "eSuplementoPara") {
          this.adicionarCriterioUA(
            this.c.pca.justificacao,
            "CriterioJustificacaoUtilidadeAdministrativa",
            "Critério de Utilidade Administrativa",
            this.textoCriterioUtilidadeAdministrativa,
            proc
          );
        }
        // Tratamento do invariante: se é Suplemento De então cria-se um critério Legal com toda a legislação selecionada associada
        else if (proc.relacao == "eSuplementoDe") {
          this.adicionarCriterio(
            this.c.pca.justificacao,
            "CriterioJustificacaoLegal",
            "Critério Legal",
            this.textoCriterioLegal,
            [proc],
            this.c.legislacao
          );
          this.semaforos.critLegalAdicionadoPCA = true;
        }
        // Tratamento do invariante: se é Síntese De então cria-se um critério de Densidade Informacional
        else if (proc.relacao == "eSinteseDe") {
          this.adicionarCriterio(
            this.c.df.justificacao,
            "CriterioJustificacaoDensidadeInfo",
            "Critério de Densidade Informacional",
            this.textoCriterioDensidadeSinDe,
            [proc],
            []
          );
        }
        // Tratamento do invariante: se é Síntetizado Por então cria-se um critério de Densidade Informacional
        else if (proc.relacao == "eSintetizadoPor") {
          this.adicionarCriterio(
            this.c.df.justificacao,
            "CriterioJustificacaoDensidadeInfo",
            "Critério de Densidade Informacional",
            this.textoCriterioDensidadeSinPor,
            [proc],
            []
          );
        }
        // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
        else if (proc.relacao == "eComplementarDe") {
          this.adicionarCriterio(
            this.c.df.justificacao,
            "CriterioJustificacaoComplementaridadeInfo",
            "Critério de Complementaridade Informacional",
            this.textoCriterioComplementaridade,
            [proc],
            []
          );
        }
      } else {
        // Tratamento do invariante: se é Suplemento Para
        // então cria-se um critério de Utilidade Administrativa para todas as subclasses
        if (proc.relacao == "eSuplementoPara") {
          for (i = 0; i < this.c.subclasses.length; i++) {
            this.adicionarCriterio(
              this.c.subclasses[i].pca.justificacao,
              "CriterioJustificacaoUtilidadeAdministrativa",
              "Critério de Utilidade Administrativa",
              this.textoCriterioUtilidadeAdministrativa,
              [proc],
              []
            );
          }
        }
        // Tratamento do invariante: se é Suplemento De então
        // cria-se um critério Legal com toda a legislação selecionada associada para todas as subclasses
        else if (proc.relacao == "eSuplementoDe") {
          for (i = 0; i < this.c.subclasses.length; i++) {
            this.adicionarCriterio(
              this.c.subclasses[i].pca.justificacao,
              "CriterioJustificacaoLegal",
              "Critério Legal",
              this.textoCriterioLegal,
              [proc],
              this.c.legislacao
            );
            this.semaforos.critLegalAdicionadoPCA = true;
          }
        }
        // Tratamento do invariante: se é Síntese De então
        // cria-se um critério de Densidade Informacional para todas as subclasses
        else if (proc.relacao == "eSinteseDe") {
          for (i = 0; i < this.c.subclasses.length; i++) {
            this.adicionarCriterio(
              this.c.subclasses[i].df.justificacao,
              "CriterioJustificacaoDensidadeInfo",
              "Critério de Densidade Informacional",
              this.textoCriterioDensidadeSinDe,
              [proc],
              []
            );
          }
        }
        // Tratamento do invariante: se é Síntetizado Por então
        // cria-se um critério de Densidade Informacional
        else if (proc.relacao == "eSintetizadoPor") {
          for (i = 0; i < this.c.subclasses.length; i++) {
            this.adicionarCriterio(
              this.c.subclasses[i].df.justificacao,
              "CriterioJustificacaoDensidadeInfo",
              "Critério de Densidade Informacional",
              this.textoCriterioDensidadeSinPor,
              [proc],
              []
            );
          }
        }
        // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
        else if (proc.relacao == "eComplementarDe") {
          for (i = 0; i < this.c.subclasses.length; i++) {
            this.adicionarCriterio(
              this.c.subclasses[i].df.justificacao,
              "CriterioJustificacaoComplementaridadeInfo",
              "Critério de Complementaridade Informacional",
              this.textoCriterioComplementaridade,
              [proc],
              []
            );
          }
        }
        // No fim, recalcula-se o DF para todas as subclasses se a sbdivisão não for DF distinto
        if (!this.c.temSubclasses4NivelDF) {
          for (i = 0; i < this.c.subclasses.length; i++) {
            this.c.subclasses[i].df.valor = this.calcDF(
              this.c.subclasses[i].processosRelacionados
            );
          }
        }
      }
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

    selectDiploma: function(leg) {
      this.c.legislacao.push(leg);
      // Remove dos selecionáveis
      var index = this.legs.findIndex(l => l.id === leg.id);
      this.legs.splice(index, 1);
    },

    unselectDiploma: function(diploma) {
      // Recoloca o diploma nos selecionáveis
      this.legs.push(diploma);
      var index = this.c.legislacao.findIndex(e => e.id === diploma.id);
      this.c.legislacao.splice(index, 1);

      // Remover os critérios quando já não há relações que os suportem
      this.verificaCriteriosPCA(diploma);
      this.verificaCriteriosDF(diploma);
    },

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

    adicionarCriterioUA: function(justificacao, tipo, label, notas, proc) {
      let myProc = JSON.parse(JSON.stringify(proc));
      // Verifica-se se o critério já existe
      var indice = justificacao.findIndex(crit => crit.tipo === tipo);
      if (indice == -1) {
        // Não existe
        justificacao.push({
          tipo: tipo,
          label: label,
          notas: notas, //this.procNotas(notas, [myProc]),
          procRel: [myProc]
        });
      } else {
        // Existe
        justificacao[indice].procRel.push(myProc);
        //justificacao[indice].notas = this.procNotas(notas, justificacao[indice].procRel)
      }
    },

    procNotas: function(notas, procRel) {
      var myNotas = notas;
      for (var i = 0; i < procRel.length; i++) {
        myNotas += "[" + procRel[i].id + "]";
        if (i == procRel.length - 1) myNotas += ", ";
        else myNotas += ".";
      }
      return myNotas;
    }
  }
};
</script>
<style>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>

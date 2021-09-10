<template>
  <!-- PCA -->
  <v-card class="ma-2">
    <v-card-title class="clav-linear-background white--text"
      >Prazo de Conservação Administrativa</v-card-title
    >
    <v-card-text class="pa-2">
      <Campo
        nome="Prazo"
        infoHeader="Prazo"
        :infoBody="myhelp.Classe.Campos.Prazo"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            v-model="c.pca.valor"
            label="Prazo em anos: 0 a 199"
            v-mask="'###'"
            solo
            clearable
            dense
            hide-details
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Notas"
        infoHeader="Notas"
        :infoBody="myhelp.Classe.Campos.Notas"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-textarea
            solo
            label="Notas ao PCA"
            v-model="c.pca.notas"
            rows="2"
            dense
            hide-details
          ></v-textarea>
        </template>
      </Campo>

      <Campo
        v-if="semaforos.pcaFormasContagemReady"
        nome="Forma de Contagem"
        infoHeader="Forma de Contagem"
        :infoBody="myhelp.Classe.Campos.FormaContagem"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-select
            item-text="label"
            item-value="value"
            v-model="c.pca.formaContagem"
            :items="pcaFormasContagem"
            label="Selecione uma forma de contagem para o prazo"
            solo
            dense
            hide-details
          />
        </template>
      </Campo>

      <Campo
        v-if="
          semaforos.pcaSubFormasContagemReady &&
          c.pca.formaContagem == 'vc_pcaFormaContagem_disposicaoLegal'
        "
        nome="Subforma de contagem"
        infoHeader="Subforma de contagem"
        :infoBody="myhelp.Classe.Campos.SubformaContagem"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-select
            item-text="label"
            item-value="value"
            v-model="c.pca.subFormaContagem"
            :items="pcaSubFormasContagem"
            label="Selecione uma subforma de contagem para o prazo"
            solo
            dense
            hide-details
          >
            <template v-slot:selection="{ item }">
              <p>{{ item.label }}</p>
            </template>

            <template v-slot:item="{ item }">
              <p>{{ item.label }}</p>
            </template>
          </v-select>
        </template>
      </Campo>

      <hr style="border-top: 1px dashed #1a237e" />

      <!-- JUSTIFICAÇÂO DO PCA -->
      <Campo
        nome="Justificação do PCA"
        infoHeader="Justificação do PCA"
        :infoBody="myhelp.Classe.Campos.JustificacaoPCA"
        color="neutralpurple"
      >
        <template v-slot:lateral>
          <v-row>
            <v-col align="right">
              <v-btn
                color="primary"
                class="white-text my-2"
                rounded
                @click="
                  adicionarCriterioGestionario(
                    c.pca.justificacao,
                    'CriterioJustificacaoGestionario',
                    'Critério Gestionário',
                    textoCriterioGestionario,
                    [],
                    []
                  )
                "
                v-if="!c.semaforos.critGestionarioAdicionado"
                >Critério Gestionário
                <v-icon dark right>add_circle_outline</v-icon>
              </v-btn>

              <v-btn
                color="primary"
                class="white-text my-2"
                rounded
                @click="
                  adicionarCriterioLegalPCA(
                    c.pca.justificacao,
                    'CriterioJustificacaoLegal',
                    'Critério Legal',
                    '',
                    [],
                    c.legislacao
                  )
                "
                v-if="!c.semaforos.critLegalAdicionadoPCA"
              >
                Critério Legal
                <v-icon dark right>add_circle_outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template v-slot:conteudo>
          <div v-if="c.pca.justificacao.length">
            <Campo
              v-for="(crit, cindex) in c.pca.justificacao"
              :key="cindex"
              :nome="crit.label"
              color="neutralpurple"
            >
              <template v-slot:lateral>
                <v-row>
                  <v-col align="center">
                    <v-icon
                      color="error"
                      @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')"
                      >remove_circle</v-icon
                    >
                  </v-col>
                </v-row>
              </template>
              <template v-slot:conteudo>
                <!-- Se existir um critério de Utilidade Administrativa ........................-->

                <div v-if="crit.tipo == 'CriterioJustificacaoUtilidadeAdministrativa'">
                  <v-textarea
                    auto-grow
                    clearable
                    single-line
                    rows="1"
                    :value="crit.notas"
                    v-model="crit.notas"
                  ></v-textarea>
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
                <!-- Se existir um critério Legal ..............................................-->
                <div v-else-if="crit.tipo == 'CriterioJustificacaoLegal'">
                  <div v-if="crit.legislacao.length > 0">
                    <v-textarea
                      auto-grow
                      clearable
                      single-line
                      rows="1"
                      :value="crit.notas"
                      v-model="crit.notas"
                    ></v-textarea>
                    <span v-for="(l, i) in crit.legislacao" :key="l.id">
                      <a :href="'/legislacao/' + l.id"> {{ l.tipo }} {{ l.numero }} </a>
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
                  <div v-if="crit.legislacao.length == 0">
                    Sem legislação associada. Pode associar legislação na área de
                    contexto.
                  </div>
                </div>
                <!-- Se existir um critério Gestionário ..........................................-->
                <v-textarea
                  v-else
                  auto-grow
                  clearable
                  single-line
                  rows="1"
                  :value="crit.notas"
                  v-model="crit.notas"
                ></v-textarea>
              </template>
            </Campo>
          </div>
          <v-alert v-else border="left" type="warning">
            Nenhum critério selecionado!
          </v-alert>
        </template>
      </Campo>
    </v-card-text>
  </v-card>
</template>

<script>
const help = require("@/config/help").help;

import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";
import Campo from "@/components/generic/Campo";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    //ProcessosRelacionadosOps,
    //LegislacaoOps,
    Campo,
  },

  data: function () {
    return {
      myhelp: help,
      textoCriterioGestionario:
        "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de" +
        " escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para" +
        " a definição do prazo o tempo do mandato de maior duração: 5 anos.",
    };
  },

  methods: {
    // Adiciona um critério à lista de critérios do PCA ou do DF....................
    adicionarCriterio: function (justificacao, tipo, label, notas, procRel, legislacao) {
      let myProcRel = JSON.parse(JSON.stringify(procRel));
      let myLeg = JSON.parse(JSON.stringify(legislacao));

      var indice = justificacao.findIndex((crit) => crit.tipo === tipo);
      if (indice == -1) {
        justificacao.push({
          tipo: tipo,
          label: label,
          notas: notas,
          procRel: myProcRel,
          legislacao: myLeg,
        });
      } else {
        justificacao[indice].procRel = justificacao[indice].procRel.concat(myProcRel);
        justificacao[indice].legislacao = justificacao[indice].legislacao.concat(myLeg);
      }
    },

    adicionarCriterioLegalPCA: function (
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
      this.c.semaforos.critLegalAdicionadoPCA = true;
    },

    adicionarCriterioGestionario: function (
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
      this.c.semaforos.critGestionarioAdicionado = true;
    },

    // Remove um critério completo duma vez
    removerCriterioTodo: function (justificacao, i, PCAouDF) {
      this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
      justificacao.splice(i, 1);
    },

    // Atualiza as flags que controlam os botões de adicionar e remover critérios
    atualizaFlagsCriterios(tipo, PCAouDF) {
      if (tipo == "CriterioJustificacaoLegal") {
        if (PCAouDF == "PCA") this.c.semaforos.critLegalAdicionadoPCA = false;
        else this.c.semaforos.critLegalAdicionadoDF = false;
      } else if (tipo == "CriterioJustificacaoGestionario") {
        this.c.semaforos.critGestionarioAdicionado = false;
      }
    },

    unselectProcesso: function (proc, listaProc) {
      var index = listaProc.findIndex((p) => p.id === proc.id);
      listaProc.splice(index, 1);
    },

    unselectDiploma: function (diploma, listaLeg) {
      var index = listaLeg.findIndex((e) => e.id === diploma.id);
      listaLeg.splice(index, 1);
      if (listaLeg.length == 0) {
        this.semaforos.critLegalAdicionadoPCA = false;
      }
    },
  },
};
</script>
<style></style>

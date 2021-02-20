<template>
  <v-card flat class="pa-3">
    <v-row>
      <!-- MENU LATERAL -->
      <v-col cols="12" order="2" sm="3" order-sm="0" md="3" lg="3">
        <ClassesArvoreLateral :classeId="idc.split('c')[1]" />
      </v-col>
      <v-col cols="12" sm="9" md="9" lg="9">
        <!-- HEADER -->
        <v-row align="center">
          <v-col cols="12" md="3" align="center">
            <Voltar />
          </v-col>
          <v-col cols="12" md="9">
            <p class="clav-content-title-2 pa-5">
              {{ this.classe.codigo }}: {{ this.classe.titulo }}
            </p>
          </v-col>
        </v-row>

        <!-- DESCENDÊNCIA -->
        <v-card v-if="classeLoaded" flat>
          <ClassesFilho :subclasses="classe.filhos" v-if="classe.filhos.length > 0" />

          <v-expansion-panels flat>
            <!-- DESCRITIVO DA CLASSE -->
            <PainelCLAV
              titulo="Descritivo da Classe"
              infoHeader="Descritivo da Classe"
              :infoBody="myhelp.Classe.BlocoDescritivo"
            >
              <template v-slot:icon>
                <unicon
                  name="descricao-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 20.71 23.668"
                  fill="#ffffff"
                />
              </template>

              <template v-slot:conteudo>
                <v-row
                  :class="{
                    'mt-10': $vuetify.breakpoint.smAndDown,
                    'mt-8': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- ESTADO -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">Estado</div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div
                      class="info-content pa-4"
                      v-if="classe.status == 'A'"
                      style="color: #46c354 !important"
                    >
                      Ativa
                    </div>
                    <div
                      class="info-content pa-4"
                      v-else-if="classe.status == 'H'"
                      style="color: #dfb83a !important"
                    >
                      Em revisão...
                    </div>
                    <div
                      class="info-content pa-4"
                      v-else
                      style="color: #f44336 !important"
                    >
                      Inativa
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- DESCRIÇÂO -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Descrição
                      <InfoBox
                        header="Descrição"
                        :text="myhelp.Classe.Campos.Descricao"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">
                      {{ classe.descricao }}
                    </div>
                  </v-col>
                </v-row>

                <NotasAp :notas="classe.notasAp" v-if="classe.notasAp.length > 0" />

                <ExemplosNotasAp
                  :exemplos="classe.exemplosNotasAp"
                  v-if="classe.exemplosNotasAp.length > 0"
                />

                <NotasEx :notas="classe.notasEx" v-if="classe.notasEx.length > 0" />

                <TermosIndice
                  :termos="classe.termosInd"
                  v-if="classe.termosInd.length > 0"
                />
              </template>
            </PainelCLAV>

            <PainelCLAV
              v-if="classe.nivel == 3"
              titulo="Contexto de Avaliação"
              infoHeader="Contexto de Avaliação"
              :infoBody="myhelp.Classe.BlocoContexto"
            >
              <template v-slot:icon>
                <unicon
                  name="folder-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 20.71 23.668"
                  fill="#ffffff"
                />
              </template>
              <template v-slot:conteudo>
                <v-row>
                  <!-- TIPO DE PROCESSO -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Tipo de Processo
                      <InfoBox
                        header="Tipo de Processo"
                        :text="myhelp.Classe.Campos.TipoProcesso"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">{{ classe.tipoProc }}</div>
                  </v-col>
                </v-row>

                <v-row>
                  <!-- TRANSVERSALIDADE -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Processo Transversal
                      <InfoBox
                        header="Processo Transversal"
                        :text="myhelp.Classe.Campos.ProcessoTransversal"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">
                      {{ classe.procTrans == "S" ? "Sim" : "Não" }}
                    </div>
                  </v-col>
                </v-row>

                <Donos :entidades="classe.donos" v-if="classe.donos.length > 0" />

                <Participantes
                  :entidades="classe.participantes"
                  v-if="classe.participantes.length > 0"
                />

                <ProcessosRelacionados
                  :processos="classe.processosRelacionados"
                  v-if="classe.processosRelacionados.length > 0"
                />

                <Legislacao
                  :legs="classe.legislacao"
                  v-if="classe.legislacao.length > 0"
                />
              </template>
            </PainelCLAV>

            <!-- CONTEXTO DA CLASSE -->
            <PainelCLAV
              v-if="(classe.nivel == 3 && classe.filhos.length == 0) || classe.nivel == 4"
              titulo="Decisões de Avaliação"
              infoHeader="Decisões de Avaliação"
              :infoBody="myhelp.Classe.BlocoContexto"
            >
              <template v-slot:icon>
                <unicon
                  name="decisao-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 20.71 23.668"
                  fill="#ffffff"
                />
              </template>
              <template v-slot:conteudo>
                <v-row>
                  <v-col>
                    <v-toolbar
                      color="#083581"
                      class="caption mt-5"
                      dark
                      height="45"
                      style="border-radius: 6px"
                    >
                      <v-toolbar-title
                        :class="{
                          'mx-auto': $vuetify.breakpoint.smAndDown,
                          'mx-0': $vuetify.breakpoint.mdAndUp,
                        }"
                      >
                        Prazo de Conservação Administrativa
                      </v-toolbar-title>
                    </v-toolbar>
                  </v-col>
                </v-row>

                <v-row
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- PRAZO -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Prazo
                      <InfoBox
                        header="Prazo"
                        :text="myhelp.Classe.Campos.Prazo"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4" v-if="classe.pca.valores > 1">
                      {{ classe.pca.valores + " anos" }}
                    </div>
                    <div class="info-content pa-4" v-else-if="classe.pca.valores == 1">
                      {{ classe.pca.valores + " ano" }}
                    </div>
                    <div class="info-content pa-4" v-else-if="classe.pca.notas != ''">
                      Não especificado
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="classe.pca.notas != ''"
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- NOTAS -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Notas
                      <InfoBox
                        header="Notas ao PCA"
                        :text="myhelp.Classe.Campos.Notas"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">
                      {{ classe.pca.notas }}
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="classe.pca.formaContagem"
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- FORMA DE CONTAGEM -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Forma de Contagem
                      <InfoBox
                        header="Forma de Contagem"
                        :text="myhelp.Classe.Campos.FormaContagem"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">
                      {{ classe.pca.formaContagem }}
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="classe.pca.subFormaContagem"
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- SUBFORMA DE CONTAGEM -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Subforma de Contagem
                      <InfoBox
                        header="Subforma de Contagem"
                        :text="myhelp.Classe.Campos.SubformaContagem"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">
                      {{ classe.pca.subFormaContagem }}
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="classe.pca.justificacao"
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- JUSTIFICAÇÂO -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Justificação
                      <InfoBox
                        header="Justificação do PCA"
                        :text="myhelp.Classe.Campos.JustificacaoPCA"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4" style="min-height: 61px">
                      <div v-for="c in classe.pca.justificacao" :key="c.tipoId">
                        <!-- Critério Gestionário ...............................-->
                        <v-row v-if="c.tipoId == 'CriterioJustificacaoGestionario'">
                          <v-col cols="3" class="pt-0">
                            <div class="sub-info-label">Critério Gestionário</div>
                          </v-col>
                          <v-col cols="9" class="pt-0">
                            <div>
                              {{
                                /* texto normalizado:
                                  mylabels.textoCriterioJustificacaoGestionario
                                  texto proveniente da FRD: */
                                c.conteudo
                              }}
                            </div>
                          </v-col>
                        </v-row>

                        <!-- Critério Utilidade Administrativa .................-->
                        <v-row
                          v-if="c.tipoId == 'CriterioJustificacaoUtilidadeAdministrativa'"
                        >
                          <v-col cols="3" class="pt-0">
                            <div class="sub-info-label">
                              Critério de Utilidade Administrativa
                            </div>
                          </v-col>
                          <v-col cols="9" class="pt-0">
                            <div>
                              {{ c.conteudo }}
                              <br />
                              <br />
                              <ul>
                                <li v-for="p in c.processos" :key="p.procId">
                                  <a :href="'/classes/consultar/' + p.procId">
                                    {{ p.procId.split("c")[1] }} -
                                    {{ p.nome }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </v-col>
                        </v-row>

                        <!-- Critério Legal ...................................-->
                        <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                          <v-col cols="3" class="pt-0">
                            <div class="sub-info-label">Critério Legal</div>
                          </v-col>
                          <v-col cols="9" class="pt-0">
                            <div>
                              {{ c.conteudo }}
                              <br />
                              <br />
                              <ul>
                                <li v-for="l in c.legislacao" :key="l.legId">
                                  <a :href="'/legislacao/' + l.legId">
                                    {{ l.tipo }} {{ l.numero }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- DESTINO FINAL ................................................... -->

                <v-row>
                  <v-col>
                    <v-toolbar
                      color="#083581"
                      class="caption mt-5"
                      dark
                      height="45"
                      style="border-radius: 6px"
                    >
                      <v-toolbar-title
                        :class="{
                          'mx-auto': $vuetify.breakpoint.smAndDown,
                          'mx-0': $vuetify.breakpoint.mdAndUp,
                        }"
                        >Destino Final</v-toolbar-title
                      >
                    </v-toolbar>
                  </v-col>
                </v-row>

                <v-row
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- VALOR -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Destino Final
                      <InfoBox
                        header="Destino Final"
                        :text="myhelp.Classe.Campos.DF"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">
                      <span v-if="classe.df.valor == 'E'">Eliminação</span>
                      <span v-else-if="classe.df.valor == 'C'"> Conservação </span>
                      <span v-else-if="classe.df.valor == 'CP'">
                        Conservação Parcial
                      </span>
                      <span v-else-if="classe.df.nota != ''">Não Especificado</span>
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="classe.df.nota"
                  ::class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
                >
                  <!-- NOTA ao DF -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Nota
                      <InfoBox
                        header="Nota ao DF"
                        :text="myhelp.Classe.Campos.NotasDF"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4">{{ classe.df.nota }}</div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="classe.df.justificacao"
                  :class="{
                    'mt-5': $vuetify.breakpoint.smAndDown,
                    'mt-4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <!-- JUSTIFICAÇÂO -->
                  <v-col cols="12" lg="2">
                    <div class="info-label">
                      Justificação
                      <InfoBox
                        header="Justificação do DF"
                        :text="myhelp.Classe.Campos.JustificacaoDF"
                        helpColor="info"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" lg="10">
                    <div class="info-content pa-4" style="min-height: 61px">
                      <div v-for="c in classe.df.justificacao" :key="c.tipoId">
                        <!-- Critério Legal ...................................-->
                        <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                          <v-col cols="3" class="pt-0">
                            <div class="sub-info-label">Critério Legal</div>
                          </v-col>
                          <v-col cols="9" class="pt-0">
                            <div>
                              {{ c.conteudo }}
                              <br />
                              <br />
                              <ul>
                                <li v-for="l in c.legislacao" :key="l.legId">
                                  <a :href="'/legislacao/' + l.legId">
                                    {{ l.tipo }} {{ l.numero }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </v-col>
                        </v-row>

                        <!-- Critério de Densidade Informacional ..............-->
                        <v-row v-if="c.tipoId == 'CriterioJustificacaoDensidadeInfo'">
                          <v-col cols="3" class="pt-0">
                            <div class="sub-info-label">
                              Critério de Densidade Informacional
                            </div>
                          </v-col>
                          <v-col cols="9" class="pt-0">
                            <div>
                              {{
                                /* texto normalizado:
                                  mylabels.textoCriterioDensidadeInfo
                                  texto proveniente da FRD: */
                                c.conteudo
                              }}
                              <br />
                              <br />
                              <ul>
                                <li v-for="p in c.processos" :key="p.procId">
                                  <a :href="'/classes/consultar/' + p.procId">
                                    {{ p.procId.split("c")[1] }} -
                                    {{ p.nome }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </v-col>
                        </v-row>

                        <!-- Critério de Complementaridade Informacional ..............-->
                        <v-row
                          v-if="c.tipoId == 'CriterioJustificacaoComplementaridadeInfo'"
                        >
                          <v-col cols="3" class="pt-0">
                            <div class="sub-info-label">
                              Critério de Complementaridade Informacional
                            </div>
                          </v-col>
                          <v-col cols="9" class="pt-0">
                            <div>
                              {{
                                /* texto normalizado:
                                  mylabels.textoCriterioComplementaridade
                                  texto proveniente da FRD: */
                                c.conteudo
                              }}
                              <br />
                              <br />
                              <ul>
                                <li v-for="p in c.processos" :key="p.procId">
                                  <a :href="'/classes/consultar/' + p.procId">
                                    {{ p.procId.split("c")[1] }} -
                                    {{ p.nome }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </PainelCLAV>
          </v-expansion-panels>
        </v-card>

        <p v-else>A carregar...</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import ClassesFilho from "@/components/classes/consulta/ClassesFilho.vue";
import NotasAp from "@/components/classes/consulta/NotasAp.vue";
import NotasEx from "@/components/classes/consulta/NotasEx.vue";
import ExemplosNotasAp from "@/components/classes/consulta/ExemplosNotasAp.vue";
import TermosIndice from "@/components/classes/consulta/TermosIndice.vue";
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";
import ClassesArvoreLateral from "@/components/classes/ClassesArvoreLateral.vue";
import Voltar from "@/components/generic/Voltar.vue";

import InfoBox from "@/components/generic/infoBox.vue";
import PainelCLAV from "@/components/generic/PainelCLAV";

export default {
  props: ["idc", "savedSearch"],
  data: () => ({
    classe: {},
    classeLoaded: false,

    filhosHeaders: [
      {
        text: "Código",
        align: "left",
        sortable: false,
        value: "codigo",
      },
      {
        text: "Título",
        value: "titulo",
      },
    ],
    myhelp: require("@/config/help").help,
    mylabels: require("@/config/labels").criterios,
  }),

  components: {
    InfoBox,
    ClassesFilho,
    NotasAp,
    NotasEx,
    ExemplosNotasAp,
    TermosIndice,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao,
    ClassesArvoreLateral,
    Voltar,
    PainelCLAV,
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/classes/consultar/c" + idClasse);
    },
  },
  mounted: function () {
    this.$request("get", "/classes/" + this.idc)
      .then(async (response) => {
        this.classe = response.data;
        if (this.classe.df.justificacao) {
          for (let i = 0; i < this.classe.df.justificacao.length; i++) {
            if (this.classe.df.justificacao[i].processos) {
              for (let j = 0; j < this.classe.df.justificacao[i].processos.length; j++) {
                let help =
                  "/classes/" +
                  this.classe.df.justificacao[i].processos[j].procId +
                  "/meta";

                await this.$request("get", help).then((response) => {
                  this.classe.df.justificacao[i].processos[j].nome = response.data.titulo;
                });
              }
            }

            if (this.classe.df.justificacao[i].legislacao) {
              for (let j = 0; j < this.classe.df.justificacao[i].legislacao.length; j++) {
                await this.$request(
                  "get",
                  "/legislacao/" + this.classe.df.justificacao[i].legislacao[j].legId
                ).then((response) => {
                  this.classe.df.justificacao[i].legislacao[j].tipo = response.data.tipo;
                  this.classe.df.justificacao[i].legislacao[j].numero =
                    response.data.numero;
                });
              }
            }
          }
        }
        if (this.classe.pca.justificacao) {
          for (let h = 0; h < this.classe.pca.justificacao.length; h++) {
            if (this.classe.pca.justificacao[h].processos) {
              for (let z = 0; z < this.classe.pca.justificacao[h].processos.length; z++) {
                if (this.classe.pca.justificacao[h].processos[z].procId) {
                  await this.$request(
                    "get",
                    "/classes/" +
                      this.classe.pca.justificacao[h].processos[z].procId +
                      "/meta"
                  ).then((response) => {
                    this.classe.pca.justificacao[h].processos[z].nome =
                      response.data.titulo;
                  });
                }
              }
            }

            if (this.classe.pca.justificacao[h].legislacao) {
              for (
                let z = 0;
                z < this.classe.pca.justificacao[h].legislacao.length;
                z++
              ) {
                await this.$request(
                  "get",
                  "/legislacao/" + this.classe.pca.justificacao[h].legislacao[z].legId
                ).then((response) => {
                  this.classe.pca.justificacao[h].legislacao[z].tipo = response.data.tipo;
                  this.classe.pca.justificacao[h].legislacao[z].numero =
                    response.data.numero;
                });
              }
            }
          }
        }
        this.classeLoaded = true;
      })
      .catch((error) => {
        return error;
      });
  },
};
</script>

<style scoped>
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

.sub-info-label {
  color: #1976d2;
  font-weight: bold;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}

.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}

#expanded-content {
  margin-right: 12px !important;
  margin-left: 17px !important;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>

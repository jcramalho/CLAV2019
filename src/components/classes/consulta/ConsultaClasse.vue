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
                <Campo nome="Estado" infoHeader="Estado" color="neutralpurple">
                  <template v-slot:conteudo>
                    <div v-if="classe.status == 'A'" style="color: #46c354 !important">
                      Ativa
                    </div>
                    <div
                      v-else-if="classe.status == 'H'"
                      style="color: #dfb83a !important"
                    >
                      Em revisão...
                    </div>
                    <div v-else style="color: #f44336 !important">Inativa</div>
                  </template>
                </Campo>

                <Campo
                  nome="Descrição"
                  infoHeader="Descrição"
                  :infoBody="myhelp.Classe.Campos.Descricao"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.descricao }}
                  </template>
                </Campo>

                <Campo
                  v-if="classe.notasAp.length > 0"
                  nome="Notas de Aplicação"
                  infoHeader="Notas de Aplicação"
                  :infoBody="myhelp.Classe.Campos.NotasAp"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <ul>
                      <li v-for="n in classe.notasAp" :key="n.idNota">
                        {{ n.nota }}
                      </li>
                    </ul>
                  </template>
                </Campo>

                <Campo
                  v-if="classe.exemplosNotasAp.length > 0"
                  nome="Exemplos de Notas de Aplicação"
                  infoHeader="Exemplos de Notas de Aplicação"
                  :infoBody="myhelp.Classe.Campos.ExemplosNotasAp"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <ul>
                      <li v-for="n in classe.exemplosNotasAp" :key="n.idNota">
                        {{ n.exemplo }}
                      </li>
                    </ul>
                  </template>
                </Campo>

                <Campo
                  v-if="classe.notasEx.length > 0"
                  nome="Notas de Exclusão"
                  infoHeader="Notas de Exclusão"
                  :infoBody="myhelp.Classe.Campos.NotasEx"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <ul>
                      <li
                        v-for="n in classe.notasEx"
                        :key="n.idNota"
                        v-html="analisaRefs(n.nota)"
                      />
                    </ul>
                  </template>
                </Campo>

                <Campo
                  v-if="classe.termosInd.length > 0"
                  nome="Termos de Índice"
                  infoHeader="Termos de Índice"
                  :infoBody="myhelp.Classe.Campos.TermosIndice"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <ul>
                      <li v-for="t in classe.termosInd" :key="t.idTI">{{ t.termo }}</li>
                    </ul>
                  </template>
                </Campo>
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
                <!-- TIPO DE PROCESSO -->
                <Campo
                  nome="Tipo de Processo"
                  infoHeader="Tipo de Processo"
                  :infoBody="myhelp.Classe.Campos.TipoProcesso"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.tipoProc }}
                  </template>
                </Campo>

                <!-- TRANSVERSALIDADE -->
                <Campo
                  nome="Processo Transversal"
                  infoHeader="Processo Transversal"
                  :infoBody="myhelp.Classe.Campos.ProcessoTransversal"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.procTrans == "S" ? "Sim" : "Não" }}
                  </template>
                </Campo>

                <Campo
                  v-if="classe.donos.length > 0"
                  nome="Donos do processo"
                  infoHeader="Donos do processo"
                  :infoBody="myhelp.Classe.Campos.Donos"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <ul>
                      <li v-for="p in classe.donos" :key="p.idDono">
                        <a v-if="p.idTipo == 'Entidade'" :href="'/entidades/' + p.idDono">
                          {{ p.sigla }}:
                          {{ p.designacao }}
                          ({{ p.tipo.split("#")[1] }})
                        </a>
                        <a v-else :href="'/tipologias/' + p.idDono">
                          {{ p.sigla }}:
                          {{ p.designacao }}
                          ({{ p.tipo.split("#")[1] }})
                        </a>
                      </li>
                    </ul>
                  </template>
                </Campo>

                <!-- <Campo
                  nome="Participantes no processo"
                  infoHeader="Participantes no processo"
                  :infoBody="myhelp.Classe.Campos.Participantes"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <v-data-table
                      :headers="headersParticipantes"
                      :items="myParticipantes"
                      hide-default-footer
                    >
                      <template v-slot:item="props">
                        <tr>
                          <td>{{ props.item.label }}</td>
                          <td>
                            <ul>
                              <li v-for="p in props.item.participantes" :key="p.label">
                                <a
                                  v-if="p.idTipo == 'Entidade'"
                                  :href="'/entidades/' + p.idParticipante"
                                >
                                  {{ p.sigla }}
                                  ({{ p.idTipo }}) - {{ p.designacao }}
                                </a>
                                <a v-else :href="'/tipologias/' + p.idParticipante">
                                  {{ p.sigla }}
                                  ({{ p.idTipo }}) - {{ p.designacao }}
                                </a>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </template>
                </Campo> -->

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
                <v-row justify="center">
                  <span class="clav-content-title-2">
                    Prazo de Conservação Administrativa
                  </span>
                </v-row>

                <!-- PRAZO -->
                <Campo
                  nome="Prazo"
                  infoHeader="Prazo"
                  :infoBody="myhelp.Classe.Campos.Prazo"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <div v-if="classe.pca.valores > 1">
                      {{ classe.pca.valores + " anos" }}
                    </div>
                    <div v-else-if="classe.pca.valores == 1">
                      {{ classe.pca.valores + " ano" }}
                    </div>
                    <div v-else-if="classe.pca.notas != ''">Não especificado</div>
                  </template>
                </Campo>

                <!-- NOTAS -->
                <Campo
                  v-if="classe.pca.notas != ''"
                  nome="Notas"
                  infoHeader="Notas ao PCA"
                  :infoBody="myhelp.Classe.Campos.Notas"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.pca.notas }}
                  </template>
                </Campo>

                <!-- FORMA DE CONTAGEM -->
                <Campo
                  v-if="classe.pca.formaContagem"
                  nome="Forma de Contagem"
                  infoHeader="Forma de Contagem"
                  :infoBody="myhelp.Classe.Campos.FormaContagem"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.pca.formaContagem }}
                  </template>
                </Campo>

                <!-- SUBFORMA DE CONTAGEM -->
                <Campo
                  v-if="classe.pca.subFormaContagem"
                  nome="Subforma de Contagem"
                  infoHeader="Subforma de Contagem"
                  :infoBody="myhelp.Classe.Campos.SubformaContagem"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.pca.subFormaContagem }}
                  </template>
                </Campo>

                <!-- JUSTIFICAÇÂO -->
                <Campo
                  v-if="classe.pca.justificacao"
                  nome="Justificação"
                  infoHeader="Justificação"
                  :infoBody="myhelp.Classe.Campos.JustificacaoPCA"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <div>
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
                  </template>
                </Campo>

                <!-- DESTINO FINAL ................................................... -->
                <v-row justify="center">
                  <span class="clav-content-title-2 mt-5">Destino final</span>
                </v-row>
                <!-- VALOR -->
                <Campo
                  nome="Destino final"
                  infoHeader="Destino final"
                  :infoBody="myhelp.Classe.Campos.DF"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <div>
                      <span v-if="classe.df.valor == 'E'">Eliminação</span>
                      <span v-else-if="classe.df.valor == 'C'"> Conservação </span>
                      <span v-else-if="classe.df.valor == 'CP'">
                        Conservação Parcial
                      </span>
                      <span v-else-if="classe.df.nota != ''">Não Especificado</span>
                    </div>
                  </template>
                </Campo>

                <!-- NOTA ao DF -->
                <Campo
                  v-if="classe.df.nota"
                  nome="Nota"
                  infoHeader="Nota ao DF"
                  :infoBody="myhelp.Classe.Campos.NotasDF"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    {{ classe.df.nota }}
                  </template>
                </Campo>

                <!-- JUSTIFICAÇÂO -->
                <Campo
                  v-if="classe.df.justificacao"
                  nome="Justificação"
                  infoHeader="Justificação do DF"
                  :infoBody="myhelp.Classe.Campos.JustificacaoDF"
                  color="neutralpurple"
                >
                  <template v-slot:conteudo>
                    <div>
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
                  </template>
                </Campo>
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
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";
import ClassesArvoreLateral from "@/components/classes/ClassesArvoreLateral.vue";
import Voltar from "@/components/generic/Voltar.vue";

import InfoBox from "@/components/generic/infoBox.vue";
import PainelCLAV from "@/components/generic/PainelCLAV";
import Campo from "@/components/generic/Campo";

export default {
  props: ["idc", "savedSearch"],
  data: () => ({
    classe: {},
    classeLoaded: false,
    codeFormats: {
      2: /[0-9]{3}\.[0-9]{2}(?!\.)/,
      3: /[0-9]{3}\.[0-9]{2}\.[0-9]{3}(?!\.)/,
    },

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
    Participantes,
    ProcessosRelacionados,
    Legislacao,
    ClassesArvoreLateral,
    Voltar,
    PainelCLAV,
    Campo,
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/classes/consultar/c" + idClasse);
    },

    analisaRefs: function (nota) {
      var notaHtml = nota.replace(
        this.codeFormats[3],
        '<a href="/classes/consultar/c$&">$&</a>'
      );
      notaHtml = notaHtml.replace(
        this.codeFormats[2],
        '<a href="/classes/consultar/c$&">$&</a>'
      );
      return notaHtml;
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
  color: var(--v-primary-base) !important;
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

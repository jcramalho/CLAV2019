<template>
  <div>
    <v-card class="ma-4">
      <v-card-title class="indigo darken-4 white--text">
        Tabela de Seleção
        <v-spacer />
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn @click="csvExport()" color="white" icon v-on="on">
              <v-icon>get_app</v-icon>
            </v-btn>
          </template>
          <span>Transferir Tabela de Seleção</span>
        </v-tooltip>
      </v-card-title>

      <v-card-text class="ma-1">
        <v-row>
          <v-col cols="2">
            <div class="info-label">Designação</div>
          </v-col>
          <v-col>
            <div class="info-content">{{ ts.designacao }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <div class="info-label">Data de Autenticação</div>
          </v-col>
          <v-col>
            <div class="info-content">{{ ts.data }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <div class="info-label">Entidade Produtora</div>
          </v-col>
          <v-col>
            <div class="info-content">
              <a :href="'/entidades/ent_' + ts.entidade">{{ ts.entidade }}</a>
              {{" ("+ts.responsavel+")"}}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <div class="info-label">Entidades</div>
          </v-col>
          <v-col>
            <div class="info-content">
              <ul>
                <li v-for="(ent, i) in ts.entidades" :key="i">
                  <a :href="'/entidades/ent_' + ent">{{ ent }}</a>
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="2" sm="2" class="mt-3">
            <div class="info-label">Tabela de Seleção</div>
          </v-col>
          <v-col xs="3" sm="3" />
          <v-col xs="5" sm="5">
            <v-text-field
              label="Procurar"
              v-model="search"
              append-icon="search"
              single-line
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="ts.classes"
              item-key="codigo"
              :search="search"
              class="elevation-1"
              :footer-props="footer_props"
              :page.sync="paginaTabela"
              :expanded="expanded"
              :single-expand="true"
              @click:row="clicked"
            >
              <template v-slot:expanded-item="{headers,item}">
                <td :colspan="headers.length">
                  <v-card class="ma-1 elevation-0">
                    <v-card-text>
                      <v-expansion-panels>
                        <v-expansion-panel popout>
                          <!-- DESCRITIVO DA CLASSE -->
                          <v-expansion-panel-header>
                            <div class="separador">
                              Descritivo da Classe
                              <InfoBox
                                header="Descritivo da Classe"
                                :text="myhelp.Classe.BlocoDescritivo"
                                helpColor="white"
                              />
                            </div>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-row>
                              <!-- ESTADO -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">Estado</div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content" v-if="item.status == 'A'">Ativa</div>
                                <div
                                  class="info-content"
                                  v-else-if="item.status == 'H'"
                                >Em revisão...</div>
                                <div class="info-content" v-else>Inativa</div>
                              </v-col>
                            </v-row>

                            <v-row>
                              <!-- DESCRIÇÂO -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Descrição
                                  <InfoBox
                                    header="Descrição"
                                    :text="myhelp.Classe.Campos.Descricao"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">{{ item.descricao }}</div>
                              </v-col>
                            </v-row>

                            <NotasAp :notas="item.notasAp" v-if="item.notasAp.length > 0" />

                            <ExemplosNotasAp
                              :exemplos="item.exemplosNotasAp"
                              v-if="item.exemplosNotasAp.length > 0"
                            />

                            <NotasEx :notas="item.notasEx" v-if="item.notasEx.length > 0" />

                            <TermosIndice
                              :termos="item.termosInd"
                              v-if="item.termosInd.length > 0"
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel popout v-if="item.nivel == 3">
                          <!-- CONTEXTO DA CLASSE -->
                          <v-expansion-panel-header>
                            <div class="separador">
                              Contexto de Avaliação
                              <InfoBox
                                header="Contexto de Avaliação"
                                :text="myhelp.Classe.BlocoContexto"
                                helpColor="white"
                              />
                            </div>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-row>
                              <!-- TIPO DE PROCESSO -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Tipo de Processo
                                  <InfoBox
                                    header="Tipo de Processo"
                                    :text="myhelp.Classe.Campos.TipoProcesso"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">{{ item.tipoProc }}</div>
                              </v-col>
                            </v-row>

                            <v-row>
                              <!-- TRANSVERSALIDADE -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Processo Transversal
                                  <InfoBox
                                    header="Processo Transversal"
                                    :text="myhelp.Classe.Campos.ProcessoTransversal"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div
                                  class="info-content"
                                >{{ item.procTrans == "S" ? "Sim" : "Não" }}</div>
                              </v-col>
                            </v-row>

                            <Donos :entidades="item.donos" v-if="item.donos.length > 0" />

                            <Participantes
                              :entidades="item.participantes"
                              v-if="item.participantes.length > 0"
                            />

                            <ProcessosRelacionados
                              :processos="item.processosRelacionados"
                              v-if="item.processosRelacionados.length > 0"
                            />

                            <Legislacao :legs="item.legislacao" v-if="item.legislacao.length > 0" />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel
                          v-if="
                  (item.nivel == 3 && item.filhos.length == 0) ||
                    item.nivel == 4
                "
                        >
                          <v-expansion-panel-header>
                            <div class="separador">
                              Decisões de Avaliação
                              <InfoBox
                                header="Decisões de Avaliação"
                                :text="myhelp.Classe.BlocoDecisoes"
                                helpColor="white"
                              />
                            </div>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-row>
                              <v-col xs="12" sm="12">
                                <v-toolbar
                                  color="indigo darken-4"
                                  class="caption font-weight-regular"
                                  dark
                                  height="25"
                                >
                                  <v-toolbar-title>Prazo de Conservação Administrativa</v-toolbar-title>
                                </v-toolbar>
                              </v-col>
                            </v-row>

                            <v-row>
                              <!-- PRAZO -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Prazo
                                  <InfoBox
                                    header="Prazo"
                                    :text="myhelp.Classe.Campos.Prazo"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div
                                  class="info-content"
                                  v-if="item.pca.valores > 1"
                                >{{ item.pca.valores + " anos" }}</div>
                                <div
                                  class="info-content"
                                  v-else-if="item.pca.valores == 1"
                                >{{ item.pca.valores + " ano" }}</div>
                                <div
                                  class="info-content"
                                  v-else-if="item.pca.notas != ''"
                                >Não especificado</div>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.pca.notas != ''">
                              <!-- NOTAS -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Notas
                                  <InfoBox
                                    header="Notas ao PCA"
                                    :text="myhelp.Classe.Campos.Notas"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">{{ item.pca.notas }}</div>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.pca.formaContagem">
                              <!-- FORMA DE CONTAGEM -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Forma de Contagem
                                  <InfoBox
                                    header="Forma de Contagem"
                                    :text="myhelp.Classe.Campos.FormaContagem"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">{{ item.pca.formaContagem }}</div>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.pca.subFormaContagem">
                              <!-- SUBFORMA DE CONTAGEM -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Subforma de Contagem
                                  <InfoBox
                                    header="Subforma de Contagem"
                                    :text="myhelp.Classe.Campos.SubformaContagem"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">{{ item.pca.subFormaContagem }}</div>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.pca.justificacao">
                              <!-- JUSTIFICAÇÂO -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Justificação
                                  <InfoBox
                                    header="Justificação do PCA"
                                    :text="myhelp.Classe.Campos.JustificacaoPCA"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">
                                  <div v-for="c in item.pca.justificacao" :key="c.tipoId">
                                    <!-- Critério Gestionário ...............................-->
                                    <v-row v-if="c.tipoId == 'CriterioJustificacaoGestionario'">
                                      <v-col xs="2" sm="2">
                                        <div class="info-label">Critério Gestionário</div>
                                      </v-col>
                                      <v-col xs="10" sm="10">
                                        <div class="info-content">
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
                                      v-if="
                              c.tipoId ==
                                'CriterioJustificacaoUtilidadeAdministrativa'
                            "
                                    >
                                      <v-col xs="2" sm="2">
                                        <div class="info-label">Critério de Utilidade Administrativa</div>
                                      </v-col>
                                      <v-col xs="10" sm="10">
                                        <div class="info-content">
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
                                      <v-col xs="2" sm="2">
                                        <div class="info-label">Critério Legal</div>
                                      </v-col>
                                      <v-col xs="10" sm="10">
                                        <div class="info-content">
                                          {{ c.conteudo }}
                                          <br />
                                          <br />
                                          <ul>
                                            <li v-for="l in c.legislacao" :key="l.legId">
                                              <a
                                                :href="'/legislacao/' + l.legId"
                                              >{{ l.tipo }} {{ l.numero }}</a>
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
                              <v-col xs="12" sm="12">
                                <v-toolbar
                                  color="indigo darken-4"
                                  class="caption font-weight-regular"
                                  dark
                                  height="25"
                                >
                                  <v-toolbar-title>Destino Final</v-toolbar-title>
                                </v-toolbar>
                              </v-col>
                            </v-row>

                            <v-row>
                              <!-- VALOR -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Destino Final
                                  <InfoBox
                                    header="Destino Final"
                                    :text="myhelp.Classe.Campos.DF"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">
                                  <span v-if="item.df.valor == 'E'">Eliminação</span>
                                  <span v-else-if="item.df.valor == 'C'">Conservação</span>
                                  <span v-else-if="item.df.valor == 'CP'">Conservação Parcial</span>
                                  <span v-else-if="item.df.nota!=''">Não Especificado</span>
                                </div>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.df.nota">
                              <!-- NOTA ao DF -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Nota
                                  <InfoBox
                                    header="Nota ao DF"
                                    :text="myhelp.Classe.Campos.NotasDF"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">{{ item.df.nota }}</div>
                              </v-col>
                            </v-row>

                            <v-row v-if="item.df.justificacao">
                              <!-- JUSTIFICAÇÂO -->
                              <v-col xs="2" sm="2">
                                <div class="info-label">
                                  Justificação
                                  <InfoBox
                                    header="Justificação do DF"
                                    :text="myhelp.Classe.Campos.JustificacaoDF"
                                    helpColor="indigo darken-4"
                                  />
                                </div>
                              </v-col>
                              <v-col xs="10" sm="10">
                                <div class="info-content">
                                  <div v-for="c in item.df.justificacao" :key="c.tipoId">
                                    <!-- Critério Legal ...................................-->
                                    <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                                      <v-col xs="2" sm="2">
                                        <div class="info-label">Critério Legal</div>
                                      </v-col>
                                      <v-col xs="10" sm="10">
                                        <div class="info-content">
                                          {{ c.conteudo }}
                                          <br />
                                          <br />
                                          <ul>
                                            <li v-for="l in c.legislacao" :key="l.legId">
                                              <a
                                                :href="'/legislacao/' + l.legId"
                                              >{{ l.tipo }} {{ l.numero }}</a>
                                            </li>
                                          </ul>
                                        </div>
                                      </v-col>
                                    </v-row>

                                    <!-- Critério de Densidade Informacional ..............-->
                                    <v-row
                                      v-if="
                              c.tipoId == 'CriterioJustificacaoDensidadeInfo'
                            "
                                    >
                                      <v-col xs="2" sm="2">
                                        <div class="info-label">Critério de Densidade Informacional</div>
                                      </v-col>
                                      <v-col xs="10" sm="10">
                                        <div class="info-content">
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
                                      v-if="
                              c.tipoId ==
                                'CriterioJustificacaoComplementaridadeInfo'
                            "
                                    >
                                      <v-col xs="2" sm="2">
                                        <div
                                          class="info-label"
                                        >Critério de Complementaridade Informacional</div>
                                      </v-col>
                                      <v-col xs="10" sm="10">
                                        <div class="info-content">
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
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import NotasAp from "@/components/classes/consulta/NotasAp.vue";
import NotasEx from "@/components/classes/consulta/NotasEx.vue";
import ExemplosNotasAp from "@/components/classes/consulta/ExemplosNotasAp.vue";
import TermosIndice from "@/components/classes/consulta/TermosIndice.vue";
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["ts"],
  components: {
    InfoBox,
    NotasAp,
    NotasEx,
    ExemplosNotasAp,
    TermosIndice,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao,
  },
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: false,
    tree_ou_tabela: false,
    paginaTabela: 1,
    headers: [
      { text: "Código", sortable: false, value: "codigo" },
      { text: "Título", sortable: false, value: "titulo" },
      { text: "PCA", sortable: false, value: "pca.valores" },
      { text: "Destino Final", sortable: false, value: "df.valor" },
    ],
    footer_props: {
      "items-per-page-options": [10, 25, -1],
      "items-per-page-text": "Mostrar",
      "items-per-page-all-text": "Todos",
    },

    myhelp: require("@/config/help").help,
    mylabels: require("@/config/labels").criterios,
  }),
  methods: {
    csvExport() {
      //let csvContent = "data:text/csv;charset=utf-8,";
      let headers;
      let csvContent;
      let fileName = "TS-exportada-" + this.ts.entidades.join('-')
      headers =
        "Código,N.º Referência,Título,Descrição,Dono PN,Participante PN,PCA,Nota PCA,Forma de Contagem PCA,DF,Nota DF";
      csvContent = [
        headers,
        ...this.ts.classes.map((item) => {
          var str =
            '"' +
            (item.codigo || "") +
            '",' +
            '"' +
            (item.referencia || "") +
            '",' +
            '"' +
            (item.titulo || "") +
            '",' +
            '"' +
            (item.descricao || "") +
            '",' +
            '"' +
            (item.designacaoDono ? "X" : "") +
            '",' +
            '"' +
            (item.designacaoParticipante ? "X" : "") +
            '",' +
            '"' +
            (item.pca || "") +
            '",' +
            '"' +
            (item.notaPCA || "") +
            '",' +
            '"';
          if (item.formaContagem == "Data de conclusão do procedimento")
            str += "F04";
          else if (item.formaContagem == "Data de cessação da vigência")
            str += "F05";
          else if (item.formaContagem == "Data de início do procedimento")
            str += "F02";
          else if (item.formaContagem == "Data de emissão do título")
            str += "F03";
          else if (
            item.formaContagem ==
            "Data de extinção da entidade sobre a qual recai o procedimento"
          )
            str += "F06";
          else if (item.formaContagem == "Data de extinção do direito")
            str += "F07";
          else if (item.formaContagem == "Conforme disposição legal") {
            str += "F01.";
            if (item.subFormaContagem)
              str += item.subFormaContagem.split("F01.")[1];
          }

          str +=
            '","' + (item.df || "") + '",' + '"' + (item.notaDF || "") + '"';
          return str;
        }),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + data);
      link.setAttribute("download", fileName + ".csv");
      link.click();
    },
    clicked(value) {
      if (
        value.descricao ||
        value.notaDF ||
        value.notaPCA ||
        value.formaContagem ||
        value.subFormaContagem ||
        value.designacaoParticipante ||
        value.designacaoDono
      )
        if (this.expanded[0] == value) this.expanded.pop();
        else this.expanded = [value];
    },
  },
};
</script>
<style>

.separador {
  color: white; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E; 
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 8px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
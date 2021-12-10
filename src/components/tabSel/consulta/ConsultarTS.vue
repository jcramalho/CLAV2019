<template>
  <div>
    <v-card class="ma-4">
      <v-card-title class="clav-linear-background white--text">
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

      <v-card-text class="ma-2">
        <Campo color="neutralpurple" nome="Designação">
          <template v-slot:conteudo>
            {{ ts.designacao }}
          </template>
        </Campo>

        <Campo color="neutralpurple" nome="Data de Autenticação">
          <template v-slot:conteudo>
            {{ ts.data }}
          </template>
        </Campo>

        <Campo color="neutralpurple" nome="Entidade Produtora">
          <template v-slot:conteudo>
            <a :href="'/entidades/ent_' + ts.entidade">{{ ts.entidade }}</a>
            {{ " (" + ts.responsavel + ")" }}
          </template>
        </Campo>

        <Campo
          color="neutralpurple"
          :nome="
            tipo === 'Organizacional' ? 'Entidade abrangida' : 'Entidades abrangidas'
          "
          :infoHeader="
            tipo === 'Organizacional' ? 'Entidade abrangida' : 'Entidades abrangidas'
          "
          infoBody="Entidade à qual a tabela de seleção se destina, sendo responsável pela sua aplicação."
        >
          <template v-slot:conteudo>
            <ul>
              <li v-for="(ent, i) in ts.entidades" :key="i">
                <a :href="'/entidades/ent_' + ent">{{ ent }}</a>
              </li>
            </ul>
          </template>
        </Campo>

        <v-row>
          <v-col cols="12" sm="4" md="3">
            <v-card class="pa-4" color="neutralpurple">
              <v-row class="pa-0 ma-0" justify="center">
                <span class="clav-info-label">Tabela de Seleção</span>
                <InfoBox header="Tabela de Seleção" :text="myhelp.TabelasSelecao" />
              </v-row>
            </v-card>
          </v-col>
          <v-col xs="1" sm="1" />
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
            <v-card color="secondary" class="py-2">
              <v-data-table
                :headers="headers"
                :items="ts.classes"
                item-key="codigo"
                :search="search"
                :footer-props="footer_props"
                :page.sync="paginaTabela"
                single-expand
                expand-icon="$expand"
                show-expand
              >
                <template v-slot:[`item.dono`]="{ item }">
                  <td v-if="item.codigo.split('.').length === 3">
                    <span v-if="item.donos && item.donos.length > 0">
                      <span v-for="(e, i) in item.donos" :key="i">
                        <v-chip
                          v-if="tipo === 'Pluriorganizacional'"
                          class="ml-1"
                          color="indigo darken-4"
                          outlined
                          label
                          x-small
                        >
                          {{ e.sigla }}
                        </v-chip>
                        <v-icon v-else> done </v-icon>
                      </span>
                    </span>
                  </td>
                </template>

                <template v-slot:[`item.participante`]="{ item }">
                  <td v-if="item.codigo.split('.').length === 3">
                    <span v-if="item.participantes && item.participantes.length > 0">
                      <span v-for="(e, i) in item.participantes" :key="i">
                        <v-chip
                          v-if="tipo === 'Pluriorganizacional'"
                          class="ml-1"
                          color="indigo darken-4"
                          outlined
                          label
                          x-small
                        >
                          {{ e.sigla }} -
                          {{ participacaoLabel(e.participLabel) }}
                        </v-chip>
                        <span v-else>{{ participacaoLabel(e.participLabel) }}</span>
                      </span>
                    </span>
                  </td>
                </template>

                <template v-slot:[`item.pca`]="{ item }">
                  <td
                    v-if="
                      item.codigo.split('.').length === 3 ||
                      item.codigo.split('.').length === 4
                    "
                  >
                    <span v-if="item.pca && item.pca.valores">
                      {{
                        item.pca.valores > 1
                          ? item.pca.valores + " Anos"
                          : item.pca.valores + " Ano"
                      }}
                    </span>
                  </td>
                </template>

                <template v-slot:[`item.df`]="{ item }">
                  <td
                    v-if="
                      item.codigo.split('.').length === 3 ||
                      item.codigo.split('.').length === 4
                    "
                  >
                    <span v-if="item.df && item.df.valor">
                      {{
                        item.df.valor === "C"
                          ? "Conservação"
                          : item.df.valor === "E"
                          ? "Eliminação"
                          : item.df.valor === "CP"
                          ? "Conservação Parcial"
                          : ""
                      }}
                    </span>
                  </td>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-card class="ma-1 elevation-0">
                      <v-card-text>
                        <v-expansion-panels>
                          <v-expansion-panel popout>
                            <!-- DESCRITIVO DA CLASSE -->
                            <v-expansion-panel-header
                              class="clav-linear-background white--text"
                            >
                              <div>
                                <font size="4"><b> Descritivo da Classe</b></font>
                                <InfoBox
                                  header="Descritivo da Classe"
                                  :text="myhelp.Classe.BlocoDescritivo"
                                  helpColor="white"
                                />
                              </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <!-- ESTADO -->
                              <Campo
                                color="neutralpurple"
                                nome="Estado"
                                infoHeader="Estado"
                                :infoBody="myhelp.Classe.Campos.Estado"
                              >
                                <template v-slot:conteudo>
                                  {{
                                    item.status === "A"
                                      ? "Ativa"
                                      : item.status === "H"
                                      ? "Em revisão"
                                      : "Inativa"
                                  }}
                                </template>
                              </Campo>

                              <!-- DESCRIÇÂO -->
                              <Campo
                                color="neutralpurple"
                                nome="Descrição"
                                infoHeader="Descrição"
                                :infoBody="myhelp.Classe.Campos.Descricao"
                              >
                                <template v-slot:conteudo>
                                  {{ item.descricao }}
                                </template>
                              </Campo>
                              <!-- NOTAS AP -->
                              <Campo
                                v-if="item.notasAp && item.notasAp.length > 0"
                                color="neutralpurple"
                                nome="Notas de Aplicação"
                                infoHeader="Notas de Aplicação"
                                :infoBody="myhelp.Classe.Campos.NotasAp"
                              >
                                <template v-slot:conteudo>
                                  <ul>
                                    <li v-for="n in item.notasAp" :key="n.idNota">
                                      {{ n.nota }}
                                    </li>
                                  </ul>
                                </template>
                              </Campo>
                              <!-- EXEMPLOS NOTAS AP -->
                              <Campo
                                v-if="
                                  item.exemplosNotasAp && item.exemplosNotasAp.length > 0
                                "
                                color="neutralpurple"
                                nome="Exemplos de Notas de Aplicação"
                                infoHeader="Exemplos de Notas de Aplicação"
                                :infoBody="myhelp.Classe.Campos.ExemplosNotasAp"
                              >
                                <template v-slot:conteudo>
                                  <ul>
                                    <li
                                      v-for="n in item.exemplosNotasAp"
                                      :key="n.idExemplo"
                                    >
                                      {{ n.exemplo }}
                                    </li>
                                  </ul>
                                </template>
                              </Campo>

                              <Campo
                                v-if="item.notasEx && item.notasEx.length > 0"
                                color="neutralpurple"
                                nome="Notas de Exclusão"
                                infoHeader="Notas de Exclusão"
                                :infoBody="myhelp.Classe.Campos.NotasEx"
                              >
                                <template v-slot:conteudo>
                                  <ul>
                                    <li v-for="n in item.notasEx" :key="n.idNota">
                                      {{ n.nota }}
                                    </li>
                                  </ul>
                                </template>
                              </Campo>
                              <Campo
                                v-if="item.termosInd && item.termosInd.length > 0"
                                color="neutralpurple"
                                nome="Termos de Índice"
                                infoHeader="Termos de Índice"
                                :infoBody="myhelp.Classe.Campos.TermosIndice"
                              >
                                <template v-slot:conteudo>
                                  <ul>
                                    <li v-for="n in item.termosInd" :key="n.idTI">
                                      {{ n.termo }}
                                    </li>
                                  </ul>
                                </template>
                              </Campo>
                            </v-expansion-panel-content>
                          </v-expansion-panel>

                          <v-expansion-panel popout v-if="item.nivel == 3">
                            <!-- CONTEXTO DA CLASSE -->

                            <v-expansion-panel-header
                              class="clav-linear-background white--text"
                            >
                              <div>
                                <font size="4"><b>Contexto de Avaliação</b></font>
                                <InfoBox
                                  header="Contexto de Avaliação"
                                  :text="myhelp.Classe.BlocoContexto"
                                  helpColor="white"
                                />
                              </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <!-- TIPO DE PROCESSO -->
                              <Campo
                                color="neutralpurple"
                                nome="Tipo de Processo"
                                infoHeader="Tipo de Processo"
                                :infoBody="myhelp.Classe.Campos.TipoProcesso"
                              >
                                <template v-slot:conteudo>
                                  {{ item.tipoProc }}
                                </template>
                              </Campo>

                              <!-- TRANSVERSALIDADE -->
                              <Campo
                                color="neutralpurple"
                                nome="Processo Transversal"
                                infoHeader="Processo Transversal"
                                :infoBody="myhelp.Classe.Campos.ProcessoTransversal"
                              >
                                <template v-slot:conteudo>
                                  {{ item.procTrans === "S" ? "Sim" : "Não" }}
                                </template>
                              </Campo>

                              <Donos
                                :entidades="item.donos"
                                v-if="item.donos.length > 0"
                              />

                              <Participantes
                                :entidades="item.participantes"
                                v-if="item.participantes.length > 0"
                              />

                              <ProcessosRelacionados
                                :processos="item.processosRelacionados"
                                v-if="item.processosRelacionados.length > 0"
                              />

                              <Legislacao
                                :legs="item.legislacao"
                                v-if="item.legislacao.length > 0"
                              />
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                          <v-expansion-panel
                            v-if="
                              (item.nivel == 3 && item.filhos.length == 0) ||
                              item.nivel == 4
                            "
                          >
                            <v-expansion-panel-header
                              class="clav-linear-background white--text"
                            >
                              <div>
                                <font size="4"><b>Decisões de Avaliação</b></font>
                                <InfoBox
                                  header="Decisões de Avaliação"
                                  :text="myhelp.Classe.BlocoDecisoes"
                                  helpColor="white"
                                />
                              </div>
                            </v-expansion-panel-header>

                            <v-expansion-panel-content>
                              <v-toolbar
                                class="clav-linear-background white--text mb-4"
                                rounded
                                width="100%"
                                height="30%"
                              >
                                <v-toolbar-title
                                  >Prazo de Conservação Administrativa</v-toolbar-title
                                >
                              </v-toolbar>

                              <!-- PRAZO -->
                              <Campo
                                color="neutralpurple"
                                nome="Prazo"
                                infoHeader="Prazo"
                                :infoBody="myhelp.Classe.Campos.Prazo"
                              >
                                <template v-slot:conteudo>
                                  {{
                                    item.pca.valores > 1
                                      ? item.pca.valores + " Anos"
                                      : item.pca.valores === ""
                                      ? "Não Específicado"
                                      : item.pca.valores + " Ano"
                                  }}
                                </template>
                              </Campo>

                              <!-- NOTAS -->
                              <Campo
                                v-if="item.pca.notas != ''"
                                color="neutralpurple"
                                nome="Nota"
                                infoHeader="Nota"
                                :infoBody="myhelp.Classe.Campos.Notas"
                              >
                                <template v-slot:conteudo>
                                  {{ item.pca.notas }}
                                </template>
                              </Campo>

                              <!-- FORMA DE CONTAGEM -->
                              <Campo
                                v-if="
                                  item.pca.formaContagem && item.pca.formaContagem != ''
                                "
                                color="neutralpurple"
                                nome="Forma de Contagem"
                                infoHeader="Forma de Contagem"
                                :infoBody="myhelp.Classe.Campos.FormaContagem"
                              >
                                <template v-slot:conteudo>
                                  {{ item.pca.formaContagem }}
                                </template>
                              </Campo>

                              <!-- SUBFORMA DE CONTAGEM -->
                              <Campo
                                v-if="
                                  item.pca.subFormaContagem &&
                                  item.pca.subFormaContagem != ''
                                "
                                color="neutralpurple"
                                nome="Subforma de Contagem"
                                infoHeader="Subforma de Contagem"
                                :infoBody="myhelp.Classe.Campos.SubformaContagem"
                              >
                                <template v-slot:conteudo>
                                  {{ item.pca.subFormaContagem }}
                                </template>
                              </Campo>

                              <!-- JUSTIFICAÇÂO -->
                              <Campo
                                v-if="
                                  item.pca.justificacao &&
                                  item.pca.justificacao.length > 0
                                "
                                color="neutralpurple"
                                nome="Justificação"
                                infoHeader="Justificação"
                                :infoBody="myhelp.Classe.Campos.JustificacaoPCA"
                              >
                                <template v-slot:conteudo>
                                  <div v-for="c in item.pca.justificacao" :key="c.tipoId">
                                    <!-- Critério Gestionário ...............................-->
                                    <v-row
                                      v-if="c.tipoId == 'CriterioJustificacaoGestionario'"
                                    >
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
                                        <div class="info-label">
                                          Critério de Utilidade Administrativa
                                        </div>
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
                                              <a :href="'/legislacao/' + l.legId"
                                                >{{ l.tipo }} {{ l.numero }}</a
                                              >
                                            </li>
                                          </ul>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </div></template
                                >
                              </Campo>

                              <!-- DESTINO FINAL ................................................... -->

                              <v-toolbar
                                class="clav-linear-background white--text my-4"
                                rounded
                                width="100%"
                                height="30%"
                              >
                                <v-toolbar-title>Destino Final</v-toolbar-title>
                              </v-toolbar>

                              <!-- VALOR -->
                              <Campo
                                color="neutralpurple"
                                nome="Destino Final"
                                infoHeader="Destino Final"
                                :infoBody="myhelp.Classe.Campos.DF"
                              >
                                <template v-slot:conteudo>
                                  {{
                                    item.df.valor == "E"
                                      ? "Eliminação"
                                      : item.df.valor == "C"
                                      ? "Conservação"
                                      : item.df.valor == "CP"
                                      ? "Conservação Parcial"
                                      : "Não Especificado"
                                  }}
                                </template>
                              </Campo>

                              <!-- NOTA ao DF -->
                              <Campo
                                v-if="item.df.nota"
                                color="neutralpurple"
                                nome="Nota"
                                infoHeader="Nota"
                                :infoBody="myhelp.Classe.Campos.NotasDF"
                              >
                                <template v-slot:conteudo>
                                  {{ item.df.nota }}
                                </template>
                              </Campo>

                              <!-- JUSTIFICAÇÂO -->
                              <Campo
                                v-if="
                                  item.df.justificacao && item.df.justificacao.length > 0
                                "
                                color="neutralpurple"
                                nome="Justificação"
                                infoHeader="Justificação"
                                :infoBody="myhelp.Classe.Campos.JustificacaoDF"
                              >
                                <template v-slot:conteudo>
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
                                              <a :href="'/legislacao/' + l.legId"
                                                >{{ l.tipo }} {{ l.numero }}</a
                                              >
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
                                        <div class="info-label">
                                          Critério de Densidade Informacional
                                        </div>
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
                                        <div class="info-label">
                                          Critério de Complementaridade Informacional
                                        </div>
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
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </div>
                                </template>
                              </Campo>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-card-text>
                    </v-card>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";
import Campo from "@/components/generic/CampoCLAV.vue";

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["ts"],
  components: {
    InfoBox,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao,
    Campo,
  },
  data: () => ({
    search: "",
    expanded: [],
    tipo: "",
    singleExpand: false,
    tree_ou_tabela: false,
    paginaTabela: 1,
    headers: [
      {
        text: "Código",
        value: "codigo",
        class: "subtitle-1",
        width: "10%",
        sortable: false,
      },
      {
        text: "Título",
        value: "titulo",
        class: "subtitle-1",
        width: "30%",
        sortable: false,
      },
      {
        text: "Dono",
        value: "dono",
        class: "subtitle-1",
        width: "15%",
        sortable: false,
      },
      {
        text: "Participante",
        value: "participante",
        class: "subtitle-1",
        width: "20%",
        sortable: false,
      },
      {
        text: "PCA",
        value: "pca",
        class: "subtitle-1",
        width: "10%",
        sortable: false,
      },
      {
        text: "DF",
        value: "df",
        class: "subtitle-1",
        width: "10%",
        sortable: false,
      },

      {
        text: "",
        value: "data-table-expand",
        width: "5%",
        sortable: false,
      },
    ],
    footer_props: {
      "items-per-page-options": [10, 25, -1],
      "items-per-page-text": "Mostrar",
      "items-per-page-all-text": "Todos",
    },

    myhelp: require("@/config/help").help,
    mylabels: require("@/config/labels").criterios,
  }),
  beforeUpdate() {
    this.ts.entidades.length > 1
      ? (this.tipo = "Pluriorganizacional")
      : (this.tipo = "Organizacional");

    if (this.tipo === "Organizacional") {
      this.headers[2].width = "5%";
      this.headers[3].width = "5%";
      this.headers[4].width = "5%";
      this.headers[5].width = "5%";
    }
  },
  methods: {
    csvExport() {
      //let csvContent = "data:text/csv;charset=utf-8,";
      let headers;
      let csvContent;
      let fileName = "TS-exportada-" + this.ts.entidades.join("-");
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
            (item.pca.valores || "") +
            '",' +
            '"' +
            (item.pca.notas || "") +
            '",' +
            '"';
          if (item.pca.formaContagem == "Data de conclusão do procedimento") str += "F04";
          else if (item.pca.formaContagem == "Data de cessação da vigência") str += "F05";
          else if (item.pca.formaContagem == "Data de início do procedimento")
            str += "F02";
          else if (item.pca.formaContagem == "Data de emissão do título") str += "F03";
          else if (
            item.pca.formaContagem ==
            "Data de extinção da entidade sobre a qual recai o procedimento"
          )
            str += "F06";
          else if (item.pca.formaContagem == "Data de extinção do direito") str += "F07";
          else if (item.pca.formaContagem == "Conforme disposição legal") {
            str += "F01.";
            if (item.pca.subFormaContagem)
              str += item.pca.subFormaContagem.split("F01.")[1];
          }

          str += '","' + (item.df.valor || "") + '",' + '"' + (item.df.nota || "") + '"';
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

    participacaoLabel(label) {
      return label === "Apreciador"
        ? "Apreciar"
        : label === "Assessor"
        ? "Assessorar"
        : label === "Comunicador"
        ? "Comunicar"
        : label === "Decisor"
        ? "Decidir"
        : label === "Executor"
        ? "Executar"
        : label === "Iniciador"
        ? "Iniciar"
        : "";
    },
  },
};
</script>
<style>
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

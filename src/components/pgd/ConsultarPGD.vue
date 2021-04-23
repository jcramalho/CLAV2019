<template>
  <div>
    <v-card class="ma-4">
      <v-card-title class="clav-linear-background white--text">
        {{ titulo }}
        <v-spacer />
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn @click="csvExport()" color="white" icon v-on="on">
              <v-icon>get_app</v-icon>
            </v-btn>
          </template>
          <span>Exportar Tabela de Seleção</span>
        </v-tooltip>
      </v-card-title>

      <v-card-text class="ma-1">
        <Campo
          v-for="(item, index) in objeto"
          v-bind:key="index"
          color="neutralpurple"
          :nome="
            item.campo === 'Entidades'
              ? objeto.entidades.text.length > 1
                ? item.campo
                : 'Entidade'
              : item.campo
          "
          :infoHeader="
            item.campo === 'Entidades'
              ? objeto.entidades.text.length > 1
                ? item.campo
                : 'Entidade'
              : item.campo
          "
          :infoBody="
            item.campo === 'Fonte de legitimação'
              ? myhelp.TS.Campos.fonteLegitimacao
              : item.tipo === 'Legislação'
              ? myhelp.Legislacao.Campos[item.campo]
              : ''
          "
        >
          <template v-slot:conteudo>
            <span v-if="item.campo === 'Entidades'">
              <ol>
                <li v-for="(ent, i) in item.text" :key="i">
                  <a
                    :href="
                      objeto.fonte.text != 'RADA'
                        ? ent.id.includes('ent_')
                          ? '/entidades/' + ent.id
                          : '/tipologias/' + ent.id
                        : ent.includes('ent_')
                        ? '/entidades/' + ent
                        : '/tipologias/' + ent
                    "
                    >{{
                      objeto.fonte.text != "RADA"
                        ? ent.sigla
                        : ent.includes("ent_")
                        ? ent.split("ent_")[1]
                        : ent.split("tip_")[1]
                    }}</a
                  >
                </li>
              </ol>
            </span>
            <span v-else-if="item.campo === 'Link'"
              ><a :href="item.text">{{ item.text }}</a></span
            >

            <span v-else>{{ item.text }}</span>
          </template>
        </Campo>

        <v-row>
          <v-col cols="12" sm="4" md="3">
            <v-card class="pa-4" color="neutralpurple">
              <v-row class="pa-0 ma-0" justify="center">
                <span class="clav-info-label">Tabela de Seleção</span>
                <InfoBox
                  header="Tabela de Seleção"
                  :text="myhelp.TabelasSelecao"
                />
              </v-row>
            </v-card>
          </v-col>
          <v-col xs="1" sm="1" />
          <v-col xs="5" sm="5">
            <v-text-field
              v-if="!tree_ou_tabela"
              label="Procurar"
              v-model="search"
              append-icon="search"
              single-line
              hide-details
            />
          </v-col>
          <v-col xs="1" sm="1" />
          <v-col xs="2" sm="2">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-switch
                  prepend-icon="table_view"
                  inset
                  hide-details
                  v-model="tree_ou_tabela"
                  v-on="on"
                ></v-switch>
              </template>
              <span>Alterar modo de visualização da Tabela de Seleção</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list v-if="tree_ou_tabela">
              <v-list-group
                v-for="(classe, i) in classesTree"
                :key="i"
                multiple
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span v-if="classe.codigo"
                        >{{ classe.codigo }}
                        <span class="ml-7">{{ classe.titulo }}</span></span
                      >
                      <span v-else class="ml-9">{{ classe.titulo }}</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <ShowPGD :classe="classe" />
              </v-list-group>
            </v-list>
            <v-data-table
              v-else
              :headers="
                objeto &&
                (objeto.fonte.text === 'PGD' || objeto.fonte.text === 'RADA')
                  ? headers
                  : headersLC
              "
              :items="classes"
              item-key="idClasse"
              :search="search"
              class="elevation-1"
              :footer-props="footer_props"
              :page.sync="paginaTabela"
              single-expand
              expand-icon="$expand"
              show-expand
            >
              <template v-slot:[`item.pca`]="{ item }">
                {{
                  item.pca > 1
                    ? item.pca + " Anos"
                    : !item.pca || item.pca === ""
                    ? ""
                    : item.pca + " Ano"
                }}
              </template>
              <template v-slot:[`item.participantes`]="{ item }">
                <span
                  v-if="item.participantes && item.participantes.length === 1"
                  ><v-icon>done</v-icon></span
                >
                <ol v-else-if="item.participantes">
                  <li v-for="(p, index) in item.participantes" :key="index">
                    <a :href="'/entidades/' + p.entParticipante">{{
                      p.entParticipante.split("ent_")[1]
                    }}</a>
                  </li>
                </ol>
              </template>

              <template v-slot:[`item.donos`]="{ item }">
                <span v-if="item.donos && item.donos.length === 1">
                  <v-icon>done</v-icon>
                </span>
                <ol v-else-if="item.donos">
                  <li v-for="(d, index) in item.donos" :key="index">
                    <a :href="'/entidades/' + d.entDono">{{
                      d.entDono.split("ent_")[1]
                    }}</a>
                  </li>
                </ol>
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-card class="ma-1 elevation-0">
                    <v-expansion-panels>
                      <v-expansion-panel
                        v-if="item.descricao || item.diplomas"
                        popout
                      >
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

                          <!-- DIPLOMAS -->
                          <Campo
                            v-if="item.diplomas"
                            color="neutralpurple"
                            nome="Diplomas Jurídico-Administrativo"
                            infoHeader="Diplomas Jurídico-Administrativo"
                            :infoBody="myhelp.Classe.Campos.Descricao"
                          >
                            <template v-slot:conteudo>
                              <div
                                v-for="(d, index) in item.diplomas.split('#')"
                                :key="index"
                              >
                                {{ d }}
                              </div>
                            </template>
                          </Campo>
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel
                        v-if="
                          (item.nivel == 3 &&
                            classes.filter(
                              (c) =>
                                (c.codigo && c.codigo.includes(item.codigo)) ||
                                (!c.codigo && c.referencia === item.referencia)
                            ).length == 1) ||
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
                              >Prazo de Conservação
                              Administrativa</v-toolbar-title
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
                                item.pca > 1
                                  ? item.pca + " Anos"
                                  : item.pca === ""
                                  ? "Não Específicado"
                                  : item.pca + " Ano"
                              }}
                            </template>
                          </Campo>

                          <!-- NOTAS -->
                          <Campo
                            v-if="item.notaPCA && item.notaPCA != ''"
                            color="neutralpurple"
                            nome="Nota"
                            infoHeader="Nota"
                            :infoBody="myhelp.Classe.Campos.Notas"
                          >
                            <template v-slot:conteudo>
                              {{ item.notaPCA }}
                            </template>
                          </Campo>
                          <!-- FORMA DE CONTAGEM -->
                          <Campo
                            v-if="
                              item.formaContagem && item.formaContagem != ''
                            "
                            color="neutralpurple"
                            nome="Forma de Contagem"
                            infoHeader="Forma de Contagem"
                            :infoBody="myhelp.Classe.Campos.FormaContagem"
                          >
                            <template v-slot:conteudo>
                              {{ item.formaContagem }}
                            </template>
                          </Campo>

                          <!-- SUBFORMA DE CONTAGEM -->
                          <Campo
                            v-if="
                              item.subFormaContagem &&
                              item.subFormaContagem != ''
                            "
                            color="neutralpurple"
                            nome="Subforma de Contagem"
                            infoHeader="Subforma de Contagem"
                            :infoBody="myhelp.Classe.Campos.SubformaContagem"
                          >
                            <template v-slot:conteudo>
                              {{ item.subFormaContagem }}
                            </template>
                          </Campo>

                          <!-- JUSTIFICAÇÂO -->
                          <Campo
                            v-if="
                              item.justificacaoPCA && item.justificacaoPCA != ''
                            "
                            color="neutralpurple"
                            nome="Justificação"
                            infoHeader="Justificação"
                            :infoBody="myhelp.Classe.Campos.JustificacaoPCA"
                          >
                            <template v-slot:conteudo>
                              {{ item.justificacaoPCA }}
                            </template>
                          </Campo>

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
                              {{ item.df }}
                            </template>
                          </Campo>

                          <!-- NOTA ao DF -->
                          <Campo
                            v-if="item.notaDF && item.notaDF != ''"
                            color="neutralpurple"
                            nome="Nota"
                            infoHeader="Nota"
                            :infoBody="myhelp.Classe.Campos.NotasDF"
                          >
                            <template v-slot:conteudo>
                              {{ item.notaDF }}
                            </template>
                          </Campo>

                          <!-- JUSTIFICAÇÃO do DF -->
                          <Campo
                            v-if="
                              item.justificacaoDF && item.justificacaoDF != ''
                            "
                            color="neutralpurple"
                            nome="Justificação"
                            infoHeader="Justificação"
                            :infoBody="myhelp.Classe.Campos.JustificacaoDF"
                          >
                            <template v-slot:conteudo>
                              {{ item.justificacaoDF }}
                            </template>
                          </Campo>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
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
import ShowPGD from "@/components/pgd/ShowPGD.vue";
import Campo from "@/components/generic/Campo.vue";
import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["classes", "classesTree", "objeto", "titulo"],
  components: {
    ShowPGD,
    Campo,
    InfoBox,
  },
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: false,
    tree_ou_tabela: false,
    paginaTabela: 1,
    headersLC: [
      {
        text: "Código",
        sortable: false,
        value: "codigo",
        class: "subtitle-1",
        width: "5%",
      },
      {
        text: "Referência",
        sortable: false,
        value: "referencia",
        class: "subtitle-1",
        width: "5%",
      },
      {
        text: "Título",
        sortable: false,
        value: "titulo",
        class: "subtitle-1",
        width: "30%",
      },
      {
        text: "Dono",
        value: "donos",
        class: "subtitle-1",
        width: "10%",
        sortable: false,
      },
      {
        text: "Participante",
        value: "participantes",
        class: "subtitle-1",
        width: "10%",
        sortable: false,
      },
      {
        text: "PCA",
        sortable: false,
        value: "pca",
        class: "subtitle-1",
        width: "5%",
      },
      {
        text: "Destino final",
        sortable: false,
        value: "df",
        class: "subtitle-1",
        width: "10%",
      },
      {
        text: "",
        value: "data-table-expand",
        width: "5%",
        sortable: false,
      },
    ],
    headers: [
      {
        text: "Código",
        sortable: false,
        value: "codigo",
        class: "subtitle-1",
        width: "10%",
      },
      {
        text: "Referência",
        sortable: false,
        value: "referencia",
        class: "subtitle-1",
        width: "5%",
      },
      {
        text: "Título",
        sortable: false,
        value: "titulo",
        class: "subtitle-1",
        width: "35%",
      },
      {
        text: "PCA",
        sortable: false,
        value: "pca",
        class: "subtitle-1",
        width: "10%",
      },
      {
        text: "Destino final",
        sortable: false,
        value: "df",
        class: "subtitle-1",
        width: "10%",
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
  }),
  methods: {
    csvExport() {
      //let csvContent = "data:text/csv;charset=utf-8,";
      let headers;
      let csvContent;
      let fileName = this.titulo.replace(/ /g, "_");
      if (this.objeto.fonte.text == "RADA") {
        headers =
          "Código,Nº de Referência,Título,Descrição,PCA,Nota PCA,Forma de contagem do PCA,DF,Nota ao DF";
        csvContent = [
          headers,
          ...this.classes.map((item) => {
            return (
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
              (item.pca || "") +
              '",' +
              '"' +
              (item.notaPCA || "") +
              '",' +
              '"' +
              (item.formaContagem || "") +
              '",' +
              '"' +
              (item.df || "") +
              '",' +
              '"' +
              (item.notaDF || "") +
              '",'
            );
          }),
        ]
          .join("\n")
          .replace(/(^\[)|(\]$)/gm, "");

        fileName =
          "TS_RADA_" + this.objeto.entidade.text + "_" + this.objeto.data.text;
      } else if (this.objeto.fonte.text == "PGD/LC") {
        headers =
          "Código,N.º Referência,Título,Descrição,Dono PN,Participante PN,PCA,Nota PCA,Forma de Contagem PCA,DF,Nota DF";

        csvContent = [
          headers,
          ...this.classes.map((item) => {
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
      } else {
        headers =
          "Código,N.º Referência,Título,Descrição,PCA,Nota PCA,DF,Nota DF";
        csvContent = [
          headers,
          ...this.classes.map((item) => {
            return (
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
              (item.pca || "") +
              '",' +
              '"' +
              (item.notaPCA || "") +
              '",' +
              '"' +
              (item.df || "") +
              '",' +
              '"' +
              (item.notaDF || "") +
              '"'
            );
          }),
        ]
          .join("\n")
          .replace(/(^\[)|(\]$)/gm, "");
      }
      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + data);
      link.setAttribute("download", fileName + ".csv");
      link.click();
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

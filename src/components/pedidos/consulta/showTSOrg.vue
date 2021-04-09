<template>
  <div>
    <Campo
      color="neutralpurple"
      nome="Entidade abrangida"
      infoHeader="
            Entidade abrangida
          "
      infoBody="Entidade à qual a tabela de seleção se destina, sendo responsável pela sua aplicação."
    >
      <template v-slot:conteudo>
        <v-chip class="ma-2" color="indigo darken-4" outlined label>
          <v-icon left>account_balance</v-icon>
          {{ p.objeto.dados.ts.designacaoEntidade }}
          {{ p.objeto.dados.ts.designacaoTipologia }}
        </v-chip>
      </template>
    </Campo>
    <v-card class="pa-4 my-5" color="neutralpurple">
      <span class="clav-info-label">
        Tabela de Seleção para a entidade
        {{ p.objeto.dados.ts.designacaoEntidade }}
        {{ p.objeto.dados.ts.designacaoTipologia }}
      </span></v-card
    >

    <v-data-table
      :headers="tsHeaders"
      :items="procs"
      item-key="codigo"
      class="elevation-1"
      :footer-props="tsFooterProps"
      expand-icon="$expand"
      single-expand
      show-expand
    >
      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="warning"
          >Não existem processos para mostrar...</v-alert
        >
      </template>
      <template v-slot:[`item.dono`]="{ item }">
        <v-icon v-if="item.dono"> done </v-icon>
      </template>
      <template v-slot:[`item.participante`]="{ item }">
        <span v-if="item.participante != 'NP'">
          {{ item.participante }}
        </span>
      </template>

      <template v-slot:[`footer.page-text`]="props">
        {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-card flat class="ma-1 elevation-0">
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel popout>
                  <!-- DESCRITIVO DA CLASSE -->
                  <v-expansion-panel-header class="clav-linear-background white--text">
                    <div class="separador">
                      <font size="4"><b> Descritivo da Classe</b></font>
                      <InfoBox
                        header="Descritivo da Classe"
                        :text="myhelp.Classe.BlocoDescritivo"
                        helpColor="white"
                      />
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
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
                    <Campo
                      v-if="item.exemplosNotasAp && item.exemplosNotasAp.length > 0"
                      color="neutralpurple"
                      nome="Exemplos de Notas de Aplicação"
                      infoHeader="Exemplos de Notas de Aplicação"
                      :infoBody="myhelp.Classe.Campos.ExemplosNotasAp"
                    >
                      <template v-slot:conteudo>
                        <ul>
                          <li v-for="n in item.exemplosNotasAp" :key="n.idExemplo">
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
                <v-expansion-panel v-if="item.codigo.split('.').length === 3" popout>
                  <!-- CONTEXTO DE AVALIAÇÂO DA CLASSE -->
                  <v-expansion-panel-header class="clav-linear-background white--text">
                    <div class="separador">
                      <font size="4"><b>Contexto de Avaliação</b></font>
                      <InfoBox
                        header="Contexto de Avaliação"
                        :text="myhelp.Classe.BlocoContexto"
                        helpColor="white"
                      />
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
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
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="item.codigo.split('.').length === 3" popout>
                  <!-- DECISÔES DE AVALIAÇÂO DA CLASSE -->
                  <v-expansion-panel-header class="clav-linear-background white--text">
                    <div class="separador">
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
                            : " Ano"
                        }}
                      </template>
                    </Campo>
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
                    <Campo
                      v-if="item.pca.formaContagem != ''"
                      color="neutralpurple"
                      nome="Forma de Contagem"
                      infoHeader="Forma de Contagem"
                      :infoBody="myhelp.Classe.Campos.FormaContagem"
                    >
                      <template v-slot:conteudo>
                        {{ item.pca.formaContagem }}
                      </template>
                    </Campo>
                    <Campo
                      v-if="
                        item.pca.subFormaContagem != undefined &&
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
                    <Campo
                      v-if="item.pca.justificacao.length > 0"
                      color="neutralpurple"
                      nome="Justificação"
                      infoHeader="Justificação"
                      :infoBody="myhelp.Classe.Campos.JustificacaoPCA"
                    >
                      <template v-slot:conteudo>
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
                              c.tipoId == 'CriterioJustificacaoUtilidadeAdministrativa'
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

                    <v-toolbar
                      class="clav-linear-background white--text my-4"
                      rounded
                      width="100%"
                      height="30%"
                    >
                      <v-toolbar-title>Destino Final</v-toolbar-title>
                    </v-toolbar>
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
                    <Campo
                      v-if="item.df.justificacao.length > 0"
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
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoDensidadeInfo'">
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
                            v-if="c.tipoId == 'CriterioJustificacaoComplementaridadeInfo'"
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

      <template v-slot:pageText="props">
        Processos {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>

    <!--div class="info-content">
        {{ JSON.stringify(p) }}
        </div-->
  </div>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
import Campo from "@/components/generic/Campo.vue";

export default {
  props: ["p"],
  components: {
    InfoBox,
    Campo,
  },

  data: () => ({
    procs: [],
    tsHeaders: [
      { text: "Código", value: "codigo", class: "subtitle-1", width: "15%" },
      { text: "Título", value: "titulo", class: "subtitle-1", width: "35%" },
      { text: "Dono", value: "dono", class: "subtitle-1", width: "15%" },
      {
        text: "Participante",
        value: "participante",
        class: "subtitle-1",
        width: "20%",
      },
      {
        text: "",
        value: "data-table-expand",
        width: "5%",
      },
    ],
    tsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [5, 10, -1],
      "items-per-page-all-text": "Todos",
    },
    myhelp: require("@/config/help").help,
  }),
  async created() {
    const lvl1 = await this.$request(
      "get",
      "/classes?estrutura=arvore&nivel=1&info=esqueleto"
    );
    const lvl2 = await this.$request(
      "get",
      "/classes?estrutura=arvore&nivel=2&info=esqueleto"
    );
    let aux = [];
    this.procs = JSON.parse(JSON.stringify(this.p.objeto.dados.ts.listaProcessos.procs));
    this.procs.map((proc) => {
      !aux.some((pr) => pr && proc.pai.codigo === pr.codigo)
        ? aux.push(lvl2.data.find((p) => p.codigo === proc.pai.codigo))
        : "";
    });
    aux.map((proc) => {
      this.procs.push(proc);
      let codigo = proc.codigo.split(".")[0];
      !this.procs.some((pr) => pr && pr.codigo === codigo)
        ? this.procs.push(lvl1.data.find((p) => p.codigo === codigo))
        : "";
    });
    this.procs.sort((p1, p2) => p1.codigo > p2.codigo);
  },
};
</script>

<style>
.info-label {
  color: #dee2f8;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>

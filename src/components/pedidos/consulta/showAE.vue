<template>
  <v-card class="mt-2">
    <v-card-title class="clav-linear-background white--text">
      {{ p.objeto.acao }} do Auto de Eliminação
      <v-spacer></v-spacer>
      <unicon
        name="criar-icon"
        width="20"
        height="20"
        viewBox="0 0 20.71 20.721"
        fill="white"
      />
    </v-card-title>
    <v-card-text>
      <Campo
        nome="Entidade Responsável"
        infoHeader="Nome da Entidade Responsável"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <span v-if="p.objeto.dados.entidade">
            {{ p.objeto.dados.entidade.split("_")[1] }}
          </span>
          <span v-else>
            {{ p.entidade }}
          </span>
        </template>
      </Campo>
      <Campo
        v-if="p.objeto.dados.legislacao"
        nome="Fonte de Legitimação"
        infoHeader="Fonte de Legitimação"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <a :href="'/legislacao/' + p.objeto.dados.refLegislacao">
            {{ p.objeto.dados.legislacao }}
          </a>
        </template>
      </Campo>
      <Campo
        v-else
        nome="Referencial Classificativo"
        infoHeader="Referencial Classificativo"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <a
            v-if="p.objeto.dados.tipo == 'RADA'"
            :href="'/rada/' + p.objeto.dados.referencial.split('#')[1]"
          >
            {{ p.objeto.dados.referencial.split("#")[0] }}
          </a>
          <span v-else>{{ p.objeto.dados.referencial.split("#")[0] }}</span>
        </template>
      </Campo>
      <Campo nome="Fundo" infoHeader="Fundo" color="neutralpurple">
        <template v-slot:conteudo>
          <ul>
            <li v-for="(f, i) in p.objeto.dados.fundo" :key="i">
              <a :href="'/entidades/ent_' + f.split(' - ')[0]">{{ f }}</a>
            </li>
          </ul>
        </template>
      </Campo>

      <Campo nome="Classes" infoHeader="Classes" color="neutralpurple">
        <template v-slot:conteudo>
          <v-list dense color="secondary">
            <v-list-group
              v-for="(item, index) in p.objeto.dados.zonaControlo"
              :key="index"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title
                    v-if="item.codigo && item.referencia"
                    v-text="item.codigo + ', ' + item.referencia"
                    ><span v-if="item.titulo">
                      - {{ item.titulo }}</span
                    ></v-list-item-title
                  >
                  <v-list-item-title
                    v-else-if="item.codigo"
                    v-text="item.codigo"
                    ><span v-if="item.titulo">
                      - {{ item.titulo }}</span
                    ></v-list-item-title
                  >
                  <v-list-item-title v-else v-text="item.referencia"
                    ><span v-if="item.titulo">
                      - {{ item.titulo }}</span
                    ></v-list-item-title
                  >
                </v-list-item-content>
              </template>
              <v-list-item-content>
                <v-list-item-title>
                  <Campo
                    v-if="item.codigo"
                    nome="Código da classe"
                    infoHeader="Código da classe"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.codigo }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.referencia"
                    nome="Referência"
                    infoHeader="Referência"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.referencia }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.titulo"
                    nome="Título"
                    infoHeader="Título"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.titulo }}</span>
                    </template>
                  </Campo>
                  <Campo
                    nome="Data de Início"
                    infoHeader="Data de Início"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.dataInicio }}</span>
                    </template>
                  </Campo>
                  <Campo
                    nome="Data de Fim"
                    infoHeader="Data de Fim"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.dataFim }}</span>
                    </template>
                  </Campo>
                  <Campo
                    nome="N.º de agregações"
                    infoHeader="N.º de agregações"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span>
                        {{ item.nrAgregacoes ? item.nrAgregacoes : 0 }}</span
                      >
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.uiPapel"
                    nome="Medição das UI em papel (m.l.)"
                    infoHeader="Medição das UI em papel (m.l.)"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.uiPapel }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.uiDigital"
                    nome="Medição das UI em digital (Gb)"
                    infoHeader="Medição das UI em digital (Gb)"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.uiDigital }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.uiOutros"
                    nome="Medição das UI noutros suportes"
                    infoHeader="Medição das UI noutros suportes"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.uiOutros }}</span>
                    </template>
                  </Campo>
                  <table class="consulta mx-5">
                    <!--tr v-if="item.prazoConservacao">
                          <td style="width:20%;">
                            <div class="info-label">Prazo de Conservação Administrativa</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.prazoConservacao }} <span v-if="item.prazoConservacao=='1'">Ano</span><span v-else>Anos</span>
                          </td>
                        </tr-->
                    <!--tr v-if="item.notasPCA">
                          <td style="width:20%;">
                            <div class="info-label">
                              Notas do PCA
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.notasPCA }}</td>
                        </tr-->
                    <!--tr v-if="item.destino">
                          <td style="width:20%;">
                            <div class="info-label">Destino final</div>
                          </td>
                          <td v-if="item.destino === 'E'" style="width:80%;">
                            Eliminação
                          </td>
                          <td
                            v-else-if="item.destino === 'C'"
                            style="width:80%;"
                          >
                            Conservação
                          </td>
                          <td v-else style="width:80%;">
                            {{ item.destino }}
                          </td>
                        </tr-->
                    <!--tr v-if="item.notaDF">
                          <td style="width:20%;">
                            <div class="info-label">
                              Nota do DF
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.notaDF }}</td>
                        </tr-->

                    <!--tr v-if="item.destino=='CP' && item.justificaDF">
                          <td style="width:20%;">
                            <div class="info-label">
                              Justificação do DF
                            </div>
                          </td>
                          <td style="width:80%;"><span v-for="(just,index) in item.justificaDF" :key="index">{{ just }}</span></td>
                        </tr-->
                    <!--tr v-if="item.ni && (item.destino === 'C' || item.destino === 'Conservação')">
                          <td style="width:20%;">
                            <div class="info-label">
                              Natureza de intervenção
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.ni }}</td>
                        </tr-->
                    <!--tr v-if="item.dono && item.dono.length>0 && (item.destino === 'C' || item.destino === 'Conservação')">
                          <td style="width:20%;">
                            <div class="info-label">Donos do PN</div>
                          </td>
                          <td style="width:80%;"><li v-for="(d,i) in item.dono" :key="i">{{ d }}</li></td>
                        </tr-->
                  </table>
                  <div
                    class="ma-1"
                    v-if="item.agregacoes && item.agregacoes.length > 0"
                  >
                    <v-row justify="space-between" class="info-label">
                      <v-col>Lista de Agregações</v-col>
                      <v-col>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Procura"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-data-table
                      :headers="cabecalho"
                      :items="item.agregacoes"
                      :items-per-page="5"
                      class="elevation-1 ml-2 mt-3"
                      :footer-props="footer_props"
                      :search="search"
                    />
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-group>
          </v-list>
        </template>
      </Campo>
    </v-card-text>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/Campo";

export default {
  props: ["p"],
  components: {
    Campo,
  },

  data: () => ({
    search: "",
    cabecalho: [
      { text: "Código", align: "left", sortable: false, value: "codigo" },
      { text: "Título", align: "left", value: "titulo" },
      { text: "Data de Contagem", align: "center", value: "dataContagem" },
      { text: "Natureza de Intervenção", align: "center", value: "ni" },
    ],
    footer_props: {
      "items-per-page-text": "Mostrar",
    },
  }),
};
</script>

<style>
.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #1a237e;
}

.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}

.panel-info-custom .panel-body {
  font-size: 1pc;
  font-family: "Times New Roman", Times, serif;
}

.panel-noticiabox .panel-body {
  font-size: 1pc;
}

.panel-linkbox .panel-body {
  padding-top: 5px !important;
  padding-left: 30px !important;
  padding-bottom: 10px;
}

li .panel-body {
  padding: 0px;
}

li .panel-body li {
  margin-left: 20px;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}

.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
}
</style>

<template>
  <v-card class="ma-2 panel panel-default panel-custom">
    <v-card-title class="pa-2 indigo darken-4 title white--text" dark>
      Auto de Eliminação
    </v-card-title>
    <v-card-text class="panel-body">
      <div class="form-group">
        <table class="consulta ma-3">
          <tr>
            <td style="width:20%;">
              <div class="info-label">Número</div>
            </td>
            <td style="width:80%;">
              {{ ((auto.id || "").split("ae_")[1] || "").replace(/\_/g,"/") }}
            </td>
          </tr>
          <tr>
            <td style="width:20%;">
              <div class="info-label">Data de Autenticação</div>
            </td>
            <td style="width:80%;">
              {{ auto.data }}
            </td>
          </tr>
          <tr>
            <td style="width:20%;">
              <div class="info-label">Entidade Responsável</div>
            </td>
            <td style="width:80%;">
              <a :href="'/entidades/' + auto.entidade">{{ (auto.entidade || "").split("_")[1] +" - "+auto.entidadeNome}}</a>{{" ("+auto.responsavel+")"}}
            </td>
          </tr>
          <tr v-if="auto.legislacao">
            <td style="width:20%;">
              <div class="info-label">Fonte de Legitimação</div>
            </td>
            <td style="width:80%;">
              {{auto.tipo+" - "}}
              <a v-if="auto.tipo=='PGD'" :href="'/pgd/pgd_' + auto.refLegislacao">{{ auto.legislacao }}</a>
              <a v-else-if="auto.tipo=='RADA'" :href="'/pgd/tsRada_' + auto.refLegislacao">{{ auto.legislacao }}</a>
              <a v-else :href="'/legislacao/' + auto.refLegislacao">{{ auto.legislacao }}</a>
            </td>
          </tr>
          <tr v-else>
            <td style="width:20%;">
              <div class="info-label">Referencial Classificativo</div>
            </td>
            <td style="width:80%;">
              <span v-if="auto.referencialLabel"><a :href="'/ts/'+auto.referencial">{{auto.referencialLabel}}</a> (TS/LC)</span>
              <span v-else>{{auto.referencialTitulo}} (RADA/CLAV)</span>
            </td>
          </tr>
          <tr>
            <td style="width:20%;">
              <div class="info-label">Fundo</div>
            </td>
            <td style="width:80%;">
              <li v-for="(f,i) in auto.fundo" :key="i">
                <a :href="'/entidades/' + f">{{ (f.fundo || "").split("_")[1] +" - "+f.nome}}</a>
              </li>
            </td>
          </tr>
        </table>
        <v-expansion-panels v-model="panel" multiple popout>
          <v-expansion-panel class="ma-1">
            <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text"
              >Classes</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-list>
                <v-list-group
                  v-for="item in auto.zonaControlo"
                  :key="item.codigo"
                  color="grey darken-1"
                  no-action
                >
                  <template v-slot:activator>
                    <v-list-item-content class="info-label">
                      <v-list-item-title class="mx-2">
                        <div v-if="item.codigo && item.referencia">{{item.codigo + ': ' + item.referencia + ' - ' + item.titulo}}</div>
                        <div v-else-if="item.codigo">{{item.codigo + ' - ' + item.titulo}}</div>
                        <div v-else>{{item.referencia + ' - ' + item.titulo}}</div>
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item-content>
                    <v-list-item-title class="wrap-text">
                      <table class="consulta mx-5">
                        <tr v-if="item.codigo">
                          <td style="width:20%;">
                            <div class="info-label">Código da classe</div>
                          </td>
                          <td style="width:80%;">
                            <div v-if="auto.tipo=='TS/LC'">
                              <a
                                :href="'/classes/consultar/c' + item.codigo"
                                >{{ item.codigo }}</a
                              >
                            </div>
                            <div v-else>{{item.codigo}}</div>
                          </td>
                        </tr>
                        <tr v-if="item.referencia">
                          <td style="width:20%;">
                            <div class="info-label">Referência</div>
                          </td>
                          <td style="width:80%;">
                            <div>{{item.referencia}}</div>
                          </td>
                        </tr>
                        <tr v-if="item.titulo">
                          <td style="width:20%;">
                            <div class="info-label">Título</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.titulo }}
                          </td>
                        </tr>
                        <tr v-if="item.pca && item.pca != 'NE'">
                          <td style="width:20%;">
                            <div class="info-label">Prazo de Conservação Administrativa</div>
                          </td>
                          <td style="width:80%;">
                            <span v-if="item.pca=='1'">{{ item.pca }} Ano</span>
                            <span v-else>{{ item.pca }} Anos</span>
                          </td>
                        </tr>
                        <tr v-if="item.destino && item.destino != 'NE'">
                          <td style="width:20%;">
                            <div class="info-label">Destino Final</div>
                          </td>
                          <td v-if="item.destino === 'E'" style="width:80%;">
                            Eliminação
                          </td>
                          <td v-else-if="item.destino === 'C'" style="width:80%;">
                            Conservação
                          </td>
                          <td v-else style="width:80%;">
                            {{ item.destino }}
                          </td>
                        </tr>
                        <tr v-if="item.ni">
                          <td style="width:20%;">
                            <div class="info-label">
                              Natureza de intervenção
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.ni }}</td>
                        </tr>
                        <tr v-if="item.dono && item.dono.length>0 ">
                          <td style="width:20%;">
                            <div class="info-label">Dono do PN</div>
                          </td>
                          <td style="width:80%;"><li v-for="(d,i) in item.dono" :key="i">
                            <a :href='"/entidade/"+d.dono' >{{ (d.dono || "").split("_")[1] +" - "+d.nome }}</a>
                          </li></td>
                        </tr>
                        <tr>
                          <td style="width:20%;">
                            <div class="info-label">Data de Início</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.dataInicio }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width:20%;">
                            <div class="info-label">Data de Fim</div>
                          </td>
                          <td style="width:80%;">{{ item.dataFim }}</td>
                        </tr>
                        <tr v-if="item.agregacoes && item.agregacoes.length>0">
                          <td style="width:20%;">
                            <div class="info-label">
                              N.º de agregações
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.agregacoes.length }}</td>
                        </tr>
                        <tr v-if="item.UIpapel">
                          <td style="width:20%;">
                            <div class="info-label">
                              Medição das UI em papel (m.l.)
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.UIpapel }}</td>
                        </tr>
                        <tr v-if="item.UIdigital">
                          <td style="width:20%;">
                            <div class="info-label">
                              Medição das UI em digital (Gb)
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.UIdigital }}</td>
                        </tr>
                        <tr v-if="item.UIoutros">
                          <td style="width:20%;">
                            <div class="info-label">
                              Medição das UI noutros suportes
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.UIoutros }}</td>
                        </tr>
                      </table>
                      <div class="ma-1" v-if="item.agregacoes && item.agregacoes.length>0">
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
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div>
        <v-btn medium class="primary darken-4" @click="$router.go(-1)">
          Voltar
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["auto"],
  data: () => ({
    search: "",
    panel: [0],
    cabecalho: [
      { text: "Código", align: "left", sortable: false, value: "codigo" },
      { text: "Título", align: "left", value: "titulo" },
      { text: "Data de Contagem", align: "center", value: "dataContagem" },
      { text: "Natureza de Intervenção", align: "center", value: "ni" }
    ],
    footer_props: {
      "items-per-page-text": "Mostrar"
    }
  })
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

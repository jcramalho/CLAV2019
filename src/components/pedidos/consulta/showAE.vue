<template>
<v-card class="my-2 panel panel-default panel-custom">
    <v-card-title class="pa-2 indigo darken-4 title white--text" dark>
      {{ p.objeto.acao }} do Auto de Eliminação
    </v-card-title>
    <v-card-text class="panel-body">
      <div class="form-group">
        <table class="consulta">
          <tr>
            <td style="width:20%;">
              <div class="info-label">Entidade Responsável:</div>
            </td>
            <td style="width:80%;">
              {{ p.objeto.dados.ae.entidade }}
            </td>
          </tr>
          <tr>
            <td style="width:20%;">
              <div class="info-label">Fonte de Legitimação:</div>
            </td>
            <td style="width:80%;">{{ p.objeto.dados.ae.legislacao }}</td>
          </tr>
          <tr>
            <td style="width:20%;">
              <div class="info-label">Fundo:</div>
            </td>
            <td style="width:80%;">{{ p.objeto.dados.ae.fundo }}</td>
          </tr>
        </table>

        <v-expansion-panels popout>
          <v-expansion-panel class="ma-1">
            <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text"
              >Zonas de Controlo</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-list>
                <v-list-group
                  v-for="item in p.objeto.dados.ae.zonaControlo"
                  :key="item.codigo"
                  color="grey darken-1"
                  no-action
                >
                  <template v-slot:activator>
                    <v-list-item-content class="info-label">
                      <v-list-item-title
                        v-if="item.codigo && item.referencia"
                        v-text="
                          'Zona de Controlo - ' +
                            item.codigo +
                            ' ' +
                            item.referencia
                        "
                      ></v-list-item-title>
                      <v-list-item-title
                        v-else-if="item.codigo"
                        v-text="'Zona de Controlo - ' + item.codigo"
                      ></v-list-item-title>
                      <v-list-item-title
                        v-else
                        v-text="'Zona de Controlo - ' + item.referencia"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item-content>
                    <v-list-item-title>
                      <table class="consulta mx-5">
                        <tr v-if="item.codigo">
                          <td style="width:20%;">
                            <div class="info-label">Código da class:</div>
                          </td>
                          <td style="width:80%;">
                            <a
                              v-if="!item.referencia"
                              :href="'/classes/consultar/c' + item.codigo"
                              >{{ item.codigo }}</a
                            >
                            <div v-else>{{ item.codigo }}</div>
                          </td>
                        </tr>
                        <tr v-if="item.referencia">
                          <td style="width:20%;">
                            <div class="info-label">Referência:</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.referencia }}
                          </td>
                        </tr>
                        <tr v-if="item.titulo">
                          <td style="width:20%;">
                            <div class="info-label">Título:</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.titulo }}
                          </td>
                        </tr>
                        <tr v-if="item.prazoConservacao">
                          <td style="width:20%;">
                            <div class="info-label">Prazo de Conservação Administrativa:</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.prazoConservacao }} Anos
                          </td>
                        </tr>
                        <tr v-if="item.destino">
                          <td style="width:20%;">
                            <div class="info-label">Destino Final:</div>
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
                              Natureza de intervenção:
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.ni }}</td>
                        </tr>
                        <tr v-if="item.dono">
                          <td style="width:20%;">
                            <div class="info-label">Dono do PN:</div>
                          </td>
                          <td style="width:80%;">{{ item.dono }}</td>
                        </tr>
                        <tr>
                          <td style="width:20%;">
                            <div class="info-label">Data de Início:</div>
                          </td>
                          <td style="width:80%;">
                            {{ item.dataInicio }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width:20%;">
                            <div class="info-label">Data de Fim:</div>
                          </td>
                          <td style="width:80%;">{{ item.dataFim }}</td>
                        </tr>
                        <tr>
                          <td style="width:20%;">
                            <div class="info-label">
                              N.º de agregações:
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.agregacoes.length }}</td>
                        </tr>
                        <tr v-if="item.uiPapel">
                          <td style="width:20%;">
                            <div class="info-label">
                              Medição das UI em papel (m.l.):
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.uiPapel }}</td>
                        </tr>
                        <tr v-if="item.uiDigital">
                          <td style="width:20%;">
                            <div class="info-label">
                              Medição das UI em digital (Gb):
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.uiDigital }}</td>
                        </tr>
                        <tr v-if="item.uiOutros">
                          <td style="width:20%;">
                            <div class="info-label">
                              Medição das UI noutros suportes:
                            </div>
                          </td>
                          <td style="width:80%;">{{ item.uiOutros }}</td>
                        </tr>
                      </table>

                      <v-expansion-panels>
                        <v-expansion-panel class="ma-2">
                          <v-expansion-panel-header class="pa-4 indigo darken-4 title white--text"
                            >Zonas de Agregação</v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <v-list class="ma-1">
                              <v-list-group
                                v-for="subItem in item.agregacoes"
                                :key="subItem.codigo"
                                color="grey darken-1"
                                no-action
                              >
                                <template v-slot:activator>
                                  <v-list-item-content class="info-label mx-3">
                                    <v-list-item-title
                                      v-text="'Agregação ' + subItem.codigo"
                                    ></v-list-item-title>
                                  </v-list-item-content>
                                </template>
                                <v-list-item-content>
                                  <v-list-item-title>
                                    <table class="consulta mx-8">
                                      <tr>
                                        <td style="width:20%;">
                                          <div class="info-label">
                                            Código da agregações:
                                          </div>
                                        </td>
                                        <td style="width:80%;">
                                          {{ subItem.codigo }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="width:20%;">
                                          <div class="info-label">
                                            Título da agregações:
                                          </div>
                                        </td>
                                        <td style="width:80%;">
                                          {{ subItem.titulo }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="width:20%;">
                                          <div class="info-label">
                                            Data de Contagem do PCA:
                                          </div>
                                        </td>
                                        <td style="width:80%;">
                                          {{ subItem.dataContagem }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="width:20%;">
                                          <div class="info-label">
                                            Natureza de Intervenção:
                                          </div>
                                        </td>
                                        <td style="width:80%;">
                                          {{ subItem.ni }}
                                        </td>
                                      </tr>
                                    </table>
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-group>
                            </v-list>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-group>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"],

  data: () => ({})
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
</style>

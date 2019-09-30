<template>
        <v-card class="ma-4 panel panel-default panel-custom">
          <v-toolbar class="panel-heading">
            <v-toolbar-title class="page-header">
              <h1>{{ "Auto de Eliminação - "+ auto.id }}</h1>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="panel-body">
            <div class="form-group">
              <table class="consulta">
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Número do Auto:</div>
                  </td>
                  <td style="width:80%;">{{ auto.id }}</td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Data de Autenticação:</div>
                  </td>
                  <td style="width:80%;">{{ auto.data }}</td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Entidade Responsável:</div>
                  </td>
                  <td style="width:80%;">
                    <a
                      :href="'/entidades/'+auto.entidade.split('#')[1]"
                    >{{auto.entidade.split("#ent_")[1]}}</a>
                  </td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Identificação Responsável:</div>
                  </td>
                  <td style="width:80%;">{{auto.responsavel}}</td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Fonte de Legitimação:</div>
                  </td>
                  <td style="width:80%;">{{auto.legislacao}}</td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Fundo:</div>
                  </td>
                  <td style="width:80%;">{{auto.fundo}}</td>
                </tr>
              </table>
              <v-expansion-panels popout>
                <v-expansion-panel class="ma-1">
                  <v-expansion-panel-header class="info-label">Zonas de Controlo</v-expansion-panel-header>
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
                            <v-list-item-title
                              v-if="typeof item.codigo !== 'undefined' && typeof item.referencia !== 'undefined'"
                              v-text="'Zona de Controlo - '+item.codigo+' '+item.referencia"
                            ></v-list-item-title>
                            <v-list-item-title
                              v-else-if="typeof item.codigo !== 'undefined'"
                              v-text="'Zona de Controlo - '+item.codigo"
                            ></v-list-item-title>
                            <v-list-item-title
                              v-else
                              v-text="'Zona de Controlo - '+item.referencia"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </template>
                        <v-list-item-content>
                          <v-list-item-title>
                            <table class="consulta mx-5">
                              <tr v-if="typeof item.codigo !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Código da class:</div>
                                </td>
                                <td style="width:80%;">
                                  <a
                                    v-if="typeof item.referencia==='undefined'"
                                    :href="'/classes/consultar/c'+item.codigo"
                                  >{{ item.codigo }}</a>
                                  <div v-else>{{item.codigo}}</div>
                                </td>
                              </tr>
                              <tr v-if="typeof item.referencia !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Referência:</div>
                                </td>
                                <td style="width:80%;">{{ item.referencia }}</td>
                              </tr>
                              <tr v-if="typeof item.ni !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Natureza de intervenção:</div>
                                </td>
                                <td style="width:80%;">{{ item.ni }}</td>
                              </tr>
                              <tr v-if="typeof item.dono !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Dono do PN:</div>
                                </td>
                                <td style="width:80%;">{{ item.dono }}</td>
                              </tr>
                              <tr>
                                <td style="width:20%;">
                                  <div class="info-label">Data de Início:</div>
                                </td>
                                <td style="width:80%;">{{ item.dataInicio }}</td>
                              </tr>
                              <tr>
                                <td style="width:20%;">
                                  <div class="info-label">Data de Fim:</div>
                                </td>
                                <td style="width:80%;">{{ item.dataFim }}</td>
                              </tr>
                              <tr>
                                <td style="width:20%;">
                                  <div class="info-label">N.º de agregações:</div>
                                </td>
                                <td style="width:80%;">{{ item.ag.length }}</td>
                              </tr>
                              <tr v-if="typeof item.uiPapel !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Medição das UI em papel (m.l.):</div>
                                </td>
                                <td style="width:80%;">{{ item.uiPapel }}</td>
                              </tr>
                              <tr v-if="typeof item.uiDigital !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Medição das UI em digital (Gb):</div>
                                </td>
                                <td style="width:80%;">{{ item.uiDigital }}</td>
                              </tr>
                              <tr v-if="typeof item.uiOutros !== 'undefined'">
                                <td style="width:20%;">
                                  <div class="info-label">Medição das UI noutros suportes:</div>
                                </td>
                                <td style="width:80%;">{{ item.uiOutros }}</td>
                              </tr>
                            </table>
                            <v-expansion-panels>
                              <v-expansion-panel class="ma-1">
                                <v-expansion-panel-header class="info-label">Zonas de Agregação</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <v-list class="ma-1">
                                    <v-list-group
                                      v-for="subItem in item.ag"
                                      :key="subItem.codigo"
                                      color="grey darken-1"
                                      no-action
                                    >
                                      <template v-slot:activator>
                                        <v-list-item-content class="info-label mx-3">
                                          <v-list-item-title v-text="'Agregação '+subItem.codigo"></v-list-item-title>
                                        </v-list-item-content>
                                      </template>
                                      <v-list-item-content>
                                        <v-list-item-title>
                                          <table class="consulta mx-8">
                                            <tr>
                                              <td style="width:20%;">
                                                <div class="info-label">Código da agregações:</div>
                                              </td>
                                              <td style="width:80%;">{{ subItem.codigo }}</td>
                                            </tr>
                                            <tr>
                                              <td style="width:20%;">
                                                <div class="info-label">Título da agregações:</div>
                                              </td>
                                              <td style="width:80%;">{{ subItem.titulo }}</td>
                                            </tr>
                                            <tr>
                                              <td style="width:20%;">
                                                <div class="info-label">Data de Contagem do PCA:</div>
                                              </td>
                                              <td style="width:80%;">{{ subItem.dataContagem }}</td>
                                            </tr>
                                            <tr>
                                              <td style="width:20%;">
                                                <div class="info-label">Natureza de Intervenção:</div>
                                              </td>
                                              <td style="width:80%;">
                                                <div
                                                  v-if="subItem.ni.split('#vc_naturezaIntervencao_')[1]==='dono'"
                                                >Dono</div>
                                                <div
                                                  v-else-if="subItem.ni.split('#vc_naturezaIntervencao_')[1]==='paticipante'"
                                                >Participante</div>
                                                <div v-else></div>
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
            <div>
              <v-btn medium color="primary" @click="$router.go(-1)">Voltar</v-btn>
            </div>
          </v-card-text>
        </v-card>
</template>

<script>
const help = require("@/config/help").help;
import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["auto"],
  components: {
  },
  data: () => ({
    domainCollapsed: true,
    entCollapsed: true,
    partsCollapsed: {
      Apreciador: true,
      Assessor: true,
      Comunicador: true,
      Decisor: true,
      Executor: true,
      Iniciador: true
    },
    participationsDic: {
      Apreciador: "Apreciar",
      Assessor: "Assessorar",
      Comunicador: "Comunicar",
      Decisor: "Decidir",
      Executor: "Executar",
      Iniciador: "Iniciar"
    },
    myhelp: help
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
  border-color: #8c9eff;
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
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
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

<template>
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
            v-if="item.codigo && item.referencia"
            v-text="
                item.codigo +
                ' - ' +
                item.referencia +
                ' - ' +
                item.titulo
            "
          ></v-list-item-title>
          <v-list-item-title
            v-else-if="item.codigo"
            v-text="item.codigo + ' - ' + item.titulo"
          ></v-list-item-title>
          <v-list-item-title
            v-else
            v-text="item.referencia + ' - ' + item.titulo"
          ></v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list-item-content>
        <v-list-item-title>
          <v-row v-if="item.codigo">
            <v-col cols="3">
              <div class="info-label">Código da class:</div>
            </v-col>
            <v-col class="mt-2">
              {{ item.codigo }}
            </v-col>
          </v-row>
          <v-row v-if="item.referencia">
            <v-col cols="3">
              <div class="info-label">Referência:</div>
            </v-col>
            <v-col class="mt-2">
              {{ item.referencia }}
            </v-col>
          </v-row>
          <v-row v-if="item.titulo">
            <v-col cols="3">
              <div class="info-label">Título:</div>
            </v-col>
            <v-col class="mt-2">
              {{ item.titulo }}
            </v-col>
          </v-row>
          <v-row v-if="item.prazoConservacao">
            <v-col cols="3">
              <div class="info-label">Prazo de Conservação Administrativa:</div>
            </v-col>
            <v-col class="mt-2">
              {{ item.prazoConservacao }} Anos
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="3">
              <div class="info-label">Prazo de Conservação Administrativa:</div>
            </v-col>
            <v-col class="mt-2">
              <v-text-field :value="item.prazo" label="Insira o PCA em Anos" hint="Exemplo: 10" solo clearable></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <div class="info-label">Destino Final:</div>
            </v-col>
            <v-col class="mt-2">
              <v-select v-if="tipo!='PGD_LC'" :items="df" v-model="item.destino" solo dense></v-select>
              <span v-else>{{item.destino}}</span>
            </v-col>
          </v-row>
          <div v-if="item.destino==='Conservação' || item.destino==='C'">
            <v-row>
              <v-col cols="3">
                <div class="info-label">
                  Natureza de intervenção:
                </div>
              </v-col>
              <v-col class="mt-2">
                Participante
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="info-label">Dono do PN:</div>
              </v-col>
              <v-col class="mt-2">
              <v-autocomplete
                label="Selecione as entidades donas do processo"
                :items="donos"
                v-model="item.dono"
                solo
                dense
                chips
                multiple
              ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="3">
              <div class="info-label">Data de Início:</div>
            </v-col>
            <v-col class="mt-2">
              {{ item.dataInicio }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <div class="info-label">Data de Fim:</div>
            </v-col>
            <v-col class="mt-2">{{ item.dataFim }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <div class="info-label">
                N.º de agregações:
              </div>
            </v-col>
            <v-col class="mt-2">{{ item.agregacoes.length }}</v-col>
          </v-row>
          <v-row v-if="item.uiPapel">
            <v-col cols="3">
              <div class="info-label">
                Medição das UI em papel (m.l.):
              </div>
            </v-col>
            <v-col class="mt-2">{{ item.uiPapel }}</v-col>
          </v-row>
          <v-row v-if="item.uiDigital">
            <v-col cols="3">
              <div class="info-label">
                Medição das UI em digital (Gb):
              </div>
            </v-col>
            <v-col class="mt-2">{{ item.uiDigital }}</v-col>
          </v-row>
          <v-row v-if="item.uiOutros">
            <v-col cols="3">
              <div class="info-label">
                Medição das UI noutros suportes:
              </div>
            </v-col>
            <v-col class="mt-2">{{ item.uiOutros }}</v-col>
          </v-row>
        <div class="ma-1">
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

<script>
export default {
  props: ["auto","donos","submit","tipo"],

  data: () => ({
    df: ["Eliminação", "Conservação"],
    search: "",
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
</style>

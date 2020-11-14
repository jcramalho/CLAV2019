<template>
 <div>
    <v-row>
      <v-col>
        <v-text-field
          shaped
          rounded
          filled
          readonly
          dense
          hide-details
          label="Entidade Responsável"
          :value="p.objeto.dados.entidade.split('_')[1]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="p.objeto.dados.legislacao">
        <v-text-field
          shaped
          rounded
          filled
          readonly
          dense
          hide-details
          label="Fonte de Legitimação"
          :value="p.objeto.dados.legislacao"
        />
      </v-col>
      <v-col v-else>
        <v-text-field
          shaped
          rounded
          filled
          readonly
          dense
          hide-details
          label="Referencial Classificativo"
          :value="p.objeto.dados.referencial.split('#')[0]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          shaped
          rounded
          filled
          readonly
          auto-grow
          dense
          :rows="p.objeto.dados.fundo.length"
          hide-details
          label="Fundo"
          :value="p.objeto.dados.fundo.join('\n')"
        />
      </v-col>
    </v-row>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header class="pa-2 pl-5 blue-grey lighten-5 subtitle grey--text text--darken-1"
              >Classes</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-list>
                <v-list-group
                  v-for="(item,index) in p.objeto.dados.zonaControlo"
                  :key="index"
                  color="grey darken-1"
                  no-action
                >
                  <template v-slot:activator>
                    <v-list-item-content class="blue-grey lighten-5 grey--text text--darken-3">
                      <v-list-item-title class="px-2"
                        v-if="item.codigo && item.referencia"
                        v-text="
                          item.codigo +
                            ', ' +
                          item.referencia +
                            ' - ' +
                          item.titulo                           
                        "
                      ></v-list-item-title>
                      <v-list-item-title class="px-2"
                        v-else-if="item.codigo"
                        v-text="item.codigo + ' - ' + item.titulo"
                      ></v-list-item-title>
                      <v-list-item-title class="px-2"
                        v-else
                        v-text="item.referencia + ' - ' + item.titulo"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item-content>
                    <v-list-item-title class="wrap-text">
                      <v-row v-if="item.codigo">
                        <v-col>
                          <v-text-field
                            v-if="item.codigo"
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Código da classe"
                            :value="item.codigo"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.referencia">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Referência"
                            :value="item.referencia"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.titulo">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Título"
                            :value="item.titulo"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.prazoConservacao">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Prazo de Conservação Administrativa"
                            :value="item.prazoConservacao==='1' ? item.prazoConservacao + ' Ano' : item.prazoConservacao + ' Anos'"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.destino">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Destino Final"
                            :value="item.destino === 'E' ? 'Eliminação' : item.destino === 'C' ? 'Conservação' : item.destino"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Data de Início"
                            :value="item.dataInicio"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Data de Fim"
                            :value="item.dataFim"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="N.º de agregações"
                            :value="item.agregacoes.length==0 ? item.nrAgregacoes : item.agregacoes.length"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.uiPapel">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Medição das UI em papel (m.l.)"
                            :value="item.uiPapel"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.uiDigital">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Medição das UI em digital (Gb)"
                            :value="item.uiDigital"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="item.uiOutros">
                        <v-col>
                          <v-text-field
                            shaped
                            rounded
                            filled
                            readonly
                            dense
                            hide-details
                            label="Medição das UI noutros suportes"
                            :value="item.uiOutros"
                          />
                        </v-col>
                      </v-row>
                      <div class="ma-1" v-if="item.agregacoes.length >0">
                        <v-row justify="space-between" class="blue-grey lighten-5">
                          <v-col><span class="pa-5" color="grey darken-3">Lista de Agregações</span></v-col>
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
</template>

<script>
export default {
  props: ["p"],

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

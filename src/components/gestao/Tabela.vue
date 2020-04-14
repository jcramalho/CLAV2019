<template>
  <v-card>
    <v-card-title>
      Tabela de indicadores estatisticos

      <download-csv
        :data="indicadores"
        name="indicadores.csv"
        :labels="labels"
        :fields="fields"
        v-on:export-finished="exported"
      >
        <v-btn 
          class="ml-5"
          fab 
          small 
          color="indigo darken-4"
        >
          <v-icon color="white">cloud_download</v-icon>
        </v-btn>
      </download-csv>

      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="indicadores"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
/* eslint-disable */
  export default {
    data () {
      return {
        search: '',
        labels: {
          indicador: 'Indicador',
          valor: 'Valor'
        },
        fields : ['indicador', 'valor'],
        headers: [
          {
            text: 'Indicador',
            sortable: true,
            value: 'indicador',
          },
          { text: 'Valor', value: 'valor' }
        ],
        indicadores: [],
      }
    },
  created() {
    this.getIndicadores();
  },
  methods: {
    async getIndicadores() {
      await this.$request("get", "/indicadores/tabela")
        .then(res => {
          this.indicadores = res.data;
          this.indicadores.forEach(element => {
            if(element.indicador.includes('#')) {
              element.indicador = element.indicador.split('#')[1];
              element.indicador = element.indicador.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
              element.indicador = element.indicador[0].toUpperCase() + element.indicador.slice(1);
              element.indicador = element.indicador.replace(/^E/g, 'É');
              element.indicador = element.indicador.replace(/Tem Rel Proc/g, 'Relacoes Entre Processos');
            } else if (element.indicador === 'C' | 
                       element.indicador === 'CP'|
                       element.indicador === 'E' |
                       element.indicador === 'NE'){
              element.indicador = "Destino final " + element.indicador; 
            } else {
            }
          });
        })
        .catch(error => alert(error));
    }
  }
}
</script>
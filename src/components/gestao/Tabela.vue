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
        indicadores: [
          {
            indicador: 'Frozen Yogurt',
            valor: 159
          },
          {
            indicador: 'Ice cream sandwich',
            valor: 237
          },
          {
            indicador: 'Eclair',
            valor: 262
          },
          {
            indicador: 'Cupcake',
            valor: 305
          },
          {
            indicador: 'Gingerbread',
            valor: 356
          },
          {
            indicador: 'Jelly bean',
            valor: 375
          },
          {
            indicador: 'Lollipop',
            valor: 392
          },
          {
            indicador: 'Honeycomb',
            valor: 408
          },
          {
            indicador: 'Donut',
            valor: 452
          },
          {
            indicador: 'KitKat',
            valor: 518
          },
        ],
      }
    },
  created() {
    this.getIndicadores();
  },
  methods: {
    async getIndicadores() {
      await this.$request("get", "/stats/tabela")
        .then(res => {
          this.indicadores = res.data;
          this.indicadores.forEach(element => {
            if(element.indicador.includes('#')) {
              element.indicador = element.indicador.split('#')[1];
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
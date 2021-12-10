<template>
  <v-card flat class="pa-3">
    <v-card-title>
      <p class="clav-content-title-1">Tabela de indicadores estatisticos</p>
      <v-spacer></v-spacer>
      <v-tooltip top color="info" open-delay="500">
        <template v-slot:activator="{ on }">
          <download-csv
            :data="indicadores"
            name="indicadores.csv"
            :labels="labels"
            :fields="fields"
          >
            <v-btn v-on="on" class="ml-5" small color="primary">
              <v-icon color="white">cloud_download</v-icon>
            </v-btn>
          </download-csv>
        </template>

        <span>Download da tabela de indicadores em CSV</span>
      </v-tooltip>
    </v-card-title>

    <v-card flat class="clav-info-content">
      <v-tooltip top color="info" open-delay="500">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-on="on"
            v-model="search"
            append-icon="search"
            label="Procurar / filtrar tabela"
            text
            single-line
            hide-details
            clearable
            color="blue darken-3"
            class="mt-n2 mb-3 mx-6 font-weight-medium"
          ></v-text-field>
        </template>

        <span> Filtrar tabela</span>
      </v-tooltip>
      <v-data-table
        class="table-content"
        :headers="headers"
        :items="indicadores"
        :search="search"
        :footer-props="procsFooterProps"
      ></v-data-table>
    </v-card>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      labels: {
        indicador: "Indicador",
        valor: "Valor",
      },
      fields: ["indicador", "valor"],
      procsFooterProps: {
        "items-per-page-text": "Indicadores por página",
        "items-per-page-options": [10, 20, 100, -1],
        "items-per-page-all-text": "Todos",
      },
      headers: [
        {
          text: "Indicador",
          sortable: true,
          value: "indicador",
        },
        {
          text: "Valor",
          value: "valor",
        },
      ],
      indicadores: [
        {
          indicador: "",
          valor: "",
        },
      ],
    };
  },
  created() {
    this.getIndicadores();
  },
  methods: {
    async getIndicadores() {
      await this.$request("get", "/indicadores/tabela")
        .then((res) => {
          this.indicadores = res.data;
          this.indicadores.forEach((element) => {
            if (element.indicador.includes("#")) {
              element.indicador = element.indicador.split("#")[1];
              element.indicador = element.indicador.replace(
                /([a-z0-9])([A-Z])/g,
                "$1 $2"
              );
              element.indicador =
                element.indicador[0].toUpperCase() + element.indicador.slice(1);
              element.indicador = element.indicador.replace(/^E/g, "É");
              element.indicador = element.indicador.replace(
                /Tem Rel Proc/g,
                "Relacoes Entre Processos"
              );
            } else if (
              (element.indicador === "C") |
              (element.indicador === "CP") |
              (element.indicador === "E") |
              (element.indicador === "NE")
            ) {
              element.indicador = "Destino final " + element.indicador;
            }
          });
        })
        .catch((error) => alert(error));
    },
  },
};
</script>

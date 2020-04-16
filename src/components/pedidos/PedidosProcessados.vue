<template>
  <v-expansion-panel popout focusable>
    <v-expansion-panel-header
      class="indigo darken-3 bold--text white--text"
      dark
    >
      <div>
        <b>Pedidos Processados</b>
        <sup class="ml-1">
          <v-badge color="red">
            <template v-slot:badge>
              {{ pedidos.length }}
            </template>
          </v-badge>
        </sup>
      </div>

      <template v-slot:actions>
        <v-icon color="white">expand_more</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="procurar"
            append-icon="search"
            label="Procurar pedido por código"
            single-line
            hide-details
            filled
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="pedidos"
          :search="procurar"
          class="elevation-1"
          sortDesc
          sort-by="data"
          :custom-sort="ordenaTabela"
          :footer-props="footer_props"
        >
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Não existem pedidos neste estado...
            </v-alert>
          </template>

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <template slot="headerCell" slot-scope="props">
            <span style="color: blue;">
              {{ props.header.text }}
            </span>
          </template>

          <template v-slot:item="props">
            <tr>
              <td class="subheading">{{ props.item.codigo }}</td>
              <td class="subheading">
                {{ props.item.objeto.acao }} - {{ props.item.objeto.tipo }}
              </td>
              <td class="subheading">
                <span v-if="props.item.entidade">{{
                  props.item.entidade.split("_")[1]
                }}</span>
              </td>
              <td class="subheading">{{ props.item.criadoPor }}</td>
              <td class="subheading">{{ converteData(props.item.data) }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      @click="showPedido(props.item)"
                      color="indigo darken-2"
                      v-on="on"
                      >visibility</v-icon
                    >
                  </template>
                  <span>Ver pedido...</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      @click="distribuiPedido(props.item)"
                      color="indigo darken-2"
                      v-on="on"
                      >person</v-icon
                    >
                  </template>
                  <span>Distribuir pedido...</span>
                </v-tooltip>
                <v-tooltip bottom v-if="false">
                  <template v-slot:activator="{ on }">
                    <v-icon color="red darken-2" v-on="on">delete</v-icon>
                  </template>
                  <span>Apagar pedido</span>
                </v-tooltip>
              </td>
            </tr>
          </template>

          <template v-slot:pageText="props">
            Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: ["pedidos", "titulo"],

  data: () => {
    return {
      procurar: "",
      headers: [
        {
          text: "Código",
          value: "codigo",
          sortable: true,
          class: "title",
          filterable: true,
        },
        {
          text: "Tipo",
          value: "tipo",
          sortable: false,
          class: "title",
          filterable: false,
        },
        {
          text: "Entidade",
          value: "entidade",
          sortable: false,
          class: "title",
          filterable: false,
        },
        {
          text: "Responsável",
          value: "responsavel",
          sortable: false,
          class: "title",
          filterable: false,
        },
        {
          text: "Data",
          align: "left",
          sortable: true,
          value: "data",
          class: "title",
          filterable: false,
        },
        { text: "Tarefa", sortable: false, class: "title", filterable: false },
      ],

      footer_props: {
        "items-per-page-text": "Pedidos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },

  methods: {
    ordenaTabela(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === "codigo") {
          if (!isDesc[0]) {
            return (
              parseInt(b[index].split("-")[0].concat(b[index].split("-")[1])) -
              parseInt(a[index].split("-")[0].concat(a[index].split("-")[1]))
            );
          } else {
            return (
              parseInt(a[index].split("-")[0].concat(a[index].split("-")[1])) -
              parseInt(b[index].split("-")[0].concat(b[index].split("-")[1]))
            );
          }
        } else if (index[0] === "data") {
          if (!isDesc[0]) {
            return new Date(b[index]) - new Date(a[index]);
          } else {
            return new Date(a[index]) - new Date(b[index]);
          }
        } else {
          if (
            typeof a[index] !== "undefined" &&
            typeof b[index] !== "undefined"
          ) {
            if (!isDesc[0]) {
              return a[index]
                .toLowerCase()
                .localeCompare(b[index].toLowerCase());
            } else {
              return b[index]
                .toLowerCase()
                .localeCompare(a[index].toLowerCase());
            }
          }
        }
      });
      return items;
    },

    converteData(data) {
      let novaData = new Date(data);

      let ano = novaData.getFullYear();
      let mes = novaData.getMonth() + 1;
      let dia = novaData.getDate();

      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      return `${dia}-${mes}-${ano}`;
    },

    showPedido: function(pedido) {
      this.$router.push("/pedidos/" + pedido.codigo);
    },
  },
};
</script>

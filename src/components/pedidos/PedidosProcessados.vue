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
        <v-icon color="white">$expand</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-data-table
        :headers="headers"
        :items="pedidos"
        class="elevation-1"
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
            <td class="subheading">{{ converteData(props.item.data) }}</td>
            <td class="subheading">{{ props.item.estado }}</td>
            <td class="subheading">{{ props.item.codigo }}</td>
            <td class="subheading">{{ props.item.criadoPor }}</td>
            <td class="subheading">{{ props.item.entidade }}</td>
            <td class="subheading">
              {{ props.item.objeto.acao }} - {{ props.item.objeto.tipo }}
            </td>

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
            </td>
          </tr>
        </template>

        <template v-slot:pageText="props">
          Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: ["pedidos", "titulo"],

  data: () => {
    return {
      headers: [
        {
          text: "Data",
          align: "left",
          sortable: true,
          value: "data",
          class: "title"
        },
        {
          text: "Estado",
          align: "left",
          sortable: false,
          value: "estado",
          class: "title"
        },
        { text: "Código", value: "codigo", sortable: true, class: "title" },
        {
          text: "Responsável",
          value: "responsavel",
          sortable: true,
          class: "title"
        },
        { text: "Entidade", value: "entidade", sortable: true, class: "title" },
        { text: "Tipo", value: "tipo", sortable: true, class: "title" },
        { text: "Tarefa", sortable: true, class: "title" }
      ],

      footer_props: {
        "items-per-page-text": "Pedidos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
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
    }
  }
};
</script>

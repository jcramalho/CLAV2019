<template>
  <v-expansion-panel-content>
    <template v-slot:header>
      <v-toolbar color="indigo darken-4 body-2 font-weight-bold" dark>
        <v-toolbar-title>{{ titulo }}</v-toolbar-title>
        <sup>
        <v-badge color="red" bottom>
          <template v-slot:badge>
            <span>{{ pedidos.length }}</span>
          </template>
        </v-badge>
        </sup>
      </v-toolbar>
    </template>

    <v-data-table
          :headers="headers"
          :items="pedidos"
          class="elevation-1"
          rows-per-page-text="Pedidos por página"
        >
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Não existem pedidos neste estado...
            </v-alert>
          </template>

          <template slot="headerCell" slot-scope="props">
            <span style="color: blue;">
              {{ props.header.text }}
            </span>
          </template>

          <template v-slot:items="props">
            <tr>
              <td class="subheading">{{ props.item.data.split("T")[0] }}</td>
              <td class="subheading">{{ props.item.estado }}</td>
              <td class="subheading">{{ props.item.codigo }}</td>
              <td class="subheading">{{ props.item.criadoPor }}</td>
              <td class="subheading">
                {{ props.item.objeto.acao }} - {{ props.item.objeto.tipo }}
              </td>
              <td class="subheading">
                <v-btn color="blue" dark round @click="showPedido(props.item)">
                  {{ props.item.objeto.codigo }}
                </v-btn>
              </td>
              <td>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="showPedido(props.item)" color="indigo darken-2" v-on="on">visibility</v-icon>
                    </template>
                    <span>Ver pedido...</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="distribuiPedido(props.item)" color="indigo darken-2" v-on="on">person</v-icon>
                    </template>
                    <span>Distribuir pedido...</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="analisaPedido(props.item)" color="indigo darken-2" v-on="on">search</v-icon>
                    </template>
                    <span>Analisar pedido...</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon color="indigo darken-2" v-on="on">keyboard_return</v-icon>
                    </template>
                    <span>Devolver pedido...</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon color="indigo darken-2" v-on="on">check</v-icon>
                    </template>
                    <span>Validar pedido...</span>
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
      { text: "Código", value: "codigo", sortable: false, class: "title" },
      {
        text: "Responsável",
        value: "responsavel",
        sortable: false,
        class: "title"
      },
      { text: "Tipo", value: "tipo", sortable: false, class: "title" },
      { text: "Objeto", value: "objeto", sortable: false, class: "title" },
      { text: "Tarefa", sortable: false, class: "title" }
    ]
    }
  },

  methods: {
      distribuiPedido: function(pedido){
          this.$emit('distribuir', pedido)
      },

      showPedido: function(pedido){
          this.$emit('show', pedido)
      },

      analisaPedido: function(pedido){
        return true
      }
  }
};
</script>
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>

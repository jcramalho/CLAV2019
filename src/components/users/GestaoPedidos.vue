<template>
  <PainelCLAV titulo="Lista de pedidos submetidos">
    <template v-slot:icon>
      <v-badge color="error" :content="pedidos.length" overlap>
        <v-icon color="secondary"> mdi-send-clock </v-icon>
      </v-badge>
    </template>
    <template v-slot:conteudo>
      <v-card flat>
        <v-card-title>
          <v-text-field
            v-model="procurar"
            append-icon="search"
            label="Procurar pedido"
            single-line
            hide-details
            filled
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="pedidos"
          :search.sync="procurar"
          sort-by="codigo"
          :custom-sort="ordenaTabela"
          :footer-props="footerProps"
          :items-per-page="5"
          @click:row="showPedido($event)"
        >
          <template v-slot:no-data>
            <v-alert type="error" width="50%" class="m-auto mb-2 mt-2" outlined>
              Não existem pedidos neste estado...
            </v-alert>
          </template>

          <template v-slot:no-results>
            <v-alert type="info" width="50%" class="m-auto mb-2 mt-2" outlined>
              Sem resultados para "<strong>{{ procurar }}</strong
              >".
            </v-alert>
          </template>

          <template v-slot:item.estado="{ item }">
            <v-chip v-if="item.estado === 'Validado'" outlined color="green">
              {{ item.estado }}
              <v-icon right>assignment_turned_in</v-icon>
            </v-chip>

            <v-chip v-else-if="item.estado === 'Devolvido'" outlined color="red">
              {{ item.estado }}
              <v-icon right>assignment_late</v-icon>
            </v-chip>

            <v-chip v-else-if="item.estado === 'Submetido'" outlined color="blue">
              {{ item.estado }}
              <v-icon right>send</v-icon>
            </v-chip>

            <v-chip v-else outlined color="orange">
              {{ item.estado }}
              <v-icon right>assignment</v-icon>
            </v-chip>
          </template>

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </template>
  </PainelCLAV>
</template>

<script>
import PainelCLAV from "@/components/generic/PainelCLAV";
export default {
  props: ["pedidos"],

  components: {
    PainelCLAV,
  },

  data() {
    return {
      procurar: "",
      headers: [
        {
          text: "Código",
          value: "codigo",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Tipo",
          value: "tipo",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Data",
          value: "data",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Estado",
          value: "estado",
          class: "title",
          sortable: true,
          filterable: true,
        },
      ],
      footerProps: {
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
            const dataA = a[index].split("-").reverse().join("");

            const dataB = b[index].split("-").reverse().join("");

            return dataB.localeCompare(dataA);
          } else {
            const dataA = a[index].split("-").reverse().join("");

            const dataB = b[index].split("-").reverse().join("");

            return dataA.localeCompare(dataB);
          }
        } else {
          if (typeof a[index] !== "undefined" && typeof b[index] !== "undefined") {
            if (!isDesc[0]) {
              return a[index].toLowerCase().localeCompare(b[index].toLowerCase());
            } else {
              return b[index].toLowerCase().localeCompare(a[index].toLowerCase());
            }
          }
        }
      });

      return items;
    },

    showPedido(pedido) {
      this.$router.push("/users/pedidos/" + pedido.codigo);
    },
  },
};
</script>

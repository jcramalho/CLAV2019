<template>
  <v-card flat class="clav-info-content">
    <v-tooltip top color="info" open-delay="500">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-on="on"
          v-model="procurar"
          append-icon="search"
          label="Procurar pedido"
          text
          single-line
          hide-details
          clearable
          color="primary"
          class="font-weight-medium"
        ></v-text-field>
      </template>

      <span> Procurar pedido</span>
    </v-tooltip>
    <v-data-table
      :loading="!pedidos"
      loading-text="A carregar... Por favor aguarde"
      :search="procurar"
      :headers="headers"
      :items="pedidos"
      :footer-props="footer_props"
      :page.sync="paginaTabela"
      sort-by="data"
      sort-desc
    >
      <template v-slot:no-data>
        <v-alert outlined type="warning" icon="warning" class="font-weight-medium ma-2">
          Não existem pedidos neste estado.
        </v-alert>
      </template>
      <template v-slot:no-results>
        <v-alert outlined type="warning" icon="warning" class="font-weight-medium ma-2"
          >Não foram encontrados resultados para "{{ procurar }}".</v-alert
        >
      </template>
      <template v-slot:item.entidade="{ item }">
        {{ item.entidade.split("_")[1] }}
      </template>
      <template v-slot:item.data="{ item }">
        {{ item.data.split("T")[0] }}
      </template>
      <template v-slot:item.tarefa="{ item }">
        <v-row justify="center">
          <v-col cols="4">
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="showPedido(item)" small icon>
                  <unicon
                    name="look-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.71 15.574"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Ver Pedido</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="4"
            v-if="
              temPermissaoDistribuir() &&
              (item.estado === 'Submetido') | (item.estado === 'Ressubmetido')
            "
          >
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small icon @click="$emit('distribuir', item)">
                  <unicon
                    name="participacao-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.71 17.678"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Distribuir Pedido</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="4"
            v-if="
              temPermissaoDevolver() &&
              (item.estado === 'Submetido' || item.estado === 'Ressubmetido')
            "
          >
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small icon @click="$emit('devolver', item)">
                  <unicon
                    name="devolver-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.71 12.943"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Devolver Pedido</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="4"
            v-if="
              temPermissaoAnalisar() &&
              (item.estado === 'Distribuído' || item.estado === 'Redistribuído')
            "
          >
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small icon @click="$emit('analisar', item)">
                  <unicon
                    name="consultar-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.71 20.697"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Analisar Pedido</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="4"
            v-if="
              temPermissaoValidar() &&
              (item.estado === 'Apreciado' || item.estado === 'Reapreciado')
            "
          >
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small text rounded @click="$emit('validar', item)">
                  <unicon
                    name="accept-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.71 18.204"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Validar Pedido</span>
            </v-tooltip> </v-col
          ><v-col
            cols="4"
            v-if="
              temPermissaoValidar() &&
              (item.estado === 'Apreciado2v' || item.estado === 'Reapreciado2v')
            "
          >
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small text rounded @click="$emit('validar', item)">
                  <unicon
                    name="accept-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.71 18.204"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Validar Pedido</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4" v-if="temPermissaoAnalisar() && item.estado === 'Em Despacho'">
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" small text rounded @click="$emit('despachar', item)">
                  <unicon
                    name="pedido-despacho-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 20.712 20.71"
                    fill="#0D47A1"
                  />
                </v-btn>
              </template>
              <span>Despachar Pedido</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
      <template v-slot:pageText="{ props }">
        Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {
  NIVEIS_DISTRIBUIR_PEDIDO,
  NIVEIS_DEVOLVER_PEDIDO,
  NIVEIS_ANALISAR_PEDIDO,
  NIVEIS_VALIDAR_PEDIDO,
} from "@/utils/consts";

export default {
  props: ["pedidos", "utilizadores"],
  methods: {
    showPedido(pedido) {
      this.$router.push("/pedidos/novos/" + pedido.codigo);
    },

    temPermissaoDistribuir() {
      return NIVEIS_DISTRIBUIR_PEDIDO.includes(this.$userLevel());
    },

    temPermissaoDevolver() {
      return NIVEIS_DEVOLVER_PEDIDO.includes(this.$userLevel());
    },

    temPermissaoAnalisar() {
      return NIVEIS_ANALISAR_PEDIDO.includes(this.$userLevel());
    },

    temPermissaoValidar() {
      return NIVEIS_VALIDAR_PEDIDO.includes(this.$userLevel());
    },
  },
  data() {
    return {
      paginaTabela: 1,
      procurar: "",
      headers: [
        {
          text: "Código",
          value: "codigo",
          class: "title",
          sortable: true,
          filterable: true,
          width: "15%",
          align: "center",
        },
        {
          text: "Tipo",
          value: "objeto.tipo",
          class: "title",
          sortable: true,
          filterable: true,
          width: "10%",
          align: "center",
        },
        {
          text: "Entidade",
          value: "entidade",
          class: "title",
          sortable: false,
          filterable: true,
          width: "15%",
          align: "center",
        },
        {
          text: "Criador",
          value: "criadoPor",
          class: "title",
          sortable: true,
          filterable: true,
          width: "30%",
          align: "center",
        },
        {
          text: "Data",
          align: "left",
          value: "data",
          class: "title",
          sortable: true,
          filterable: true,
          width: "15%",
          align: "center",
        },
        {
          text: "Tarefa",
          value: "tarefa",
          class: "title",
          align: "center",
          sortable: false,
          filterable: false,
          width: "15%",
          align: "center",
        },
      ],
      footer_props: {
        "items-per-page-text": "Pedidos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },
};
</script>

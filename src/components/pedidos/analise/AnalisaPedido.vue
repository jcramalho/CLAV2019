<template>
  <v-row class="ma-1">
    <Loading v-if="loading" :message="'pedido'" />
    <v-row v-else class="ma-1">
      <v-col>
        <v-card>
          <v-card-title class="indigo darken-4 title white--text" dark>
            Análise do pedido: {{ pedido.codigo }} - {{ pedido.objeto.acao }} de
            {{ pedido.objeto.tipo }}

            <v-spacer />

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="showDespachos()" color="white" v-on="on">
                  comment
                </v-icon>
              </template>
              <span>Ver despachos...</span>
            </v-tooltip>
          </v-card-title>

          <!-- Para a Criação de novos dados -->
          <v-card-text v-if="pedido.objeto.acao === 'Criação'">
            <AnalisaEntidade
              v-if="pedido.objeto.tipo === 'Entidade'"
              :p="pedido"
            />

            <AnalisaLeg
              v-else-if="pedido.objeto.tipo === 'Legislação'"
              :p="pedido"
            />

            <AnalisaTipologiaEntidade
              v-else-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            />

            <AnalisaAE
              v-else-if="pedido.objeto.tipo === 'Auto de Eliminação'"
              :p="pedido"
            />

            <AnalisaDefault v-else :p="pedido" />
          </v-card-text>

          <!-- Para a Alteração de dados -->
          <v-card-text
            v-else-if="
              pedido.objeto.acao === 'Alteração' ||
                pedido.objeto.acao === 'Extinção'
            "
          >
            <AnalisaEditaEntidade
              v-if="pedido.objeto.tipo === 'Entidade'"
              :p="pedido"
            />

            <AnalisaEditaLegislacao
              v-else-if="pedido.objeto.tipo === 'Legislação'"
              :p="pedido"
            />

            <AnalisaEditaTipologiaEntidade
              v-else-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            />

            <AnalisaDefault v-else :p="pedido" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.visivel"
      color="warning"
      multi-linagh
      :timeout="6000"
      top
    >
      {{ snackbar.texto }}
      <v-btn dark text @click="snackbar.visivel = false">
        Fechar
      </v-btn>
    </v-snackbar>

    <!-- Dialog Ver Despachos-->
    <v-dialog v-model="despachosDialog" width="50%">
      <VerDespachos
        :despachos="pedido.distribuicao"
        @fecharDialog="fecharDialog()"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import AnalisaLeg from "@/components/pedidos/analise/AnalisaLegislacao";
import AnalisaEntidade from "@/components/pedidos/analise/AnalisaEntidade";
import AnalisaTipologiaEntidade from "@/components/pedidos/analise/AnalisaTipologiaEntidade";
import AnalisaAE from "@/components/pedidos/analise/AnalisaAE";

import AnalisaEditaEntidade from "@/components/pedidos/analise/AnalisaEditaEntidade";
import AnalisaEditaLegislacao from "@/components/pedidos/analise/AnalisaEditaLegislacao";
import AnalisaEditaTipologiaEntidade from "@/components/pedidos/analise/AnalisaEditaTipologiaEntidade";

import AnalisaDefault from "@/components/pedidos/analise/AnalisaDefault";

import VerDespachos from "@/components/pedidos/generic/VerDespachos";

import Loading from "@/components/generic/Loading";

export default {
  props: ["idp"],

  components: {
    AnalisaEntidade,
    AnalisaLeg,
    Loading,
    AnalisaTipologiaEntidade,
    AnalisaEditaEntidade,
    AnalisaEditaLegislacao,
    AnalisaEditaTipologiaEntidade,
    AnalisaAE,
    AnalisaDefault,
    VerDespachos,
  },

  data() {
    return {
      loading: true,
      snackbar: {
        visivel: false,
        texto: "Test",
      },
      pedido: {},
      pedidoLoaded: false,
      despachosDialog: false,
      headers: [
        { text: "Estado", align: "left", sortable: false, value: "estado" },
        { text: "Data", value: "data" },
        { text: "Responsável", value: "responsavel" },
        { text: "Despacho", value: "despacho" },
      ],
      etapas: [],
    };
  },

  async mounted() {
    try {
      const { data } = await this.$request("get", "/pedidos/" + this.idp);
      this.pedido = data;
      this.pedidoLoaded = true;
      this.loading = false;
    } catch (err) {
      this.snackbar.visivel = true;
      this.snackbar.texto = "Erro ao carregar dados da base de dados";
    }
  },

  methods: {
    showDespachos() {
      this.despachosDialog = true;
    },

    fecharDialog() {
      this.despachosDialog = false;
    },
  },
};
</script>

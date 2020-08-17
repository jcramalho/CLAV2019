<template>
  <v-row class="ma-1">
    <Loading v-if="loading" :message="'pedido'" />
    <v-row v-else class="ma-1">
      <v-col>
        <v-card>
          <v-card-title class="indigo darken-4 title white--text" dark>
            Validação do pedido: {{ pedido.codigo }} -
            {{ pedido.objeto.acao }} de
            {{ pedido.objeto.tipo }}
            <v-spacer />
            <v-tooltip
              v-if="
                !(
                  pedido.objeto.acao === 'Criação' &&
                  (pedido.estado === 'Submetido' ||
                    pedido.estado === 'Distribuído')
                )
              "
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="verHistorico()"
                  color="white"
                  v-on="on"
                  class="ml-4"
                >
                  history
                </v-icon>
              </template>
              <span>Ver histórico de alterações...</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="showDespachos()"
                  color="white"
                  v-on="on"
                  class="ml-2"
                >
                  comment
                </v-icon>
              </template>
              <span>Ver despachos...</span>
            </v-tooltip>
          </v-card-title>
          <!-- Para a Criação de novos dados -->
          <v-card-text
            v-if="
              pedido.objeto.acao === 'Criação' ||
                pedido.objeto.acao === 'Importação'
            "
          >
            <ValidaEntidade
              v-if="pedido.objeto.tipo === 'Entidade'"
              :p="pedido"
            />

            <ValidaRADA v-if="pedido.objeto.tipo === 'RADA'" :p="pedido" />
            <ValidaLegislacao
              v-if="pedido.objeto.tipo === 'Legislação'"
              :p="pedido"
            />

            <ValidaTipologiaEntidade
              v-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            />

            <ValidaAE
              v-if="
                pedido.objeto.tipo.includes('AE ') ||
                  pedido.objeto.tipo === 'Auto de Eliminação'
              "
              :p="pedido"
              :tipo="pedido.objeto.tipo"
            />
          </v-card-text>

          <!-- Para a Alteração de novos dados -->
          <v-card-text
            v-if="
              pedido.objeto.acao === 'Alteração' ||
                pedido.objeto.acao === 'Extinção'
            "
          >
            <ValidaEditaEntidade
              v-if="pedido.objeto.tipo === 'Entidade'"
              :p="pedido"
            />

            <ValidaEditaLegislacao
              v-if="pedido.objeto.tipo === 'Legislação'"
              :p="pedido"
            />

            <ValidaEditaTipologiaEntidade
              v-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>

    <!-- Dialog Ver Despachos-->
    <v-dialog v-model="despachosDialog" width="50%">
      <VerDespachos
        :despachos="pedido.distribuicao"
        @fecharDialog="fecharDialog()"
      />
    </v-dialog>

    <!-- Dialog Ver Historico de Alterações-->
    <v-dialog v-model="verHistoricoDialog" width="70%">
      <VerHistorico :pedido="pedido" @fecharDialog="fecharHistorico()" />
    </v-dialog>
  </v-row>
</template>

<script>
import ValidaEntidade from "@/components/pedidos/validacao/ValidaEntidade";
import ValidaLegislacao from "@/components/pedidos/validacao/ValidaLegislacao";
import ValidaTipologiaEntidade from "@/components/pedidos/validacao/ValidaTipologiaEntidade";
import ValidaAE from "@/components/pedidos/validacao/ValidaAE";
import ValidaRADA from "@/components/pedidos/validacao/ValidaRADA";

import ValidaEditaEntidade from "@/components/pedidos/validacao/ValidaEditaEntidade";
import ValidaEditaLegislacao from "@/components/pedidos/validacao/ValidaEditaLegislacao";
import ValidaEditaTipologiaEntidade from "@/components/pedidos/validacao/ValidaEditaTipologiaEntidade";

import VerDespachos from "@/components/pedidos/generic/VerDespachos";
import VerHistorico from "@/components/pedidos/generic/VerHistorico";

import Loading from "@/components/generic/Loading";
import ErroDialog from "@/components/generic/ErroDialog";

export default {
  props: ["idp"],

  components: {
    ValidaEntidade,
    ValidaLegislacao,
    ValidaTipologiaEntidade,
    ValidaEditaEntidade,
    ValidaEditaLegislacao,
    ValidaEditaTipologiaEntidade,
    ValidaAE,
    Loading,
    VerDespachos,
    ErroDialog,
    ValidaRADA,
    VerHistorico
  },

  data() {
    return {
      verHistoricoDialog: false,
      loading: true,
      pedido: {},
      erroDialog: {
        visivel: false,
        mensagem: null
      },
      pedidoLoaded: false,
      despachosDialog: false,
      headers: [
        { text: "Estado", align: "left", sortable: false, value: "estado" },
        { text: "Data", value: "data" },
        { text: "Responsável", value: "responsavel" },
        { text: "Despacho", value: "despacho" }
      ],
      etapas: []
    };
  },

  async created() {
    try {
      const { data } = await this.$request("get", "/pedidos/" + this.idp);
      if (data.estado !== "Apreciado")
        throw new URIError("Este pedido não pertence a este estado.");

      this.pedido = data;
      this.pedidoLoaded = true;
      this.loading = false;
    } catch (err) {
      if (err instanceof URIError) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = err.message.toString();
      }
    }
  },

  methods: {
    verHistorico() {
      this.verHistoricoDialog = true;
    },

    fecharHistorico() {
      this.verHistoricoDialog = false;
    },

    showDespachos() {
      this.despachosDialog = true;
    },

    fecharDialog() {
      this.despachosDialog = false;
    }
  }
};
</script>

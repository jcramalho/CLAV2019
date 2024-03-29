<template>
  <v-row class="ma-1">
    <Loading v-if="loading" :message="'pedido'" />
    <v-row v-else class="ma-1">
      <v-col>
        <v-card>
          <v-card-title class="indigo darken-4 title white--text mb-5" dark>
            Validação do pedido: {{ pedido.codigo }} - {{ pedido.objeto.acao }} de
            {{ pedido.objeto.tipo }}
            <v-spacer />
            <v-tooltip
              v-if="
                temPermissaoConsultarHistorico() &&
                !(
                  pedido.objeto.acao === 'Criação' &&
                  (pedido.estado === 'Submetido' || pedido.estado === 'Ressubmetido')
                )
              "
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-icon @click="verHistorico()" color="white" v-on="on" class="ml-4"
                  >history</v-icon
                >
              </template>
              <span>Ver histórico de alterações...</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon @click="showDespachos()" color="white" v-on="on" class="ml-2"
                  >comment</v-icon
                >
              </template>
              <span>Ver despachos...</span>
            </v-tooltip>
          </v-card-title>

          <!-- Para a Criação de novos dados -->
          <v-card-text
            v-if="pedido.objeto.acao === 'Criação' || pedido.objeto.acao === 'Importação'"
          >
            <ValidaEntidade v-if="pedido.objeto.tipo === 'Entidade'" :p="pedido" />

            <ValidaRADA
              v-if="pedido.objeto.tipo === 'RADA'"
              :p="pedido"
              fase="validacao"
            />
            <ValidaLegislacao v-if="pedido.objeto.tipo === 'Legislação'" :p="pedido" />

            <ValidaTipologiaEntidade
              v-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            />

            <ValidaClasseN1
              v-else-if="
                pedido.objeto.tipo === 'Classe_N3' ||
                pedido.objeto.tipo === 'Classe_N1' ||
                pedido.objeto.tipo === 'Classe_N2'
              "
              :p="pedido"
              validar
            />

            <ValidaAE
              v-if="
                pedido.objeto.tipo.includes('AE ') ||
                pedido.objeto.tipo === 'Auto de Eliminação'
              "
              :p="pedido"
              :tipo="pedido.objeto.tipo"
            />

            <ValidaTSPluri
              v-if="pedido.objeto.tipo == 'TS Pluriorganizacional'"
              :p="pedido"
              fase="validacao"
            />

            <ValidaTSOrg
              v-if="pedido.objeto.tipo == 'TS Organizacional'"
              :p="pedido"
              fase="validacao"
            />

            <ValidaPPD
              v-if="pedido.objeto.tipo == 'PPD'"
              :p="pedido"
              fase="validacao"
            />
          </v-card-text>

          <!-- Para a Alteração de novos dados -->
          <v-card-text
            v-if="
              pedido.objeto.acao === 'Alteração' ||
              pedido.objeto.acao === 'Extinção' ||
              pedido.objeto.acao === 'Revogação'
            "
          >
            <span>
              <v-alert type="info" width="90%" class="m-auto mb-2 mt-2" outlined>
                <span v-if="pedido.objeto.tipo === 'Legislação'">
                  <b>{{ pedido.objeto.tipo }}:</b>
                  {{ pedido.objeto.dadosOriginais.diplomaFonte }}
                  - {{ pedido.objeto.dadosOriginais.numero }} -
                  {{ pedido.objeto.dadosOriginais.sumario }}
                </span>

                <span
                  v-else-if="
                    pedido.objeto.tipo === 'Entidade' ||
                    pedido.objeto.tipo === 'Tipologia'
                  "
                >
                  <b>{{ pedido.objeto.tipo }}:</b>
                  {{ pedido.objeto.dadosOriginais.sigla }}
                  - {{ pedido.objeto.dadosOriginais.designacao }}
                </span>
              </v-alert>

              <v-divider class="m-auto mb-2" />
            </span>

            <ValidaEditaEntidade v-if="pedido.objeto.tipo === 'Entidade'" :p="pedido" />

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
      <VerDespachos :despachos="pedido.distribuicao" @fecharDialog="fecharDialog()" />
    </v-dialog>

    <!-- Dialog Ver Historico de Alterações-->
    <v-dialog v-model="verHistoricoDialog" width="90%">
      <VerHistorico :pedido="pedido" @fecharDialog="fecharHistorico()" />
    </v-dialog>
  </v-row>
</template>

<script>
import ValidaEntidade from "@/components/pedidos/validacao/ValidaEntidade";
import ValidaLegislacao from "@/components/pedidos/validacao/ValidaLegislacao";
import ValidaTipologiaEntidade from "@/components/pedidos/validacao/ValidaTipologiaEntidade";
import ValidaAE from "@/components/pedidos/validacao/ValidaAE";
import ValidaTSPluri from "@/components/pedidos/analise/AnalisaTSPluri";
import ValidaTSOrg from "@/components/pedidos/analise/AnalisaTSOrg";
import ValidaRADA from "@/components/pedidos/analise/AnalisaRADA";
import ValidaClasseN1 from "@/components/pedidos/analise/AnalisaClasseN1";
import ValidaPPD from "@/components/pedidos/validacao/ValidaPPD";

import ValidaEditaEntidade from "@/components/pedidos/validacao/ValidaEditaEntidade";
import ValidaEditaLegislacao from "@/components/pedidos/validacao/ValidaEditaLegislacao";
import ValidaEditaTipologiaEntidade from "@/components/pedidos/validacao/ValidaEditaTipologiaEntidade";

import VerDespachos from "@/components/pedidos/generic/VerDespachos";
import VerHistorico from "@/components/pedidos/generic/VerHistorico";

import Loading from "@/components/generic/Loading";
import ErroDialog from "@/components/generic/ErroDialog";
import { NIVEIS_CONSULTAR_HISTORICO } from "@/utils/consts";

export default {
  props: ["idp"],

  components: {
    ValidaEntidade,
    ValidaLegislacao,
    ValidaTipologiaEntidade,
    ValidaEditaEntidade,
    ValidaEditaLegislacao,
    ValidaEditaTipologiaEntidade,
    ValidaClasseN1,
    ValidaAE,
    ValidaPPD,
    ValidaTSPluri,
    ValidaTSOrg,
    Loading,
    VerDespachos,
    ErroDialog,
    ValidaRADA,
    VerHistorico,
  },

  data() {
    return {
      verHistoricoDialog: false,
      loading: true,
      pedido: {},
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
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

  async created() {
    try {
      const { data } = await this.$request("get", "/pedidos/" + this.idp);
      if (
        data.estado !== "Apreciado" &&
        data.estado !== "Reapreciado" &&
        data.estado !== "Apreciado2v" &&
        data.estado !== "Reapreciado2v" &&
        data.estado !== "Devolvido para validação"
      )
        throw new URIError("Este pedido não pertence a este estado.");

      data.historico = data.historico.map((hist) => ({
        ...hist//,
        //codigo: { dados: data.objeto.codigo },
      }));

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
    temPermissaoConsultarHistorico() {
      return NIVEIS_CONSULTAR_HISTORICO.includes(this.$userLevel());
    },

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
    },
  },
};
</script>

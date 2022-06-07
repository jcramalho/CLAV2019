<template>
  <v-row class="ma-1">
    <Loading v-if="loading" :message="'pedido'" />
    <v-card v-else class="pa-2" style="width:100%" flat>
      <v-card-title class="clav-content-title-2">
        Análise do pedido: {{ pedido.codigo }} - {{ pedido.objeto.acao }} de
        {{ pedido.objeto.tipo }}
        <v-spacer />
        <v-tooltip
          v-if="
            temPermissaoConsultarHistorico() &&
            !(
              (pedido.objeto.acao === 'Criação' && pedido.estado === 'Submetido') ||
              pedido.estado === 'Ressubmetido'
            )
          "
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-icon large @click="verHistorico()" color="primary" v-on="on" class="ml-4"
              >history</v-icon
            >
          </template>
          <span>Ver histórico de alterações...</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon large @click="showDespachos()" color="primary" v-on="on" class="ml-2"
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
        <AnalisaEntidade v-if="pedido.objeto.tipo === 'Entidade'" :p="pedido" :o="options"/>

        <AnalisaRADA
          v-else-if="pedido.objeto.tipo === 'RADA'"
          :p="pedido"
          :o="options"
          fase="analise"
        />

        <AnalisaLeg v-else-if="pedido.objeto.tipo === 'Legislação'" :p="pedido" :o="options" />

        <AnalisaTipologiaEntidade
          v-else-if="pedido.objeto.tipo === 'Tipologia'"
          :p="pedido"
          :o="options"
        />

        <AnalisaClasseN1
          v-else-if="
            pedido.objeto.tipo === 'Classe_N1' || pedido.objeto.tipo === 'Classe_N2'
          "
          :p="pedido"
          :o="options"
        />

        <AnalisaClasseN3 v-else-if="pedido.objeto.tipo === 'Classe_N3'" :p="pedido" :o="options"/>

        <AnalisaAE
          v-else-if="
            pedido.objeto.tipo.includes('AE ') ||
            pedido.objeto.tipo === 'Auto de Eliminação'
          "
          :p="pedido"
          :o="options"
          :tipo="pedido.objeto.tipo"
        />

        <AnalisaTSPluri
          v-else-if="pedido.objeto.tipo.includes('TS Pluri')"
          :p="pedido"
          :o="options"
          fase="analise"
        />

        <AnalisaTSOrg
          v-else-if="pedido.objeto.tipo.includes('TS ')"
          :p="pedido"
          :o="options"
          fase="analise"
        />

        <AnalisaPPD v-else-if="pedido.objeto.tipo === 'PPD'" :p="pedido" fase="analise" :o="options"/>

        <AnalisaDefault v-else :p="pedido" :o="options"/>
      </v-card-text>

      <!-- Para a Alteração de dados -->
      <v-card-text
        v-else-if="
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
                pedido.objeto.tipo === 'Entidade' || pedido.objeto.tipo === 'Tipologia'
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
            <AnalisaEntidade v-if="pedido.objeto.tipo === 'Entidade'" :p="pedido" />

            <AnalisaRADA
              v-else-if="pedido.objeto.tipo === 'RADA'"
              :p="pedido"
              fase="analise"
            />

            <AnalisaLeg v-else-if="pedido.objeto.tipo === 'Legislação'" :p="pedido" />

            <AnalisaTipologiaEntidade
              v-else-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            />

            <AnalisaClasseN1
              v-else-if="
                pedido.objeto.tipo === 'Classe_N1' || pedido.objeto.tipo === 'Classe_N2'
              "
              :p="pedido"
            />

            <AnalisaClasseN3 v-else-if="pedido.objeto.tipo === 'Classe_N3'" :p="pedido" />

            <AnalisaAE
              v-else-if="
                pedido.objeto.tipo.includes('AE ') ||
                pedido.objeto.tipo === 'Auto de Eliminação'
              "
              :p="pedido"
              :tipo="pedido.objeto.tipo"
            />

            <AnalisaTSPluri
              v-else-if="pedido.objeto.tipo.includes('TS Pluri')"
              :p="pedido"
              fase="analise"
            />

            <AnalisaTSOrg
              v-else-if="pedido.objeto.tipo.includes('TS ')"
              :p="pedido"
              fase="analise"
            />

            <AnalisaPPD v-else-if="pedido.objeto.tipo === 'PPD'" :p="pedido" fase="analise" />

            <AnalisaDefault v-else :p="pedido" />
          </v-card-text>

          <!-- Para a Alteração de dados -->
          <v-card-text
            v-else-if="
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
                    pedido.objeto.tipo === 'Entidade' || pedido.objeto.tipo === 'Tipologia'
                  "
                >
                  <b>{{ pedido.objeto.tipo }}:</b>
                  {{ pedido.objeto.dadosOriginais.sigla }}
                  - {{ pedido.objeto.dadosOriginais.designacao }}
                </span>
              </v-alert>

              <v-divider class="m-auto mb-2" />
            </span>
            <AnalisaEditaEntidade v-if="pedido.objeto.tipo === 'Entidade'" :p="pedido" />

          <v-divider class="m-auto mb-2" />
        </span>
        <AnalisaEditaEntidade v-if="pedido.objeto.tipo === 'Entidade'" :p="pedido" :o="options"/>

        <AnalisaEditaLegislacao
          v-else-if="pedido.objeto.tipo === 'Legislação'"
          :p="pedido"
          :o="options"
        />

        <AnalisaEditaTipologiaEntidade
          v-else-if="pedido.objeto.tipo === 'Tipologia'"
          :p="pedido"
          :o="options"
        />

        <AnalisaDefault v-else :p="pedido" :o="options"/>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.visivel"
      color="warning"
      multi-linagh
      :timeout="6000"
      top
    >
      {{ snackbar.texto }}
      <v-btn dark text @click="snackbar.visivel = false">Fechar</v-btn>
    </v-snackbar>

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
import AnalisaLeg from "@/components/pedidos/analise/AnalisaLegislacao";
import AnalisaRADA from "@/components/pedidos/analise/AnalisaRADA";
import AnalisaEntidade from "@/components/pedidos/analise/AnalisaEntidade";
import AnalisaTipologiaEntidade from "@/components/pedidos/analise/AnalisaTipologiaEntidade";
import AnalisaAE from "@/components/pedidos/analise/AnalisaAE";
import AnalisaTSPluri from "@/components/pedidos/analise/AnalisaTSPluri";
import AnalisaTSOrg from "@/components/pedidos/analise/AnalisaTSOrg";
import AnalisaClasseN1 from "@/components/pedidos/analise/AnalisaClasseN1";
import AnalisaClasseN3 from "@/components/pedidos/analise/AnalisaClasseN3";
import AnalisaPPD from "@/components/pedidos/analise/AnalisaPPD";

import AnalisaEditaEntidade from "@/components/pedidos/analise/AnalisaEditaEntidade";
import AnalisaEditaLegislacao from "@/components/pedidos/analise/AnalisaEditaLegislacao";
import AnalisaEditaTipologiaEntidade from "@/components/pedidos/analise/AnalisaEditaTipologiaEntidade";

import AnalisaDefault from "@/components/pedidos/analise/AnalisaDefault";
import ErroDialog from "@/components/generic/ErroDialog";

import VerDespachos from "@/components/pedidos/generic/VerDespachos";
import VerHistorico from "@/components/pedidos/generic/VerHistorico";

import Loading from "@/components/generic/Loading";
import { NIVEIS_CONSULTAR_HISTORICO } from "@/utils/consts";

import CamundaRest from './../../../services/camunda-rest.js';

export default {
  props: ['idp','taskId', 'options'],

  components: {
    AnalisaEntidade,
    AnalisaRADA,
    AnalisaLeg,
    Loading,
    AnalisaTipologiaEntidade,
    AnalisaEditaEntidade,
    AnalisaEditaLegislacao,
    AnalisaEditaTipologiaEntidade,
    AnalisaAE,
    AnalisaTSPluri,
    AnalisaTSOrg,
    AnalisaClasseN1,
    AnalisaClasseN3,
    AnalisaPPD,
    AnalisaDefault,
    VerDespachos,
    ErroDialog,
    VerHistorico,
  },

  data() {
    return {
      verHistoricoDialog: false,
      loading: true,
      snackbar: {
        visivel: false,
        texto: "Test",
      },
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      pedido: {},
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

      var id = await this.getID();

      console.log(id) 
      
      const { data } = await this.$request("get", "/pedidos/" + id);

      if (data.estado !== "Distribuído" && data.estado !== "Redistribuído")
        throw new URIError("Este pedido não pertence a este estado.");

      data.historico = data.historico.map((hist) => ({
        ...hist,
        codigo: { dados: data.objeto.codigo },
      }));

      this.pedido = data;
      this.loading = false;

      if (this.$route.path.split('/')[1]=='bpmn') {
        console.log("carreguei os dados! Analisar Pedido...")
        console.log(this.pedido)
        console.log("task id: " + this.taskId)
        console.log("task options: " + this.options)
      }
    } catch (err) {
      if (err instanceof URIError) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = err.message.toString();
      } else {
        this.snackbar.visivel = true;
        this.snackbar.texto = "Erro ao carregar dados da base de dados";
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

    async getID() {
      var id = this.idp
      if (!id) {
        await CamundaRest.getTaskVariables(this.taskId, "pedido")
          .then((result) => {
            id = result.data.pedido.value.codigo
          })
      }
      return id
    },
  },
};
</script>

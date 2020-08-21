<template>
  <v-card class="ma-8">
    <v-card-title class="pa-2 indigo darken-4 title white--text"
      >Consulta do pedido: {{ p.codigo }} <v-spacer />
      <v-chip
        v-if="etapaPedido"
        color="indigo accent-4"
        text-color="white"
        label
      >
        <v-icon class="mr-1">label</v-icon>
        <b>{{ etapaPedido }}</b>
      </v-chip>
    </v-card-title>
    <v-card-text>
      <v-row class="mt-1">
        <v-col cols="2">
          <div class="info-label">Estado</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.estado }}</div>
        </v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col cols="2">
          <div class="info-label">Data</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.data.split("T")[0] }}</div>
        </v-col>
      </v-row>
      <v-row class="mt-1" v-if="p.entidade">
        <v-col cols="2">
          <div class="info-label">Entidade</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.entidade }}</div>
        </v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col cols="2">
          <div class="info-label">Criado Por</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.criadoPor }}</div>
        </v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col cols="2">
          <div class="info-label">Tipo</div>
        </v-col>
        <v-col>
          <div class="info-content">
            {{ p.objeto.acao }} - {{ p.objeto.tipo }}
          </div>
        </v-col>
      </v-row>

      <v-card class="mt-3">
        <v-card-title class="pa-2 indigo darken-4 title white--text"
          >Distribuição</v-card-title
        >
        <v-card-text>
          <v-data-table
            :headers="distHeaders"
            :items="p.distribuicao"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:item="props">
              <tr>
                <td class="subheading">{{ props.item.estado }}</td>
                <td class="subheading">
                  {{ converteData(props.item.data) }}
                </td>
                <td class="subheading">{{ props.item.responsavel }}</td>
                <td class="subheading">{{ props.item.despacho }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <ShowTSPluri
        v-if="p.objeto.tipo == 'TS Pluriorganizacional web'"
        :p="p"
      />
      <ShowTSOrg v-else-if="p.objeto.tipo == 'TS Organizacional'" :p="p" />
      <ShowClasse v-else-if="p.objeto.tipo == 'Classe'" :p="p" />
      <ShowEntidade
        v-else-if="p.objeto.tipo == 'Entidade'"
        :p="p"
        @verHistorico="verHistorico()"
      />

      <ShowAE
        v-else-if="
          p.objeto.tipo.includes('AE ') || p.objeto.tipo == 'Auto de Eliminação'
        "
        :p="p"
      />
      <ShowPGD v-else-if="p.objeto.tipo == 'PGD'" :p="p" />
      <ShowTipologia
        v-else-if="p.objeto.tipo === 'Tipologia'"
        :p="p"
        @verHistorico="verHistorico()"
      />
      <ShowLegislacao
        v-else-if="p.objeto.tipo == 'Legislação'"
        :p="p"
        @verHistorico="verHistorico()"
      />
      <ShowTI v-else-if="p.objeto.tipo == 'Termo de Indice'" :p="p" />
      <ShowRADA v-else-if="p.objeto.tipo == 'RADA'" :p="p" />
      <ShowDefault v-else :p="p" />
    </v-card-text>

    <v-card-actions>
      <v-btn color="indigo accent-4" dark @click="voltar">Voltar</v-btn>
      <v-spacer />
      <v-btn
        v-if="
          (p.estado === 'Distribuído' ||
            p.estado === 'Apreciado' ||
            p.estado === 'Redistribuído' ||
            p.estado === 'Reapreciado') &&
            temPermissaoSubstituirResponsavel()
        "
        color="indigo accent-4"
        dark
        @click="substituir()"
        rounded
      >
        Substituir Responsável
      </v-btn>

      <v-btn
        v-if="p.estado === 'Apreciado' || p.estado === 'Reapreciado'"
        color="indigo accent-4"
        dark
        @click="reapreciar()"
        rounded
      >
        Reapreciar pedido
      </v-btn>
    </v-card-actions>

    <!-- Substituir responsável dialog -->
    <v-dialog v-model="substituirResponsavelDialog" width="80%" persistent>
      <SubstituirResponsavel :pedido="p" @fecharDialog="fecharDialog()" />
    </v-dialog>

    <!-- Dialog Ver Historico de Alterações-->
    <v-dialog v-model="verHistoricoDialog" width="70%">
      <VerHistorico :pedido="p" @fecharDialog="fecharHistorico()" />
    </v-dialog>

    <!-- Dialog para reapreciar pedidos -->
    <v-dialog v-model="reapreciarDialog" width="80%" persistent>
      <AvancarPedido
        :utilizadores="utilizadores"
        :texto="{
          textoTitulo: 'Distribuição',
          textoAlert: 'reapreciação',
          textoBotao: 'Reapreciar',
        }"
        :pedido="p.codigo"
        @fecharDialog="fecharReapreciarDialog()"
        @avancarPedido="reapreciarPedido($event)"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import ShowRADA from "@/components/pedidos/consulta/showRADA.vue";
import ShowTSPluri from "@/components/pedidos/consulta/showTSPluri.vue";
import ShowTSOrg from "@/components/pedidos/consulta/showTSOrg.vue";
import ShowClasse from "@/components/pedidos/consulta/showClasse.vue";
import ShowDefault from "@/components/pedidos/consulta/showDefault.vue";
import ShowAE from "@/components/pedidos/consulta/showAE.vue";
import ShowEntidade from "@/components/pedidos/consulta/showEntidade";
import ShowTipologia from "@/components/pedidos/consulta/showTipologia";
import ShowLegislacao from "@/components/pedidos/consulta/showLegislacao";
import ShowTI from "@/components/pedidos/consulta/showTI";
import ShowPGD from "@/components/pedidos/consulta/showPGD";

import SubstituirResponsavel from "@/components/pedidos/generic/SubstituirResponsavel";
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";

import VerHistorico from "@/components/pedidos/generic/VerHistorico";
import {
  NIVEL_MINIMO_SUBSTITUIR_RESPONSAVEL,
  NIVEIS_ANALISAR_PEDIDO,
} from "@/utils/consts";
import { filtraNivel } from "@/utils/permissoes";

export default {
  props: ["p", "etapaPedido"],

  components: {
    ShowTSPluri,
    ShowRADA,
    ShowTSOrg,
    ShowClasse,
    ShowDefault,
    ShowAE,
    ShowEntidade,
    ShowTipologia,
    ShowLegislacao,
    ShowTI,
    SubstituirResponsavel,
    ShowPGD,
    VerHistorico,
    AvancarPedido,
  },

  data() {
    return {
      utilizadores: [],
      reapreciarDialog: false,
      substituirResponsavelDialog: false,
      verHistoricoDialog: false,
      headers: [
        { text: "Estado", align: "left", sortable: false, value: "estado" },
        { text: "Data", value: "data" },
        { text: "Responsável", value: "responsavel" },
        { text: "Despacho", value: "despacho" },
        { text: "Objeto", value: "objeto" },
      ],
      distHeaders: [
        { text: "Estado", value: "estado", class: "subtitle-1" },
        { text: "Data", value: "data", class: "subtitle-1" },
        { text: "Responsável", value: "responsavel", class: "subtitle-1" },
        { text: "Despacho", value: "despacho", class: "subtitle-1" },
      ],
    };
  },

  async created() {
    await this.listaUtilizadores();
  },

  methods: {
    async listaUtilizadores() {
      const response = await this.$request("get", "/users");

      const utilizadores = filtraNivel(response.data, NIVEIS_ANALISAR_PEDIDO);

      this.utilizadores = utilizadores;
    },

    reapreciar() {
      this.reapreciarDialog = true;
    },

    fecharReapreciarDialog() {
      this.reapreciarDialog = false;
    },

    async reapreciarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado = "Redistribuído";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email,
          },
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.fecharReapreciarDialog();
        this.$router.push("/pedidos");
      } catch (e) {
        //console.log("e :", e);
      }
    },

    temPermissaoSubstituirResponsavel() {
      return this.$userLevel() >= NIVEL_MINIMO_SUBSTITUIR_RESPONSAVEL;
    },

    converteData(data) {
      let dataFormatada = "";
      let dataConvertida = new Date(data);

      dataFormatada += `${data.split("T")[0]} - ${dataConvertida.getHours()}:`;

      if (dataConvertida.getMinutes() < 10)
        dataFormatada += `0${dataConvertida.getMinutes()}`;
      else dataFormatada += dataConvertida.getMinutes();

      return dataFormatada;
    },

    voltar() {
      const pesquisa = JSON.parse(localStorage.getItem("pesquisa-pedidos"));
      localStorage.setItem(
        "pesquisa-pedidos",
        JSON.stringify({
          ...pesquisa,
          limpar: false,
        })
      );

      this.$router.go(-1);
    },

    verHistorico() {
      this.verHistoricoDialog = true;
    },

    fecharHistorico() {
      this.verHistoricoDialog = false;
    },

    fecharDialog() {
      this.substituirResponsavelDialog = false;
    },

    substituir() {
      this.substituirResponsavelDialog = true;
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>

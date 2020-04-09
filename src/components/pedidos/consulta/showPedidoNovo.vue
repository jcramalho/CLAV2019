<template>
  <v-card class="ma-8">
    <v-card-title class="pa-2 indigo darken-4 title white--text"
      >Consulta do pedido: {{ p.codigo }}</v-card-title
    >
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
                <td class="subheading">{{ props.item.data }}</td>
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
      <ShowEntidade v-else-if="p.objeto.tipo == 'Entidade'" :p="p" />
      <ShowAE
        v-else-if="
          p.objeto.tipo.includes('AE ') || p.objeto.tipo == 'Auto de Eliminação'
        "
        :p="p"
      />
      <ShowTipologia v-else-if="p.objeto.tipo == 'Tipologia'" :p="p" />
      <ShowLegislacao v-else-if="p.objeto.tipo == 'Legislação'" :p="p" />
      <ShowTI v-else-if="p.objeto.tipo == 'Termo de Indice'" :p="p" />
      <ShowDefault v-else :p="p" />
    </v-card-text>
    <v-card-actions>
      <v-btn color="indigo" dark @click="voltar">Voltar</v-btn>
      <v-spacer />
      <v-btn color="indigo accent-4" dark @click="distribuir = true"
        >Distribuir</v-btn
      >
    </v-card-actions>

    <v-dialog v-model="distribuir" width="80%" persistent>
      <AvancarPedido
        :utilizadores="utilizadores"
        :texto="{
          textoTitulo: 'Distribuição',
          textoAlert: 'análise',
          textoBotao: 'Distribuir',
        }"
        :pedido="p.codigo"
        @fecharDialog="fecharDialog()"
        @avancarPedido="atribuirPedido($event)"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import ShowTSPluri from "@/components/pedidos/consulta/showTSPluri.vue";
import ShowTSOrg from "@/components/pedidos/consulta/showTSOrg.vue";
import ShowClasse from "@/components/pedidos/consulta/showClasse.vue";
import ShowDefault from "@/components/pedidos/consulta/showDefault.vue";
import ShowAE from "@/components/pedidos/consulta/showAE.vue";
import ShowEntidade from "@/components/pedidos/consulta/showEntidade";
import ShowTipologia from "@/components/pedidos/consulta/showTipologia";
import ShowLegislacao from "@/components/pedidos/consulta/showLegislacao";
import ShowTI from "@/components/pedidos/consulta/showTI";

import { NIVEL_MINIMO_DISTRIBUIR_PEDIDOS_NOVOS } from "@/utils/consts";
import { filtraNivel } from "@/utils/utils";

export default {
  props: ["p"],

  components: {
    ShowTSPluri,
    ShowTSOrg,
    ShowClasse,
    ShowDefault,
    ShowAE,
    ShowEntidade,
    ShowTipologia,
    ShowLegislacao,
    ShowTI,
    AvancarPedido,
  },

  data: () => ({
    distribuir: false,
    utilizadores: [],
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
  }),

  async created() {
    await this.listaUtilizadores();
  },

  methods: {
    async listaUtilizadores() {
      const response = await this.$request("get", "/users");

      const utilizadores = filtraNivel(
        response.data,
        NIVEL_MINIMO_DISTRIBUIR_PEDIDOS_NOVOS,
        ">="
      );

      this.utilizadores = utilizadores;
    },

    async atribuirPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado = "Distribuído";

        let dadosUtilizador = await this.$request(
          "get",
          "/users/" + this.$store.state.token + "/token"
        );

        dadosUtilizador = dadosUtilizador.data;

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.fecharDialog();
        this.$router.push("/pedidos");
      } catch (e) {
        console.log("e :", e);
      }
    },

    fecharDialog() {
      this.distribuir = false;
    },

    voltar: function () {
      this.$router.go(-1);
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

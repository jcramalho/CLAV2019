<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title">
      {{ p.objeto.acao }} da Classe

      <v-spacer />

      <v-tooltip
        v-if="
          temPermissaoConsultarHistorico() &&
            !(p.objeto.acao === 'Criação' && p.estado === 'Submetido')
        "
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-icon @click="verHistorico()" color="white" v-on="on">
            history
          </v-icon>
        </template>
        <span>Ver histórico de alterações...</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text>
      <v-row v-for="c in classeInfo" :key="c.campo">
        <v-col cols="2">
          <div class="info-label">{{ c.campo }}</div>
        </v-col>
        <v-col>
          <!-- <div class="info-content">{{ c.conteudo }}</div> -->
          <div v-if="!(c.conteudo instanceof Array)" class="info-content">
            {{ c.conteudo }}
          </div>

          <div v-else>
            <v-data-table
              :headers="notasAppHeader"
              :items="c.conteudo"
              class="elevation-1"
              :footer-props="footerProps"
            >
              <template v-slot:no-data>
                <v-alert
                  type="error"
                  width="100%"
                  class="m-auto mb-2 mt-2"
                  outlined
                >
                  Nenhuma tipologia selecionada...
                </v-alert>
              </template>

              <template v-slot:item.sigla="{ item }">
                <v-badge
                  v-if="novoItemAdicionado(item, campo)"
                  right
                  dot
                  inline
                  >{{ item.sigla }}</v-badge
                >

                <span v-else>
                  {{ item.sigla }}
                </span>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import ShowNotasAp from "@/components/pedidos/consulta/classes/ShowNotasAp";
import ShowExemplosNotasAp from "@/components/pedidos/consulta/classes/ShowExemplosNotasAp";
import ShowNotasEx from "@/components/pedidos/consulta/classes/ShowNotasEx";
import ShowTIs from "@/components/pedidos/consulta/classes/ShowTIs";

import ShowDonos from "@/components/pedidos/consulta/classes/ShowDonos";
import ShowParticipantes from "@/components/pedidos/consulta/classes/ShowParticipantes";
import ShowProcRel from "@/components/pedidos/consulta/classes/ShowProcRel";
import ShowLegislacao from "@/components/pedidos/consulta/classes/ShowLegislacao";

import ShowDecisoesPCA from "@/components/pedidos/consulta/classes/ShowDecisoesPCA";
import ShowDecisoesDF from "@/components/pedidos/consulta/classes/ShowDecisoesDF";

import { NIVEIS_CONSULTAR_HISTORICO } from "@/utils/consts";

export default {
  props: ["p"],

  components: {},

  data() {
    return {
      classeInfo: [
        { campo: "Nível", conteudo: this.p.objeto.dados.nivel },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo },
        { campo: "Título", conteudo: this.p.objeto.dados.titulo },
        { campo: "Descrição", conteudo: this.p.objeto.dados.descricao },
        { campo: "Notas de Aplicação", conteudo: this.p.objeto.dados.notasAp },
        { campo: "Notas de Exclusão", conteudo: this.p.objeto.dados.notasEx },
      ],
      notasAppHeader: [{ text: "Notas", value: "nota", class: "subtitle-1" }],
      footerProps: {
        "items-per-page-text": "Tipologias por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
    };
  },

  methods: {
    temPermissaoConsultarHistorico() {
      return NIVEIS_CONSULTAR_HISTORICO.includes(this.$userLevel());
    },

    verHistorico() {
      this.$emit("verHistorico");
    },
    testlog(i) {
      console.log(i);
      return true;
    },
  },
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
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>

<template>
  <v-card class="my-2">
    <v-card-title class="clav-linear-background white--text">
      {{ p.objeto.acao }} da Classe

      <v-spacer />

      <v-tooltip
        v-if="
          temPermissaoConsultarHistorico() &&
          !(
            p.objeto.acao === 'Criação' &&
            (p.estado === 'Submetido' || p.estado === 'Ressubmetido')
          )
        "
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-icon @click="verHistorico()" color="white" v-on="on"> history </v-icon>
        </template>
        <span>Ver histórico de alterações...</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text class="pt-2">
      <Campo
        v-for="c in classeInfo"
        :key="c.campo"
        :nome="c.campo"
        :infoHeader="c.campo"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <div>
            <span v-if="!(c.conteudo instanceof Array)">
              {{ c.conteudo }}
            </span>

            <div v-else>
              <v-data-table
                :headers="notasAppHeader"
                :items="c.conteudo"
                :footer-props="footerProps"
              >
                <template v-slot:no-data>
                  <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined>
                    Nenhuma nota adicionada.
                  </v-alert>
                </template>

                <template v-slot:item.sigla="{ item }">
                  <v-badge v-if="novoItemAdicionado(item, campo)" right dot inline>{{
                    item.sigla
                  }}</v-badge>

                  <span v-else>
                    {{ item.sigla }}
                  </span>
                </template>
              </v-data-table>
            </div>
          </div>
        </template>
      </Campo>
    </v-card-text>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";

import { NIVEIS_CONSULTAR_HISTORICO } from "@/utils/consts";

export default {
  props: ["p"],

  components: {
    Campo,
  },

  created() {
    this.classeInfo = [
      { campo: "Nível", conteudo: this.p.objeto.dados.nivel },
      { campo: "Código", conteudo: this.p.objeto.dados.codigo },
      { campo: "Título", conteudo: this.p.objeto.dados.titulo },
      { campo: "Descrição", conteudo: this.p.objeto.dados.descricao },
      { campo: "Notas de Aplicação", conteudo: this.p.objeto.dados.notasAp },
      { campo: "Notas de Exclusão", conteudo: this.p.objeto.dados.notasEx },
    ];
  },

  data() {
    return {
      classeInfo: [],
      notasAppHeader: [{ text: "Notas", value: "nota", class: "subtitle-1" }],
      footerProps: {
        "items-per-page-text": "Notas por página",
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
  },
};
</script>

<style></style>

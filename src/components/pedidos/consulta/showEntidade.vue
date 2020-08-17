<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title">
      {{ p.objeto.acao }} da Entidade

      <v-spacer />

      <v-tooltip
        v-if="
          !(
            p.objeto.acao === 'Criação' &&
            (p.estado === 'Submetido' || p.estado === 'Distribuído')
          )
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
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row v-if="info !== '' && info !== null && info !== undefined">
          <v-col cols="2">
            <div class="info-descricao">{{ transformaKeys(campo) }}</div>
          </v-col>

          <v-col>
            <div v-if="!(info instanceof Array)" class="info-conteudo">
              {{ info }}
            </div>

            <div v-else>
              <v-data-table
                v-if="campo === 'tipologiasSel'"
                :headers="tipologiasHeaders"
                :items="info"
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
              </v-data-table>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapKeys } from "@/utils/utils";

export default {
  props: ["p"],

  data() {
    return {
      tipologiasHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      footerProps: {
        "items-per-page-text": "Tipologias por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
    };
  },

  computed: {
    dados() {
      return this.p.objeto.dados;
    },
  },

  methods: {
    verHistorico() {
      this.$emit("verHistorico");
    },

    transformaKeys(key) {
      return mapKeys(key);
    },
  },
};
</script>

<style scoped>
.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}
</style>

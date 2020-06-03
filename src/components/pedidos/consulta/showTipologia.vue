<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title">
      {{ p.objeto.acao }} da Tipologia
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
      <v-row>
        <v-col cols="2">
          <div class="info-label">Designação</div>
        </v-col>

        <v-col>
          <div class="info-content">
            {{ tipologiaCriadaAlterada.designacao }}
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <div class="info-label">Sigla</div>
        </v-col>

        <v-col>
          <div class="info-content">{{ tipologiaCriadaAlterada.sigla }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <div class="info-label">Entidades:</div>
        </v-col>

        <v-col>
          <v-data-table
            :headers="headers"
            :items="tipologiaCriadaAlterada.entidadesSel"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:no-data>
              <v-alert
                type="error"
                width="100%"
                class="m-auto mb-2 mt-2"
                outlined
              >
                Nenhuma entidade selecionada...
              </v-alert>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"],

  data() {
    return {
      // tipologiaInfo: [
      //   { campo: "Tipologia", conteudo: this.p.objeto.dados.designacao },
      //   { campo: "Sigla", conteudo: this.p.objeto.dados.sigla },
      //   { campo: "Entidades", conteudo: this.p.objeto.dados.entidadesSel },
      //   { campo: "Código", conteudo: this.p.objeto.dados.codigo },
      // ],
      headers: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
    };
  },

  computed: {
    tipologiaOriginal() {
      return this.p.objeto.dadosOriginais;
    },

    tipologiaCriadaAlterada() {
      return this.p.objeto.dados;
    },
  },

  methods: {
    verHistorico() {
      this.$emit("verHistorico");
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  margin-top: 5px;
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.rounded-card {
  border-radius: 10px;
}
</style>

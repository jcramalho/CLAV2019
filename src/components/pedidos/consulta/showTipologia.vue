<template>
  <v-card class="mt-4">
    <v-card-title class="clav-linear-background white--text">
      {{ p.objeto.acao }} da Tipologia

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

    <v-card-text class="mb-2 pt-2">
      <span v-if="p.objeto.acao !== 'Criação'">
        <v-alert type="info" width="90%" class="m-auto mb-2 mt-2" outlined>
          <span>
            <b> {{ p.objeto.tipo }}: </b>
            {{ p.objeto.dadosOriginais.sigla }}
            - {{ p.objeto.dadosOriginais.designacao }}
          </span>
        </v-alert>

        <v-divider class="m-auto mb-2" />
      </span>

      <div v-for="(info, campo) in dados" :key="campo">
        <Campo
          v-if="
            (p.objeto.acao === 'Criação' && campo === 'sigla') ||
            (campo !== 'sigla' &&
              campo !== 'estado' &&
              info !== '' &&
              info !== null &&
              info !== undefined)
          "
          :nome="transformaKeys(campo)"
          color="neutralpurple"
        >
          <template v-slot:conteudo>
            <span v-if="!(info instanceof Array)">
              {{ info }}
            </span>

            <div v-else>
              <v-data-table
                v-if="campo === 'entidadesSel'"
                :headers="entidadesHeaders"
                :items="info"
                :footer-props="footerProps"
              >
                <template v-slot:no-data>
                  <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined>
                    Nenhuma entidade selecionada...
                  </v-alert>
                </template>
              </v-data-table>
            </div>
          </template>
        </Campo>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapKeys } from "@/utils/utils";
import { NIVEIS_CONSULTAR_HISTORICO } from "@/utils/consts";
import Campo from "@/components/generic/Campo";

export default {
  props: ["p"],

  components: {
    Campo,
  },

  data() {
    return {
      entidadesHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      footerProps: {
        "items-per-page-text": "Entidades por página",
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
    temPermissaoConsultarHistorico() {
      return NIVEIS_CONSULTAR_HISTORICO.includes(this.$userLevel());
    },

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

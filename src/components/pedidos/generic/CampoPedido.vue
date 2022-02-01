<template>
  <Campo :nome="title" :color="conversorDeCor[estado] + ' lighten-1'">
    <template v-slot:conteudo>
      <v-row dense>
        <v-col>
          <div v-if="!(info instanceof Array)">
            <span v-if="info === '' || info === null">
              [Campo não preenchido na submissão do pedido]
            </span>
            <span v-else>{{ info }}</span>
          </div>

          <div v-else>
            <VerNotas
              :header="header"
              :footer-props="{
                'items-per-page-text': 'Items por página',
                'items-per-page-options': [5, 10, -1],
                'items-per-page-all-text': 'Todas',
              }"
              :items="info"
              :addFunc="add"
              :removeFunc="remove"
              :campo="campo"
            />
          </div>
        </v-col>

        <PainelOperacoesCampo
          :hide="hideOps"
          :campo="campo"
          :validate="validate"
          :invalidate="invalidate"
          :edit="info instanceof Array ? null : edit"
          :comment="comment"
        />
      </v-row>
    </template>
  </Campo>
</template>

<script>
import PainelOperacoesCampo from "@/components/pedidos/generic/PainelOperacoesCampo";
import VerNotas from "@/components/pedidos/generic/VerNotas";
import Campo from "@/components/generic/CampoCLAV";

export default {
  props: {
    title: String,
    campo: String,
    info: [String, Array, Number],
    estado: String,
    hideOps: Boolean,
    validate: Function,
    invalidate: Function,
    edit: Function,
    add: Function,
    remove: Function,
    comment: Function,
    header: Array,
  },
  components: {
    PainelOperacoesCampo,
    VerNotas,
    Campo,
  },
  data() {
    return {
      conversorDeCor: {
        verde: "success",
        amarelo: "warning",
        vermelho: "error",
      },
    };
  },
};
</script>

<style scoped></style>

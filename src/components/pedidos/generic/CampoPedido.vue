<template>
  <v-row dense class="ma-1">
    <v-col cols="2">
      <div class="info-descricao" :class="`info-descricao-${estado}`">
        {{ title }}
      </div>
    </v-col>

    <v-col>
      <div v-if="!(info instanceof Array)" class="info-conteudo">
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
            'items-per-page-all-text': 'Todas'
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

<script>
import PainelOperacoesCampo from "@/components/pedidos/generic/PainelOperacoesCampo";
import VerNotas from "@/components/pedidos/generic/VerNotas";

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
    header: Array
  },
  components: {
    PainelOperacoesCampo,
    VerNotas
  }
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

.info-descricao-verde {
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  background-color: #ffe0b2; /* lighten-4 */
}
</style>

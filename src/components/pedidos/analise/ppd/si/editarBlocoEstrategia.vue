<template>
  <div>
    <div class="separador">Estratégia</div>
    <div class="separadorMini">Estratégia de preservação: utilização operacional</div>
    <v-card flat class="ma-1">
      <ValidaCampo
        :dadosOriginais="siSpec.estrategia.utilizacaoOperacional"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].estrategia.utilizacaoOperacional
        campoValue="idMetodoPreservacao"
        campoText="Identificação dos métodos de preservação"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.estrategia.utilizacaoOperacional"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].estrategia.utilizacaoOperacional
        campoValue="fundMetodoPreservacao"
        campoText="Fundamentação da escolha do método de preservação"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.estrategia.utilizacaoOperacional"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].estrategia.utilizacaoOperacional
        campoValue="lacunas"
        campoText="Identificação de lacunas e necessidade de desenvolvimento"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

      <div class="separadorMini">Estratégia de preservação: utilização memória</div>
      <ValidaCampo
        :dadosOriginais="siSpec.estrategia.utilizacaoMemoria"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].estrategia.utilizacaoMemoria
        campoValue="idMetodoPreservacao"
        campoText="Identificação dos métodos de preservação"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.estrategia.utilizacaoMemoria"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].estrategia.utilizacaoMemoria
        campoValue="fundMetodoPreservacao"
        campoText="Fundamentação da escolha do método de preservação"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.estrategia.utilizacaoMemoria"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].estrategia.utilizacaoMemoria
        campoValue="lacunas"
        campoText="Identificação de lacunas e necessidade de desenvolvimento"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

    </v-card>
  </div>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/ppd/ValidaCampo";


export default {
  props: ["siSpec", "novoHistorico", "indexSI"],
  components: {
    ValidaCampo,
  },
}


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
  border: 1px solid #1a237e;
}


.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>

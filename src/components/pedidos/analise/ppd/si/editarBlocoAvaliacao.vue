<template>
  <div>
    <div class="separador">Avaliação</div>
    <v-card flat class="ma-1">
      <ValidaCampo
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="descricao"
        campoText="Descrição"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="decomposicao"
        campoText="Decomposição"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="codClasse"
        campoText="Código de classificação da classe / série"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="numeroClasse"
        campoText="N.º de ref.ª da classe / série"
        tipo="string"
        :permitirEditar="false"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="tituloClasse"
        campoText="Título da classe / série"
        tipo="string"
        :permitirEditar="false"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="pcaClasse"
        campoText="PCA da classe / série"
        tipo="string"
        :permitirEditar="false"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="formaContagemPrazos"
        campoText="Forma de contagem dos prazos"
        tipo="string"
        :permitirEditar="false"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="destinoFinalClasse"
        campoText="Destino final da classe / série"
        tipo="string"
        :permitirEditar="false"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="pcaSI"
        campoText="PCA do SI"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="destinoSI"
        campoText="Destino final do SI"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="siRelacionado"
        campoText="SI relacionado: n.º de referência"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="siRelacionadoRelacao"
        campoText="SI relacionado: tipo de relação"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="checkedAti"
        campoText="Atividade do SI"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="checkedGrau"
        campoText="Grau de utilização do SI"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="checkedCriticidade"
        campoText="Criticidade do SI"
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
        :dadosOriginais="siSpec.avaliacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].avaliacao
        campoValue="objetoPreservacao"
        campoText="SI é objeto de preservação"
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

  data: () => ({
    searchSI: "",
    verClasse: false,
    classeSpec: {},

    headers: [
      { text: "Código", value: "codigo" },
      { text: "Referência", value: "referencia" },
      { text: "Título", value: "titulo" },
      { text: "PCA", value: "pca" },
      { text: "Destino Final", value: "df" },
      { text: "Ver", value: ""},
    ],

    footer_props: {
      "items-per-page-text": "Classes por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todos"
    },

  }),
  methods: {
    class2Show: function(item){
      this.classeSpec = item;
      this.verClasse = true;
    },
  }
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

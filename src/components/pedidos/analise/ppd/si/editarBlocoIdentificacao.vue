<template>
  <div>
    <v-card flat class="ma-1">
        <ValidaCampo
          :dadosOriginais="siSpec"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI]
          campoValue="numeroSI"
          campoText="Número do SI"
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
          :dadosOriginais="siSpec"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI]
          campoValue="nomeSI"
          campoText="Nome do SI"
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
        <div class="separador">Identificação</div>
        <ValidaCampo
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="adminSistema"
          campoText="Administrador do Sistema"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="adminDados"
          campoText="Administrador dos Dados"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="propSistemaPublico"
          campoText="Proprietário do SI - Entidade pública"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="propSistemaPrivado"
          campoText="Proprietário do SI - Entidade privada"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="propDados"
          campoText="Proprietário dos dados"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="localDadosPublico"
          campoText="Localização dos dados - Entidade pública"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="localDadosPrivado"
          campoText="Localização dos dados - Entidade privada"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="defResponsavel"
          campoText="Definição formal de responsabilidades"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="insourcing"
          campoText="Insourcing"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="outsourcing"
          campoText="Outsourcing"
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
          :dadosOriginais="siSpec.identificacao"
          :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].identificacao
          campoValue="notas"
          campoText="Notas"
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

  data() {
    return {
    }
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

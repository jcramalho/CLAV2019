<template>
  <div>
    <!-- validar produtoras -->
    <ValidaCampo
      v-if="!!novoHistorico.RE.entidadesProd.dados[0]"
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="entidadesProd"
      campoText="Entidades Produtoras"
      tipo="array"
      :permitirEditar="false"
    />
    <ValidaCampo
      v-else
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="tipologiasProd"
      campoText="Tipologia Produtora"
      tipo="string"
      :permitirEditar="false"
    />

    <!-- validar datas -->
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="dataInicial"
      campoText="Data Inicial"
      tipo="string"
      :permitirEditar="false"
    />
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="dataFinal"
      campoText="Data Final"
      tipo="string"
      :permitirEditar="false"
    />

    <!-- Historia Admin -->
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="hist_admin"
      campoText="História Administrativa/Biográfica"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-textarea
          solo
          name="input-7-4"
          :rules="[v => !!v || 'Campo obrigatório']"
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-textarea>
      </template>
    </ValidaCampo>
    
    <!-- Historia Cust -->
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="hist_cust"
      campoText="História Custodial"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-textarea
          solo
          name="input-7-4"
          :rules="[v => !!v || 'Campo obrigatório']"
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-textarea>
      </template>
    </ValidaCampo>

    <!-- Sistema Organização -->
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="sist_org"
      campoText="Sistema de Organização"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-textarea
          solo
          name="input-7-4"
          :rules="[v => !!v || 'Campo obrigatório']"
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-textarea>
      </template>
    </ValidaCampo>

    <!-- Localização -->
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="localizacao"
      campoText="Localização"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-textarea
          solo
          name="input-7-4"
          :rules="[v => !!v || 'Campo obrigatório']"
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-textarea>
      </template>
    </ValidaCampo>

    <!-- Estado de Conservação -->
    <ValidaCampo
      :dadosOriginais="RADA.RE"
      :novoHistorico="novoHistorico.RE"
      campoValue="est_conser"
      campoText="Estado de Conservação"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-textarea
          solo
          name="input-7-4"
          :rules="[v => !!v || 'Campo obrigatório']"
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-textarea>
      </template>
    </ValidaCampo>
  </div>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/rada/generic/ValidaCampo";

export default {
  props: ["RADA", "novoHistorico"],
  components: {
    ValidaCampo,
  },
};
</script>
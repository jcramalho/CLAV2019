<template>
  <div>
    <!-- Validar Titulo -->
    <ValidaCampo
      :dadosOriginais="RADA"
      :novoHistorico="novoHistorico"
      campoValue="titulo"
      campoText="Título"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-text-field
          :rules="[v => !!v || 'Campo obrigatório']"
          solo
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-text-field>
      </template>
    </ValidaCampo>

    <!-- Validar Entidades Responsáveis -->
    <ValidaCampo
      :dadosOriginais="RADA"
      :novoHistorico="novoHistorico"
      campoValue="entRes"
      campoText="Entidades Responsáveis"
      tipo="array"
    >
      <template v-slot:input="props">
        <v-autocomplete
          :rules="[v => !!v[0] || 'Campo obrigatório']"
          deletable-chips
          @change="props.items.updateValue"
          v-model="props.items.campoEditado"
          :items="entidades"
          placeholder="Selecione as Entidades Responsáveis."
          chips
          multiple
          solo
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                <strong>Entidade</strong> em questão não existe!
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
      </template>
    </ValidaCampo>
  </div>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/rada/generic/ValidaCampo";

export default {
  props: ["RADA", "novoHistorico", "entidades"],
  components: {
    ValidaCampo,
  },
};
</script>
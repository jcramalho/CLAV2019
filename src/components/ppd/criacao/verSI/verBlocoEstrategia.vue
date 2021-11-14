<template>
  <v-row>
    <div class="separador">Estratégia</div>
    <v-col cols="12" xs="12" sm="12">
      <div class="separadorMini">Estratégia de preservação: utilização operacional</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Identificação dos métodos de preservação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" v-if=siSpec.estrategia.utilizacaoOperacional>
      <v-text-field
        label="Não possui"
        :value="siSpec.estrategia.utilizacaoOperacional.idMetodoPreservacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Fundamentação da escolha do método de preservação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" v-if=siSpec.estrategia.utilizacaoOperacional>
      <v-text-field
          label="Não possui"
          :value="siSpec.estrategia.utilizacaoOperacional.fundMetodoPreservacao"
          readonly
          solo
          dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Identificação de lacunas e necessidade de desenvolvimento</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" v-if=siSpec.estrategia.utilizacaoOperacional>
      <v-text-field
          label="Não possui"
          :value="siSpec.estrategia.utilizacaoOperacional.lacunas"
          readonly
          solo
          dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12">
      <div class="separadorMini">Estratégia de preservação: utilização memória</div>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Identificação dos métodos de preservação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" v-if=siSpec.estrategia.utilizacaoMemoria>
      <v-text-field
        label="Não possui"
        :value="siSpec.estrategia.utilizacaoMemoria.idMetodoPreservacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Fundamentação da escolha do método de preservação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" v-if=siSpec.estrategia.utilizacaoMemoria>
      <v-text-field
          label="Não possui"
          :value="siSpec.estrategia.utilizacaoMemoria.fundMetodoPreservacao"
          readonly
          solo
          dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Identificação de lacunas e necessidade de desenvolvimento</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" v-if=siSpec.estrategia.utilizacaoMemoria>
      <v-text-field
          label="Não possui"
          :value="siSpec.estrategia.utilizacaoMemoria.lacunas"
          readonly
          solo
          dense
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>

export default {
  props: ["siSpec"],


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

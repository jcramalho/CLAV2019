<template>
  <v-row>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Número SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.numeroSI"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Nome SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.nomeSI"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <div class="separador">Identificação</div>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Administrador do Sistema</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.adminSistema"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Administrador dos Dados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.adminDados"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Proprietário do SI - Entidade pública</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.propSistemaPublico"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Proprietário do SI - Entidade privada</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.propSistemaPrivado"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Proprietário dos dados</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.propDados"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2">
      <div class="info-label">Localização dos dados - Entidade pública</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4">
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.localDadosPublico"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Localização dos dados - Entidade privada</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.localDadosPrivado"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Definição formal de responsabilidades</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.defResponsavel"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Insourcing</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.insourcing"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Outsourcing</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.outsourcing"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Notas</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.identificacao.notas"
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

<template>
  <div>
    <v-list>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="info-label">Adicionar Agregação</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-list-group>
    </v-list>
    <div class="ma-2">   
      <v-row>
        <v-col :md="2">
          <div class="info-label">Código da Agregação:</div>
        </v-col>
        <v-col>
          <v-text-field 
            hint="Exemplo: AS_DGLAB_1/2019" 
            v-model="codigo"
          >
          Insira um codigo para a agregação
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :md="2">
          <div class="info-label">Titulo da Agregação:</div>
        </v-col>
        <v-col>
          <v-text-field 
            hint="Exemplo: Auditoria à Entidade A" 
            v-model="titulo"
          >
          Insira um codigo para a agregação
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :md="2">
          <div class="info-label">Data de Contagem do PCA:</div>
        </v-col>
        <v-col>
          <v-text-field 
            hint="Exemplo: 2009" 
            v-model="dataContagem"
          >
          Insira um codigo para a agregação
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :md="2">
          <div class="info-label">Natureza de Intervenção:</div>
        </v-col>
        <v-col>
          <v-select
            label="Selecione a Natureza de Intervenção"
            :items="natureza"
            v-model="ni"
            solo
            dense
          ></v-select>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  props: ["auto"],

  data: () => ({
    codigo: null,
    titulo: null,
    dataContagem: null,
    ni: "Dono",
    natureza: ["Dono","Participante"]
  })
}
</script>
<style>
.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #696969;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}

</style>
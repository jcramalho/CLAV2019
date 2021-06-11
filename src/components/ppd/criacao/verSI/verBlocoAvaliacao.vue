<template>
  <v-row>
    <div class="separador">Avaliação</div>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Descrição</div>
    </v-col>
    <v-col cols="12" xs="12" sm="10" >
      <v-textarea
        label="Não possui"
        :value="siSpec.avaliacao.descricao"
        readonly
        rows="3"
        max-rows="6"
        solo
        dense
      ></v-textarea>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Decomposição</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.decomposicao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Código de classificação da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.codClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">N.º de ref.ª da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.numeroClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Título da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.tituloClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">PCA da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.pcaClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Forma de contagem dos prazos</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.formaContagemPrazos"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Destino final da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.destinoFinalClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">PCA do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.pcaSI"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Destino final do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.destinoSI"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">SI relacionado: n.º de referência</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.siRelacionado"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">SI relacionado: tipo de relação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.siRelacionadoRelacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Atividade do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.checkedAti"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Grau de utilização do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.checkedGrau"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Criticidade do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.checkedCriticidade"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">SI é objeto de preservação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.objetoPreservacao"
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

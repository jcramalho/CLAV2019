<template>
  <div>
    <RADAEntry label="Título" :value="rada.titulo" />
    <RADAEntry label="Entidade responsável">
      <template v-slot:valor>
        <ul>
          <li v-for="(entidade, i) in rada.entResp" :key="i">
            <a :href="'/entidades/ent_' + entidade.sigla">{{
              entidade.sigla + " - " + entidade.designacao
            }}</a>
          </li>
        </ul>
      </template>
    </RADAEntry>
    <RADAEntry
      v-if="!!rada.dataAprovacao"
      label="Data de Aprovação"
      :value="rada.dataAprovacao"
    />
    <RADAEntry
      v-if="!!rada.dataRevogacao"
      label="Data de Revogação"
      :value="rada.dataRevogacao"
    />

    <RADAEntry label="Despacho de Aprovação">
      <template v-slot:valor>
        <a :href="'/legislacao/' + rada.despachoAprovacao.split('#')[1]">
          {{ rada.despachoNumero + " - " + rada.despachoSumario }}
        </a>
      </template>
    </RADAEntry>
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["rada"],
  components: {
    RADAEntry,
  },
};
</script>
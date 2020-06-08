<template>
  <div>
    <RADAEntry label="Título" :value="rada.titulo" />
    <RADAEntry label="Entidades Responsáveis">
      <template v-slot:valor>
        <ul>
          <li v-for="(entidade, i) in rada.entResp" :key="i">
            <a
              :href="'/entidades/ent_' + entidade.sigla"
            >{{ entidade.sigla + " - " + entidade.designacao}}</a>
          </li>
        </ul>
      </template>
    </RADAEntry>
    <RADAEntry v-if="!!rada.dataAprovacao" label="Data de Aprovação" :value="rada.dataAprovacao.split(', ')[0]" />
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["rada"],
  components: {
    RADAEntry
  }
};
</script>
<template>
  <div>
    <RADAEntry label="Título" :value="RADA.titulo" />
    <RADAEntry label="Entidades Responsáveis">
      <template v-slot:valor>
        <ul>
          <li v-for="(ent, i) in RADA.entRes" :key="i">{{ ent }}</li>
        </ul>
      </template>
    </RADAEntry>
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["RADA"],
  components: {
    RADAEntry
  }
};
</script>

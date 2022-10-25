<template>
  <Campo
    v-if="j.length > 0"
    nome="Justificação"
    infoHeader="Justificação"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <ul>
        <li v-for="(crit, i) in j" :key="i">
          <div v-if="crit.tipo == 'CriterioJustificacaoLegal'">
            <b>{{ crit.label }}</b> - {{ crit.notas }}
            <span v-if="crit.legislacao.length > 0">
              <span v-for="(leg, j) in crit.legislacao" :key="j">
                {{ leg.tipo }}: {{ leg.numero }},
              </span>
            </span>
          </div>

          <div v-else>
            <b>{{ crit.label }}</b> - {{ crit.notas }}
            <span v-if="crit.procRel.length > 0">
              <span v-for="(ref, j) in crit.procRel" :key="j">
                {{ ref.codigo }} - {{ ref.titulo }},
              </span>
            </span>
          </div>
        </li>
      </ul>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";
export default {
  props: ["j"],
  components: {
    Campo,
  },
};
</script>

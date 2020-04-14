<template>
    <v-row v-if="j.length > 0">
        <v-col cols="2">
          <div class="info-label">Justificação</div>
        </v-col>
        <v-col>
          <ul>
                  <li v-for="(crit, i) in j" :key="i">

                      <div class="info-content" v-if="crit.tipo == 'CriterioJustificacaoLegal'">
                        <b>{{ crit.label }}</b> - {{ crit.notas }}
                        <span v-if="crit.legislacao.length > 0">
                            <span v-for="(leg, j) in crit.legislacao" :key="j">
                                {{ leg.tipo }}: {{ leg.numero }},
                            </span>
                        </span>
                      </div>

                      <div class="info-content" v-else>
                        <b>{{ crit.label }}</b> - {{ crit.notas }}
                        <span v-if="crit.procRel.length > 0">
                            <span v-for="(ref, j) in crit.procRel" :key="j">
                                {{ ref.codigo }} - {{ ref.titulo }},
                            </span>
                        </span>
                      </div>

                  </li>
              </ul>
        </v-col>
    </v-row>
</template>

<script>
export default {
  props: ["j"]
}
</script>
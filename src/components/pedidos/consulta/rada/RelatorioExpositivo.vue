<template>
  <v-card flat class="mb-12">
    <RADAEntry v-if="!RE.tipologiasProd" label="Entidades Produtoras">
      <template v-slot:valor>
        <ul>
          <li v-for="(ent, i) in RE.entidadesProd" :key="i">{{ent}}</li>
        </ul>
      </template>
    </RADAEntry>

    <RADAEntry v-if="!RE.entidadesProd[0]" label="Tipologias das Entidades Produtoras">
      <template v-slot:valor>
        <ul>
          <li>{{ RE.tipologiasProd }}</li>
        </ul>
      </template>
    </RADAEntry>
    <RADAEntry label="Data Inicial da Documentação" :value="RE.dataInicial" />
    <RADAEntry label="Data Final da Documentação" :value="RE.dataFinal" />
    <div v-if="!!RE.dimSuporte.nSeries">
      <v-card flat outlined>
        <div class="info-label">Dimensão e Suporte</div>
        <v-card-text>
          <RADAEntryDouble
            :value_1="RE.dimSuporte.nSeries"
            :value_2="RE.dimSuporte.nSubseries"
            label_1="Número de Séries"
            label_2="Número de Subséries"
          />
          <RADAEntryDouble
            :value_1="RE.dimSuporte.nUI"
            :value_2="RE.dimSuporte.medicaoUI_papel"
            label_1="Número de Unidades de Instalação"
            label_2="Medição das UIs em Papel"
          />
          <RADAEntryDouble
            :value_1="RE.dimSuporte.medicaoUI_digital"
            :value_2="RE.dimSuporte.medicaoUI_outros"
            label_1="Medição das UIs em Digital"
            label_2="Medição das UIs em noutros suportes"
          />
        </v-card-text>
      </v-card>
    </div>
    <RADAEntry label="História Administrativa/Biográfica" :value="RE.hist_admin" />
    <RADAEntry label="História Custodial" :value="RE.hist_cust" />
    <RADAEntry label="Sistema de Organização" :value="RE.sist_org" />
    <RADAEntry label="Localização" :value="RE.localizacao" />
    <RADAEntry label="Estado de Conservação" :value="RE.est_conser" />
  </v-card>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import RADAEntryDouble from "@/components/rada/consulta/elementos/campos/RadaEntryDouble.vue";

export default {
  props: ["RE"],
  components: {
    RADAEntry,
    RADAEntryDouble
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}
</style>
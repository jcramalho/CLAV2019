<template>
  <div>
    <RADAEntry label="Produtoras da Documentação">
      <template v-slot:valor>
        <ul>
          <li v-for="(entidade, i) in rada.produtoras" :key="i">
            <a
              v-if="entidade.ent_or_tip.split('#')[1].split('_')[0] == 'ent'"
              :href="'/entidades/ent_' + entidade.sigla"
            >{{ entidade.sigla + " - " + entidade.designacao}}</a>
            <a
              v-else
              :href="'/tipologias/tip_' + entidade.sigla"
            >{{ entidade.sigla + " - " + entidade.designacao}}</a>
          </li>
        </ul>
      </template>
    </RADAEntry>
    <RADAEntry label="Data inicial" :value="rada.dataInicial" />
    <RADAEntry label="Data final" :value="rada.dataFinal" />
    <br />
    <v-card outlined>
      <div class="info-label">Dimensão e Suporte</div>
      <v-card-text>
        <RADAEntryDouble
          label_1="Número de Séries"
          :value_1="rada.nSeries"
          label_2="Número de Subséries"
          :value_2="rada.nSubseries"
        />
        <RADAEntryDouble
          label_1="Número de Unidades de instalação"
          :value_1="rada.nUI"
          label_2="Medição das UIs em Papel"
          :value_2="rada.medicaoUI_papel"
        />
        <RADAEntryDouble
          label_1="Medição das UIs em Digital"
          :value_1="rada.medicaoUI_digital"
          label_2="Medição das UIs em noutros suportes"
          :value_2="rada.medicaoUI_outros"
        />
      </v-card-text>
    </v-card>
    <br />
    <RADAEntry label="História administrativa/biográfica" :value="rada.hist_admin" />
    <RADAEntry label="História custodial" :value="rada.hist_cust" />
    <RADAEntry label="Sistema de organização" :value="rada.sist_org" />
    <RADAEntry label="Localização" :value="rada.localizacao" />
    <RADAEntry label="Estado de conservação" :value="rada.est_conser" />
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import RADAEntryDouble from "@/components/rada/consulta/elementos/campos/RadaEntryDouble.vue";

export default {
  components: {
    RADAEntry,
    RADAEntryDouble
  },
  props: ["rada"]
};
</script>
<template>
  <div>
    <NovaLegislacao
      :legislacao="legislacao"
      :newSerie="newSerie"
      :legislacaoProcessada="legislacaoProcessada"
      :tipos="tipos"
    />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Legislação</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-autocomplete
          v-model="newSerie.legislacao"
          :items="legislacaoProcessada"
          label="Selecione a legislação associada à série"
          multiple
          item-text="legislacao"
          return-object
          solo
          clearable
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                <strong>Legislação</strong> em questão não existe no sistema!
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click:close="removeLeg(data.item)"
            >{{ data.item.legislacao }}</v-chip>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NovaLegislacao from "./NovaLegislacao";

export default {
  props: ["newSerie", "legislacao", "classes", "legislacaoProcessada", "tipos"],
  components: {
    NovaLegislacao
  },
  methods: {
    removeLeg(item) {
      this.newSerie.legislacao = this.newSerie.legislacao.filter(
        i => i.legislacao !== item.legislacao
      );

      this.filtrarCriterioLegal(item);
    },
    filtrarCriterioLegal(item) {
      // Necessario remover do critério legal associado à série quer às subséries que são suas filhas
      // 1º remover do critério legal na justificação PCA
      let legalPCA = this.newSerie.justificacaoPCA.find(
        e => e.tipo == "Critério Legal"
      );
      if (legalPCA != undefined) {
        legalPCA.relacoes = legalPCA.relacoes.filter(e => e != item.legislacao);

        if (legalPCA.relacoes.length == 0) {
          this.newSerie.justificacaoPCA = this.newSerie.justificacaoPCA.filter(
            e => e.tipo != "Critério Legal"
          );
        }
      }
      // 2º remover do critério legal na justificação DF
      let legalDF = this.newSerie.justificacaoDF.find(
        e => e.tipo == "Critério Legal"
      );
      if (legalDF != undefined) {
        legalDF.relacoes = legalDF.relacoes.filter(e => e != item.legislacao);

        if (legalDF.relacoes.length == 0) {
          this.newSerie.justificacaoDF = this.newSerie.justificacaoDF.filter(
            e => e.tipo != "Critério Legal"
          );
        }
      }
    }
  }
};
</script>


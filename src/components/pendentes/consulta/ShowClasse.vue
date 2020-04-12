<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>
      {{ p.acao }} da Classe
    </v-card-title>
    <v-card-text>
      <v-row v-for="c in classeInfo" :key="c.campo">
        <v-col cols="2">
          <div class="info-label">{{ c.campo }}</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ c.conteudo }}</div>
        </v-col>
      </v-row>

      <v-card class="ma-2"
              v-if="(p.objeto.notasAp.length > 0)||(p.objeto.exemplosNotasAp.length > 0)||(p.objeto.notasEx.length > 0)||((p.objeto.nivel == 3) && (p.objeto.termosInd.length > 0))">
        <v-card-title class="info-label subtitle-1 font-weight-medium">
          Descritivo da classe
        </v-card-title>
        <v-card-text>
          <ShowNotasAp v-if="p.objeto.notasAp.length > 0" :lista="p.objeto.notasAp"/>
          <ShowExemplosNotasAp v-if="p.objeto.exemplosNotasAp.length > 0" :lista="p.objeto.exemplosNotasAp"/>
          <ShowNotasEx v-if="p.objeto.notasEx.length > 0" :lista="p.objeto.notasEx"/>
          <ShowTIs v-if="(p.objeto.nivel == 3) && (p.objeto.termosInd.length > 0)" :lista="p.objeto.termosInd"/>
        </v-card-text>
      </v-card>

      <v-card class="ma-2" v-if="p.objeto.nivel >= 3">
        <v-card-title class="info-label subtitle-1 font-weight-medium">
          Contexto de avaliação
        </v-card-title>
        <v-card-text>
          <v-row v-if="p.objeto.tipoProc != ''">
            <v-col cols="2">
              <div class="info-label">Tipo de processo</div>
            </v-col>
            <v-col>
              <div class="info-content">{{ p.objeto.tipoProc }}</div>
            </v-col>
          </v-row>
          <v-row v-if="p.objeto.procTrans != ''">
            <v-col cols="2">
              <div class="info-label">Processo transversal</div>
            </v-col>
            <v-col>
              <div class="info-content">{{ p.objeto.procTrans }}</div>
            </v-col>
          </v-row>

          <ShowDonos v-if="p.objeto.donos.length > 0" :lista="p.objeto.donos"/>
          <ShowParticipantes v-if="p.objeto.participantes.length > 0" :lista="p.objeto.participantes"/>
          <ShowProcRel v-if="p.objeto.processosRelacionados.length > 0" :lista="p.objeto.processosRelacionados"/>
          <ShowLegislacao v-if="p.objeto.legislacao.length > 0" :lista="p.objeto.legislacao"/>
        </v-card-text>
      </v-card>

      <v-card class="ma-2"  v-if="p.objeto.nivel >= 3">
        <v-card-title class="info-label subtitle-1 font-weight-medium">
          Decisões de avaliação
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2">
                <div class="info-label">PCA</div>
            </v-col>
            <v-col>
              <ShowDecisoesPCA :pca="p.objeto.pca"/>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
                <div class="info-label">DF</div>
            </v-col>
            <v-col>
              <ShowDecisoesDF :df="p.objeto.df"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!--div>
        {{ JSON.stringify(p.objeto.dados.pca) }}
      </div-->
    </v-card-text>
  </v-card>
</template>

<script>
import ShowNotasAp from "@/components/pedidos/consulta/classes/ShowNotasAp"
import ShowExemplosNotasAp from "@/components/pedidos/consulta/classes/ShowExemplosNotasAp"
import ShowNotasEx from "@/components/pedidos/consulta/classes/ShowNotasEx"
import ShowTIs from "@/components/pedidos/consulta/classes/ShowTIs"

import ShowDonos from "@/components/pedidos/consulta/classes/ShowDonos"
import ShowParticipantes from "@/components/pedidos/consulta/classes/ShowParticipantes"
import ShowProcRel from "@/components/pedidos/consulta/classes/ShowProcRel"
import ShowLegislacao from "@/components/pedidos/consulta/classes/ShowLegislacao"

import ShowDecisoesPCA from "@/components/pedidos/consulta/classes/ShowDecisoesPCA"
import ShowDecisoesDF from "@/components/pedidos/consulta/classes/ShowDecisoesDF"

export default {
  props: ["p"],

  components: {
    ShowNotasAp, ShowExemplosNotasAp, ShowNotasEx, ShowTIs,
    ShowDonos, ShowParticipantes, ShowProcRel, ShowLegislacao,
    ShowDecisoesPCA, ShowDecisoesDF
  },

  data() {
    return {
      classeInfo: [
        { campo: "Nível", conteudo: this.p.objeto.nivel },
        { campo: "Código", conteudo: this.p.objeto.codigo },
        { campo: "Título", conteudo: this.p.objeto.titulo },
        { campo: "Descrição", conteudo: this.p.objeto.descricao }
      ]
    };
  }
};
</script>

<style>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>

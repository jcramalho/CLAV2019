<template>
  <v-card class="my-2">
    <v-card-title class="clav-linear-background white--text">
      {{ p.objeto.acao }} da Classe
    </v-card-title>
    <v-card-text class="pa-2">
      <Campo
        v-for="c in classeInfo"
        :key="c.campo"
        :nome="c.campo"
        :infoHeader="c.campo"
        color="neutralpurple"
      >
        <template v-slot:conteudo> {{ c.conteudo }} </template>
      </Campo>

      <v-card
        class="my-2"
        v-if="
          p.objeto.dados.notasAp.length > 0 ||
          p.objeto.dados.exemplosNotasAp.length > 0 ||
          p.objeto.dados.notasEx.length > 0 ||
          (p.objeto.dados.nivel == 3 && p.objeto.dados.termosInd.length > 0)
        "
      >
        <v-card-title class="clav-linear-background white--text">
          Descritivo da classe
        </v-card-title>
        <v-card-text class="pa-2">
          <Campo
            v-if="p.objeto.dados.notasAp.length > 0"
            nome="Notas de aplicação"
            infoHeader="Notas de aplicação"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(n, i) in p.objeto.dados.notasAp" :key="i">{{ n.nota }}</li>
              </ul>
            </template>
          </Campo>
          <Campo
            v-if="p.objeto.dados.exemplosNotasAp.length > 0"
            nome="Exemplos de notas de aplicação"
            infoHeader="Exemplos de notas de aplicação"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(n, i) in p.objeto.dados.exemplosNotasAp" :key="i">
                  {{ n.exemplo }}
                </li>
              </ul>
            </template>
          </Campo>
          <Campo
            v-if="p.objeto.dados.notasEx.length > 0"
            nome="Notas de exclusão"
            infoHeader="Notas de exclusão"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(n, i) in p.objeto.dados.notasEx" :key="i">{{ n.nota }}</li>
              </ul>
            </template>
          </Campo>
          <Campo
            v-if="p.objeto.dados.nivel == 3 && p.objeto.dados.termosInd.length > 0"
            nome="Termos de Índice"
            infoHeader="Termos de Índice"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(n, i) in p.objeto.dados.termosInd" :key="i">{{ n.termo }}</li>
              </ul>
            </template>
          </Campo>
        </v-card-text>
      </v-card>

      <v-card class="my-2">
        <v-card-title class="clav-linear-background white--text">
          Contexto de avaliação
        </v-card-title>
        <v-card-text class="pa-2">
          <Campo
            v-if="p.objeto.dados.tipoProc != ''"
            nome="Tipo de processo"
            infoHeader="Tipo de processo"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              {{ p.objeto.dados.tipoProc }}
            </template>
          </Campo>
          <Campo
            v-if="p.objeto.dados.procTrans != ''"
            nome="Processo transversal"
            infoHeader="Processo transversal"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              {{ p.objeto.dados.procTrans }}
            </template>
          </Campo>

          <ShowDonos
            v-if="p.objeto.dados.donos.length > 0"
            :lista="p.objeto.dados.donos"
          />
          <ShowParticipantes
            v-if="p.objeto.dados.participantes.length > 0"
            :lista="p.objeto.dados.participantes"
          />
          <ShowProcRel
            v-if="p.objeto.dados.processosRelacionados.length > 0"
            :lista="p.objeto.dados.processosRelacionados"
          />
          <ShowLegislacao
            v-if="p.objeto.dados.legislacao.length > 0"
            :lista="p.objeto.dados.legislacao"
          />
        </v-card-text>
      </v-card>

      <v-card class="my-2">
        <v-card-title class="clav-linear-background white--text">
          Decisões de avaliação
        </v-card-title>
        <v-card-text class="pa-2">
          <v-row>
            <v-col cols="2">
              <div class="info-label">PCA</div>
            </v-col>
            <v-col>
              <ShowDecisoesPCA :pca="p.objeto.dados.pca" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">DF</div>
            </v-col>
            <v-col>
              <ShowDecisoesDF :df="p.objeto.dados.df" />
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
import ShowDonos from "@/components/pedidos/consulta/classes/ShowDonos";
import ShowParticipantes from "@/components/pedidos/consulta/classes/ShowParticipantes";
import ShowProcRel from "@/components/pedidos/consulta/classes/ShowProcRel";
import ShowLegislacao from "@/components/pedidos/consulta/classes/ShowLegislacao";

import ShowDecisoesPCA from "@/components/pedidos/consulta/classes/ShowDecisoesPCA";
import ShowDecisoesDF from "@/components/pedidos/consulta/classes/ShowDecisoesDF";

import Campo from "@/components/generic/Campo";

export default {
  props: ["p"],

  components: {
    ShowDonos,
    ShowParticipantes,
    ShowProcRel,
    ShowLegislacao,
    ShowDecisoesPCA,
    ShowDecisoesDF,
    Campo,
  },

  data() {
    return {
      classeInfo: [
        { campo: "Nível", conteudo: this.p.objeto.dados.nivel },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo },
        { campo: "Título", conteudo: this.p.objeto.dados.titulo },
        { campo: "Descrição", conteudo: this.p.objeto.dados.descricao },
      ],
    };
  },
};
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
</style>

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

          <Campo
            v-if="p.objeto.dados.donos.length > 0"
            nome="Donos do processo"
            infoHeader="Donos do processo"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(p, i) in p.objeto.dados.donos" :key="i">
                  {{ p.sigla }}:
                  {{ p.designacao }}
                  ({{ p.tipo }})
                </li>
              </ul>
            </template>
          </Campo>

          <Campo
            v-if="p.objeto.dados.participantes.length > 0"
            nome="Participantes no processo"
            infoHeader="Participantes no processo"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(p, i) in p.objeto.dados.participantes" :key="i">
                  [{{ p.intervencao }}] {{ p.sigla }}:
                  {{ p.designacao }}
                  ({{ p.tipo }})
                </li>
              </ul>
            </template>
          </Campo>

          <Campo
            v-if="p.objeto.dados.processosRelacionados.length > 0"
            nome="Processos relacionados"
            infoHeader="Processos relacionados"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(p, i) in p.objeto.dados.processosRelacionados" :key="i">
                  [{{ p.relacao }}]: {{ p.codigo }} - {{ p.titulo }}
                </li>
              </ul>
            </template>
          </Campo>

          <Campo
            v-if="p.objeto.dados.legislacao.length > 0"
            nome="Legislação"
            infoHeader="Legislação"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <ul>
                <li v-for="(leg, i) in p.objeto.dados.legislacao" :key="i">
                  {{ leg.tipo }}
                  {{ leg.numero }}, {{ leg.data }}, {{ leg.sumario }}
                </li>
              </ul>
            </template>
          </Campo>
        </v-card-text>
      </v-card>

      <v-card class="my-2">
        <v-card-title class="clav-linear-background white--text">
          Decisões de avaliação
        </v-card-title>
        <v-card-text class="pa-2">
          <Campo
            nome="Subclasses de 4º nível?"
            infoHeader="Subclasses de 4º nível"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              {{ !p.objeto.dados.temSubclasses4Nivel ? "Não" : "Sim" }}
            </template>
          </Campo>
          <div v-if="!p.objeto.dados.temSubclasses4Nivel">
            <Campo nome="PCA" infoHeader="PCA" color="neutralpurple">
              <template v-slot:conteudo>
                <ShowDecisoesPCA :pca="p.objeto.dados.pca" />
              </template>
            </Campo>
            <Campo nome="DF" infoHeader="DF" color="neutralpurple">
              <template v-slot:conteudo>
                <ShowDecisoesDF :df="p.objeto.dados.df" />
              </template>
            </Campo>
          </div>
          <div v-else>
            <Campo
              nome="Motivo(s) da subdivisão em 4ºs níveis"
              infoHeader="Motivo(s) da subdivisão em 4ºs níveis:"
              color="neutralpurple"
            >
              <template v-slot:conteudo>
                <ul>
                  <li v-if="!!p.objeto.dados.temSubclasses4NivelPCA">
                    Prazo de Conservação Administrativa distinto
                  </li>
                  <li v-if="!!p.objeto.dados.temSubclasses4NivelDF">
                    Destino Final distinto
                  </li>
                </ul>
              </template>
            </Campo>
            <strong></strong>
            <Subclasses4Nivel
              :c="p.objeto.dados"
              :semaforos="p.objeto.dados.subclasses[0].semaforos"
              :pcaFormasContagem="p.objeto.dados.pca.pcaFormasContagem"
              :pcaSubFormasContagem="p.objeto.dados.pca.pcaSubFormasContagem"
              :disable="true"
              class="mt-3"
            />
          </div>
        </v-card-text>
      </v-card>

      <!--div>
        {{ JSON.stringify(p.objeto.dados.pca) }}
      </div-->
    </v-card-text>
  </v-card>
</template>

<script>
import ShowDecisoesPCA from "@/components/pedidos/consulta/classes/ShowDecisoesPCA";
import ShowDecisoesDF from "@/components/pedidos/consulta/classes/ShowDecisoesDF";
import Subclasses4Nivel from "@/components/classes/criacao/Subclasses4Nivel";

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["p"],

  components: {
    Subclasses4Nivel,
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

<style></style>

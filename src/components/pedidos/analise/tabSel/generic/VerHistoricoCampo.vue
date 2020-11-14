<template>
  <div>
    <v-row dense class="ma-1">
      <v-col cols="2">
        <div
          :class="['info-descricao', `info-descricao-${historicoCampo.cor}`]"
        >
          {{ campoText }}
        </div>
      </v-col>
      <v-col>
        <div class="info-conteudo">
          <slot name="campo">
            <span v-if="tipo == 'procsAselecionar'">
              <ul>
                <li v-for="(v, i) in historicoCampo.dados" :key="i">
                  {{ v.codigo }} - {{ v.titulo }}
                </li>
              </ul>
            </span>
            <span v-else-if="tipo == 'array'">
              <ul>
                <li v-for="(v, i) in historicoCampo.dados" :key="i">
                  {{ v[arrayValue] }}
                </li>
              </ul>
            </span>
            <span v-else-if="tipo == 'estado'">
              <div v-if="historicoCampo.dados === 'A'">
                Ativa
              </div>
              <div v-else-if="historicoCampo.dados === 'H'">
                Em revisão...
              </div>
              <div v-else>Inativa</div>
            </span>
            <span v-else-if="tipo == 'procTrans'">{{
              historicoCampo.dados == "S" ? "Sim" : "Não"
            }}</span>
            <span v-else-if="tipo == 'donos'">
              <Donos :entidades="historicoCampo.dados" :valida="true" />
            </span>
            <span v-else-if="tipo == 'participantes'">
              <Participantes :entidades="historicoCampo.dados" :valida="true"
            /></span>

            <span v-else-if="tipo == 'procRel'">
              <ProcessosRelacionados
                :processos="historicoCampo.dados"
                :valida="true"
              />
            </span>
            <span v-else-if="tipo == 'legs'">
              <Legislacao :legs="historicoCampo.dados" :valida="true"
            /></span>
            <span v-else-if="tipo == 'prazo'">
              <div v-if="historicoCampo.dados > 1">
                {{ historicoCampo.dados }} anos
              </div>
              <div v-else-if="historicoCampo.dados == 1">
                {{ historicoCampo.dados }} ano
              </div>
              <div v-else>
                Não específicado
              </div>
            </span>
            <span v-else-if="tipo == 'justPCA'">
              <div v-for="c in historicoCampo.dados" :key="c.tipoId">
                <!-- Critério Gestionário ...............................-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoGestionario'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério Gestionário
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{
                        /* texto normalizado:
                                          mylabels.textoCriterioJustificacaoGestionario
                                          texto proveniente da FRD: */
                        c.conteudo
                      }}
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério Utilidade Administrativa .................-->
                <v-row
                  v-if="
                    c.tipoId == 'CriterioJustificacaoUtilidadeAdministrativa'
                  "
                >
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério de Utilidade Administrativa
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{ c.conteudo }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="p in c.processos" :key="p.procId">
                          <a :href="'/classes/consultar/' + p.procId">
                            {{ p.procId.split("c")[1] }} -
                            {{ p.nome }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério Legal ...................................-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério Legal
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{ c.conteudo }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="l in c.legislacao" :key="l.legId">
                          <a :href="'/legislacao/' + l.legId"
                            >{{ l.tipo }} {{ l.numero }}</a
                          >
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </span>
            <span v-else-if="tipo == 'df'">
              <span v-if="historicoCampo.dados == 'E'">Eliminação</span>
              <span v-else-if="historicoCampo.dados == 'C'">Conservação</span>
              <span v-else-if="historicoCampo.dados == 'CP'"
                >Conservação Parcial</span
              >
              <span v-else>Não Especificado</span>
            </span>
            <span v-else-if="tipo == 'justDF'">
              <div v-for="c in historicoCampo.dados" :key="c.tipoId">
                <!-- Critério Legal ...................................-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério Legal
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{ c.conteudo }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="l in c.legislacao" :key="l.legId">
                          <a :href="'/legislacao/' + l.legId"
                            >{{ l.tipo }} {{ l.numero }}</a
                          >
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério de Densidade Informacional ..............-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoDensidadeInfo'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério de Densidade Informacional
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{
                        /* texto normalizado:
                                          mylabels.textoCriterioDensidadeInfo
                                          texto proveniente da FRD: */
                        c.conteudo
                      }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="p in c.processos" :key="p.procId">
                          <a :href="'/classes/consultar/' + p.procId">
                            {{ p.procId.split("c")[1] }} -
                            {{ p.nome }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério de Complementaridade Informacional ..............-->
                <v-row
                  v-if="c.tipoId == 'CriterioJustificacaoComplementaridadeInfo'"
                >
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério de Complementaridade Informacional
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{
                        /* texto normalizado:
                                          mylabels.textoCriterioComplementaridade
                                          texto proveniente da FRD: */
                        c.conteudo
                      }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="p in c.processos" :key="p.procId">
                          <a :href="'/classes/consultar/' + p.procId">
                            {{ p.procId.split("c")[1] }} -
                            {{ p.nome }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </span>
            <span v-else>{{ historicoCampo.dados }}</span>
          </slot>
        </div>
      </v-col>
      <v-col cols="1" v-if="!!historicoCampo.nota">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="verNota = true">message</v-icon>
          </template>
          <span>Ver nota relativa ao campo...</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-dialog v-model="verNota" width="50%">
      <v-card>
        <v-card-title class="indigo darken-4 title white--text"
          >Nota {{ campoText }}</v-card-title
        >

        <v-card-text>
          <v-row>
            <v-col>
              <v-textarea
                :value="historicoCampo.nota"
                auto-grow
                outlined
                readonly
                color="indigo"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="red darken-4" dark @click="verNota = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";

export default {
  props: ["campoText", "historicoCampo", "tipo", "arrayValue"],
  components: { Donos, Participantes, ProcessosRelacionados, Legislacao },
  data() {
    return {
      verNota: false
    };
  }
};
</script>

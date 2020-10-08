<template>
  <div>
    <br />
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step step="1" editable>Zona Descrita</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="2" editable>Zona de Contexto de Avaliação</v-stepper-step>

        <v-divider v-if="!!historico.pca || !!historico.notaPCA"></v-divider>
        <!-- <v-divider v-if="!classes.some(e => e.eFilhoDe == classe.codigo)"></v-divider> -->
        <!--  v-if="!classes.some(e => e.eFilhoDe == classe.codigo)" -->
        <v-stepper-step
          step="3"
          editable
          v-if="!!historico.pca || !!historico.notaPCA"
        >Zona de Decisões de Avaliação</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <!-- zona descritiva -->
        <v-stepper-content :step="1" flat>
          <v-card flat>
            <v-card-text>
              <VerHistoricoCampo campoText="Código" :historicoCampo="historico.codigo" />
              <VerHistoricoCampo campoText="Título" :historicoCampo="historico.titulo" />
              <VerHistoricoCampo campoText="Descrição" :historicoCampo="historico.descricao" />
              <VerHistoricoCampo
                v-if="!!historico.eFilhoDe.dados"
                campoText="Classe Pai"
                :historicoCampo="historico.eFilhoDe"
              />
              <VerHistoricoCampo campoText="Nível" :historicoCampo="historico.tipo" />
              <VerHistoricoCampo campoText="Data Inicial" :historicoCampo="historico.dataInicial" />
              <VerHistoricoCampo campoText="Data Final" :historicoCampo="historico.dataFinal" />
              <VerHistoricoCampo
                campoText="Unidades de Instalação"
                :historicoCampo="historico.UIs"
              />

              <div v-if="historico.tipo.dados == 'Série'">
                <VerHistoricoCampo
                  campoText="Tipo de Unidade Arquivística"
                  :historicoCampo="historico.tUA"
                />
                <VerHistoricoCampo campoText="Tipo de Série" :historicoCampo="historico.tSerie" />
                <VerHistoricoCampo
                  campoText="Suporte e Medição"
                  :historicoCampo="historico.suporte_e_medicao"
                >
                  <template v-slot:campo>
                    <span>
                      <ul>
                        <li
                          v-for="(v, i) in historico.suporte_e_medicao.dados"
                          :key="i"
                        >{{ v.suporte + ": " + v.medicao + ";" }}</li>
                      </ul>
                    </span>
                  </template>
                </VerHistoricoCampo>
                <VerHistoricoCampo campoText="Localização" :historicoCampo="historico.localizacao" />
              </div>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <!-- zona contexto de avaliação -->
        <v-stepper-content :step="2" flat>
          <v-card flat>
            <v-card-text>
              <div v-if="historico.tipo.dados == 'Série'">
                <VerHistoricoCampo
                  v-if="!!historico.entProdutoras.dados[0]"
                  campoText="Entidades Produtoras"
                  :historicoCampo="historico.entProdutoras"
                />
                <VerHistoricoCampo
                  v-else
                  campoText="Tipologias Produtoras"
                  :historicoCampo="historico.tipologiasProdutoras"
                />

                <VerHistoricoCampo
                  v-if="!!historico.legislacao.dados[0]"
                  campoText="Legislação"
                  :historicoCampo="historico.legislacao"
                >
                  <template v-slot:campo>
                    <span>
                      <ul>
                        <li v-for="(v, i) in historico.legislacao.dados" :key="i">{{ v.legislacao }}</li>
                      </ul>
                    </span>
                  </template>
                </VerHistoricoCampo>
              </div>
              <VerHistoricoCampo
                v-if="!!historico.relacoes.dados[0]"
                campoText="Séries/Subséries Relacionadas"
                :historicoCampo="historico.relacoes"
              >
                <template v-slot:campo>
                  <span>
                    <ul>
                      <li
                        v-for="(v, i) in historico.relacoes.dados"
                        :key="i"
                      >{{ v.relacao + " " + v.serieRelacionada.codigo + ";" }}</li>
                    </ul>
                  </span>
                </template>
              </VerHistoricoCampo>
            </v-card-text>
            <br />
          </v-card>
        </v-stepper-content>
        <!-- zona decisões de avaliação -->
        <v-stepper-content :step="3" flat v-if="!!historico.pca || !!historico.notaPCA">
          <v-card flat>
            <v-card outlined>
              <div class="info-label">Prazo de Conservação Administrativo</div>
              <v-card-text>
                <VerHistoricoCampo
                  v-if="!!historico.pca.dados"
                  campoText="PCA"
                  :historicoCampo="historico.pca"
                />
                <VerHistoricoCampo
                  v-if="!!historico.notaPCA.dados"
                  campoText="Nota sobre PCA"
                  :historicoCampo="historico.notaPCA"
                />
                <div v-if="!!historico.formaContagem">
                  <VerHistoricoCampo
                    v-if="!!historico.formaContagem.forma.dados"
                    campoText="Forma de Contagem do PCA"
                    :historicoCampo="historico.formaContagem.forma"
                  >
                    <template v-slot:campo>
                      <span>{{ formaContagem.find(e => e.value == historico.formaContagem.forma.dados).label }}</span>
                    </template>
                  </VerHistoricoCampo>
                  <VerHistoricoCampo
                    v-if="!!historico.formaContagem.subforma.dados"
                    campoText="Subforma de Contagem do PCA"
                    :historicoCampo="historico.formaContagem.subforma"
                  />
                </div>
                <VerHistoricoCampo
                  v-if="!!historico.justificacaoPCA.dados[0]"
                  campoText="Justificação do PCA"
                  :historicoCampo="historico.justificacaoPCA"
                >
                  <template v-slot:campo>
                    <span>
                      <ul>
                        <li v-for="(v, i) in historico.justificacaoPCA.dados" :key="i">
                          {{ `${v.tipo}: ${!!v.nota ? v.nota : "[Nota não preenchida]"}` }}
                          <ul v-if="!!v.relacoes">
                            <li
                              v-for="(rel, j) in v.relacoes"
                              :key="j"
                            >{{ !!rel.codigo ? rel.codigo : rel}}</li>
                          </ul>
                        </li>
                      </ul>
                    </span>
                  </template>
                </VerHistoricoCampo>
              </v-card-text>
              <br />
            </v-card>
            <br />
            <v-card outlined>
              <div class="info-label">Destino Final</div>
              <v-card-text>
                <VerHistoricoCampo
                  v-if="!!historico.df.dados"
                  campoText="DF"
                  :historicoCampo="historico.df"
                />
                <VerHistoricoCampo
                  v-if="!!historico.notaDF.dados"
                  campoText="Nota sobre o DF"
                  :historicoCampo="historico.notaDF"
                />
                <VerHistoricoCampo
                  v-if="!!historico.justificacaoDF.dados[0]"
                  campoText="Justificação do DF"
                  :historicoCampo="historico.justificacaoDF"
                >
                  <template v-slot:campo>
                    <span>
                      <ul>
                        <li v-for="(v, i) in historico.justificacaoDF.dados" :key="i">
                          {{ `${v.tipo}: ${!!v.nota ? v.nota : "[Nota não preenchida]"}` }}
                          <ul v-if="!!v.relacoes[0]">
                            <li
                              v-for="(rel, j) in v.relacoes"
                              :key="j"
                            >{{ !!rel.codigo ? rel.codigo : rel}}</li>
                          </ul>
                        </li>
                      </ul>
                    </span>
                  </template>
                </VerHistoricoCampo>
              </v-card-text>
            </v-card>

            <br />
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <br />
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/rada/generic/VerHistoricoCampo";

export default {
  props: ["historico", "formaContagem"],
  components: {
    VerHistoricoCampo,
  },
};
</script>
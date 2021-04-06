<template>
  <v-dialog :value="true" width="90%" @click:outside="$emit('fechar');">
    <v-card>
      <v-card-title
        class="indigo darken-4 title white--text mb-4"
        dark
      >Validação da classe {{elemento.tipo}}: {{ elemento.codigo + " - " + elemento.titulo }}</v-card-title>

      <v-card-text>
        <!-- {{ elemento }}
        {{ novoHistorico}}-->
        <!-- Código -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="codigo"
          campoText="Código"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />

        <!-- Titulo -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="titulo"
          campoText="Título"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />
        <!-- Pai -->
        <ValidaCampo
          v-if="!!novoHistorico.dados.eFilhoDe.dados"
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="eFilhoDe"
          campoText="Classe pai"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />
        <v-expansion-panels class="ma-1">
          <v-expansion-panel class="ma-1" popout focusable>
            <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
              <b>Zona Descritiva</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- Descrição -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="descricao"
                campoText="Descrição"
                tipo="string"
                @corAlterada="validadeClasse"
              >
                <template v-slot:input="props">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório']"
                    solo
                    v-model="props.items.campoEditado"
                    @input="props.items.updateValue"
                  ></v-text-field>
                </template>
              </ValidaCampo>
              <!-- Data inicial -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="dataInicial"
                campoText="Data inicial"
                tipo="string"
                :permitirEditar="false"
                @corAlterada="validadeClasse"
              />

              <!-- Data final -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="dataFinal"
                campoText="Data final"
                tipo="string"
                :permitirEditar="false"
                @corAlterada="validadeClasse"
              />

              <!-- UIs -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="UIs"
                campoText="Unidades de instalação"
                tipo="array"
                :permitirEditar="false"
                @corAlterada="validadeClasse"
              />
              <!-- Zona Descritiva -->
              <div v-if="novoHistorico.dados.tipo.dados == 'Série'">
                <!-- Tipo de UA -->
                <ValidaCampo
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="tUA"
                  campoText="Tipo de unidade arquivística"
                  tipo="string"
                  @corAlterada="validadeClasse"
                >
                  <template v-slot:input="props">
                    <v-select
                      :rules="[v => !!v || 'Campo obrigatório']"
                      @change="props.items.updateValue"
                      v-model="props.items.campoEditado"
                      :items="['Processo', 'Coleção', 'Dossier', 'Registo']"
                      placeholder="Selecione o tipo de unidade arquivística."
                      chips
                      solo
                    ></v-select>
                  </template>
                </ValidaCampo>
                <!-- Tipo de série -->
                <ValidaCampo
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="tSerie"
                  campoText="Tipo de série"
                  tipo="string"
                  @corAlterada="validadeClasse"
                >
                  <template v-slot:input="props">
                    <v-select
                      :rules="[v => !!v || 'Campo obrigatório']"
                      @change="props.items.updateValue"
                      v-model="props.items.campoEditado"
                      :items="['Aberta', 'Fechada']"
                      placeholder="Selecione o tipo série."
                      chips
                      solo
                    ></v-select>
                  </template>
                </ValidaCampo>

                <!-- Suporte e Medicao -->
                <ValidaCampo
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="suporte_e_medicao"
                  campoText="Medição e Suporte"
                  tipo="array"
                  @corAlterada="validadeClasse"
                  :permitirEditar="false"
                >
                  <template v-slot:campo>
                    <span>
                      <ul>
                        <li
                          v-for="(v, i) in novoHistorico.dados.suporte_e_medicao.dados"
                          :key="i"
                        >{{ v.suporte + ": " + v.medicao + ";" }}</li>
                      </ul>
                    </span>
                  </template>
                </ValidaCampo>

                <!-- Localização -->
                <ValidaCampo
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="localizacao"
                  campoText="Localização"
                  tipo="array"
                  @corAlterada="validadeClasse"
                >
                  <template v-slot:input="props">
                    <v-combobox
                      :rules="[v => !!v[0] || 'Campo obrigatório!']"
                      multiple
                      solo
                      clearable
                      v-model="props.items.campoEditado"
                      @change="props.items.updateValue"
                      chips
                      deletable-chips
                      label="Localização"
                    ></v-combobox>
                  </template>
                </ValidaCampo>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="ma-1" popout focusable>
            <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
              <b>Zona de Contexto de Avaliação</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-if="novoHistorico.dados.tipo.dados == 'Série'">
                <ValidaCampo
                  v-if="!!novoHistorico.dados.entProdutoras.dados[0]"
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="entProdutoras"
                  campoText="Entidade produtora"
                  tipo="array"
                  :permitirEditar="false"
                />
                <ValidaCampo
                  v-else
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="tipologiasProdutoras"
                  campoText="Tipologias Produtoras"
                  tipo="array"
                  :permitirEditar="false"
                />

                <ValidaCampo
                  :dadosOriginais="elemento"
                  :novoHistorico="novoHistorico.dados"
                  campoValue="legislacao"
                  campoText="Legislação"
                  tipo="array"
                  :permitirEditar="false"
                >
                  <template v-slot:campo>
                    <span>
                      <ul>
                        <li
                          v-for="(v, i) in novoHistorico.dados.legislacao.dados"
                          :key="i"
                        >{{ v.legislacao }}</li>
                      </ul>
                    </span>
                  </template>
                </ValidaCampo>
              </div>
              <!-- RELACOES -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="relacoes"
                campoText="Relações"
                tipo="array"
                @corAlterada="validadeClasse"
                :permitirEditar="false"
              >
                <template v-slot:campo>
                  <span>
                    <ul>
                      <li
                        v-for="(v, i) in novoHistorico.dados.relacoes.dados"
                        :key="i"
                      >{{ v.relacao + " " + v.serieRelacionada.codigo + ";" }}</li>
                    </ul>
                  </span>
                </template>
              </ValidaCampo>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel
            class="ma-1"
            popout
            focusable
            v-if="!!novoHistorico.dados.pca || !!novoHistorico.dados.notaPCA"
          >
            <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
              <b>Zona de Decisões de Avaliação</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="pca"
                campoText="Prazo de conservação administrativa"
                tipo="string"
                :permitirEditar="false"
              />
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="notaPCA"
                campoText="Nota PCA"
                tipo="string"
                :permitirEditar="false"
              />
              <!-- TODO FORMA CONTAGEM PCA -->
              <ValidaCampo
                :dadosOriginais="elemento.formaContagem"
                :novoHistorico="novoHistorico.dados.formaContagem"
                campoValue="forma"
                campoText="Forma de Contagem"
                @corAlterada="validadeClasse"
                tipo="string"
                :permitirEditar="false"
              >
                <template v-slot:campo>
                  <span>{{ textoForma(novoHistorico.dados.formaContagem.forma, formaContagem.formasContagem) }}</span>
                </template>
              </ValidaCampo>
              <!-- TODO SUBFORMA CONTAGEM PCA -->
              <ValidaCampo
                v-if="novoHistorico.dados.formaContagem.forma.dados == 'vc_pcaFormaContagem_disposicaoLegal'"
                :dadosOriginais="elemento.formaContagem"
                :novoHistorico="novoHistorico.dados.formaContagem"
                campoValue="subforma"
                campoText="Subforma de Contagem"
                @corAlterada="validadeClasse"
                tipo="string"
                :permitirEditar="false"
              />
              <!-- TODO JUSTIFICACAO PCA -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="justificacaoPCA"
                campoText="Justificação do PCA"
                tipo="array"
                @corAlterada="validadeClasse"
                :permitirEditar="false"
              >
                <template v-slot:campo>
                  <div v-if="!!novoHistorico.dados.justificacaoPCA.dados[0]">
                    <v-row
                      v-for="(criterio, cindex) in novoHistorico.dados.justificacaoPCA.dados"
                      :key="cindex"
                    >
                      <v-col cols="3">
                        <div style="padding-left: 15px;" class="info-label">{{ criterio.tipo }}</div>
                      </v-col>
                      <v-col
                        cols="9"
                        v-if="criterio.tipo == 'Critério Gestionário'"
                        style="padding-right: 20px;"
                      >
                        <div span class="info-conteudo">
                          <span v-if="!!criterio.nota">{{criterio.nota}}</span>
                          <span v-else>[Nota não preenchida na submissão do pedido]</span>
                        </div>
                      </v-col>
                      <v-col v-else style="padding-right: 20px;">
                        <v-card outlined>
                          <div span class="info-conteudo">
                            <span v-if="!!criterio.nota">{{criterio.nota}}</span>
                            <span v-else>[Nota não preenchida na submissão do pedido]</span>
                          </div>
                          <v-card-text>
                            <ul v-if="criterio.tipo == 'Critério de Utilidade Administrativa'">
                              <li
                                v-for="(relacao, relindex) in criterio.relacoes"
                                :key="relindex"
                              >{{ relacao.codigo }}</li>
                            </ul>
                            <ul v-else>
                              <li
                                v-for="(relacao, relindex) in criterio.relacoes"
                                :key="relindex"
                              >{{ relacao }}</li>
                            </ul>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                  <span v-else>[Campo não preenchido na submissão do pedido]</span>
                </template>
              </ValidaCampo>
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="df"
                campoText="Destino final"
                tipo="string"
                :permitirEditar="false"
              />
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="notaDF"
                campoText="Nota DF"
                tipo="string"
                :permitirEditar="false"
              />
              <!-- TODO JUSTIFICACAO DF -->
              <ValidaCampo
                :dadosOriginais="elemento"
                :novoHistorico="novoHistorico.dados"
                campoValue="justificacaoDF"
                campoText="Justificação do DF"
                tipo="array"
                @corAlterada="validadeClasse"
                :permitirEditar="false"
              >
                <template v-slot:campo>
                  <div v-if="!!novoHistorico.dados.justificacaoDF.dados[0]">
                    <v-row
                      v-for="(criterio, cindex) in novoHistorico.dados.justificacaoDF.dados"
                      :key="cindex"
                    >
                      <v-col cols="3">
                        <div style="padding-left: 15px;" class="info-label">{{ criterio.tipo }}</div>
                      </v-col>
                      <v-col style="padding-right: 20px;">
                        <v-card outlined>
                          <div span class="info-conteudo">
                            <span v-if="!!criterio.nota">{{criterio.nota}}</span>
                            <span v-else>[Nota não preenchida na submissão do pedido]</span>
                          </div>

                          <v-card-text>
                            <ul v-if="criterio.tipo != 'Critério Legal'">
                              <li
                                v-for="(relacao, relindex) in criterio.relacoes"
                                :key="relindex"
                              >{{ relacao.codigo }}</li>
                            </ul>
                            <ul v-else>
                              <li
                                v-for="(relacao, relindex) in criterio.relacoes"
                                :key="relindex"
                              >{{ relacao }}</li>
                            </ul>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </ValidaCampo>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="indigo darken-4" dark @click="$emit('fechar')">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/rada/generic/ValidaCampo";

export default {
  props: ["elemento", "novoHistorico", "formaContagem"],
  components: {
    ValidaCampo,
  },
  data() {
    return {
      nota: null,
    };
  },
  methods: {
    validadeClasse(cor) {
      let existemV = Object.keys(this.novoHistorico.dados).some((k) => {
        return this.novoHistorico.dados[k].cor === "vermelho";
      });

      if (existemV) {
        this.novoHistorico.cor = "vermelho";
      } else {
        let existemA = Object.keys(this.novoHistorico.dados).some((k) => {
          return this.novoHistorico.dados[k].cor === "amarelo";
        });

        if (existemA) {
          this.novoHistorico.cor = "amarelo";
        } else {
          this.novoHistorico.cor = "verde";
        }
      }
    },
    textoForma(item, lista) {
      let f = lista.find((e) => e.value == item.dados);
      return f.label;
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}
</style>

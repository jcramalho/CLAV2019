<template>
    <!-- PCA -->
    <v-container fluid>
        <v-layout row wrap color="teal lighten-5" v-if="!c.temSubclasses4Nivel">
            <v-flex xs2>
                <span class="title">Prazo de Conservação Administrativa</span>
            </v-flex>
            <v-flex xs9>
                <v-layout row wrap>
                    <v-flex xs2>
                        <v-subheader>Prazo:</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                        <v-text-field
                            v-model="c.pca.valor"
                            label="Prazo em anos"
                            solo
                            clearable
                        ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap v-if="semaforos.pcaFormasContagemReady">
                    <v-flex xs2>
                        <v-subheader>Forma de Contagem:</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                        <v-select
                            item-text="label"
                            item-value="value"
                            v-model="c.pca.formaContagem"
                            :items="pcaFormasContagem"
                            label="Selecione uma forma de contagem para o prazo"
                            solo dense
                        />
                    </v-flex>
                </v-layout>
                <v-layout row wrap v-if="semaforos.pcaSubFormasContagemReady && c.pca.formaContagem=='vc_pcaFormaContagem_disposicaoLegal'">
                    <v-flex xs2>
                        <v-subheader>Subforma de contagem:</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                        <v-select
                            item-text="label"
                            item-value="value"
                            v-model="c.pca.subFormaContagem"
                            :items="pcaSubFormasContagem"
                            label="Selecione uma subforma de contagem para o prazo"
                            solo dense
                        />
                    </v-flex>
                </v-layout>

                <hr style="border-top: 2px dashed green;"/>

            </v-flex>

            <!-- JUSTIFICAÇÂO DO PCA -->
            <v-container fluid>
                <v-layout row wrap>
                    <v-flex xs2>
                        <span class="subheading">Justificação do PCA</span>
                    </v-flex>
                    <v-flex xs9>
                        <v-layout row justify-start>
                            <v-flex>
                                <v-btn color="indigo darken-3" dark 
                                    @click="adicionarCriterioGestionario(c.pca.justificacao, 'CriterioJustificacaoGestionario', 'Critério Gestionário', textoCriterioGestionario, [], [])"
                                    v-if="!semaforos.critGestionarioAdicionado"
                                > Adicionar Critério Gestionário
                                </v-btn>
                            </v-flex>
                            <v-flex>
                                <v-btn color="indigo darken-3" dark 
                                    @click="adicionarCriterioLegalPCA(c.pca.justificacao, 'CriterioJustificacaoLegal', 'Critério Legal', '', [], c.legislacao)"
                                    v-if="!semaforos.critLegalAdicionadoPCA"
                                > Adicionar Critério Legal
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap v-for="(crit, cindex) in c.pca.justificacao" :key="cindex">
                            <v-flex xs6>
                                <v-subheader>{{ crit.label }}</v-subheader>
                            </v-flex>
                            <v-flex xs6>
                                <v-btn small color="red darken-2" dark round @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')">
                                    <v-icon dark>remove_circle</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                    solo
                                    label="Notas do critério"
                                    v-model="crit.notas"
                                    rows="2"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs12 v-if="crit.procRel.length > 0">
                                <ProcessosRelacionadosOps 
                                    :processos="crit.procRel" 
                                    @unselectProcRel="unselectProcesso($event, crit.procRel)"
                                />
                            </v-flex>
                            <v-flex xs12 v-if="crit.legislacao.length > 0">
                                <LegislacaoOps
                                    :legs="crit.legislacao"
                                    @unselectDiploma="unselectDiploma($event, crit.legislacao)"
                                />
                            </v-flex>
                            <hr style="border-top: 2px dotted green; width: 100%;"/>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
                                
        </v-layout>
    </v-container>
</template>

<script>
import ProcessosRelacionadosOps from '@/components/classes/ProcessosRelacionadosOps.vue'
import LegislacaoOps from '@/components/classes/LegislacaoOps.vue'

export default {
    props: ["c","semaforos","pcaFormasContagem","pcaSubFormasContagem"],

    components: {
        ProcessosRelacionadosOps, LegislacaoOps
    },

        data: function() {
            return {
                textoCriterioGestionario: "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de" +
                                    " escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para" +
                                    " a definição do prazo o tempo do mandato de maior duração: 5 anos."
      }
    },

    methods: {
        // Adiciona um critério à lista de critérios do PCA ou do DF....................
        adicionarCriterio: function (justificacao, tipo, label, notas, procRel, legislacao) {
            let myProcRel = JSON.parse(JSON.stringify(procRel));
            let myLeg = JSON.parse(JSON.stringify(legislacao));
            
            var indice = justificacao.findIndex(crit => crit.tipo === tipo);
            if(indice == -1){
                justificacao.push({
                    tipo: tipo,
                    label, label,
                    notas: notas,
                    procRel: myProcRel,
                    legislacao: myLeg
                });
            }
            else{
                justificacao[indice].procRel = justificacao[indice].procRel.concat(myProcRel);
                justificacao[indice].legislacao = justificacao[indice].legislacao.concat(myLeg);
            }
            
        },

        adicionarCriterioLegalPCA: function (justificacao, tipo, label, notas, procRel, legislacao) {
            this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
            this.semaforos.critLegalAdicionadoPCA = true;
        },

        adicionarCriterioGestionario: function (justificacao, tipo, label, notas, procRel, legislacao) {
            this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
            this.semaforos.critGestionarioAdicionado = true;
        },

        // Remove um critério completo duma vez
        removerCriterioTodo: function(justificacao, i, PCAouDF){
            this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
            justificacao.splice(i, 1);
        },

        // Atualiza as flags que controlam os botões de adicionar e remover critérios
        atualizaFlagsCriterios(tipo, PCAouDF){
            if(tipo == "CriterioJustificacaoLegal"){
                if(PCAouDF == 'PCA')
                    this.semaforos.critLegalAdicionadoPCA = false;
                else
                    this.semaforos.critLegalAdicionadoDF = false;
            }
            else if(tipo == "CriterioJustificacaoGestionario"){
                this.semaforos.critGestionarioAdicionado = false;
            }
        },

        unselectProcesso: function(proc, listaProc){
            var index = listaProc.findIndex(p => p.id === proc.id);
            listaProc.splice(index,1);
        },

        unselectDiploma: function(diploma, listaLeg){
            var index = listaLeg.findIndex(e => e.id === diploma.id);
            listaLeg.splice(index,1);
        },
    }
}
</script>

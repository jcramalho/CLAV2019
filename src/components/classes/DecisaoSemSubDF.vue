<template>
    <!-- DF -->
    <v-container fluid>
        <v-layout row wrap color="teal lighten-5" v-if="!c.temSubclasses4Nivel">
            <v-flex xs2>
                <span class="title">Destino Final</span>
            </v-flex>
            <v-flex xs9>
                <v-layout row wrap>
                    <v-flex xs2>
                        <v-subheader>Destino</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                        <SelectValueFromList
                            v-if="c.df.valor == 'NE'"
                            :initial-value = "c.df.valor"
                            :options = "destinoFinalTipos"
                            @value-change="c.df.valor = $event"
                        />
                        
                        <span v-else>
                            {{ destinoFinalLabels[c.df.valor] }}
                        </span> 
                    </v-flex>

                    <v-flex xs12>
                        <v-textarea
                            solo
                            label="Notas ao destino final"
                            v-model="c.df.notas"
                            rows="2"
                        ></v-textarea>
                    </v-flex>
                </v-layout>

                <hr style="border-top: 2px dashed green;"/>

            </v-flex>

            <!-- JUSTIFICAÇÂO DO DF -->
            <v-container fluid>
                <v-layout row wrap>
                    <v-flex xs2>
                        <span class="subheading">Justificação do DF</span>
                    </v-flex>
                    <v-flex xs9>
                        <v-layout row justify-start>
                            <v-flex>
                                <v-btn color="indigo darken-3" dark 
                                    @click="adicionarCriterioLegalPCA(c.df.justificacao, 'CriterioJustificacaoLegal', 'Critério Legal', '', [], c.legislacao)"
                                    v-if="!semaforos.critLegalAdicionadoDF"
                                > Adicionar Critério Legal
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap v-for="(crit, cindex) in c.df.justificacao" :key="cindex">
                            <v-flex xs6>
                                <v-subheader>{{ crit.label }}</v-subheader>
                            </v-flex>
                            <v-flex xs6>
                                <v-btn small color="red darken-2" dark round @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')">
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
import SelectValueFromList from '@/components/generic/SelectValueFromList.vue'

export default {
    props: ["c","semaforos"],

    components: {
        ProcessosRelacionadosOps, LegislacaoOps, SelectValueFromList
    },

     data: function() {
      return {
          destinoFinalTipos: [
            {label: 'Não Especificado', value: 'NE'},
            {label: 'Conservação', value: 'C'},
            {label: 'Conservação Parcial', value: 'CP'},
            {label: 'Eliminação', value: 'E'}
        ],

        destinoFinalLabels: {
            'NE': 'Não Especificado', 
            'C': 'Conservação',
            'CP': 'Conservação Parcial',
            'E': 'Eliminação'
        },
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

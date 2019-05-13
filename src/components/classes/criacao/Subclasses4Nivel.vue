<template>
    <!-- SUBCLASSES 4º NÍVEL -->
    <v-expansion-panel-content v-if="c.temSubclasses4NivelPCA || c.temSubclasses4NivelDF">
        <template v-slot:header>
            <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                <v-toolbar-title>Subclasses de nível 4</v-toolbar-title>
            </v-toolbar>
        </template>

        <v-container fluid>
            <v-layout>
                <v-flex>
                    <v-tabs
                        v-model="active"
                        color="teal darken-4"
                        dark
                        slider-color="white"
                    >
                        <v-tab
                            v-for="subClasse in c.subclasses"
                            :key="subClasse.codigo"
                            ripple
                        >
                            {{ subClasse.codigo }}
                        </v-tab>
                        <v-tab-item
                            v-for="subClasse in c.subclasses"
                            :key="subClasse.codigo"
                        >
                            <v-layout wrap row>
                                <v-flex xs2>
                                    <v-subheader>Código:</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    {{ subClasse.codigo }}
                                </v-flex>
                            </v-layout>
                            <v-layout wrap row>
                                <v-flex xs2>
                                    <v-subheader>Código do pai:</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    {{ c.codigo }}
                                </v-flex>
                            </v-layout>
                            <v-layout wrap row>
                                <v-flex xs2>
                                    <v-subheader>Título:</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    <v-text-field
                                        v-model="subClasse.titulo"
                                        label="Título"
                                        solo clearable
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout wrap row>
                                <v-flex xs2>
                                    <v-subheader>Descrição:</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    <v-text-field
                                        v-model="subClasse.descricao"
                                        label="Descrição"
                                        solo clearable
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>

                            <hr style="border-top: 3px dashed green; border-radius: 2px;"/>

                            <TermosIndiceOps :c="c"/>

                            <hr style="border-top: 3px dashed green; border-radius: 2px;"/>

                            <BlocoDecisoes4Nivel
                                :c="subClasse"
                                :semaforos="semaforos"
                                :pcaFormasContagem="pcaFormasContagem"
                                :pcaSubFormasContagem="pcaSubFormasContagem"
                            />
                        </v-tab-item>
                    </v-tabs>
                </v-flex>
            </v-layout>
        </v-container>

    </v-expansion-panel-content>
</template>

<script>
import ProcessosRelacionadosOps from '@/components/classes/criacao/ProcessosRelacionadosOps.vue'
import LegislacaoOps from '@/components/classes/criacao/LegislacaoOps.vue'
import SelectValueFromList from '@/components/generic/SelectValueFromList.vue'
import TermosIndiceOps from '@/components/classes/criacao/TermosIndiceOps.vue'
import BlocoDecisoes4Nivel from '@/components/classes/criacao/BlocoDecisoes4Nivel.vue'

export default {
    props: ["c","semaforos","pcaFormasContagem","pcaSubFormasContagem"],

    components: {
        ProcessosRelacionadosOps, LegislacaoOps, SelectValueFromList, TermosIndiceOps,
        BlocoDecisoes4Nivel
    },

     data: function() {
        return {
            active: null,

            destinoFinalTipos: [
                {label: 'Não Especificado (NE)', value: 'NE'},
                {label: 'Conservação (C)', value: 'C'},
                {label: 'Conservação Parcial (CP)', value: 'CP'},
                {label: 'Eliminação (E)', value: 'E'}
            ],

            destinoFinalLabels: {
                'NE': 'Não Especificado (NE)', 
                'C': 'Conservação (C)',
                'CP': 'Conservação Parcial (CP)',
                'E': 'Eliminação (E)'
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

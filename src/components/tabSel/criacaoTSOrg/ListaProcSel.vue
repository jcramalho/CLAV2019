<template>
    <v-data-table
        :items="lista"
        :headers="headers"
        class="elevation-1"
        item-key="classe"
        :rows-per-page-items="[10, 20, 100]"
        rows-per-page-text="Mostrar"
        :key="componentKey"
    >
        <template v-slot:headers="props">
            <tr>
                <th
                    v-for="h in props.headers"
                    :key="h.value"
                    class="body-2 font-weight-bold"
                >
                    {{ h.text }}
                </th>
            </tr>
        </template>
        <template v-slot:items="props" >
            <tr>
                <td>
                    {{ props.item.classe }}
                </td>
                <td>
                    {{ props.item.designacao }}
                </td>
                <td>
                    <v-dialog v-model="props.item.parteDescritiva" scrollable persistent width="1000px">
                        <template v-slot:activator="{ on }">
                            <v-btn small color="primary" v-on="on">
                                <v-icon>    
                                    edit
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-card v-if="novaListaReady" >
                            <v-card-title>
                                <span class="headline">Parte descritiva do processo {{ props.item.classe }} </span>
                            </v-card-title>
                            <v-divider></v-divider>

                            <v-card-text style="height: 500px;">
                                <NotasAp :lista="novaLista[props.item.classe]" />
                                <hr />
                                <ExemplosNotasAp :lista="novaLista[props.item.classe]" />
                                <hr />
                                <NotasEx :lista="novaLista[props.item.classe]" />
                                <hr />
                                <TermosIndice :lista="novaLista[props.item.classe]"/>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="blue darken-1" flat @click="guardar(props.item.classe); props.item.parteDescritiva=false">Guardar</v-btn>
                                <v-btn color="blue darken-1" flat @click="cancelar(props.item.classe); props.item.parteDescritiva=false">Cancelar</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card v-else>
                            <v-card-title>
                                <span class="headline">A carregar a parte descritiva dos processos... </span>
                                <div class="flex-grow-1"></div>
                                <v-progress-circular
                                    :size="50"
                                    :width="6"
                                    indeterminate
                                    color="primary"
                                ></v-progress-circular>
                            </v-card-title>
                        </v-card>
                    </v-dialog>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import NotasAp from "@/components/tabSel/criacaoTSOrg/NotasAp.vue";
import ExemplosNotasAp from "@/components/tabSel/criacaoTSOrg/ExemplosNotasAp.vue";
import NotasEx from "@/components/tabSel/criacaoTSOrg/NotasEx.vue";
import TermosIndice from "@/components/tabSel/criacaoTSOrg/TermosIndice.vue";

export default {
    props: ["lista"],
    components: { 
        NotasAp,
        ExemplosNotasAp,
        NotasEx,
        TermosIndice 
    },
    data: () => ({
        headers: [
            {
                text: "Classe",
                value: "classe",
                width: "20%"
            },
            {
                text: "Designação",
                value: "designacao",
                width: "60%"
            },
            {
                text: "Parte Descritiva",
                value: "parteDescritiva"
            }
        ],
        novaLista: [],
        novaListaReady: false,
        notasAp: [],
        exemplosNotasAp: [],
        notasEx: [],
        termosInd: [],
        componentKey: 0,
        
    }),
    methods: {
        guardar: async function(classe){
            // Slice para copiar o array
            this.notasAp[classe] = this.novaLista[classe].notasAp.slice(0);
            this.exemplosNotasAp[classe] = this.novaLista[classe].exemplosNotasAp.slice(0);
            this.notasEx[classe] = this.novaLista[classe].notasEx.slice(0);
            this.termosInd[classe] = this.novaLista[classe].termosInd.slice(0);
            this.$emit("listaTotalSelUpdate", this.novaLista);
            this.componentKey +=1;
        },
        cancelar: async function(classe){
            this.novaLista[classe].notasAp = this.notasAp[classe].slice(0);
            this.novaLista[classe].exemplosNotasAp = this.exemplosNotasAp[classe].slice(0);
            this.novaLista[classe].notasEx = this.notasEx[classe].slice(0);
            this.novaLista[classe].termosInd = this.termosInd[classe].slice(0);
            this.componentKey +=1;
        }
    },
    mounted: async function(){
        try {
            for( var i = 0; i < this.lista.length; i++){
                this.novaLista[this.lista[i].classe] = this.lista[i];

                var na = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/notasAp")
                // Caso já exista notas de Aplicação associadas (acontece quando já se guardou trabalho previamente)
                if(this.lista[i].notasAp){
                    this.novaLista[this.lista[i].classe].notasAp = this.lista[i].notasAp
                }
                else{
                    this.novaLista[this.lista[i].classe].notasAp = na.data;
                }
                this.notasAp[this.lista[i].classe] = this.novaLista[this.lista[i].classe].notasAp.slice(0);

                var ena = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/exemplosNotasAp")
                if(this.lista[i].exemplosNotasAp){
                    this.novaLista[this.lista[i].classe].exemplosNotasAp = this.lista[i].exemplosNotasAp
                }
                else{
                    this.novaLista[this.lista[i].classe].exemplosNotasAp = ena.data;
                }
                this.exemplosNotasAp[this.lista[i].classe] = this.novaLista[this.lista[i].classe].exemplosNotasAp.slice(0);

                var ne = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/notasEx")
                if(this.lista[i].notasEx){
                    this.novaLista[this.lista[i].classe].notasEx = this.lista[i].notasEx
                }
                else{
                    this.novaLista[this.lista[i].classe].notasEx = ne.data;
                }
                this.notasEx[this.lista[i].classe] = this.novaLista[this.lista[i].classe].notasEx.slice(0);

                var ti = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/ti");
                if(this.lista[i].termosInd){
                    this.novaLista[this.lista[i].classe].termosInd = this.lista[i].termosInd
                }
                else{
                    this.novaLista[this.lista[i].classe].termosInd = ti.data;
                }
                this.termosInd[this.lista[i].classe] = this.novaLista[this.lista[i].classe].termosInd.slice(0);
            }
            this.$emit("listaTotalSelUpdate", this.novaLista);
            this.novaListaReady = true
            
        } catch (err) {
            return err;
        }
    }
}
</script>

<style>
.info-label {
  color: #1a237e;
  padding: 4px;
  font-weight: 400;
  width: 90%;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
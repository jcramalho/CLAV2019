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
                                <!--<ExemplosNotasAp :lista="c" />
                                <hr />
                                <NotasEx :lista="c" />
                                <hr />
                                <TermosIndice :lista="c" v-if="c.nivel == 3 && !c.temSubclasses4Nivel" />-->
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="blue darken-1" flat @click="guardarNA(props.item.classe); props.item.parteDescritiva=false">Guardar</v-btn>
                                <v-btn color="blue darken-1" flat @click="cancelarNA(props.item.classe); props.item.parteDescritiva=false">Cancelar</v-btn>
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

export default {
    props: ["lista"],
    components: { 
        NotasAp 
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
        componentKey: false,
        
    }),
    methods: {
        guardarNA: async function(classe){
            this.notasAp[classe] = this.novaLista[classe].notasAp.slice(0);
            this.componentKey +=1;
        },
        cancelarNA: async function(classe){
            this.novaLista[classe].notasAp = this.notasAp[classe].slice(0);
            this.componentKey +=1;
        }
    },
    mounted: async function(){
        try {
            for( var i = 0; i < this.lista.length; i++){
                this.novaLista[this.lista[i].classe] = this.lista[i];

                var na = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/notasAp")
                this.novaLista[this.lista[i].classe].notasAp = na.data
                this.notasAp[this.lista[i].classe] = this.novaLista[this.lista[i].classe].notasAp.slice(0);

                var ena = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/exemplosNotasAp")
                console.log(ena.data)

                var ne = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/notasEx")
                console.log(ne.data)

                var ti = await axios.get(lhost + "/api/classes/c" + this.lista[i].classe + "/ti")
                console.log(ti.data)
            }
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
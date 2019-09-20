<template>
    <v-data-table
        v-if="entProcDonoReady"
        :items="lista"
        :headers="headers"
        class="elevation-1"
        item-key="classe"
        :footer-props="procsFooterProps"
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
        <template v-slot:item="props">
            <tr
                :style="{
                    backgroundColor:
                        (listaResUltimos.findIndex(p => p == props.item.classe) != -1 ||
                        preSel.findIndex(p => p == props.item.classe) != -1) &&
                        !entProcDono[props.item.classe][Object.keys(entProcDono[props.item.classe])] && !(Object.keys(entProcPar[props.item.classe])).length
                            ? 'orange'
                            : 'transparent'
                }"
            >
                <td>
                   {{ props.item.classe }}
                </td>
                <td>
                    {{ props.item.designacao }}
                </td> 
                <td>
                   <v-dialog v-model="props.item.dono" scrollable persistent width="700px">
                        <template v-slot:activator="{ on }" v-if=" !procSelDonos.includes(props.item.classe) ">
                            <v-btn fab small color="primary" v-on="on">
                                <v-icon>list</v-icon>
                            </v-btn>
                        </template>
                        <template v-slot:activator="{ on }" v-else>
                            <v-btn fab small color="primary" v-on="on">
                                <v-icon>check</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Selecione as entidades donas do processo: {{ props.item.classe }} </span>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text style="height: 400px;">
                                    <v-checkbox 
                                        v-for="e in entidades" 
                                        :key="e.id" 
                                        v-model="entProcDono[props.item.classe][e.id]" 
                                        :label="e.designacao + '  (' + e.sigla + ') '"
                                    ></v-checkbox>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn color="blue darken-1" text @click="props.item.dono = false; selecTodasEnt(entidades, props.item.classe)">Selecionar todos</v-btn>
                                <v-btn color="blue darken-1" text @click="props.item.dono = false; guardaEntDonos(props.item.classe)">Continuar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </td>
                <td>
                    <v-dialog v-model="props.item.participante" scrollable persistent width="700px" v-if="entProcParReady">
                        <template v-slot:activator="{ on }" v-if="!(Object.keys(entProcPar[props.item.classe])).length">
                            <v-btn fab small color="primary" v-on="on">
                                <v-icon>list</v-icon>
                            </v-btn>
                        </template>
                        <template v-slot:activator="{ on }" v-else>
                            <v-btn fab small color="primary" v-on="on">
                                <v-icon>check</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Selecione as entidades participante no processo: {{ props.item.classe }} </span>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text style="height: 400px;" >
                                <div v-for="e in entidades" :key="e.id"  >
                                    <template v-if="!entProcPar[props.item.classe][e.id]">
                                        <v-btn color="primary" fab small dark @click="dialog[props.item.classe][e.id] = !dialog[props.item.classe][e.id]; props.item.participante = false"> 
                                            <v-icon dark>add</v-icon> 
                                        </v-btn>
                                            {{ e.designacao + '  (' + e.sigla + ') '}}
                                    </template>
                                    <template v-else>
                                        <v-btn color="primary" fab small dark @click="dialog[props.item.classe][e.id] = !dialog[props.item.classe][e.id]; props.item.participante = false"> 
                                            <v-icon dark>edit</v-icon> 
                                        </v-btn>
                                        <v-btn color="primary" fab small dark @click="eliminarPart = true"> 
                                            <v-icon dark>remove</v-icon> 
                                            <v-dialog v-model="eliminarPart" persistent max-width="290">
                                                <v-card>
                                                    <v-card-title class="headline">Confirmar ação</v-card-title>
                                                    <v-card-text>Pretende eliminar esta participação?</v-card-text>
                                                    <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="red" text @click="eliminarPart = false">Cancelar</v-btn>
                                                    <v-btn color="primary" text @click="desselecionarPart(props.item.classe, e.id); eliminarPart=false;">Confirmar</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-btn>
                                            {{ e.designacao + '  (' + e.sigla + ') ' + ': ' + entProcPar[props.item.classe][e.id]}}
                                    </template>
                                    <div style="flex: 1 1 auto;">
                                    <v-dialog v-model="dialog[props.item.classe][e.id]" persistent max-width="500px">
                                        <v-card>
                                            <v-card-title>
                                                {{ "Selecione o tipo de intervenção da entidade: " + e.sigla }}
                                                <br />
                                                {{ "No processo: " + props.item.classe }}
                                            </v-card-title>
                                            <v-card-text>
                                                <v-select
                                                    :items="tipoParticipacao"
                                                    v-model="entProcPar[props.item.classe][e.id]"
                                                    label="Tipo de intervenção"
                                                    item-value="text"
                                                ></v-select>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn color="primary" text @click="dialog[props.item.classe][e.id]=false; props.item.participante=true">Continuar</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    </div>
                                </div>

                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn color="blue darken-1" text @click="props.item.participante = false; guardaEntPar(props.item.classe)">Continuar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </td> 
            </tr>
        </template>
        <template v-slot:pageText="props">
            Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
        </template>
    </v-data-table>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
    props: ["lista", "entidades", "listaPreSel", "procSelGuardados"],
    data: () => ({
    // Cabeçalho da tabela para selecionar os PNs comuns
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
        text: "Dono",
        value: "dono"
      },
      {
        text: "Participante",
        value: "participante"
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    },
    // Onde vão ficar armazenados as entidades donas de cada processo. Por ex: {proc1: [ent1,ent2]; proc2: [ent1,ent3]}
    entProcDono: [],
    // True quando a lista das entidades donas de cada processo estiver pronta
    entProcDonoReady: false,
    // Tipos de participação
    tipoParticipacao: [],
    // Para abrir e fechar a caixa de dialogo
    dialog: {},
    // Onde vão ficar armazenados as entidades participantes de cada processo. Por ex: {proc1: [ent1 : "apreciar", ent2 : __]; proc2: [ent1: __,ent3: "iniciar"]}
    entProcPar: [],
    // True quando a lista das entidades donas de cada processo estiver pronta
    entProcParReady: false,
    // Lista dos processos especificos resultantes das travessias
    listaResUltimos: [],
    // Lista dos processos restantes resultantes das travessias
    listaResRestantes: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Todas as travessias são carregadas para esta variável
    travessias: [],
    // Lista dos processos selecionados como donos
    procSelDonos: [],
    preSel: [],
    // Processos especificos selecionados (como dono ou participante ou ambos)
    procUltSel: [],
    // Dialog de confirmação de eliminação de participação
    eliminarPart: false
    }),
    methods: {
        tipoPar: async function(){
            var resPar = await axios.get(lhost + "/api/vocabularios/vc_processoTipoParticipacao");
            for( var i = 0; i < resPar.data.length; i++){
                this.tipoParticipacao.push(resPar.data[i].termo)
            }
        },
        desselecionarPart: async function(classe, id){
            delete this.entProcPar[classe][id];
        },
        // Calculo da travessia do processo passado como parametro (vai buscar a informação à estrutura carregada na variável "travessias")
        calcRel: async function(processo) {
            try {
                // Lista com todos os processos resultantes da travessia com ponto de partida no processo x (processo):
                this.listaProcResultado[processo] = this.travessias[processo];

                // Coloca na lista de processos resultantes ultimos os processos pré selecionados
                // resultantes das travessias dos processos comuns
                if (!this.listaResUltimos.length) {
                    if (this.preSel.length) {
                        for (var l = 0; l < this.lista.length; l++) {
                        if (this.preSel.includes(this.lista[l].classe))
                            this.listaResUltimos.push(this.lista[l].classe);
                        }
                    }
                    this.preSel = [];
                }

                // listaResUltimos: Lista dos processos resultantes (das travessias) comuns
                for (var i = 0; i < this.travessias[processo].length; i++) {
                for (var j = 0; j < this.lista.length; j++) {
                    if (
                    this.lista[j].classe === this.travessias[processo][i] &&
                    !this.listaResUltimos.includes(this.travessias[processo][i])
                    ) {
                    this.listaResUltimos.push(this.travessias[processo][i]);
                    }
                }
                }
                // retira aqueles processos que já estão selecionados
                var procSel = Object.keys(this.listaProcResultado);
                for (var x = 0; x < procSel.length; x++) {
                if (this.listaResUltimos.includes(procSel[x])) {
                    this.listaResUltimos.splice(
                    this.listaResUltimos.indexOf(procSel[x]),
                    1
                    );
                }
                }

                this.$emit("contadorProcPreSelUlt", this.listaResUltimos);
            } catch (err) {
                return err;
            }
            },
            // Reverte a seleção
            uncheck: async function(processo) {
                // apaga o resultado da travessia desse processo
                // Assim listaProcResultado: Nova lista dos processos resultantes das travessias (sem o processo que se desselecionou)
                delete this.listaProcResultado[processo];

                // Vai rever se a lista de resultados de processos comuns contem processos iguais aos outros resultados de travessias.
                var procSel = Object.keys(this.listaProcResultado);
                // newListaResUltimos: Nova lista dos processos resultantes comuns
                var newListaResUltimos = [];
                // newListaResUltimos: Nova lista dos processos resultantes restantes
                var newListaResUltimos = [];
                for (var i = 0; i < procSel.length; i++) {
                    for (var j = 0; j < this.listaProcResultado[procSel[i]].length; j++) {
                    if (
                        (this.listaResUltimos.includes(
                        this.listaProcResultado[procSel[i]][j]
                        ) ||
                        this.listaProcResultado[procSel[i]][j] === processo) &&
                        !newListaResUltimos.includes(this.listaProcResultado[procSel[i]][j])
                    ) {
                        newListaResUltimos.push(this.listaProcResultado[procSel[i]][j]);
                    } 
                    }
                }
                this.listaResUltimos = newListaResUltimos;

                this.$emit("contadorProcPreSelUlt", this.listaResUltimos);
            },
            guardaEntDonos: async function(proc){
                for( var i = 0; i < Object.keys(this.entProcDono[proc]).length; i++){
                    var haDono = false;
                    if( this.entProcDono[proc][Object.keys(this.entProcDono[proc])[i]] ){
                        haDono = true;
                        this.procSelDonos.push(proc);
                        if (!this.procUltSel.includes(proc)) {
                            this.procUltSel.push(proc);
                            this.$emit("contadorProcSelUlt", this.procUltSel);
                            this.calcRel(proc);
                        }
                        break;
                    }
                }
                if( !haDono ){
                    if (Object.keys(this.entProcPar[proc]).length == 0) {
                        var index = this.procUltSel.indexOf(proc);
                        var indexDono = this.procSelDonos.indexOf(proc);
                        if( index != -1){
                            this.procUltSel.splice(index, 1);
                            this.procSelDonos.splice(indexDono, 1);
                            this.uncheck(proc);
                            this.$emit("contadorProcSelUlt", this.procUltSel);
                        }
                    }
                    else {
                        var indexDono = this.procSelDonos.indexOf(proc);
                        if( index != -1){
                            this.procSelDonos.splice(indexDono, 1);
                        }
                    }
                }

                var guardar = {}
                guardar['dono'] = this.entProcDono;
                this.$emit("guardarTSProcUlt", guardar);
            },
            selecTodasEnt: async function(entidades, proc){
                for( var i = 0; i < entidades.length; i++){
                    this.entProcDono[proc][entidades[i].id] = true;
                }
                this.procSelDonos.push(proc)
                if (!this.procUltSel.includes(proc)) {
                        this.procUltSel.push(proc);
                        this.$emit("contadorProcSelUlt", this.procUltSel);
                        this.calcRel(proc);
                }
                var guardar = {}
                guardar['dono'] = this.entProcDono;
                this.$emit("guardarTSProcUlt", guardar);
            },
            guardaEntPar: async function(proc){
                var guardar = {}
                guardar['part'] = this.entProcPar;
                this.$emit("guardarTSProcUlt", guardar);
                if( !this.procUltSel.includes(proc) && Object.keys(this.entProcPar[proc]).length ){
                    this.procUltSel.push(proc);
                    this.$emit("contadorProcSelUlt", this.procUltSel)
                    this.calcRel(proc);
                }
                else if (Object.keys(this.entProcPar[proc]).length == 0) {
                    var haDono = false;
                    for( var i = 0; i < Object.keys(this.entProcDono[proc]).length; i++){
                        if( this.entProcDono[proc][Object.keys(this.entProcDono[proc])[i]] ){
                            haDono = true;
                            break;
                            }
                    }
                    if( !haDono ){
                        var index = this.procUltSel.indexOf(proc);
                        if( index != -1 ){
                            this.procUltSel.splice(index, 1);
                            this.uncheck(proc);
                            this.$emit("contadorProcSelUlt", this.procUltSel);
                        }
                    }
                }
            },
    },
    mounted: async function(){
        try {
            this.preSel = this.listaPreSel;

            // Vai a API de dados buscar todos os cálculos das travessias
            var res = await axios.get(lhost + "/api/travessia");
            var trav = res.data;
            for (var j = 0; j < trav.length; j++) {
                this.travessias[trav[j].processo] = trav[j].travessia;
            }

            this.tipoPar();
            for( var i = 0; i < this.lista.length; i++ ){
                this.entProcDono[this.lista[i].classe] = {};
                for(var j = 0; j < this.entidades.length; j++){
                        this.entProcDono[this.lista[i].classe][this.entidades[j].id] = this.procSelGuardados[this.lista[i].classe].dono[this.entidades[j].id]
                        if(this.procSelGuardados[this.lista[i].classe].dono[this.entidades[j].id]){
                            console.log(this.procUltSel)
                            if (!this.procUltSel.includes(this.lista[i].classe)) {
                                this.procUltSel.push(this.lista[i].classe);
                                this.$emit("contadorProcSelUlt", this.procUltSel);
                                this.procSelDonos.push(this.lista[i].classe)
                                this.calcRel(this.lista[i].classe)
                            }
                        }
                    }
            }
            this.entProcDonoReady = true;
            if(JSON.stringify(this.procSelGuardados[this.lista[0].classe].part) == "[]"){
                for( var i = 0; i < this.lista.length; i++ ){
                    this.entProcPar[this.lista[i].classe] = {};
                    var tempDialog = [];
                    for(var j = 0; j < this.entidades.length; j++){
                        tempDialog[this.entidades[j].id] = false
                    }
                    this.dialog[this.lista[i].classe] = tempDialog;
                    tempDialog = [];
                }
            }
            else { 
            for( var i = 0; i < this.lista.length; i++ ){
                this.entProcPar[this.lista[i].classe] = this.procSelGuardados[this.lista[i].classe].part;
                if( JSON.stringify(this.procSelGuardados[this.lista[i].classe].part) != "{}"){
                    if (!this.procUltSel.includes(this.lista[i].classe)) {
                        this.procUltSel.push(this.lista[i].classe);
                        this.$emit("contadorProcSelUlt", this.procUltSel);
                        this.calcRel(this.lista[i].classe)
                    }
                }
                var tempDialog = [];
                for(var j = 0; j < this.entidades.length; j++){
                    tempDialog[this.entidades[j].id] = false
                }
                this.dialog[this.lista[i].classe] = tempDialog;
                tempDialog = [];
            }
        }
            this.entProcParReady = true;
        } catch (err) {
            return err;
        }
    }
}
</script>


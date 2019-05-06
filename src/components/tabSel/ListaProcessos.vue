<template>
    <v-data-table 
        :items="lista"
        :headers="headers"
        class="elevation-1"
        item-key="classe"
        :rows-per-page-items="[10,20,100]"
    > 
    <template v-slot:headers="props">
        <tr>
            <th v-for="h in props.headers" :key="h.value" class="body-2 font-weight-bold">
                {{ h.text }}
            </th>
        </tr>
    </template>
    <template v-slot:items="props">
        <tr :style="{backgroundColor: (listaResultados.findIndex(p => p.codigo == props.item.classe) != -1 ? 'orange' : 'transparent' ) }">
            <td>    
                    {{ props.item.classe }}
            </td>
            <td>    
                    {{ props.item.designacao }}
            </td>
            <td>
                <v-checkbox
                    v-model="props.item.dono"
                    primary
                    hide-details
                    v-on:change="{(props.item.dono && !props.item.participante) ? calcRel(props.item.classe) : null} "
                ></v-checkbox>
            </td>
            <td>
                <v-checkbox
                    v-model="props.item.participante"
                    primary
                    hide-details
                    v-on:change="{(props.item.participante && !props.item.dono) ? calcRel(props.item.classe) : null} "
                ></v-checkbox>
            </td>
        </tr>
    </template>
    </v-data-table>
</template>

<script>
const lhost = require('@/config/global').host
const axios = require('axios')

export default {
    props: [ "lista", "tipo" ],
    data: () => ({
        search: null,
        donos: [],
        participantes: [],
        selected: [],
        headers: [
            {
                text: "Classe",
                value: "classe",
                width: "20%",
            },
            {
                text: "Designação",
                value: "designacao",
                width: "60%",
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

        processo: '',
        listaResultados: []
    }),
    computed: {
        estado() {
            return this.$store.state.criacaoTabSel
        }
    },
    methods: {
        // retorna a lista dos processos complementares ao processo passado como parâmetro
        loadComplementares: async function(p, profundidade){
            try{
                var response = await axios.get(lhost + "/api/classes/c" + p + "/procRel/eComplementarDe");
                return response.data.map(function (item) {
                    return {
                        codigo: item.codigo,
                        titulo: item.titulo,
                        relacao: "eComplementarDe",
                        nivel: profundidade
                    }
                    });
            }
           catch(erro){
                console.log(erro);
            }
        },

        loadSintetizados: async function(p, profundidade){
            try{
                var response = await axios.get(lhost + "/api/classes/c" + p + "/procRel/eSintetizadoPor");
                return response.data.map(function (item) {
                    return {
                        codigo: item.codigo,
                        titulo: item.titulo,
                        relacao: "eSintetizadoPor",
                        nivel: profundidade
                    }
                });
            }
           catch(erro){
                console.log(erro);
            }
        },

        loadSuplementares: async function(p, profundidade){
            try{
                var response = await axios.get(lhost + "/api/classes/c" + p + "/procRel/eSuplementoPara");
                return response.data.map(function (item) {
                    return {
                        codigo: item.codigo,
                        titulo: item.titulo,
                        relacao: "eSuplementoPara",
                        nivel: profundidade
                    }
                });
            }
           catch(erro){
                console.log(erro);
            }
        },
        calcRel: async function(processo){
            this.$emit('contadorProcSel')
            try{
                var profundidade = 1;
                var stackProc = [];
                stackProc.push({listaProc: [], nivel: 1});
                stackProc[0].listaProc.push(processo);
                var proc;
                //this.listaResultados = [];
                var visitados = [];
                visitados.push(processo);  // Processo inicial está no índice 0

                /*this.fechoCalculado = false;
                var stop = false;*/

                while((profundidade <= 1000) && (stackProc[profundidade-1].listaProc.length > 0)){
                    stackProc.push({listaProc: [], nivel: profundidade+1});
                    for(var i = 0; i < stackProc[profundidade-1].listaProc.length; i++){
                        proc = stackProc[profundidade-1].listaProc[i];

                        // vai procurar os processos que estabelecem com este processo a relação de "complementares"
                        var comp = await this.loadComplementares(proc, profundidade);
                        if(comp.length > 0){
                            this.listaResultados = await this.juntaNovos(this.listaResultados, comp);
                            stackProc[profundidade].listaProc = stackProc[profundidade].listaProc.concat( await this.juntaNovosVisitas(visitados, this.filtra(comp), "comp"));
                        }
                        

                        var sint = await this.loadSintetizados(proc, profundidade);
                        if(sint.length > 0){
                            this.listaResultados = await this.juntaNovos(this.listaResultados, sint);
                            stackProc[profundidade].listaProc = stackProc[profundidade].listaProc.concat( await this.juntaNovosVisitas(visitados, this.filtra(sint), "sint"));
                        }

                        var sup = await this.loadSuplementares(proc, profundidade);
                        if(sup.length > 0){
                            this.listaResultados = await this.juntaNovos(this.listaResultados, sup);
                            stackProc[profundidade].listaProc = stackProc[profundidade].listaProc.concat( await this.juntaNovosVisitas(visitados, this.filtra(sup), "sup"));
                        }
                    }
                    profundidade++;
                }
                console.log(stackProc)
                console.log(this.listaResultados)
                
                this.listaResultados.sort(function (a, b) {
                        return a.codigo.localeCompare(b.codigo);
                });
                
                this.$emit('contadorProcPreSel', this.listaResultados);
            }
            catch(erro){
                console.log(erro);
            }
        },
        juntaNovos: async function(existentes, candidatos){
            for(var i=0; i < candidatos.length; i++){
                if(existentes.length > 0){
                    var index = existentes.findIndex(p => p.codigo == candidatos[i].codigo);
                    if(index == -1){
                        existentes.push(candidatos[i]);
                    }
                }
                else
                    existentes.push(candidatos[i]);
            }
            return existentes;
        },
        juntaNovosVisitas: async function(visitados, candidatos, relacao){
            var res = [];
            for(var i=0; i < candidatos.length; i++){
                var index = visitados.indexOf(candidatos[i]);
                if(index == -1){
                    visitados.push(candidatos[i]);
                    res.push(candidatos[i]);
                }
                else if((index == 0) && (relacao != "comp")){
                    alert("Circularidade!!!");
                }
            }
            return res;
        },
        filtra: function(lproc){
            return lproc.map(function(p){
                return p.codigo
            })
        },
    }
}
</script>

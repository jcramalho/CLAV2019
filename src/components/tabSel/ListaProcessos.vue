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
        <tr :style="{backgroundColor: (listaResComuns.findIndex(p => p == props.item.classe) != -1 && (!props.item.dono && !props.item.participante) ? 'orange' : 'transparent' ) }">
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
                    v-on:change="{(props.item.dono && !props.item.participante) ? calcRel(props.item.classe) : ((props.item.dono && props.item.participante) ? null : (!props.item.dono && !props.item.participante) ? uncheck() : null)} "
                ></v-checkbox>
            </td>
            <td>
                <v-checkbox
                    v-model="props.item.participante"
                    primary
                    hide-details
                    v-on:change="{(props.item.participante && !props.item.dono) ? calcRel(props.item.classe) : ((props.item.participante && props.item.dono) ? null : (!props.item.participante && !props.item.dono) ? uncheck() : null)} "
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
        // listas resultantes do calculo da travessia, separados por comuns e os restantes
        listaResComuns: [],
        listaResRestantes: [],
        // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
        listaProcResultado: [],
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
                var listaResultados = [];
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
                            listaResultados = await this.juntaNovos(listaResultados, comp);
                            stackProc[profundidade].listaProc = stackProc[profundidade].listaProc.concat( await this.juntaNovosVisitas(visitados, this.filtra(comp), "comp"));
                        }
                        

                        var sint = await this.loadSintetizados(proc, profundidade);
                        if(sint.length > 0){
                            listaResultados = await this.juntaNovos(listaResultados, sint);
                            stackProc[profundidade].listaProc = stackProc[profundidade].listaProc.concat( await this.juntaNovosVisitas(visitados, this.filtra(sint), "sint"));
                        }

                        var sup = await this.loadSuplementares(proc, profundidade);
                        if(sup.length > 0){
                            listaResultados = await this.juntaNovos(listaResultados, sup);
                            stackProc[profundidade].listaProc = stackProc[profundidade].listaProc.concat( await this.juntaNovosVisitas(visitados, this.filtra(sup), "sup"));
                        }
                    }
                    profundidade++;
                }
                console.log(stackProc)
                console.log(listaResultados)
                
                listaResultados.sort(function (a, b) {
                        return a.codigo.localeCompare(b.codigo);
                });
                
                this.listaProcResultado[processo] = listaResultados;
                console.log(this.listaProcResultado)

                // separa o resultado da travessia em duas listas, uma com os processos comuns (que estão presentes na tabela) e os restantes   
                for( var i = 0; i < listaResultados.length; i++ ){
                    var procComum = false;
                    for( var j = 0; j < this.lista.length; j++ ) {
                        if(this.lista[j].classe === listaResultados[i].codigo && !this.listaResComuns.includes(listaResultados[i].codigo)){
                            this.listaResComuns.push(listaResultados[i].codigo);
                            procComum = true;
                            break;
                        }
                    }
                    if( !procComum && !this.listaResRestantes.includes(listaResultados[i].codigo) && !this.listaResComuns.includes(listaResultados[i].codigo)){
                        this.listaResRestantes.push(listaResultados[i].codigo)
                    }
                }
                // retira aqueles processos que já estão selecionados 
                var procSel = Object.keys(this.listaProcResultado);
                for( var i = 0; i < procSel.length; i++){
                    if( this.listaResComuns.includes(procSel[i]) ){
                        this.listaResComuns.splice(this.listaResComuns.indexOf(procSel[i]), 1);
                    }
                }
                console.log(this.listaResComuns)
                console.log(this.listaResRestantes)

                this.$emit('contadorProcPreSel', this.listaResComuns);
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
            }
            return res;
        },
        filtra: function(lproc){
            return lproc.map(function(p){
                return p.codigo
            })
        },
        uncheck: function(){
            this.$emit('uncheckProcSel')
        }
    }
}
</script>

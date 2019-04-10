<template>
  <Listagem v-bind:lista="termosIndice" 
            tipo="Termos de Índice" 
            v-bind:cabecalho="['Termo', 'Classe', 'Título da Classe']"
            v-bind:campos="['termo', 'idClasse', 'tituloClasse']"/>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    data: () => ({
      termosIndice: [],
      campos: [],
    }),
    components: {
            Listagem
        },
    
    mounted: async function (){
        try{
            var response = await axios.get(lhost + "/api/termosIndice");
            this.termosIndice = await this.preparaLista(response.data);
        }
        catch(e){
            console.log(e);
        }
    },

    methods: {
        preparaLista: async function(listaTermos){
            try{
                var myTree = [];
                for(var i=0; i < listaTermos.length; i++){
                    myTree.push({
                        termo: listaTermos[i].termo,
                        idClasse: listaTermos[i].idClasse,
                        tituloClasse: listaTermos[i].tituloClasse
                    });
                }
                return myTree;
            }
            catch(error){
                return []
            }
        }
    },
}
</script>



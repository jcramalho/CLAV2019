<template>
  <Listagem v-bind:lista="tipologias" 
            tipo="Tipologias" 
            v-bind:cabecalho="['Sigla', 'Designação']"
            v-bind:campos="['id', 'designacao']"/>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from 'axios'

export default {
    data: () => ({
      tipologias: [],
      campos: [],
    }),
    components: {
            Listagem
        },
    
    mounted: async function (){
        try{
            var response = await axios.get('http://localhost:7778/api/tipologias');
            this.tipologias = await this.preparaTree(response.data);
        }
        catch(e){
            console.log(e);
        }
    },

    methods: {
        /*go: function(idTipologia){
            this.$router.push('/tipologias/' + idTipologia);
        },*/
        preparaTree: async function(listaTipologias){
            try{
                var myTree = [];
                for(var i=0; i < listaTipologias.length; i++){
                    myTree.push({
                        id: listaTipologias[i].sigla,
                        designacao: listaTipologias[i].designacao
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


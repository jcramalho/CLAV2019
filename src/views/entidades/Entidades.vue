<template>
  <Listagem v-bind:lista="entidades" 
            tipo="Entidades" 
            v-bind:cabecalho="['Sigla', 'Designação', 'Internacional']"
            v-bind:campos="['id', 'designacao', 'internacional']"/>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from 'axios'

export default {
    data: () => ({
      entidades: [],
      campos: [],
    }),
    components: {
            Listagem
        },
    
    mounted: async function (){
        try{
            var response = await axios.get('http://localhost:7778/api/entidades');
            this.entidades = await this.preparaTree(response.data);
        }
        catch(e){
            console.log(e);
        }
    },

    methods: {
        /*go: function(idEntidade){
            this.$router.push('/entidades/' + idEntidade);
        },*/
        preparaTree: async function(listaEntidades){
            try{
                var myTree = [];
                for(var i=0; i < listaEntidades.length; i++){
                    myTree.push({
                        id: listaEntidades[i].sigla,
                        designacao: listaEntidades[i].designacao,
                        internacional: listaEntidades[i].internacional
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


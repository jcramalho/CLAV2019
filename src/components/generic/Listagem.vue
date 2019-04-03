<template>
    <v-card>
        <v-card-title>
            <h1>{{ tipo }}</h1>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Filtrar"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="lista"
            :search="search"
            class="elevation-1"
            :rows-per-page-items="[10,20,100]"
            rows-per-page-text="Mostrar"
            v-if="listaReady"            
        >
            <template v-slot:items="props">
                <td v-for="(campo, index) in props.item" v-bind:key="index">{{ campo }}</td>
            </template>
            <template v-slot:pageText="props">
                Resultados: {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
            </template>
        </v-data-table>
    </v-card>
</template>


<script>
export default {
    props: ["lista", "tipo", "cabecalho", "campos"],
    data: () => ({
      search: '',
      listaReady: false,
      headers: []
    }),
    mounted: async function (){
        try{
            for(var i=0; i< this.cabecalho.length ; i++){
                this.headers[i] = {
                    text: this.cabecalho[i],
                    value: this.campos[i]
                }
            }
        }
        catch(e){
            console.log(e);
        }
        this.listaReady= true;
    },

}
</script>


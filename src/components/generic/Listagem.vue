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
            :disable-initial-sort="true"         
        >
            <template v-slot:items="props" >
                <tr v-if="tipo=='Termos de Índice'" @click="go(props.item.idClasse)" >
                    <td v-for="(campo, index) in props.item" v-bind:key="index">    
                            {{ campo }}
                    </td>
                </tr>
                <tr v-if="tipo=='Legislação'" @click="go(props.item.id)" > 
                        <td v-for="(campo, index) in props.item" v-bind:key="index"> 
                            <div v-if="props.item">
                                {{ campo }}
                            </div>
                        </td>
                </tr>
                <tr v-else @click="go(props.item.id)" >
                    <td v-for="(campo, index) in props.item" v-bind:key="index">    
                            {{ campo }}
                    </td>
                </tr>
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
    methods: {
        go: function(id){
            switch(this.tipo) {
                case "Entidades":
                    this.$router.push('/entidades/ent_'+id);
                    break;
                case "Tipologias":
                    this.$router.push('/tipologias/tip_'+id);
                    break;
                case "Legislação":
                    this.$router.push('/legislacao/'+id);
                    break;
                case "Termos de Índice":
                    this.$router.push('/classes/consultar/c'+id);
                    break;
                }             
            //this.$router.push('/classes/consultar/c'+idClasse);
        },
    },
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
        console.log(this.lista)
    },

}
</script>


<template>
    <v-data-table 
        :items="lista"
        :headers="headers"
        :disable-initial-sort="true"
        class="elevation-1"
        hide-actions
    > 
    <template v-slot:items="props">
      <tr>
        <td v-for="(campo, index) in props.item" v-bind:key="index">    
                {{ campo }}
        </td>
        <td>
            <v-checkbox
                v-model="props.selected"
                primary
                hide-details
            ></v-checkbox>
        </td>
        <td>
            <v-checkbox
                v-model="props.selected"
                primary
                hide-details
            ></v-checkbox>
        </td>
        </tr>
    </template>
    <!--<template v-slot:expand="props">
        <v-card flat>
            <v-card-text>Peek-a-boo!</v-card-text> 
        </v-card>
    </template>      --> 
    </v-data-table>
</template>

<script>
export default {
    props: [ "lista", "tipo" ],
    data: () => ({
        search: null,
        donos: [],
        participantes: [],
        headers: [
            {
                text: "Classes",
                value: "classes",
                width: "80%",
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
    }),
    methods: {
        preparaLista: async function(lista){
            console.log(lista)
            
        }
    }
}
</script>

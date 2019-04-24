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
        <td>    
                {{ props.item.classe }}
        </td>
        <td>
            <v-checkbox
                v-model="props.item.dono"
                primary
                hide-details
            ></v-checkbox>
        </td>
        <td>
            <v-checkbox
                v-model="props.item.participante"
                primary
                hide-details
            ></v-checkbox>
        </td>
    </template>
    </v-data-table>
</template>

<script>
export default {
    props: [ "lista", "tipo" ],
    data: () => ({
        search: null,
        donos: [],
        participantes: [],
        selected: [],
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
    computed: {
        estado() {
            return this.$store.state.criacaoTabSel
        }
    },
    methods: {
        preparaLista: async function(lista){
            console.log(lista)
            
        }
    }
}
</script>

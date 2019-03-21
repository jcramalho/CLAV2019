<template>
    <div>
        <div class="subheading font-weight-medium">Legislação</div>
        <v-data-table
            :headers="headers"
            :items="legs"
            class="elevation-1"
            hide-actions
        >
            <template v-slot:headers="props">
                <tr>
                    <th v-for="h in props.headers" :key="h.text" class="body-2 font-weight-bold">
                        {{ h.text }}
                    </th>
                </tr>
            </template>

            <template v-slot:items="props">
                <tr>
                    <td>{{ props.item.tipo }}</td>
                    <td> {{ props.item.numero }} </td>
                    <td> {{ props.item.sumario }} </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    props: ["legs"],

    data: function() {
      return {
          headers: [
            { text: 'Tipo', align: 'left', value: 'tipo'},
            { text: 'Número', value: 'numero' },
            { text: 'Sumário', value: 'sumario' }
          ]
      }
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        }
    }
}
</script>

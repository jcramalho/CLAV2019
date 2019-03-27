<template>
    <div>
        <div class="subheading font-weight-medium">Descendência</div>

        <v-data-table
            :items="subclasses"
            class="elevation-1"
            hide-headers
            hide-actions
        >
            <template v-slot:items="props">
                <tr>
                    <td>
                        <a :href="'/classes/consultar/c' + props.item.codigo"> {{ props.item.codigo }} </a>
                                - {{ props.item.titulo }} 
                    </td>
                </tr>
            </template>
            
        </v-data-table>
    </div>
</template>

<script>
export default {
    props: ["subclasses"],
    methods: {
        go: function(idClasse){
            this.$router.push('/classes/c'+idClasse);
            this.$router.go();
        }
    }
}
</script>

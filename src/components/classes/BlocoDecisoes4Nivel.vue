<template>
    <v-container>
        <v-layout>
            <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
            </v-toolbar>
        </v-layout>

        <DecisaoComSubPCA
            :c="c"
            :semaforos="semaforos"
            :pcaFormasContagem="pcaFormasContagem"
            :pcaSubFormasContagem="pcaSubFormasContagem"
        />

        <DecisaoComSubDF
            :c="c"
            :semaforos="semaforos"
            :pcaFormasContagem="pcaFormasContagem"
            :pcaSubFormasContagem="pcaSubFormasContagem"
        />
    </v-container>
</template>

<script>
import DecisaoComSubPCA from '@/components/classes/DecisaoComSubPCA.vue'
import DecisaoComSubDF from '@/components/classes/DecisaoComSubDF.vue'

export default {
    props: ["c","semaforos","pcaFormasContagem","pcaSubFormasContagem"],

    components: {
        DecisaoComSubPCA, DecisaoComSubDF
    }
}
</script>

<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                 <v-btn small color="red darken-2" dark round @click="removerPCA">
                    Remover PCA
                    <v-icon dark>remove_circle</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: ["c"],

    methods: {
        removerPCA: function(){
            this.c.pca = {};
        }
    }
}
</script>

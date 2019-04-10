<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm20>
                <v-card>
                    <v-toolbar color="indigo darken-1" dark>
                        <v-toolbar-title><h1>{{ titulo }}</h1></v-toolbar-title>
                    </v-toolbar>
                <v-card-text>
                    <h1>{{ objeto }}</h1>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: ["tipo", "objeto", "titulo"]
}
</script>

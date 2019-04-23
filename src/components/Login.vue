<template>
    <v-container>
        <h1> Utilizador dos serviços CLAV </h1>
        <v-container fluid>
            <v-row>
                <v-col>Pode proceder à autenticação para utilização dos serviços CLAV através do cartão de cidadão, da chave móvel digital ou do seu email pessoal institucional e respetiva senha de acesso.</v-col>
                <v-col cols="7">Autenticação</v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
export default {
    methods: {
        goHome: function(){
            this.$router.push('/');
        }
    }
}
</script>
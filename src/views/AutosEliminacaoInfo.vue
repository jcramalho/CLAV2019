<template>
<v-content class="px-12">
    <p class="content-title-1">Autos de Eliminação</p>
    <p class="content-text px-8 py-2">
        Quando a documentação atinge o término do seu prazo de conservação
        administrativa e o seu destino final é a eliminação, a ação de eliminar
        deve ser concretizada seguindo as boas práticas. Na CLAV é possível
        criar os autos de eliminação ao abrigo de tabela de seleção inserida
        em Portaria de gestão de documentos ou Relatório de avaliação de
        documentação acumulada, e submetê-los à DGLAB para verificação de conformidade.
    </p>
    <p class="content-title px-8 py-2">
        Para aceder a autos de eliminação, selecione a opção <b>CONSULTAR</b>.
    </p>
    <p class="content-text px-8 py-2">
        Para criar autos de eliminação, selecione a opção <b>CRIAR.
            Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>
    <p class="content-text px-8 py-2">
        Para importar autos de eliminação, selecione a opção <b>IMPORTAR.
            Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>

    <p class="content-text px-8 pb-4">
        <b>Consulte as instruções em <a @click="$router.push('/forminstr')">Formulários e instruções</a>.</b>
    </p>
    <v-container fluid style="text-align: center;">
        <v-row justify="center" align="center">
            <v-col cols="12" md="4">
                <v-btn @click="$router.push('/autosEliminacao')" rounded class="white--text" :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }" id="default-button">
                    <unicon name="consultar-icon" width="20" height="20" viewBox="0 0 20.71 20.697" fill="#ffffff" />
                    <p class="ml-2">Consultar</p>
                </v-btn>
            </v-col>
            <v-col cols="12" md="4" v-if="
              this.$userLevel() > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            ">
                <v-btn @click="$router.push('/autosEliminacao/criar')" rounded class="white--text" :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }" id="default-button">
                    <unicon name="criar-icon" width="20" height="20" viewBox="0 0 20.71 20.721" fill="#ffffff" />
                    <p class="ml-2">Criar</p>
                </v-btn>
            </v-col>
            <v-col cols="12" md="4" v-if="
              this.$userLevel() > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            ">
                <v-btn @click="$router.push('/autosEliminacao/importar')" rounded class="white--text" :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }" id="default-button">
                    <unicon name="importar-icon" width="20" height="20" viewBox="0 0 20.71 18.121" fill="#ffffff" />
                    <p class="ml-2">Importar</p>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</v-content>
</template>

<script>
export default {
    name: "AutosEliminacaoInfo",

    mounted: async function () {
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
ul li {
    list-style: none;
    color: #606060;
    font-size: 0.9em;
    margin-bottom: 1rem;
    position: relative;
}

ul li::before {
    content: "\2022";
    position: absolute;
    left: -2rem;
    top: -2.35rem;
    font-size: 4em;
    color: #4da0d0;
}
</style>

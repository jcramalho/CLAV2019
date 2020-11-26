<template>
<v-content class="px-12">
    <p class="content-title-1">Planos de preservação digital</p>
    <p class="content-text px-8 py-2">
        <i>«Um Plano de Preservação Digital é um documento estratégico
            que contém políticas e procedimentos orientados para a
            constituição de uma estrutura técnica e organizacional que
            permita preservar de forma continuada documentos de arquivo
            eletrónicos (DAE) através de ações realizadas sobre os
            objetos digitais (OD) que os compõem.»</i>
    </p>
    <p class="legenda"> (in Recomendações para a produção de Planos de Preservação Digital)</p>
    <p class="content-title px-8 py-2">
        Os Planos de Preservação Digital podem ser organizacionais
        (de uma entidade) ou pluriorganizacionais (de um conjunto de
        entidades, por exemplo, de âmbito ministerial).
    </p>
    <p class="content-text px-8 py-2">
        Para a elaboração de um PPD, é necessário que a entidade tenha
        uma fonte de legitimação (portaria ou despacho que estabelece
        as decisões de avaliação).
    </p>
    <p class="content-text px-8 py-2">
        A CLAV disponibiliza 3 ficheiros que correspondem às 3 Fases
        da FRD (Folha de Recolha de Dados) para a elaboração de um Plano
        de Preservação Digital. A consultoria técnica e a aprovação do PPD
        é efetuada pela DGLAB, através do Serviço competente para o efeito.
        A CLAV disponibiliza também um conjunto de documentos técnicos de
        apoio à elaboração de planos de preservação digital.
    </p>

    <p class="content-text px-8 pb-4">
        Para propor um Plano de Preservação Digital, selecione a opção <b>IMPORTAR.
            Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>
    <v-container fluid style="text-align: center;">
        <v-row justify="center" align="center">
            <v-col cols="12" md="4">
                <v-btn @click="$router.push('/ppd/consultar')" rounded class="white--text" :class="{
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
                <v-btn @click="$router.push('/ppd/criar')" rounded class="white--text" :class="{
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
                <v-btn @click="$router.push('/ppd/importar')" rounded class="white--text" :class="{
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
    name: "PlanosDePreserDigInfo",

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

.legenda {
    text-align: right;
    font-size: 75%;
}
</style>

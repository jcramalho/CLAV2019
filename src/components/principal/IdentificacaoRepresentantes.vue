<template>
    <v-card  class="ma-4 pa-2" >
      <v-toolbar class="indigo accent-4" dark>
        <v-toolbar-title>Indicação de representante da entidade</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-card-text class="pa-2">
            <p>Para identificar os representantes que utilizarão os serviços CLAV a entidade deve preencher
            <a :href="`${publicPath}documentos/form-id-representante.docx`">este formulário</a> e remetê-lo, por via postal ou eletrónica, para:
                <ul>
                    <li>DGLAB, Edifício da Torre do Tombo, Alameda da Universidade, 1649-010 Lisboa;</li>
                    <li>clav@dglab.gov.pt</li>
                </ul>
            </p>
        </v-card-text>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
    data () {
        return {
            publicPath: process.env.BASE_URL
        }
    }
}
</script>
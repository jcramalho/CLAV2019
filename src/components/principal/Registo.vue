<template>
    <v-card  class="ma-4 pa-2" >
      <v-toolbar color="indigo darken-4" dark>
        <v-toolbar-title>Registo na CLAV</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Como registar-se na CLAV</v-expansion-panel-header>
          <v-expansion-panel-content>
            <p>O acesso aos serviços da CLAV depende do registo 
                prévio dos utilizadores designados como representantes pelas Entidades.</p>
            <p>Para tal, deverão ser seguidos os seguinte passos:</p>
            <ol>
                <li>Designação de representante(s) pela Entidade;</li>
                <li>Preenchimento do <a :href="`${publicPath}documentos/form-id-representante.pdf`">
                formulário disponibilizado para o efeito</a>, para cada representante designado;</li>
                <li>O formulário deverá ser assinado por um dirigente superior da Entidade e autenticado 
                  com assinatura digital, se o envio for feito por via eletrónica (NB: não serão aceites 
                  assinaturas do formulário por dirigentes intermédios). Esta autorização autenticada pelo 
                  dirigente superior é o equivalente a uma delegação de competências, uma vez que o representante 
                  da entidade passa a ter capacidade para, em nome da entidade, submeter autos de eliminação, 
                  propostas de tabelas de seleção e novas classes para a Lista Consolidada;</li>
                <li>O formulário deverá ser remetido à DGLAB por via postal ou eletrónica, respetivamente, para:
                    <ul>
                        <li>DGLAB, Edifício da Torre do Tombo, Alameda da Universidade, 
                          1649-010 Lisboa (formulário assinado manualmente) ou</li>
                        <li><a href="mailto:clav@dglab.gov.pt">clav@dglab.gov.pt</a> (formulário com assinatura digital).</li>
                    </ul>
                </li>
                <li>Após receção do formulário, a DGLAB efetuará o(s) respetivo(s) registo(s)
                    até 48 horas úteis;</li>
                <li>Findo esse prazo, o utilizador poderá aceder à plataforma, selecionando a opção 
                    “Autenticação”;</li>
                <li>A autenticação, no primeiro acesso, deve ser efetuada com o Cartão de cidadão.</li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Indicação de representante da entidade</v-expansion-panel-header>
          <v-expansion-panel-content>
            <p>Para identificar os representantes que utilizarão os serviços CLAV a entidade deve preencher
            <a :href="`${publicPath}documentos/form-id-representante.pdf`">este formulário</a> e remetê-lo, por via postal ou eletrónica, para:
                <ul>
                    <li>DGLAB, Edifício da Torre do Tombo, Alameda da Universidade, 1649-010 Lisboa;</li>
                    <li>clav@dglab.gov.pt</li>
                </ul>
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
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

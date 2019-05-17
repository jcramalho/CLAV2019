<template>
  <v-app>
    <MainPageHeader/>

    <v-snackbar
			v-model="snackbar"
			:timeout="timeout"
      :color="color"
			:top="true">
			{{ text }}
			<v-btn flat @click="fecharSnackbar">Fechar</v-btn>
		</v-snackbar>

    <v-content>
      <router-view/>
    </v-content>

    <PageFooter/>

  </v-app>
</template>

<script>

import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src

const lhost = require('@/config/global').host   
import axios from 'axios'

export default {
  name: 'App',
  components: {
    PageFooter, MainPageHeader
  },
  watch:{
    async $route(to, from){
      if(this.$store.state.user.token!=''){
        var res = await axios.get(lhost + "/api/users/verificaToken/" + this.$store.state.user.token);
        if(res.data.name=='TokenExpiredError'){
          this.text = 'A sua sessão expirou! Por favor faça login novamente.';
          this.color = 'error';
          this.snackbar = true;
          this.$router.push('/');
          this.$store.commit('guardaTokenUtilizador', '');
          this.$store.commit('guardaNomeUtilizador', '');
        }
      }
    }
  },
  methods: {
    fecharSnackbar(){
			this.snackbar = false;
			if(this.done==true) this.$router.push('/');
		}
  },
  data: () => (
    {
      snackbar: false,
			color: '',
			timeout: 4000,
			text: '',
      classeOps: [
        'Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'
      ],
      entidadeOps: [
        'Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'
      ],
      tipologiaOps: [
        'Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'
      ],
      legislacaoOps: [
        'Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'
      ],
    }
  )
}
</script>

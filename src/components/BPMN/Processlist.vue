<template>
  <div id="ProcessList">

    <v-dialog v-model="visible" 
      @input="visible=false" 
      @keydown.esc="close"
      @click:outside="close"
      width="500px"
    >

      <v-card style="z-index:2;">
        <v-card-title class="text-h5 grey lighten-2">
          Aviso
        </v-card-title>

        <div class="message">
          <slot>Ao apagar o processo estará também apagar todas as tarefas ativas relativas ao processo. Tem a certeza que quer continuar?</slot>
        </div>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            class="red darken-4 white--text"
            @click="close()"
          >
            Cancelar
          </v-btn>
           <v-btn
            text
            class="indigo accent-4 white--text"
            @click="confirm()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-row>
      <v-col>
        
        <div v-if="loading">
         <h3> A carregar os processos... </h3>
        </div>

        <div v-else-if="erro!=''">
          <h3> Algo correu mal... </h3>
          <h5> Por favor verifique se a ligação ao Camunda está ativa! </h5>
        </div>
        
        <div v-else-if="processDefinitions && processDefinitions.length">
          <h3> Escolhe o processo a começar: </h3>
          <v-list>
            <v-list-item v-for="processDefinition of processDefinitions" :key="processDefinition.id">
              <v-row >
                <v-col >
                  <div style="font-size:20px;">
                    <strong>
                      <router-link :to="`/bpmn/startprocess/${processDefinition.key}`">{{processDefinition.name}} - ( versão {{processDefinition.version}} ) </router-link>
                      <v-icon style="margin-left:20px" color="red" @click="openModal(processDefinition.deploymentId)"> mdi-delete </v-icon>
                      <v-icon style="margin-left:20px" @click="downloadProcesso(processDefinition.key)"> mdi-download </v-icon>
                    </strong>
                  </div>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </div>

        <div v-else>
          <h3> Não há processos implementados! </h3> <br/>
          <h5> <router-link to="/bpmn/deploy"> Implementar um novo processo </router-link> </h5>
        </div>

      </v-col>  
    </v-row>

  </div>
</template>

<script>
import CamundaRest from '../../services/camunda-rest';

export default {
  data() {
    return {
      processDefinitions: [],
      loading: true,
      erro: "",
      visible: false,
      value: null
    };
  },

  methods: {
    close() {
      this.visible = false
    },

    confirm() {
      this.apagarProcesso(this.value)
      this.close()
    },

    openModal(value) {
      this.visible = true
      this.value = value
    },


    apagarProcesso(deploymentId) {
      CamundaRest.deleteProcessDefinition(deploymentId)
      .then(() => {
        this.$router.go()
      }).catch(e => {
        console.error(e);
      });
    },

    async getXMLProcess(key) {
      let xml = null
      await CamundaRest.getProcessXMLByKey(key).then((result) => {
        xml = result.data.bpmn20Xml;  
      });
      return xml
    },

    async downloadProcesso(key) {
      let xml = await this.getXMLProcess(key)
      const url = window.URL.createObjectURL(new Blob([xml]));
      const link = document.createElement('a');
      link.href = url;
      let filename = key + '.bpmn'
      link.setAttribute('download', filename); 
      document.body.appendChild(link);
      link.click();
    }

  },

  async created() {
    await CamundaRest.getProcessDefinitions()
      .then((response) => {
        this.processDefinitions = response.data;
      })
      .catch(e => {
        this.erro = e
        console.error("erro :" + e);
      });
    this.loading = false
  }
};
</script>


<style>

.message {
    margin: 20px 5%;
  }

</style>

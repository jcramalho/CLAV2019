<template>
  <div id="ProcessList">
    
    <v-row>
      <v-col>
        
        <div v-if="loading">
         <h3> A carregar os processos... </h3>
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
                      <v-icon color="red" @click="apagarProcesso(processDefinition.deploymentId)"> mdi-delete </v-icon>
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
      loading: true
    };
  },

  methods: {
    apagarProcesso(deploymentId) {
      CamundaRest.deleteProcessDefinition(deploymentId)
      .then(() => {
        this.$router.go()
      }).catch(e => {
        console.error(e);
      });
    }
  },

  async created() {
    await CamundaRest.getProcessDefinitions().then((response) => {
      this.processDefinitions = response.data;
      console.log(this.processDefinitions)
      this.loading = false
    }).catch(e => {
      console.error(e);
    });
  }
};
</script>

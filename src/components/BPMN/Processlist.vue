<template>
  <div id="ProcessList">
    
    <v-row>
      <v-col>
        <h1> Start Process </h1>
        
        <v-list v-if="processDefinitions && processDefinitions.length">
          <v-list-item v-for="processDefinition of processDefinitions" :key="processDefinition.id">
            <v-row >
              <v-col >
                <div style="font-size:20px;">
                  <strong>
                    <router-link :to="`/bpmn/startprocess/${processDefinition.key}`">{{processDefinition.name}} - {{processDefinition.version}}</router-link>
                  </strong>
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <div v-else>
          Não há processos...
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
      processDefinitions: []
    };
  },

  created() {
    CamundaRest.getProcessDefinitions().then((response) => {
      this.processDefinitions = response.data;
    }).catch(e => {
      console.error(e);
    });
  }
};
</script>

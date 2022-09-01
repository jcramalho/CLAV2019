<template>
  <div>
      <div v-if="erro" >
        <h3> Algo correu mal... </h3>
        <h5> Por favor verifique se a ligação ao Camunda está ativa! </h5>
      </div>

      <v-row v-else>
        <v-col cols="2">
          <v-card raised rounded class="pa-0 ma-0">

            <div v-if="loading" >
              A carregar as tarefas... 
            </div>

            <v-list v-else-if="tasks && tasks.length">
              <v-list-item-group>
                <template v-for="(task, index) in tasks">  
                  <v-list-item class="pa-2" :style="id==task.id ? 'background-color:#cce6ff; text-decoration:none;' : 'background-color:white;text-decoration:none;'" :key="index" :href="`/bpmn/tasklist/${task.id}`" >
                    <v-list-item-icon class="icon">
                      <v-icon large>mdi-ballot-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="pa-0">
                      <p><strong>
                        <span style="color:#4da6ff">{{task.name}}</span> <br>
                        <span v-for="elem of map[task.id]" :key="elem"> 
                          <span v-if="elem && task.name!='Escolher o pedido'"> {{elem}} <br> </span>
                        </span>
                        {{task.created.split('T')[0]}} || {{task.created.split('T')[1].split('.')[0]}} <br> 
                        ( {{task.processDefinitionId.split(":")[0]}} )              
                      </strong></p>
                    </v-list-item-content>
                  </v-list-item>
                  <v-row :key="task.id" align="center" justify="center">
                    <v-col cols="10" class="pa-0 ma-0">
                      <v-divider v-if="index < tasks.length - 1" :key="`${index}-divider`"></v-divider>
                    </v-col>
                  </v-row>
                </template>
              </v-list-item-group> 
            </v-list>

            <div v-else >
              Não há tarefas...
            </div>
          </v-card>

        </v-col>
        <v-col cols="10">
          <v-card raised rounded>
            <generic-form v-if="this.$route.params.taskId" :taskId="this.$route.params.taskId" :executionId="executionId" :options="options" :formKey="taskFormKey"></generic-form>
            <div v-if="!this.$route.params.taskId">
              <p>Escolhe uma tarefa.</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script>
  import CamundaRest from '../../services/camunda-rest';
  import GenericForm from './GenericForm';
  import xml2js from 'xml2js';
  

  export default {
    data() {
      return {
        map: {},
        tasks: [],
        taskFormKey: '',
        executionId: '',
        options: null,
        id: this.$route.params.taskId,
        loading: true,
        erro:''
      };
    },
    components: {
      'generic-form': GenericForm
    },
    watch: {
      '$route': 'atualiza',
      'tasks': 'getAllID'
    },
    methods: {
      async getTask(taskId) {
        var t = null
        this.tasks.forEach(task => {
          if (task.id == taskId) t = task
        })  
        return t
      },

      async getAllID() {
        this.tasks.forEach(async (task) => {
          var c, t, a = null
          await CamundaRest.getTaskVariables(task.id, "pedido")
            .then((result) => {
              if (result.data.pedido) {
                c = result.data.pedido.value.codigo 
                t = result.data.pedido.value.objeto.tipo 
                a = result.data.pedido.value.objeto.acao 
              }
            })
          this.map[task.id] = {"codigo" : '[' + c + ']', "tipo" : t + ' - ' + a}
        })
        return true
      },

      async parseXML2JSON(xml) {

        var parser = new xml2js.Parser({  
          trim: true,  
          explicitArray: true  
        }); 

        var result = {}

        parser.parseString(xml, function (err, json) {
          err ? console.log("erro a converter: " + err) : result=json
        }); 

        return result
      },

      async getFlowFromTask(json, taskID, list) {
          var flows = json['bpmn:definitions']['bpmn:process']['0']['bpmn:sequenceFlow']
          flows.forEach(flow => {
              if (flow.$.sourceRef==taskID && flow.$.name) list.push(flow.$.name)
              else if (flow.$.sourceRef==taskID) this.getFlowFromTask(json, flow.$.targetRef, list)
          });
          return list
      },
      
      async atualiza() {
        await this.open()

        await this.fetchData()
      }, 

      async open() {
        await CamundaRest.getTasks()
          .then((result) => {
            this.tasks = result.data;
          })
          .catch(e => {
            this.erro = e;
          });

        await this.getAllID();
      },

      async fetchData() {
        
        await this.open()

        if (this.$route.params.taskId) {

          var task = await this.getTask(this.$route.params.taskId)  
          var xml = null

          await CamundaRest.getProcessXML(task.processDefinitionId).then((result) => {
            xml = result.data.bpmn20Xml;  
          });

          var json = await this.parseXML2JSON(xml)

          this.options = await this.getFlowFromTask(json, task.taskDefinitionKey, [])
           
          await CamundaRest.getTaskFormKey(this.$route.params.taskId).then((result) => {
            this.taskFormKey = result.data.key;
            this.tasks.forEach(t => {
              if (t.id==this.$route.params.taskId) this.executionId= t.executionId
            })
          });
        }
      }
    },

    async created() {
      
      await this.atualiza()
      this.loading = false
    }
  };


</script>


<style>

.icon {
  margin-right: 14px !important;
}


</style>
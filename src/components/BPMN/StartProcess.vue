<template>
  <div id="StartProcess">
    
    <v-row>
      <v-col>
        <h1> Start Process </h1>
        <generic-form v-if="formKey" :formKey="formKey"></generic-form>
      </v-col>  
    </v-row>

  </div>
</template>

<script>
import GenericForm from './GenericForm';
import CamundaRest from '../../services/camunda-rest';

export default {
  data() {
    return {
      formKey: ''
    };
  },
  components: {
    'generic-form': GenericForm
  },
  mounted() {
    CamundaRest.getFormKey(this.$route.params.processDefinitionKey).then((result) => {
      this.formKey = result.data.key;
      if (!result.data.key) {
        CamundaRest.postProcessInstance(this.$route.params.processDefinitionKey, {"variables" : { "processKey" : {"value" : this.$route.params.processDefinitionKey} } })
        .then(() => {
          this.$router.push('/bpmn/tasklist')
        })
      }
    });
  }
};
</script>

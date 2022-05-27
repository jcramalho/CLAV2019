<template>
  <div>
    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <h3>Implementar um processo</h3> <br/>

        <div class="dropbox">
          <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = 1" class="input-file">
            <h5 v-if="isInitial">
              Clica <b style="color:#4da6ff;"> aqui </b> para implementar um novo processo
            </h5>
            <h5 v-if="isSaving">
              Implementando {{ fileCount}} processo(s)...
            </h5>
        </div>
    </form>

     <!--SUCCESS-->
     <div v-if="isSuccess">
       <h3>Carregado {{ uploadedFiles.length }} ficheiro(s) com sucesso!</h3> <br/>
       <h5><router-link to='/bpmn/startprocess'> Começar o processo</router-link></h5>
     </div>
     
     <!--FAILED-->
     <div v-if="isFailed">
       <h3>Carregamento falhou!</h3>
       <p>
         <a href="javascript:void(0)" @click="reset()">Tenta outra vez</a>
       </p>
       <pre>{{ uploadError }}</pre>
     </div>
   </div>
</template>

<script>
  import CamundaRest from '../../services/camunda-rest';

  const STATUS_INITIAL = 0;
  const STATUS_SAVING = 1;
  const STATUS_SUCCESS = 2;
  const STATUS_FAILED = 3;

  export default {
    name: 'app',
    data() {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'data'
      };
    },
    computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
    },
    methods: {
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
      save(formData) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;
        CamundaRest.deployProcessDefinition(formData)
          .then((x) => {
            this.uploadedFiles = [].concat(x);
            this.currentStatus = STATUS_SUCCESS;
          })
          .catch((err) => {
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
          });
      },
      filesChange(fieldName, fileList) {
        // handle file changes
        const formData = new FormData();
        if (!fileList.length) return;
        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map((x) => {
            formData.append(fieldName, fileList[x], fileList[x].name);
          });
        // save it
        this.save(formData);
      }
    },
    mounted() {
      this.reset();
    }
  };
</script>


<!-- SASS styling -->
<style lang="scss">
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
</style>

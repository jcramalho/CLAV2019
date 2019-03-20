<template>
  <v-treeview v-if="classesCarregadas" :items="classes"></v-treeview>
</template>

<script>
import axios from 'axios'

export default {
    data: () => ({
      classes: [],
      classesCarregadas: false
    }),

  mounted: function (){
        axios
            .get('http://localhost:7778/api/classes')
            .then(response => {
                this.classes = response.data;
                this.classesCarregadas = true;
            })
            .catch(error => { return(error)})
    }
}
</script>

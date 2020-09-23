<template>
  <v-card class="ma-2">
    <v-card-title>Lista dos PPDs na BD</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="hPPDs"
        :items="PPDs"
        @click:row="rowClicked">

          <template v-slot:no-data>
            <v-alert :value="true" color="warning" icon="warning">
              Ainda não foi possível apresentar a lista dos PPDs...
            </v-alert>
          </template>

          <template v-slot:items="props">
            <tr @click="rowClicked(props.item)">
              <td>{{ props.item.nomePlano }}</td>
            </tr>
          </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>



<script>

export default {
    name: 'PPD',

    data() {
        return {
            hPPDs: [
                {text: "Nome Plano", sortable: true, value: "nomePlano", class: "subtitle-1" }
            ],
            PPDs: [],
            loading:true,
            seach: '',
        }
    },

    /*
    created: async function(){
    try {
      let response = await axios.get(lhost + "/ppds");
      this.PPDs = response.data
    }
    catch (e) {
      return e;
    }
  },
  */
/*
  created: function() {
    this.$request("get", "/ppds")
      .then(response => {
        this.PPDs = response.data;
        this.loading = true;
      })
      .catch(error => {
        return error;
      });
  }*/
  created: async function() {
    try {
      var response = await this.$request("get", "/ppds");
      this.PPDs = response.data;
    } catch (e) {
      return e;
    }
  }

};
</script>
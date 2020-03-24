<template>
    <v-container>
      <v-row>
        <v-dialog v-model="dialog" width="80%">
      <v-card>
        <v-card-title class="headline">
          Distribuição dos Termos de Índice pelas subclasses criadas
        </v-card-title>
        <v-card-text>
          <v-data-table
            :items="tis"
            :headers="headers"
            class="ma-1"
          >
            <template v-slot:item="props">
                <tr>
                    <td>
                        {{ props.item.termo }}
                    </td>
                    <td>
                        <v-radio-group v-model="props.item.subclasse" row>
                            <v-radio 
                                v-for="(s,i) in c.subclasses"
                                :key="i"
                                :label="s.codigo" 
                                :value="s.codigo"
                                color="indigo darken-3"
                            >
                            </v-radio>
                        </v-radio-group>
                    </td>
                </tr>
            </template>
            <template v-slot:footer.page-text="props">
                Termos: {{ props.pageStart }} - {{ props.pageStop }} de
                {{ props.itemsLength }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-4" text dark rounded @click="$emit('distribuir', tis)">Distribuir</v-btn>
            <v-btn color="red darken-4" text dark rounded @click="dialog = false; $emit('cancelar')">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      </v-row>
    </v-container>
</template>

<script>
export default {
  props: ["c"],

  data: function() {
    return {
      dialog: false,
      tis: [],

      headers: [
          { text: 'Termo', value: 'termo', class: ["table-header", "subtitle-2", "font-weight-bold"]},
          { text: 'Distribuição pelas subclasses', value: 'subclasse', class: ["table-header", "subtitle-2", "font-weight-bold"] },
      ],
    }
  },

  created: function(){
      this.tis = JSON.parse(JSON.stringify(this.c.termosInd))
      if(typeof(this.tis[0].subclasse) === "undefined"){ // Se ainda não foi feita uma distribuição
        for(var i=0; i < this.tis.length; i++)
          this.tis[i].subclasse = this.c.subclasses[0].codigo;
      }
  },

  mounted: function(){
    this.dialog = true;
  }
}

</script>
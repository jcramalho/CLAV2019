<template>
    <v-data-table 
        :items="lista"
        :headers="headers"
        :disable-initial-sort="true"
        class="elevation-1"
        hide-actions
    > 
    <template v-slot:items="props">
      <tr>
        <td v-for="(campo, index) in props.item" v-bind:key="index">    
                {{ campo }}
        </td>
        <td>
            <v-checkbox
                v-model="props.selected"
                primary
                hide-details
            ></v-checkbox>
        </td>
        <td>
            <v-checkbox
                v-model="props.selected"
                primary
                hide-details
            ></v-checkbox>
        </td>
        </tr>
    </template>
        
    </v-data-table>
</template>

<script>
export default {
    props: [ "lista", "tipo" ],
    data: () => ({
        search: null,
        donos: [],
        participantes: [],
        headers: [
            {
                text: "Classes",
                value: "classes",
                width: "80%",
            },
            {
                text: "Dono",
                value: "dono"
            },
            {
                text: "Participante",
                value: "participante"
            }
        ],
        items: [
        {
          id: 1,
          name: 'Applications :',
          children: [
            { id: 2, name: 'Calendar : app' },
            { id: 3, name: 'Chrome : app' },
            { id: 4, name: 'Webstorm : app' }
          ]
        },
        {
          id: 5,
          name: 'Documents :',
          children: [
            {
              id: 6,
              name: 'vuetify :',
              children: [
                {
                  id: 7,
                  name: 'src :',
                  children: [
                    { id: 8, name: 'index : ts' },
                    { id: 9, name: 'bootstrap : ts' }
                  ]
                }
              ]
            },
            {
              id: 10,
              name: 'material2 :',
              children: [
                {
                  id: 11,
                  name: 'src :',
                  children: [
                    { id: 12, name: 'v-btn : ts' },
                    { id: 13, name: 'v-card : ts' },
                    { id: 14, name: 'v-window : ts' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 15,
          name: 'Downloads :',
          children: [
            { id: 16, name: 'October : pdf' },
            { id: 17, name: 'November : pdf' },
            { id: 18, name: 'Tutorial : html' }
          ]
        },
      ]
    }),
    methods: {
        preparaLista: async function(lista){
            console.log(lista)
            
        }
    }
}
</script>

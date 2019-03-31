<template>
        <v-data-table
            :headers="headers"
            :items="myProcRel"
            class="elevation-1"
            hide-actions
        >
            <template v-slot:headers="props">
                <tr>
                    <th v-for="h in props.headers" :key="h.text" class="body-2 font-weight-bold">
                        {{ h.text }}
                    </th>
                </tr>
            </template>

            <template v-slot:items="props">
                <tr>
                <td>{{ props.item.label }}</td>
                <td>
                    <ul>
                        <li v-for="p in props.item.processos" :key="p.label">
                            <a :href="'/classes/consultar/c' + p.codigo"> {{ p.codigo }} </a>
                                - {{ p.titulo }} 
                        </li>
                    </ul>
                </td>
                </tr>
            </template>
            
        </v-data-table>
</template>

<script>

export default {
    props: ["processos"],

    data: function() {
      return {
          headers: [
            { text: 'Relação', align: 'left', sortable: false, value: 'label'},
            { text: 'Processos', value: 'processos' }
          ],
          relPorTipo: {
            eAntecessorDe: [],
            eComplementarDe: [],
            eCruzadoCom: [],
            eSinteseDe: [],
            eSintetizadoPor: [],
            eSucessorDe: [],
            eSuplementoDe: [],
            eSuplementoPara: [] 
        },
        labels: {
            eAntecessorDe: "É Antecessor de",
            eComplementarDe: "É Complementar de",
            eCruzadoCom: "É Cruzado com",
            eSinteseDe: "É Síntese de",
            eSintetizadoPor: "É Sintetizado por",
            eSucessorDe: "É Sucessor de",
            eSuplementoDe: "É Suplemento de",
            eSuplementoPara: "É Suplemento para"
        },
        myProcRel: []
      }
    },

    methods: {
        go: function(id){
            this.$router.push('/classes/consultar/c'+id);
            this.$router.go();
        }
    },

    mounted: function () {
        var tipo;
        for(var i=0; i < this.processos.length; i++){
            tipo = this.processos[i].idRel;
            this.relPorTipo[tipo].push(this.processos[i])
        }
        for(var j=0; j < Object.keys(this.relPorTipo).length; j++){
            tipo = Object.keys(this.relPorTipo)[j]
            if(this.relPorTipo[tipo].length > 0){
                this.myProcRel.push({label: this.labels[tipo], processos: this.relPorTipo[tipo]})
            }
        }
    }
}
</script>

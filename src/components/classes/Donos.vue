<template>
    <v-layout wrap ma-2>
    <!-- DONOS DO PROCESSO -->
        <v-flex xs2>
            <div class="info-label">Donos do processo</div>
        </v-flex>
        <v-flex xs10>
            <div class="info-content">
                <ul>
                    <li v-for="p in entidades" :key="p.idParticipante">
                        <a v-if="p.idTipo == 'Entidade'" :href="'/entidades/' + p.idParticipante">
                            {{ p.sigla }}:
                            {{ p.designacao }}
                            ({{ p.tipo.split('#')[1] }})
                        </a>
                        <a v-else :href="'/tipologias/' + p.idParticipante">
                            {{ p.sigla }}:
                            {{ p.designacao }}
                            ({{ p.tipo.split('#')[1] }})
                        </a>
                    </li>
                </ul>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ["entidades"],

     data: function() {
      return {
          headers: [
            { text: 'Sigla', align: 'left', value: 'sigla'},
            { text: 'Designação', value: 'designacao' },
            { text: 'Tipo', value: 'tipo' }
          ]
      }
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        }
    }
}
</script>

<style>
a:link {
  color: #1A237E;
  background-color: transparent;
}

a:hover {
  color: white ;
  background-color: #1A237E ;
}

.info-label {
    color: #1A237E;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
}

.info-content {
    padding: 5px; 
    width: 100%;
    border: 1px solid #1A237E ;
}
</style>
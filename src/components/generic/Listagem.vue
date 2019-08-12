<template>
  <v-card>
    <v-card-title>
      <h1>{{ tipo }}</h1>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar"
        single-line
        hide-details
      ></v-text-field>
      <v-btn v-if="tipo == 'Vocabulários Controlados'" class="ml-4" fab dark small color="indigo" @click="dialog = true">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="lista"
      :search="search"
      class="elevation-1"
      :rows-per-page-items="[10, 20, 100]"
      rows-per-page-text="Mostrar"
      v-if="listaReady"
      :disable-initial-sort="true"
    >
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Não foram encontrados resultados para "{{ search }}" .
        </v-alert>
      </template>
      <template v-slot:items="props">
        <tr v-if="tipo == 'Termos de Índice'" @click="go(props.item.idClasse)">
          <td v-for="(campo, index) in props.item" v-bind:key="index">
            {{ campo }}
          </td>
        </tr>
        <tr v-else-if="tipo == 'Legislação'" @click="go(props.item.numero)">
          <td v-for="(campo, index) in props.item" v-bind:key="index">
            <div v-if="props.item">
              <div v-if="index === 'entidades'">
                <div
                  v-for="(ent, index) in campo.split(',')"
                  v-bind:key="index"
                >
                  <a :href="'/entidades/ent_' + ent">{{ ent }} </a>
                </div>
              </div>
              <div v-else>
                {{ campo }}
              </div>
            </div>
          </td>
        </tr>
        <tr v-else @click="go(props.item.id)">
          <td v-for="(campo, index) in props.item" v-bind:key="index">
            {{ campo }}
          </td>
        </tr>
      </template>
      <template v-slot:pageText="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["lista", "tipo", "cabecalho", "campos", "ids"],
  data: () => ({
    search: "",
    listaReady: false,
    headers: [],
    dialog: false
  }),
  methods: {
    go: function(id) {
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades/ent_" + id);
          break;
        case "Tipologias de Entidade":
          this.$router.push("/tipologias/tip_" + id);
          break;
        case "Legislação":
          var idLeg = "";
          for (var i = 0; i < this.ids.length; i++) {
            if (this.ids[i].numero === id) {
              idLeg = this.ids[i].id;
              break;
            }
          }
          this.$router.push("/legislacao/" + idLeg);
          break;
        case "Termos de Índice":
          this.$router.push("/classes/consultar/c" + id);
          break;
        case "Vocabulários Controlados":
          this.$router.push("/vocabularios/" + id);
          break;
      }
    }
  },
  mounted: async function() {
    try {
      for (var i = 0; i < this.cabecalho.length; i++) {
        this.headers[i] = {
          text: this.cabecalho[i],
          value: this.campos[i]
        };
      }
    } catch (e) {
      return e;
    }
    this.listaReady = true;
  }
};
</script>

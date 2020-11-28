<template>
  <v-card>
    <v-sheet class="indigo lighten-2">
      <v-text-field
        v-model="search"
        label="Filtrar por número SI ou título"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <div>
        <v-treeview
          dense
          hoverable
          activatable
          :items="arvore"
          :search="search"
          :filter="filter"
          :open.sync="open"
        >
          <template slot="label" slot-scope="{ item }">
            <v-btn text depressed @click="go(item.id)">{{ item.name }}</v-btn>
            <br />
          </template>
        </v-treeview>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["arvore"],
  data: () => ({

    items: [],
    open: [1, 2],
    search: null,

  }),

computed: {
    filter () {
        return (item, search, textKey) => item[textKey].indexOf(search) > -1
      },
  }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>
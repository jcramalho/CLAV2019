<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    :return-value.sync="dataValor"
    transition="scale-transition"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dataValor"
        v-on="on"
        label="Data: AAAA-MM-DD"
        prepend-icon="event"
        readonly
        single-line
        color="blue darken-3"
      />
    </template>

    <v-date-picker
      v-model="dataValor"
      no-title
      scrollable
      color="blue darken-3"
      show-current
      first-day-of-week="1"
      :max="new Date().toISOString().substr(0, 10)"
      min="1970-01-01"
      locale="pt"
      @input="
        menu1 = false;
        dataSelecionada();
      "
    />
  </v-menu>
</template>

<script>
export default {
  props: ["d"],

  data() {
    return {
      dataValor: this.d,
      menu1: false
    };
  },

  methods: {
    dataSelecionada: function() {
      this.$refs.menu1.save(this.dataValor);
      this.$emit("dataSelecionada", this.dataValor);
      this.dataValor = "";
    }
  }
};
</script>

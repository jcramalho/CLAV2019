<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    :return-value.sync="dataValor"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        filled
        v-model="dataValor"
        :label="label"
        prepend-icon="event"
        readonly
        v-on="on"
      />
    </template>

    <v-date-picker
      v-model="dataValor"
      no-title
      scrollable
      show-current
      first-day-of-week="1"
      :max="new Date().toISOString().substr(0, 10)"
      :min="minData"
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
  props: ["d", "label", "dataMinima"],

  data() {
    return {
      minData: "",
      dataValor: this.d,
      menu1: false,
    };
  },

  mounted() {
    this.minData = this.dataMinima || "1800-01-01";
  },

  methods: {
    dataSelecionada: function() {
      this.$refs.menu1.save(this.dataValor);
      this.$emit("dataSelecionada", this.dataValor);
      this.dataValor = "";
    },
  },
};
</script>

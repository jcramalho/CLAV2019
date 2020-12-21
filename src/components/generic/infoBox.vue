<template>
  <v-dialog v-model="dialog" :width="widthDialog">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" small :color="colorHelp" dark>info_outline</v-icon>
    </template>

    <v-card :color="colorDialog">
      <v-card-title>
        <span class="title font-weight-light">{{ header }}</span>
      </v-card-title>

      <v-card-text>
        <!--{{ text }}-->
        <div v-html="text" />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-4" text @click="dialog=false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["text", "header", "helpColor", "dialogColor", "helpWidth"],
  data() {
    return {
      dialog: false,
      colorHelp: "",
      colorDialog: "",
      widthDialog: ""
    };
  },
  created: function() {
    if (!this.helpColor) {
      this.colorHelp = "#78909C";
    } else this.colorHelp = this.helpColor;

    if (!this.dialogColor) {
      this.colorDialog = "#ECEFF1";
    } else this.colorDialog = this.dialogColor;

    if (!this.helpWidth) {
      this.widthDialog = "500";
    } else this.widthDialog = this.helpWidth;
  }
};
</script>

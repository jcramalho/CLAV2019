import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1a237e",
        secondary: "#f3f7fc",
        accent: "#1976d2",
        success: "#46c354",
        error: "#b71c1c",
        neutral: "#d8d8d8",
      },
      dark: {
        primary: "#black",
      },
    },
  },
  icons: {
    iconfont: "md"
  }
});

import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        gradientleft: "#19237e",
        gradientright: "#0056b6",
        primary: "#1a237e",
        secondary: "#f3f7fc",
        accent: "#1976d2", 
        success: "#46c354",
        error: "#b71c1c",
        neutral: "#d8d8d8",
        neutralpurple: "#dee2f8",
        neutralblue: "#09337f",
        infocontent: "#f1f6f8",
        h1color: "#4da0d0",
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

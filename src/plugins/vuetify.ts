import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: "#1a237e",
        secondary: "#f3f7fc",
        accent: "#1976d2", 
        success: "#46c354",
        error: "#b71c1c",
        neutral: "#d8d8d8",
        neutralpurple: "#dee2f8",
        neutralblue: "#09337f",
        infocontent: "#f1f6f8",
        gradientleft: "#19237e",
        gradientright: "#0056b6",
        h1color: "#4da0d0",
        textshadow: "#807575",
        textshadow2: "#8f8989",
      },
      dark: {
        primary: "#010a69",
        secondary: "#3e5878",
        accent: "#1976d2", 
        success: "#46c354",
        error: "#b71c1c",
        neutral: "#535d78",
        neutralpurple: "#dee2f8",
        neutralblue: "#09337f",
        infocontent: "#f1f6f8",
        gradientleft: "#11174a",
        gradientright: "#002b5c",
        h1color: "#c4daf5",
        textshadow: "#e4eaed",
        textshadow2: "#94a0a6",
      },
    },
  },
  icons: {
    iconfont: "md"
  }
});

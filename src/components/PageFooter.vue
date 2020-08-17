<template>
  <v-footer dark padless>
    <v-card class="flex" flat>
      <v-card-title id="footer-bar" class="hidden-sm-and-down px-4 py-0">
        <p class="big-footer-letters">DGLAB -</p>
        <p class="regular-footer-letters pl-2">
          Direção Geral do Livro, dos Arquivos e das Bibliotecas
        </p>
        <v-spacer></v-spacer>
        <p class="body-2">Versão: 2020-03-19</p>

        <v-spacer></v-spacer>

        <p v-if="ontoReady" class="body-2">Ontologia: {{ ontologia }}</p>

        <v-spacer></v-spacer>
        <v-btn text rounded href="mailto:clav@dglab.gov.pt" id="contact-button">
          <unicon
            name="contacto-icon"
            width="24"
            height="24"
            viewBox="0 0 25.71 19.282"
            fill="#e5e5e5"
          />
          <p class="icon-text">Contactos</p>
        </v-btn>
        <v-spacer></v-spacer>
        <v-img
          id="footer-image"
          class="my-2"
          :src="require('./../assets/feder.png')"
          aspect-ratio="4.8600"
        />
      </v-card-title>
      <!--Mobile Footer-->
      <v-card-title id="footer-bar" class="hidden-md-and-up px-4 py-3">
        <p class="big-footer-letters mt-3">DGLAB-</p>
        <p class="regular-footer-letters mt-3">
          Direção Geral do Livro, dos Arquivos e das Bibliotecas
        </p>
        <v-spacer></v-spacer>
        <p class="body-2 mt-3">Versão: 2020-03-19</p>

        <v-spacer></v-spacer>

        <p v-if="ontoReady" class="body-2 mt-3">Ontologia: {{ ontologia }}</p>

        <v-spacer></v-spacer>
        <v-btn
          text
          rounded
          href="mailto:clav@dglab.gov.pt"
          id="contact-button"
          class="mt-3 pa-0"
        >
          <unicon
            name="contacto-icon"
            width="24"
            height="24"
            viewBox="0 0 25.71 19.282"
            fill="#e5e5e5"
          />
          <p class="icon-text">Contactos</p>
        </v-btn>
        <v-spacer></v-spacer>
        <v-img
          id="footer-image"
          class="mt-3"
          :src="require('./../assets/feder.png')"
          aspect-ratio="4.8600"
        />
      </v-card-title>
    </v-card>
  </v-footer>
</template>

<script>
const interfaceVersion = require("@/config/global").interfaceVersion;

export default {
  data: function() {
    return {
      ontoReady: false,
      ontologia: "",
      interfaceVersion: interfaceVersion
    };
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/ontologia/data");
      this.ontologia = response.data;
      this.ontoReady = true;
    } catch (error) {
      return error;
    }
  }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
.v-card__title {
  line-height: 0.5rem !important;
}
.v-application .body-2 {
  line-height: 0.5rem !important;
}
#footer-bar {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  font-size: 1em;
}
.big-footer-letters {
  display: inline;
  font-weight: bold;
  font-size: 1.2em !important;
}
.regular-footer-letters {
  display: inline;
  font-weight: 300;
  vertical-align: text-bottom;
}
.v-btn {
  text-transform: none !important;
}
.v-application p {
  margin-bottom: 0 !important;
  color: #e5e5e5 !important;
}
.icon-text {
  margin-left: 0.625em;
  display: inline;
}
#contact-button {
  outline: none !important;
  text-decoration: none;
}
#footer-image {
  min-width: 90px;
  max-width: 120px;
}
</style>

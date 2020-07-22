<template>
  <v-content class="px-12">
    <p class="content-title-1">Formulários e instruções para a CLAV</p>
    <p class="content-title-2 px-8 pt-2">
      Lista Consolidada - novas classes:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9">
        <li>
          <a
            :href="
              `${publicPath}documentos/Instrucoes-Criacao-Assistida-Classes-LC.pdf`
            "
          >
            Instruções para criação assistida de classes na LC;
          </a>
        </li>
      </ul>
    </v-container>
    <p class="content-title-2 px-8 pt-2">
      Tabelas de seleção:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9">
        <li>
          Instruções para criação assistida de TS na CLAV;
        </li>
        <li>
          Instruções para submissão de TS por exportação de Formulário
          pré-preenchido;
        </li>
        <li>
          <a href="#" @click="getFormulario()">
            Formulário pré-preenchido para submissão de TS;
          </a>
        </li>
      </ul>
    </v-container>
    <p class="content-title-2 px-8 pt-2">
      Autos de eliminação:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9">
        <li>
          Instruções para criação assistida de Auto;
        </li>
        <li>
          <a
            :href="
              `${publicPath}documentos/Instrucoes-submissao-AE-por-exportacao-formulario.pdf`
            "
          >
            Instruções para submissão de Auto por exportação de Formulário;
          </a>
        </li>
        <li>
          <a :href="`${publicPath}documentos/FormularioAE_SERIE.csv`">
            Formulário para submissão de Classes / Séries para auto de
            Eliminação;
          </a>
        </li>
        <li>
          <a :href="`${publicPath}documentos/FormularioAE_UI.csv`">
            Formulário para submissão de Agregações / UI para auto de
            Eliminação;
          </a>
        </li>
        <li>
          <a :href="`${publicPath}documentos/xml_schema_pgd_lc.xsd`">
            XML Schema para PGD pertencente à Lista Consolidada;
          </a>
        </li>
        <li>
          <a :href="`${publicPath}documentos/xml_schema_s_lc.xsd`">
            XML Schema para PGD não pertencente à Lista Consolidada e RADA;
          </a>
        </li>
      </ul>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "FormInstrucoes",
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  },
  methods: {
    async getFormulario() {
      var path = "/classes?info=esqueleto&fs=text/csv";
      var filename = "formularioTS.csv";

      try {
        var response = await this.$request("get", path);
        var blob = new Blob([response.data], {
          type: "text/csv;charset=utf-8;"
        });

        if (window.navigator.msSaveBlob) {
          // FOR IE BROWSER
          navigator.msSaveBlob(blob, filename);
        } else {
          // FOR OTHER BROWSERS
          var url = URL.createObjectURL(blob);
          var element = document.createElement("a");

          element.setAttribute("href", url);
          element.setAttribute("download", filename);
          element.style.display = "none";

          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      } catch (erro) {
        this.$router.push(
          "/?erro=" +
            encodeURIComponent(
              "Não foi possível o obter o formulário pré-preenchido para a submissão de uma TS. Tente novamente mais tarde!"
            )
        );
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
<style scoped>
ul li {
  list-style: none;
  color: #606060;
  font-size: 0.9em;
  margin-bottom: 1rem;
  position: relative;
}
ul li::before {
  content: "\2022";
  position: absolute;
  left: -2rem;
  top: -2.35rem;
  font-size: 4em;
  color: #4da0d0;
}
</style>

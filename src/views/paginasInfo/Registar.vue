<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Como registar-se na CLAV</p>
    <p class="content-text px-8 py-2">
      O acesso aos serviços da CLAV depende do registo prévio dos utilizadores designados
      como representantes pelas Entidades.
    </p>
    <p class="content-title-2 px-8 pt-6 pb-4">
      Para tal, deverão ser seguidos os seguinte passos:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ol class="px-10">
        <li>Designação de representante(s) pela Entidade;</li>
        <li>
          Preenchimento do
          <a :href="`${publicPath}documentos/form-id-representante.pdf`"
            >formulário disponibilizado para o efeito</a
          >, para cada representante designado;
        </li>
        <li>
          O formulário deverá ser assinado por um dirigente superior da Entidade e
          autenticado com assinatura digital, se o envio for feito por via eletrónica (NB:
          não serão aceites assinaturas do formulário por dirigentes intermédios). Esta
          autorização autenticada pelo dirigente superior é o equivalente a uma delegação
          de competências, uma vez que o representante da entidade passa a ter capacidade
          para, em nome da entidade, submeter autos de eliminação, propostas de tabelas de
          seleção e novas classes para a Lista Consolidada;
        </li>
        <li>
          O formulário deverá ser remetido à DGLAB por via postal ou eletrónica,
          respetivamente, para:
          <ol class="px-7 mt-3" type="a">
            <li>
              DGLAB, Edifício da Torre do Tombo, Alameda da Universidade, 1649-010 Lisboa
              (formulário assinado manualmente) ou
            </li>
            <li>
              <a href="mailto:clav@dglab.gov.pt">clav@dglab.gov.pt</a>
              (formulário com assinatura digital).
            </li>
          </ol>
        </li>
        <li>
          Após receção do formulário, a DGLAB efetuará o(s) respetivo(s) registo(s) até 48
          horas úteis;
        </li>
        <li>
          Findo esse prazo, o utilizador poderá aceder à plataforma, selecionando a opção
          “Autenticação”;
        </li>
        <li>
          A autenticação, no primeiro acesso, deve ser efetuada com o Cartão de Cidadão.
        </li>
      </ol>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
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

ol {
  counter-reset: li;
}

ol > li::before {
  content: counter(li);
  font-size: 1.4em;
  font-weight: 600;
  position: absolute;
  top: -0.37rem;
  left: -2rem;
  color: #4da0d0;
}

ol li {
  list-style: none;
  counter-increment: li;
  color: #606060;
  font-size: 0.9em;
  margin-bottom: 2rem;
  position: relative;
}

ol > li > ul > li::before {
  top: -2.1rem;
}

ol > li > ul > li {
  margin-bottom: 1rem;
}
</style>

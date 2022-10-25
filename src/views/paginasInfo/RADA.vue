<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Relatórios de Avaliação de Documentação Acumulada</p>
    <p class="clav-content-text px-8 py-2">
      Um Relatório de Avaliação de Documentação Acumulada (RADA) é um instrumento que
      caracteriza a documentação acumulada, tendo em vista a sua avaliação através da
      determinação do seu prazo de conservação administrativa (PCA) e do seu destino final
      (DF).
    </p>
    <p class="clav-content-text px-8 py-2">
      Destina-se à documentação que ainda não foi objeto de avaliação arquivística, isto
      é, não abrangida por uma portaria de gestão de documentos.
    </p>
    <p class="clav-content-text px-8 py-2">
      Um RADA integra um relatório expositivo e uma tabela de seleção.
    </p>
    <p class="clav-content-text px-8 py-2">
      Um relatório expositivo do RADA consiste na descrição sumária do universo documental
      avaliado.
    </p>
    <p class="clav-content-text px-8 py-2">
      Uma tabela de seleção do RADA consiste numa estrutura hierárquica de classes que
      reflete a organização da documentação. Integra áreas orgânico e/ou funcionais e
      séries e subséries documentais, com as respetivas descrições de contextualização
      para avaliação. O último nível, série ou subsérie, fixa as decisões de avaliação,
      i.e., o período de tempo que deve manter a informação (prazo de conservação
      administrativa), o destino a aplicar findo esse prazo (conservação permanente ou
      eliminação).
    </p>
    <p class="clav-content-text px-8 py-2">
      Complementarmente, pode ainda integrar a identificação das unidades de instalação a
      que se aplica a tabela de seleção.
    </p>
    <p class="clav-content-text px-8 py-2">
      Para aceder ao catálogo dos RADA e respetivas tabelas de seleção aprovadas pela
      DGLAB e disponibilizadas na CLAV, selecione a opção
      <span class="content-title-2">CONSULTAR.</span>
    </p>
    <p class="clav-content-text px-8 py-2">
      Para propor um RADA, selecione a opção
      <b
        >CRIAR. Deve estar registado na CLAV para aceder a esta funcionalidade. Consulte
        as instruções em
        <a @click="$router.push('/docsporclasse')">Formulários e instruções</a></b
      >.
    </p>
    <p class="content-title-2 px-8 py-10 pb-3">CONSULTAR</p>
    <p class="clav-content-text px-8 py-2">
      As tabelas de seleção encontram-se organizadas em dois conjuntos:
    </p>
    <div class="pl-10">
      <ol>
        <li>
          <p>
            RADA - Relatório de Avaliação de Documentação Acumulada produzidos e aprovados
            fora da plataforma CLAV.
          </p>
        </li>
        <li>
          <p>
            RADA/CLAV - Relatório de Avaliação de Documentação Acumulada produzidos e
            aprovados através da plataforma CLAV.
          </p>
        </li>
      </ol>
    </div>
    <p class="content-title-2 px-8 py-10 pb-3">CRIAR</p>
    <p class="clav-content-text px-8 py-2">A criação de um RADA é efetuada em três etapas:</p>
    <div class="pl-10">
      <ol>
        <li>
          <p>
            Informação Geral, em que se indica o Título do RADA e as entidades
            responsáveis pelaapresentação deste instrumento;
          </p>
        </li>
        <li>
          <p>
            Relatório expositivo, efetuado através de preenchimento de formulário online,
            com criação assistida,ou através de submissão de ficheiro preenchido
            previamente offline, apartir de formulário disponibilizado.
          </p>
        </li>
        <li>
          <p>
            Tabela de seleção, efetuada igualmente com possibilidade de preenchimento de
            formulário online ou de submissão de: ficheiro para as classes relativas às
            áreas orgânico-funcional e às séries / subséries e, quando aplicável, ficheiro
            para as unidades de instalação.
          </p>
        </li>
      </ol>
    </div>
    <v-container fluid style="text-align: center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4" justify="center" align="center">
          <v-btn
            @click="$router.push('/rada/consultar')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="consultar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.697"
              fill="#ffffff"
            />
            <p class="ml-2">Consultar</p>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="4"
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          justify="center"
          align="center"
        >
          <v-btn
            @click="$router.push('/rada/criar')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="criar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.721"
              fill="#ffffff"
            />
            <p class="ml-2">Criar</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "RadaInfo",

  mounted: async function () {
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

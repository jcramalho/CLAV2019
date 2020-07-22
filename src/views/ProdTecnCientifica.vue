<template>
  <v-content class="px-12">
    <p class="content-title-1">Produção Técnica e Científica</p>
    <p class="content-title-2 px-8 pt-2">
      Provas académicas
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9">
        <li>-</li>
      </ul>
    </v-container>
    <p class="content-title-2 px-8 pt-2">
      Comunicações e artigos
    </p>
    <v-container
      fluid
      class="ma-0 px-12"
      v-for="item in listaPubs"
      :key="item.ano"
    >
      <p class="pt-4">
        <u>{{ item.ano }}</u>
      </p>
      <ul class="px-9" v-for="pub in item.pubs" :key="pub.url">
        <li>
          <a :href="pub.url"> {{ pub.titulo }}, </a>
          <br />
          <p>{{ pub.local }}, <br /></p>
          <span v-for="a in pub.autores" :key="a">{{ a }}</span>
        </li>
      </ul>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "ProdTecnCientifica",
  data() {
    return {
      listaPubs: [
        {
          ano: "2019",
          pubs: [
            {
              titulo:
                "Plataforma CLAV: garantindo a interoperabilidade semântica e preparando o acesso continuado à informação",
              url:
                "https://www.bad.pt/publicacoes/index.php/arquivosmunicipais/article/view/1979",
              local:
                "13.º Encontro Nacional de Arquivos Municipais, BAD, Cascais (18 e 19 Out. 2019)",
              autores: [
                "Alexandra Lourenço, ",
                "José Carlos Ramalho, ",
                "Madalena Ribeiro, ",
                "Pedro Penteado, ",
                "Rita Gago;"
              ]
            },
            {
              titulo:
                "A proposta de portaria de gestão de documentos para a Administração Local",
              url:
                "https://www.bad.pt/publicacoes/index.php/arquivosmunicipais/article/view/2037",
              local:
                "13.º Encontro Nacional de Arquivos Municipais, BAD, Cascais (18 e 19 Out.2019)",
              autores: [
                "Alexandra Lourenço, ",
                "Isabel Campaniço, ",
                "Filomena Machado, ",
                "Isabel Salgueiro, ",
                "Manuela Maio, ",
                "Júlio Cardoso, ",
                "Daniel de Melo, ",
                "Helena Neves, ",
                "Natália Antónia;"
              ]
            }
          ]
        },
        {
          ano: "2018",
          pubs: [
            {
              titulo:
                "Transformação digital: novas políticas e procedimentos para a classificação e a avaliação da informação",
              url:
                "https://www.bad.pt/publicacoes/index.php/congressosbad/article/view/1861",
              local: "13º Congresso Nacional BAD, Fundão (24 a 26 Out. 2018)",
              autores: [
                "Alexandra Lourenço, ",
                "José Carlos Ramalho, ",
                "Pedro Penteado, ",
                "Rita Gago;"
              ]
            },
            {
              titulo:
                'A lista consolidada como instrumento facilitador de aplicação do RGPD, IIª Jornadas Gestão de Informação "Interação entre arquivistas e informáticos: Bits e bytes: MoReq, proteção de dados e afins… "',
              url:
                "https://www.bad.pt/eventos/programa-cientifico-ii-jornadas-de-trabalho-interacao-entre-arquivistas-e-informaticos-bits-e-bytes-moreq-protecao-de-dados-e-afins-2/",
              local: "Ponte da Barca (4 Maio) 2018",
              autores: [
                "Alexandra Lourenço, ",
                "Pedro Penteado, ",
                "Rita Gago;"
              ]
            }
          ]
        },
        {
          ano: "2017",
          pubs: [
            {
              titulo: "Plataforma M51-CLAV: o que há de novo?",
              url:
                "https://www.bad.pt/eventos/wp-content/uploads/2018/01/CIGIA_COM_01.pdf",
              local:
                "I Conferência Internacional de Gestão de Informação e Arquivos (CIGIA), Albergaria-a-Velha (4 Nov.2017 )",
              autores: [
                "Alexandra Lourenço, ",
                "Pedro Penteado, ",
                "Rita Gago;"
              ]
            }
          ]
        },
        {
          ano: "2016",
          pubs: [
            {
              titulo: "Simplex +: o que precisamos para além da Medida 51?",
              url:
                "http://www.bad.pt/publicacoes/index.php/arquivosmunicipais/article/view/1535",
              local:
                "12º Encontro Nacional de Arquivos Municipais, Castelo Branco (14 e 15 Out. 2016)",
              autores: ["Alexandra Lourenço, ", "Pedro Penteado;"]
            }
          ]
        },
        {
          ano: "2015",
          pubs: [
            {
              titulo:
                "A caminho da ASIA – Avaliação Suprainstitucional da Informação Arquivística",
              url:
                "http://www.bad.pt/publicacoes/index.php/congressosbad/article/view/1458",
              local:
                "12º Congresso da Associação Nacional de Bibliotecários, Arquivistas e Documentalistas (21 a 23 Out. 2015)",
              autores: ["Alexandra Lourenço, ", "Pedro Penteado;"]
            },
            {
              titulo:
                "Uma ontologia para os processos de negócio da Administração",
              url:
                "http://www.bad.pt/publicacoes/index.php/congressosbad/article/view/1453",
              local:
                "12º Congresso da Associação Nacional de Bibliotecários, Arquivistas e Documentalistas (21 a 23 Out. 2015)",
              autores: [
                "Alexandra Lourenço, ",
                "José Carlos Ramalho, ",
                "Pedro Penteado;"
              ]
            }
          ]
        },
        {
          ano: "2014",
          pubs: [
            {
              titulo:
                "Las estrategias para mejorar el acceso y la reutilización de la información  pública en Portugal: el papel de la interoperabilidad semântica",
              url: "http://www.girona.cat/web/ica2014/ponents/textos/id200.pdf",
              local:
                '2nd Annual Conference "ICA": Archives and Cultural Industries. Girona (11-15  Out. 2014)',
              autores: ["Alexandra Lourenço, ", "Pedro Penteado;"]
            }
          ]
        },
        {
          ano: "2012",
          pubs: [
            {
              titulo:
                "O desafio da interoperabilidade na gestão dos arquivos da Administração: propostas do órgão de coordenação nacional de arquivo",
              url:
                "http://www.bad.pt/publicacoes/index.php/congressosbad/article/view/452",
              local:
                "11º Congresso da Associação Nacional de Bibliotecários, Arquivistas e Documentalistas (18 Out. 2012)",
              autores: ["Alexandra Lourenço, ", "Pedro Penteado;"]
            },
            {
              titulo:
                "É necessário alterar o processo de avaliação arquivística?",
              url:
                "http://www.bad.pt/publicacoes/index.php/congressosbad/article/view/341",
              local:
                "11º Congresso da Associação Nacional de Bibliotecários, Arquivistas e Documentalistas (19 Out. 2012)",
              autores: ["Alexandra Lourenço;"]
            }
          ]
        },
        {
          ano: "2011",
          pubs: [
            {
              titulo:
                "Novos modelos de gestão da informação arquivística na Administração Pública: A Macroestrutura Funcional (MEF)",
              url:
                "http://repap.ina.pt/bitstream/10782/580/1/Novos%20modelos%20e%20instrumentos%20de%20gest%C3%A3o%20da%20informa%C3%A7%C3%A3o%20arquivistica.pdf",
              local:
                "8º Congresso nacional da Administração Pública: desafios e soluções. Lisboa, Instituto Nacional de Administração, 2011. p. 235-243",
              autores: [
                "Alexandra Lourenço, ",
                "Cecília Henriques, ",
                "Pedro Penteado;"
              ]
            }
          ]
        }
      ]
    };
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

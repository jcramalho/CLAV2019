<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      >Produção Técnica e Científica</v-expansion-panel-header
    >
    <v-expansion-panel-content>
      <v-card>
        <v-card-text>
          <div class="subtitle">Provas académicas</div>
          <ul>
            <li></li>
          </ul>
          <div class="subtitle">Comunicações e artigos</div>
          <v-list two-line subheader>
            <v-list-item v-for="item in listaPubs" :key="item.ano">
              <v-list-item-content>
                <v-list-item-title>{{ item.ano }}</v-list-item-title>
                <ul>
                  <li v-for="pub in item.pubs" :key="pub.url">
                    <b
                      ><a :href="pub.url">{{ pub.titulo }}</a></b
                    >, {{ pub.local }};
                    <span v-for="a in pub.autores" :key="a">{{ a }}</span
                    >,
                  </li>
                </ul>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
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
                "Alexandra Lourenço",
                "José Carlos Ramalho",
                "Madalena Ribeiro",
                "Pedro Penteado",
                "Rita Gago"
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
                "Alexandra Lourenço",
                "Isabel Campaniço",
                "Filomena Machado",
                "Isabel Salgueiro",
                "Manuela Maio",
                "Júlio Cardoso",
                "Daniel de Melo",
                "Helena Neves",
                "Natália Antónia"
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
                "Alexandra Lourenço",
                "José Carlos Ramalho",
                "Pedro Penteado",
                "Rita Gago"
              ]
            },
            {
              titulo:
                'A lista consolidada como instrumento facilitador de aplicação do RGPD, IIª Jornadas Gestão de Informação "Interação entre arquivistas e informáticos: Bits e bytes: MoReq, proteção de dados e afins… "',
              url:
                "https://www.bad.pt/eventos/programa-cientifico-ii-jornadas-de-trabalho-interacao-entre-arquivistas-e-informaticos-bits-e-bytes-moreq-protecao-de-dados-e-afins-2/",
              local: "Ponte da Barca (4 Maio) 2018",
              autores: ["Alexandra Lourenço", "Pedro Penteado", "Rita Gago"]
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
              autores: ["Alexandra Lourenço", "Pedro Penteado", "Rita Gago"]
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
              autores: ["Alexandra Lourenço", "Pedro Penteado"]
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
              autores: ["Alexandra Lourenço", "Pedro Penteado"]
            },
            {
              titulo:
                "Uma ontologia para os processos de negócio da Administração",
              url:
                "http://www.bad.pt/publicacoes/index.php/congressosbad/article/view/1453",
              local:
                "12º Congresso da Associação Nacional de Bibliotecários, Arquivistas e Documentalistas (21 a 23 Out. 2015)",
              autores: [
                "Alexandra Lourenço",
                "José Carlos Ramalho",
                "Pedro Penteado"
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
              autores: ["Alexandra Lourenço", "Pedro Penteado"]
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
              autores: ["Alexandra Lourenço", "Pedro Penteado"]
            },
            {
              titulo:
                "É necessário alterar o processo de avaliação arquivística?",
              url:
                "http://www.bad.pt/publicacoes/index.php/congressosbad/article/view/341",
              local:
                "11º Congresso da Associação Nacional de Bibliotecários, Arquivistas e Documentalistas (19 Out. 2012)",
              autores: ["Alexandra Lourenço"]
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
                "Alexandra Lourenço",
                "Cecília Henriques",
                "Pedro Penteado"
              ]
            }
          ]
        }
      ]
    };
  }
};
</script>

<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>Documentação Técnica de Apoio</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Documentos Metodológicos</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <p>
                  Para conhecer os princípios teóricos e metodológicos que estão
                  na base da Lista Consolidada, veja os seguintes documentos
                  técnicos:
                </p>
                <ul>
                  <li>
                    <a
                      href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2013/10/egov_interoperabilidade.pdf"
                    >
                      Governo Electrónico e Interoperabilidade: documento
                      metodológico para a elaboração de um esquema de
                      metainformação para a interoperabilidade e de uma
                      macroestrutura funcional</a
                    >
                  </li>
                  <li>
                    <a
                      href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2014/02/2013_Orient-3-niveis_PC-MF.pdf"
                    >
                      Orientações básicas para o desenvolvimento dos 3ºs níveis
                      em planos de classificação conformes à macroestrutura
                      funcional</a
                    >
                  </li>
                  <li>
                    <a
                      href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2016/03/ASIA_Doc-metodologico2016-03-10.pdf"
                    >
                      Avaliação suprainstitucional da Informação arquivística
                      (ASIA): Documento metodológico.</a
                    >
                    Contém, em anexo, as Regras para a criação de termos do
                    índice.
                  </li>
                  <li>Os <a :href="`${publicPath}documentos/mapas-conceptuais.pdf`">Mapas conceptuais</a>
                   contêm informação sobre a subdivisão lógica das Funções
                    (MEF) e o seu desdobramento em processos de negócio (classes de 3º nível). São 
                    a base para o enquadramento conceptual e a codificação de novos processos de negócio
                    na Lista Consolidada.
                  </li>
                </ul>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Manuais</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <ul>
                  <li>Para obter informação específica sobre o processo
                   de elaboração e aplicação dos instrumentos de gestão da informação consulte as 
                   <a href="http://arquivos.dglab.gov.pt/programas-e-projectos/modernizacao-administrativa/macroestrutura-funcional-mef/fichas-tecnicas/">fichas técnicas</a>
                   :
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT1_RADA.pdf">FT1 
                        – Elaboração de relatórios de avaliação de documentação acumulada</a></v-list-item-title>
                        <p>Ficha técnica com o procedimento para a elaboração de relatórios 
                          de avaliação de documentação acumulada e sua submissão ao Órgão de coordenação do 
                          sistema nacional de arquivos</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT2_LC.pdf">FT2 – O que é a Lista Consolidada</a></v-list-item-title>
                        <p>Ficha técnica que explicita a origem, percurso e etapas de elaboração
                           do referencial para a classificação e avaliação da informação pública, 
                           denominado Lista Consolidada</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT3_Novo-PN.pdf">FT3 – 
                        Apresentação de novo processo de negócio para integração na Lista Consolidada</a></v-list-item-title>
                        <p>Ficha técnica com o procedimento para a elaboração de uma proposta 
                          de novo processo de negócio para integração na Lista Consolidada</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT4_Da-LC-a-PGD.pdf">FT4 – 
                        Elaboração de uma Portaria de Gestão de Documentos a partir da Lista Consolidada</a></v-list-item-title>
                        <p>Ficha técnica com o procedimento para a elaboração de uma Portaria de 
                          Gestão de Documentos a partir da Lista Consolidada</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT5_Aplicacao-TS.pdf">FT5 – 
                        Aplicação de uma tabela de seleção</a></v-list-item-title>
                        <p>Ficha técnica com os procedimentos para a aplicação de uma tabela de seleção, 
                          nomeadamente no que diz respeito à classificação (quando aplicável) e ao cumprimento das decisões 
                          de avaliação</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT6_ContagemPrazos_2019-07-25.pdf">FT6 – 
                        Forma de contagem de prazos de conservação administrativa</a></v-list-item-title>
                        <p>Ficha técnica com instruções para a definição da forma de contagem de prazos de 
                          conservação administrativa, no cumprimento de decisões de avaliação da informação arquivística constantes 
                          na Lista Consolidada.</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT7_Agregações_2019-07-25.pdf">FT7 – 
                        Subdivisão de processos de negócio e constituição de agregações</a></v-list-item-title>
                        <p>Ficha técnica com os procedimentos para a subdivisão de classes relativas à informação 
                          produzida no âmbito de processos de negócio (criação de classes de 4.o nível) e para a constituição de 
                          agregações aquando da aplicação do plano de classificação e tabelas de seleção derivadas da Lista Consolidada.</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT8_Aplicação-DF-Dono-Participante_2019-07-25.pdf">FT8 – 
                        Aplicação do destino final: o papel do dono e do participante</a></v-list-item-title>
                        <p>Ficha técnica com os procedimentos para a aplicação do destino final presente em 
                          tabelas de seleção derivadas da Lista Consolidada, de acordo com a intervenção das entidades no 
                          processo de negócio enquanto dono ou participante.</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT9_Eliminacao_2019-08-20.pdf.pdf">FT9 – 
                        Boas práticas de eliminação de documentos</a></v-list-item-title>
                        <p>Ficha técnica com os procedimentos para a implementação de boas práticas 
                          de eliminação de documentos e informação.</p>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title><a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT10_TS_Aplicação-no-tempo_2019-07-25.pdf">FT10 – 
                        Tabelas de seleção: aplicação no tempo</a></v-list-item-title>
                        <p>Ficha técnica referente à aplicação no tempo das decisões de avaliação constantes 
                          na tabelas de seleção de relatórios de avaliação de documentação acumulada e em portarias de gestão de 
                          documentos.</p>
                      </v-list-item-content>
                    </v-list-item>
                  </li>
                  <li>As Orientações para a aplicação de tabela de seleção derivada da Lista Consolidada
                    fornecem um conjunto de diretrizes e exemplos concretos para a utilização de uma 
                    Tabela de Seleção (TS) extraída da Lista Consolidada para a Classificação e 
                    Avaliação da Informação Arquivística (LC).</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      panelHeaderColor: "indigo accent-4",
      publicPath: process.env.BASE_URL
    };
  }
};
</script>

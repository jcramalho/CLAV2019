<template>
    <v-flex xs12 sm5>
        <v-card>
          <v-toolbar :color="panelHeaderColor" dark>
            <v-toolbar-title>O que é a CLAV</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-expansion-panel>
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>É uma Plataforma que visa:</div>
                </template>
                <v-card>
                  <v-card-text>
                    <ul>
                      <li>
                        Disponibilizar a “Lista Consolidada para a classificação
                        e avaliação da informação pública” enquanto instrumento
                        facilitador da elaboração dos planos de classificação e
                        tabelas de seleção da Administração Pública, de empresas
                        públicas e de outras entidades;
                      </li>
                      <li>
                        Possibilitar a submissão de propostas ou atualizações de
                        planos de classificação e tabelas de seleção;
                      </li>
                      <li>
                        Desmaterializar os procedimentos de controlo da
                        eliminação da informação arquivística através da recolha
                        e análise de autos de eliminação;
                      </li>
                      <li>
                        Disponibilizar ferramentas para a elaboração e submissão
                        de planos de preservação digital e planos de
                        substituição de suporte.
                      </li>
                    </ul>
                    <p>
                      As funcionalidades disponibilizadas em julho de 2018 são
                      as seguintes:
                    </p>
                    <ul>
                      <li>
                        Consulta da Lista Consolidada – Processos de Negócio;
                      </li>
                      <li>Consulta de Entidades;</li>
                      <li>Consulta de Legislação;</li>
                      <li>
                        Consulta de Termos de Índice (associados a cada Processo
                        de Negócio);
                      </li>
                      <li>
                        Disponibilização de links para Documentação Técnica de
                        Apoio;
                      </li>
                      <li>
                        Disponibilização de Notícias relevantes relacionadas com
                        a classificação e avaliação da informação arquivística.
                      </li>
                    </ul>
                    <p>Em breve, estarão acessíveis novas funcionalidades.</p>
                    <p>
                      A Plataforma CLAV tem o apoio do Sistema de Apoios à
                      Modernização Administrativa (SAMA). A sua disponibilização
                      visa também o cumprimento da Medida 51 do Simplex + 2016 e
                      da Medida 107 do Simplex + 2017.
                    </p>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
      </v-flex>
</template>

<script>
export default {
    data() {
        return {
            panelHeaderColor: "indigo accent-4"
        }
    }
}
</script>

<template>
  <v-container fluid grid-list-lg>
  <v-layout row wrap justify-center>
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
                                    <li>Disponibilizar a “Lista Consolidada para a classificação e avaliação da informação pública” enquanto instrumento facilitador da elaboração dos planos de classificação e tabelas de seleção da Administração Pública, de empresas públicas e de outras entidades;</li>
                                    <li>Possibilitar a submissão de propostas ou atualizações de planos de classificação e tabelas de seleção;</li>
                                    <li>Desmaterializar os procedimentos de controlo da eliminação da informação arquivística através da recolha e análise de autos de eliminação;</li>
                                    <li>Disponibilizar ferramentas para a elaboração e submissão de planos de preservação digital e planos de substituição de suporte.</li>
                                </ul>
                                <p>As funcionalidades disponibilizadas em julho de 2018 são as seguintes:</p>
                                <ul>
                                    <li>Consulta da Lista Consolidada – Processos de Negócio;</li>
                                    <li>Consulta de Entidades;</li>
                                    <li>Consulta de Legislação;</li>
                                    <li>Consulta de Termos de Índice (associados a cada Processo de Negócio);</li>
                                    <li>Disponibilização de links para Documentação Técnica de Apoio;</li>
                                    <li>Disponibilização de Notícias relevantes relacionadas com a classificação e avaliação da informação arquivística.</li>
                                </ul>
                                <p>Em breve, estarão acessíveis novas funcionalidades.</p>
                                <p>A Plataforma CLAV tem o apoio do Sistema de Apoios à Modernização Administrativa (SAMA). A sua disponibilização visa também o cumprimento da Medida 51 do Simplex + 2016 e da Medida 107 do Simplex + 2017.</p>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
            </v-expansion-panel>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 sm5>
        <v-card>
            <v-toolbar :color="panelHeaderColor" dark>
                <v-toolbar-title>Documentação Técnica de Apoio</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-expansion-panel>
                    <v-expansion-panel-content>
                        <template v-slot:header>
                            <div>Documentos Metodológicos</div>
                        </template>
                        <v-card>
                            <v-card-text>
                                <p>Para conhecer os princípios teóricos e metodológicos que estão na base da Lista Consolidada, veja os seguintes documentos técnicos:</p>
                                <ul>
                                    <li> 
                                        <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2013/10/egov_interoperabilidade.pdf"> Governo Electrónico e Interoperabilidade: documento metodológico para a elaboração de um esquema de metainformação para a interoperabilidade e de uma macroestrutura funcional</a>
                                    </li>
                                    <li> 
                                        <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2014/02/2013_Orient-3-niveis_PC-MF.pdf"> Orientações básicas para o desenvolvimento dos 3ºs níveis em planos de classificação conformes à macroestrutura funcional</a>
                                    </li>
                                    <li> 
                                        <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2016/03/ASIA_Doc-metodologico2016-03-10.pdf"> Avaliação suprainstitucional da Informação arquivística (ASIA): Documento metodológico.</a>
                                        Contém, em anexo, as Regras para a criação de termos do índice.
                                    </li>
                                </ul>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap justify-center>
    <v-flex xs12 sm5>
        <v-card>
            <v-toolbar :color="panelHeaderColor" dark>
                <v-toolbar-title>Operações</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-expansion-panel>
                    <v-expansion-panel-content v-for="(item,i) in operacoes" :key="i">
                        <template v-slot:header>
                            <div>{{ item.entidade }}</div>
                        </template>
                        <v-card>
                            <v-card-text>
                                <p>{{ item.texto }}</p>
                                <div>
                                    <v-btn color="deep-purple darken-3" dark v-for="o in item.ops" @click="go(o.url);">
                                        {{ o.label }}
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card-text>
        </v-card>
    </v-flex>
    
    <v-flex xs12 sm5>
        <v-card>
            <v-toolbar :color="panelHeaderColor" dark>
                <v-toolbar-title>Entidades</v-toolbar-title>
            </v-toolbar>

            <v-list two-line>
                <template>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>Identificação de Representantes</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>Área de Trabalho</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
export default {
    methods: {
        go: function(url){
            this.$router.push(url);
        }
    },
    data () {
      return {
        panelHeaderColor: "indigo accent-4",
        operacoes: [
            {
                entidade: "Lista Consolidada",
                texto: 'Estrutura de classes da “Lista Consolidada para a classificação e avaliação da informação pública” que atualmente se encontra disponível. Inclui os níveis referentes aos processos de negócio da Administração Pública.',
                ops: [
                    {
                        label: "Consultar",
                        url: "/classes"
                    }
                ]
            },
            {
                entidade: "Tabelas de Seleção",
                texto: 'Lista das Tabelas de seleção conformes à Lista Consolidada que se encontram aprovadas.',
                ops: [
                    {
                        label: "Consultar",
                        url: "/ts"
                    },
                    {
                        label: "Criar",
                        url: "/ts/criar"
                    }
                ]
            },
            {
                entidade: "Entidades",
                texto: 'Lista das entidades que estão envolvidas nos processos de negócio da Administração Pública e que foram identificadas até ao momento. Em atualização constante.',
                ops: [
                    {
                        label: "Consultar",
                        url: "/entidades"
                    },
                    {
                        label: "Adicionar",
                        url: "/entidades/criar"
                    }
                ]
            },
            {
                entidade: "Tipologias de Entidades",
                texto: 'Lista de tipologias de entidades que estão envolvidas nos processos de negócio da Administração Pública e que foram identificadas até ao momento. Em atualização constante.',
                ops: [
                    {
                        label: "Consultar",
                        url: "/tipologias"
                    },
                    {
                        label: "Adicionar",
                        url: "/tipologias/criar"
                    }
                ]
            },
            {
                entidade: "Legislação",
                texto: 'Lista da legislação que enquadra os processos de negócio da Administração Pública e que foi identificada até ao momento. Em atualização constante.',
                ops: [
                    {
                        label: "Consultar",
                        url: "/legislacao"
                    },
                    {
                        label: "Adicionar",
                        url: "/legislacao/criar"
                    }
                ]
            },
            {
                entidade: "Pedidos",
                texto: 'Pedidos de alteração ou de criação de novas instâncias que deram entrada na plataforma.',
                ops: [
                    {
                        label: "Consultar",
                        url: "/pedidos"
                    }
                ]
            }
        ]
      }
    }
}
</script>


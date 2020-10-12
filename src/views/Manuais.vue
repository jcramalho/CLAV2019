<template>
<v-content class="px-12">
    <p class="content-title-1">Manuais</p>
    <p class="content-text px-8 py-2">
        Para obter informação específica sobre o processo de elaboração e
        aplicação dos instrumentos de gestão da informação consulte as
        <a href="http://arquivos.dglab.gov.pt/programas-e-projectos/modernizacao-administrativa/macroestrutura-funcional-mef/fichas-tecnicas/">
            fichas técnicas
        </a>
        :
    </p>
    <v-container fluid class="ma-0 px-12">
        <ul class="px-9 pt-3">
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT1_RADA.pdf">
                    Orientações para a aplicação de tabela de seleção derivada da Lista Consolidada:
                </a>
                <br />
                As Orientações para a aplicação de tabela de seleção derivada da Lista
                Consolidada fornecem um conjunto de diretrizes e exemplos concretos para
                a utilização de uma Tabela de Seleção (TS) extraída da Lista Consolidada
                para a Classificação e Avaliação da Informação Arquivística (LC).
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT1_RADA.pdf">
                    FT1 – Elaboração de relatórios de avaliação de documentação
                    acumulada
                </a>
                <br />
                Ficha técnica com o procedimento para a elaboração de relatórios de
                avaliação de documentação acumulada e sua submissão ao Órgão de
                coordenação do sistema nacional de arquivos;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT2_LC.pdf">
                    FT2 – O que é a Lista Consolidada
                </a>
                <br />
                Ficha técnica que explicita a origem, percurso e etapas de elaboração
                do referencial para a classificação e avaliação da informação pública,
                denominado Lista Consolidada;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT3_Novo-PN.pdf">
                    FT3 – Apresentação de novo processo de negócio para integração na
                    Lista Consolidada
                </a>
                <br />
                Ficha técnica com o procedimento para a elaboração de uma proposta de
                novo processo de negócio para integração na Lista Consolidada;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT4_Da-LC-a-PGD.pdf">
                    FT4 – Elaboração de uma Portaria de Gestão de Documentos a partir da
                    Lista Consolidada
                </a>
                <br />
                Ficha técnica com o procedimento para a elaboração de uma Portaria de
                Gestão de Documentos a partir da Lista Consolidada;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2017/08/FT5_Aplicacao-TS.pdf">
                    FT5 – Aplicação de uma tabela de seleção
                </a>
                <br />
                Ficha técnica com os procedimentos para a aplicação de uma tabela de
                seleção, nomeadamente no que diz respeito à classificação (quando
                aplicável) e ao cumprimento das decisões de avaliação;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT6_ContagemPrazos_2019-07-25.pdf">
                    FT6 – Forma de contagem de prazos de conservação administrativa
                </a>
                <br />
                Ficha técnica com instruções para a definição da forma de contagem de
                prazos de conservação administrativa, no cumprimento de decisões de
                avaliação da informação arquivística constantes na Lista Consolidada;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT7_Agregações_2019-07-25.pdf">
                    FT7 – Subdivisão de processos de negócio e constituição de
                    agregações
                </a>
                <br />
                Ficha técnica com os procedimentos para a subdivisão de classes
                relativas À informação produzida no âmbito de processos de negócio
                (criação de classes de 4.o nível) e para a constituição de agregações
                aquando da aplicação do plano de classificação e tabelas de seleção
                derivadas da Lista Consolidada;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT8_Aplicação-DF-Dono-Participante_2019-07-25.pdf">
                    FT8 – Aplicação do destino final: o papel do dono e do participante
                </a>
                <br />
                Ficha técnica com os procedimentos para a aplicação do destino final
                presente em tabelas de seleção derivadas da Lista Consolidada, de
                acordo com a intervenção das entidades no processo de negócio enquanto
                dono ou participante;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT9_Eliminacao_2019-08-20.pdf.pdf">
                    FT9 – Boas práticas de eliminação de documentos
                </a>
                <br />
                Ficha técnica com os procedimentos para a implementação de boas
                práticas de eliminação de documentos e informação;
            </li>
            <li>
                <a href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2019/08/FT10_TS_Aplicação-no-tempo_2019-07-25.pdf">
                    FT10 – Tabelas de seleção: aplicação no tempo
                </a>
                <br />
                Ficha técnica referente à aplicação no tempo das decisões de avaliação
                constantes na tabelas de seleção de relatórios de avaliação de
                documentação acumulada e em portarias de gestão de documentos;
            </li>
        </ul>
    </v-container>
</v-content>
</template>

<script>
export default {
    name: "Manuais",
    data() {
        return {
            publicPath: process.env.BASE_URL
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

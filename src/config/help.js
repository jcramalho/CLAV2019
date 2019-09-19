module.exports.help = {
  ListaConsolidada:
    "Estrutura hierárquica de classes que representam as funções (classes de 1º nível)," +
    "as subfunções (2º nível) e os processos de negócio (3º e 4º nível) executados pela" +
    " Administração Pública. \nA Lista Consolidada é o referencial disponibilizado pela " +
    "Direção-Geral do Livro, dos Arquivos e das Bibliotecas (DGLAB) para a produção de " +
    "planos de classificação e de Tabelas de Seleção. ",
  TabelasSelecao:
    "Tabelas de seleção submetidas pelas entidades e aprovadas pela Direção-Geral do Livro, " +
    "dos Arquivos e das Bibliotecas (DGLAB), conformes à Lista Consolidada.",
  Entidades:
    "Entidades públicas que intervêm nos processos de negócio (classes de 3º nível) da " +
    "Lista Consolidada. Podem integrar uma ou mais tipologias de entidades.",
  TipologiasIntro:
    "Forma de agrupamento de entidades que intervêm nos processos de negócio " +
    "(classes de 3º nível) da Lista Consolidada. ",
  LegislacaoIntro:
    "Legislação que regula os processos de negócio e enquadra os respetivos prazos " +
    "de conservação administrativa (PCA) e destino final (DF).",
  TermosIndice:
    "Termos que detalham o âmbito de aplicação dos processos de negócio e apoiam a recuperação da informação.",
  VocabulariosControlados:
    "Gestão dos Vocabulários Controlados utilizados na aplicação.",
  AutosEliminacao:
    "Autos de eliminação produzidos ao abrigo de tabela de seleção inserida em Portaria de gestão de documentos ou Relatório de avaliação de documentação acumulada e submetida à DGLAB para verificação de conformidade.",
  Invariantes:
    "Conjunto de invariantes que testam situações de erro e identificam os PNs onde estas ocorrem.",
  Classe: {
    BlocoDescritivo:
      "Conjunto de campos que descrevem a classe. Aplica-se às classes de 1º, 2º, 3º e 4º nível.",
    BlocoContexto:
      "Conjunto de campos com informação sobre os intervenientes, os PN relacionados e legislação" +
      " e que tem por objetivo enquadrar as decisões de avaliação. Aplica-se às classes de 3º nível.",
    BlocoDecisoes:
      "Conjunto de campos que contem as decisões de avaliação, isto é, o prazo de conservação " +
      "administrativo (PCA), a sua forma de contagem, o destino final (DF) e as respetivas " +
      "justificações. Aplica-se às classes de 3º e 4º nível. ",
    Campos: {
      Estado:
        "Indicação do estado de atividade da classe:  ativo ou inativo.  Aplica-se às classes de 1º, 2º, 3º e 4º nível.",
      Pai:
        "Classe que se encontra imediatamente acima,  com indicação do respetivo código e  título. Aplica-se às classes de 2º, 3º e 4º nível.",
      Descendencia:
        "Classe que se encontra imediatamente abaixo,  com indicação do respetivo código e título. Aplica-se às classes de 1º, 2º e 3º nível.",
      Codigo:
        "Sistema numérico que identifica univocamente a classe. Aplica-se às classes de 1º, 2º, 3º e 4º nível.",
      Titulo:
        "Designação da classe. Aplica-se às classes de 1º, 2º, 3º e 4º nível.",
      Descricao:
        "Informação descritiva do âmbito da classe. Aplica-se às classes de 1º, 2º, 3º e 4º nível.",
      NotasAp:
        "Informação que especifica o âmbito de aplicação da classe. Aplica-se às classes de 1º, 2º e 3º nível.",
      ExemplosNotasAp:
        "Informação que exemplifica o âmbito de aplicação da classe. Aplica-se às classes de 1º, 2º e 3º  nível.",
      NotasEx:
        "Informação remissiva para outras classes com conteúdos similares ou sequenciais, auxilia a delimitar a aplicação da classe. Aplica-se às classes de 1º, 2º e 3º nível.",
      TermosIndice:
        "Termos que detalham o âmbito de aplicação dos processos de negócio e apoiam a recuperação da informação. Aplica-se às classes de 3º ou 4º nível.",
      TipoProcesso:
        "Indicação do tipo de processo: processo comum  (ocorre em qualquer entidade pública) ou específico (só ocorre em algumas entidades). Aplica-se  às classes de 3º nível.",
      ProcessoTransversal:
        "Indicação do tipo de processo: processo comum  (ocorre em qualquer entidade pública) ou específico (só ocorre em algumas entidades). Aplica-se  às classes de 3º nível.",
      Donos:
        "Nome da(s) entidade(s) responsável(eis) pela condução  do processo de negócio, pelo respetivo produto final e pela guarda do produto final. Aplica-se às classes de 3º nível.",
      Participantes:
        "<p>Nome da(s) entidade(s) que participam e contribuem para o produto final, não sendo responsáveis " +
        "pela condução do processo de negócio. Aplica-se às classes de 3º nível.</p>\n<p>Os tipos de " +
        "participação num processo de negócio são os seguintes:<dl>\n<dt>Apreciar:</dt><dd> intervenção no âmbito " +
        "da emissão de opinião (parecer, proposta, entre outros). Pode revestir caráter vinculativo.<dd>" +
        "\n<dt>Assessorar:</dt><dd>  intervenção de apoio pontual ou global. Inclui as ações de assessoria, de " +
        "consultoria, entre outras.<dd> \n<dt>Comunicar:</dt><dd> intervenção para a comunicação, notificação da ação " +
        "ou produto.<dd> \n<dt>Decidir:</dt><dd> intervenção deliberativa, individual ou coletiva, imediata ou decorrente " +
        "de conjugação de intenções ou votação. Inclui ações de direção, coordenação, entre outras.<dd>" +
        "\n<dt>Executar:</dt><dd> intervenção para a realização da ação. Pode ser uma execução global ou parcial.<dd>" +
        "\n<dt>Iniciar:</dt><dd> intervenção que tem por objetivo desencadear a ação mas não implica a responsabilidade" +
        " pela sua execução.<dd></dl></p>",
      ProcessosRelacionados:
        "<p>Processos que se relacionam com o processo descrito, com indicação do código e respetivo " +
        "título e do tipo de relação. Aplica-se às classes de 3º nível.</p>" +
        "\n<p>Os tipos de relação entre processos de negócio são os seguintes:<dl>" +
        "\n<dt>Antecessor de:</dt><dd> quando o output de um PN é o input de outro PN. O PN descrito é,  por conseguinte, " +
        "o antecessor ou o output para o PN aqui selecionado.<dd>" +
        "\n<dt>Sucessor de:</dt><dd> quando o output de um PN é o input de outro PN. O PN descrito é,  por conseguinte, " +
        "o sucessor ou o intput para o PN aqui selecionado.<dd>" +
        "\n<dt>Complementar de:</dt><dd> quando dois PN decorrem de forma paralela, adicionando informação complementar " +
        "um ao outro, mas nunca se tocam.<dd>" +
        "\n<dt>Cruzado com:</dt><dd> quando existe interseção de dois PN em determinado momento, seguindo " +
        "percursos distintos.<dd>" +
        "\n<dt>Síntese de:</dt><dd> quando um PN (ou uma etapa de um PN) condensa a informação de outro (ou uma etapa de " +
        "outro PN). O PN descrito é, por conseguinte, uma síntese do PN aqui selecionado.<dd>" +
        "\n<dt>Sintetizado por:</dt><dd> quando um PN (ou uma etapa de um PN) condensa a informação de outro (ou uma etapa " +
        "de outro PN). O PN descrito é, por conseguinte, sintetizado pelo PN aqui selecionado.<dd>" +
        "\n<dt>Suplemento de:</dt><dd> quando um PN recolha e analisa informação contida noutros PN, cotejando-os entre si, " +
        "mas não lhes adicionando conteúdo informativo. O PN descrito é um suplemento do PN aqui selecionado, " +
        "isto é, o primeiro recolhe e analisa informação existente no segundo.<dd>" +
        "\n<dt>Suplemento para:</dt><dd> quando um PN recolha e analisa informação contida noutros PN, cotejando-os entre si, " +
        "mas não lhes adicionando conteúdo informativo. O PN descrito é um suplemento para o PN aqui selecionado, " +
        "isto é, contém informação que o segundo vai necessitar de recolher e analisar.<dd></dl></p>",
      Legislacao:
        "Legislação que regula os processos de negócio e enquadra os respetivos prazos de conservação administrativa " +
        "(PCA) e destino final (DF). Aplica-se às classes de 3º e 4º nível.",
      Prazo:
        "Prazo de conservação administrativa (PCA), período de tempo, registado em anos, durante o qual a informação " +
        "/ documentação tem de ser conservada. Aplica-se às classes de 3º ou 4º nível.",
      FormaContagem:
        "<p>Instrução relativa à ação / momento que origina a contagem do prazo. Aplica-se às classes de 3º " +
        "ou 4º nível.</p>" +
        "\n<p>As formas de contagem do prazo, antecedidas do respetivo código, são as seguintes:<dl>" +
        "\n<dt>F01 - Conforme disposição legal:</dt><dd>  o momento em que se inicia a contagem é " +
        "determinado por lei.</dd>" +
        "\n<dt>F02 - Data de início do procedimento:</dt><dd> o momento em que se inicia a contagem é " +
        "determinado pela " +
        "abertura da agregação ou de produção do primeiro ato do procedimento.</dd>" +
        "\n<dt>F03 – Data de emissão do título:</dt><dd> o momento em que se inicia a contagem é determinado pela " +
        "produção do documento de validação ou reconhecimento.</dd>" +
        "\n<dt>F04 – Data de conclusão do procedimento:</dt><dd> o momento em que se inicia a contagem é determinado " +
        "pelo encerramento da agregação ou de produção do documento / informação relativo à última ação " +
        "ou último ato do procedimento.</dd>" +
        "\n<dt>F05 – Data de cessação da vigência:</dt><dd> o momento em que se inicia a contagem é determinado pelo " +
        "término da produção de efeitos do procedimento. Este término pode ocorrer por caducidade, " +
        "revogação, cancelamento, extinção ou decisão contenciosa.</dd>" +
        "\n<dt>F06 – Data de extinção da entidade sobre que recai o procedimento:</dt><dd> o momento em que se inicia a " +
        "contagem é determinado pelo registo do fim da entidade. Aplica-se a pessoas (momento do óbito), " +
        "empresas, bens e atividades.</dd>" +
        "\n<dt>F07 – Data de extinção do direito sobre o bem:</dt><dd> o momento em que se inicia a contagem é determinado " +
        "pelo cessamento do direito sobre o bem, A extinção do direito sobre o bem pode acontecer por alienação " +
        "(transmissão ou transação), por abate ou desaparecimento do bem, pela venda de imóveis, pela cessação da " +
        "afetação, da reserva de uso, do direito de superfície, do arrendamento ou cedência.</dd>" +
        "</dl></p>",
      SubformaContagem:
        "Informação complementar da forma de contagem do prazo  Conforme disposição legal (F01) " +
        "referente às datas ou à ação que determina o momento a partir do qual é iniciada a contagem do " +
        "prazo de conservação administrativa fixado na tabela. Aplica-se às classes de 3º ou 4º nível.",
      JustificacaoPCA:
        "<p>Indicação dos critérios que fundamentam o prazo de conservação administrativa (PCA). " +
        "Aplica-se às classes de 3º ou 4º nível.</p>" +
        "\n<p>Os critérios podem ser:<dl>" +
        "\n<dt>Critério de utilidade administrativa:</dt><dd> critério que advém da relação suplementar entre PN " +
        "sendo necessário guardar o tempo necessário para dar sequência ao PN com o qual está relacionado.</dd>" +
        "\n<dt>Critério legal:</dt><dd> critério que advém da existência de diploma(s) legal(ais).</dd>" +
        "\n<dt>Critério gestionário:</dt><dd> critério que advém do prazo para imputação de responsabilidade pela " +
        "gestão estratégica, decorrente de escrutínio público (eleições) ou da não recondução no mandato.</dd></dl></p>",
      DF:
        "Indicação do destino final (DF) da informação / documentação, depois de cumprido o prazo de conservação " +
        "administrativo, podendo ser: Conservação (C), Conservação parcial (CP), Eliminação  (E) e Não especificado " +
        "(NE). Aplica-se às classes de 3º ou 4º nível.",
      JustificacaoDF:
        "<p>Indicação dos critérios que fundamentam o destino final (DF). Aplica-se às classes de 3º ou 4º " +
        "nível.</p>" +
        "\n<p>Os critérios podem ser:<dl>" +
        "\n<dt>Critério de densidade informacional:</dt><dd> critério que advém da relação de síntese entre PN, " +
        "conservando-se a síntese e eliminando-se a restante informação.</dd>" +
        "\n<dt>Critério da complementaridade informacional:</dt><dd> critério que advém da relação complementar entre " +
        "PN, valorizando-se a conservação da informação dos dois PN.</dd>" +
        "\n<dt>Critério legal:</dt><dd> critério que advém " +
        "da existência de diploma(s) legal(ais).</dd></dl></p>"
    }
  },
  Entidade: {
    Campos: {
      Sigla: "Sigla da entidade.",
      Estado:
        "Indicação do estado da entidade: em atividade (ativa) ou extinta (inativa).",
      Internacional: "Indicação do caráter internacional da entidade.",
      DataCriacao: "Data de criação da entidade.",
      DataExtincao: "Data de extinção da entidade.",
      Tipologias: "Indicação das tipologias de entidade a que pertence."
    },
    Intervencoes: {
      Dono: "Processos de negócio em que a entidade intervém como dono.",
      Participante:
        "<p>Processos de negócio em que a entidade intervém como participante e respetivo tipo de " +
        "participação.</p>" +
        "\n<p>O dono do processo de negócio é a entidade responsável pela sua condução, pelo respetivo " +
        "produto final e pela guarda do produto final.</p>" +
        "\n<p>O participante do processos de negócio é a entidade que participa e contribui para o produto final, não sendo " +
        "responsável pela sua condução.</p>" +
        "\n<p>Os tipos de participação num processo de negócio são os seguintes:\n" +
        "<dl><dt>Apreciar:</dt><dd> intervenção no âmbito da emissão de opinião (parecer, proposta, entre outros). " +
        "Pode revestir caráter vinculativo.<dd>\n" +
        "<dt>Assessorar:</dt><dd> intervenção de apoio pontual ou global. Inclui asa ações de assessoria, de consultoria, " +
        "entre outras.</dd>\n" +
        "<dt>Comunicar:</dt><dd> intervenção para a comunicação, notificação da ação ou produto.</dd>\n" +
        "<dt>Decidir:</dt><dd> intervenção deliberativa, individual ou coletiva, imediata ou decorrente " +
        "de conjugação de intenções ou votação. Inclui ações de direção, coordenação, entre outras.</dd>\n" +
        "<dt>Executar:</dt><dd> intervenção para a realização da ação. Pode ser uma execução global ou " +
        "parcial.</dd>\n" +
        "<dt>Iniciar:</dt><dd> intervenção que tem por objetivo desencadear a ação mas não implica a " +
        "responsabilidade pela sua execução." +
        "</dd></dl></p>"
    },
    Relacoes: {
      Antecessora: "Designação da entidade antecessora.",
      Sucessora: "Designação da entidade sucessora.",
      IntegraCompetenciasDe:
        "Designação da(s) entidade(s) antecessora(s) de que provêm as competências integradas.",
      CompetenciasIntegradasEm:
        "Designação da(s) entidade(s) sucessora(s) que integrou(ram) competências da entidade referida."
    }
  },
  Tipologias: {
    Campos: {
      Sigla: "Sigla da tipologia de entidade.",
      Nome: "Designação da tipologia de entidade",
      Entidades: "Nome das entidades que fazem parte da tipologia de entidade."
    },
    Intervencoes: {
      Dono:
        "Processos de negócio em que a tipologia de entidade intervém como dono.",
      Participante:
        "<p>Processos de negócio em que a tipologia de entidade intervém como participante e respetivo tipo " +
        "de participação.</p>\n" +
        "<p>Os tipos de participação num processo de negócio são os seguintes:<dl>\n" +
        "<dt>Apreciar:</dt><dd> intervenção no âmbito da emissão de opinião (parecer, proposta, entre " +
        "outros). Pode revestir caráter vinculativo.</dd>\n" +
        "<dt>Assessorar:</dt><dd>  intervenção de apoio pontual ou global. Inclui asa ações de assessoria, " +
        "de consultoria, entre outras.</dd>\n" +
        "<dt>Comunicar:</dt><dd> intervenção para a comunicação, notificação da ação ou produto.</dd>\n" +
        "<dt>Decidir:</dt><dd> intervenção deliberativa, individual ou coletiva, imediata ou decorrente " +
        "de conjugação de intenções ou votação. Inclui ações de direção, coordenação, entre outras.</dd>\n" +
        "<dt>Executar:</dt><dd> intervenção para a realização da ação. Pode ser uma execução global ou " +
        "parcial.</dd>\n" +
        "<dt>Iniciar:</dt><dd> intervenção que tem por objetivo desencadear a ação mas não implica a " +
        "responsabilidade pela sua execução.</dd>\n" +
        "</dl></p>"
    }
  },
  Legislacao: {
    Campos: {
      Numero: "Número de diploma.",
      Tipo: "Tipo de diploma.",
      Data: "Data de publicação do diploma.",
      Sumário: "Sumário do diploma.",
      Entidades: "Entidade(s) responsável pela publicação.",
      ProcessosRegulados:
        "Processos de negócio que são regulados ou enquadrados pelo diploma."
    },
    Relacoes: {
      Altera: "Referência ao(s) diploma(s) que altera.",
      Revoga: "Referência ao(s) diploma(s) que revoga.",
      AlteradoPor:
        "Referência ao(s) diploma(s )que altera(m) o diploma referenciado.",
      RevogadoPor:
        "Referência ao(s) diploma(s) que altera(m) o diploma referenciado."
    }
  }
};

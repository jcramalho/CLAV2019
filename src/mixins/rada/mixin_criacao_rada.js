export default {
  data: () => ({
    alert_guardar: false,
    user_entidade: null,
    loading_circle_ts: false,
    erroProdutoras: [],
    toDelete: false,
    toSave: false,
    dialogRADAPendente: false,
    mensagemPedidoCriadoOK: "",
    dialogRADACriado: false,
    entidades: [],
    tipologias: [],
    legislacao: [],
    legislacaoProcessada: [],
    entidadesProcessadas: [],
    e1: 1,
    userEmail: "",
    guardar: false,
    despacho: "",
    pedidos_novas_entidades: [],
    datas_extremas_classes: [],
    erros_relacoes: []
  }),
  methods: {
    changeE1(e) {
      this.e1 = e;
    },
    calcular_dimensao_suporte(series) {
      this.RADA.RE.dimSuporte.nSeries = series.length;
      this.RADA.RE.dimSuporte.nSubseries = this.RADA.tsRada.classes.filter(
        e => e.tipo == "Subsérie"
      ).length;
      // adicionar ids às UIs
      this.RADA.RE.dimSuporte.nUI = this.RADA.tsRada.UIs.map(ui => {
        ui["id"] = "rada_" + this.RADA.id + "_ui_" + ui.codigo;
        return ui;
      }).length;
      this.RADA.RE.dimSuporte.medicaoUI_papel = series
        .filter(e => e.suporte == "Papel")
        .reduce((acc, a) => {
          return acc + Number(a.medicao);
        }, 0);
      this.RADA.RE.dimSuporte.medicaoUI_digital = series
        .filter(
          e =>
            e.suporte == "Eletrónico Digitalizado" ||
            e.suporte == "Eletrónico Nativo"
        )
        .reduce((acc, a) => {
          return acc + Number(a.medicao);
        }, 0);

      this.RADA.RE.dimSuporte.medicaoUI_outros = series
        .filter(e => e.suporte == "Outro")
        .reduce((acc, a) => {
          return acc + Number(a.medicao);
        }, 0);
    },
    // Fazer pedidos para as entidades
    async fazer_pedidos_entidades(series) {
      //  filtrar as novas entidaaddes criadas e que estão associadas a classes ou UIs
      let entidades = this.entidades.filter(
        e =>
          e.estado == "Nova" &&
          (series.some(cl =>
            cl.entProdutoras.some(ent => ent == e.sigla + " - " + e.designacao)
          ) ||
            this.RADA.tsRada.UIs.some(ui =>
              ui.produtor.entProdutoras.some(
                ent => ent == e.sigla + " - " + e.designacao
              )
            ))
      );

      for (let i = 0; i < entidades.length; i++) {
        let pedidoEntidades = {
          tipoPedido: "Criação",
          tipoObjeto: "Entidade",
          novoObjeto: {
            estado: "Ativa",
            designacao: entidades[i].designacao,
            internacional: entidades[i].internacional,
            sigla: entidades[i].sigla,
            sioe: entidades[i].sioe,
            tipologiasSel: entidades[i].tipologiasSel.map(tipologia => {
              let tip = tipologia.split(" - ");
              return {
                sigla: tip[0],
                designacao: tip[1],
                id: "tip_" + tip[0]
              };
            }),
            dataCriacao: entidades[i].dataCriacao,
            codigo: ""
          },
          user: {
            email: this.userEmail
          },
          token: this.$store.state.token,
          criadoPor: this.userEmail,
          entidade: this.user_entidade
        };

        let response = await this.$request("post", "/pedidos", pedidoEntidades);

        this.despacho =
          this.despacho +
          "[" +
          response.data +
          "] " +
          entidades[i].sigla +
          " - " +
          entidades[i].designacao +
          " (entidade);\n";

        this.pedidos_novas_entidades.push({
          codigo: response.data,
          id: "ent_" + entidades[i].sigla
        });
      }
    },
    removerDecisoesAvaliacao(series) {
      for (let i = 0; i < series.length; i++) {
        if (
          this.RADA.tsRada.classes.some(e => e.eFilhoDe == series[i].codigo)
        ) {
          delete series[i].pca;
          delete series[i].notaPCA;
          delete series[i].notaDF;
          delete series[i].formaContagem;
          delete series[i].justificacaoPCA;
          delete series[i].df;
          delete series[i].justificacaoDF;
        }
      }
    },
    async fazer_pedidos_legislacao(series) {
      let despacho = "";

      let legislacao = this.legislacao
        .filter(
          e =>
            e.estado == "Nova" &&
            series.some(cl =>
              cl.legislacao.some(
                legis =>
                  legis.legislacao ==
                  e.tipo + " " + e.numero + " - " + e.sumario
              )
            )
        )
        .map(leg => {
          leg["codigo"] = "";
          leg["diplomaFonte"] = "RADA";
          leg["estado"] = "Ativo";
          leg["processosSel"] = [];
          if (leg.link == null) {
            leg["link"] = "";
          }
          // Adicionar série à qual está relacionada;
          leg["processosSel"] = series
            .filter(cl =>
              cl.legislacao.some(
                legis =>
                  legis.legislacao ==
                  leg.tipo + " " + leg.numero + " - " + leg.sumario
              )
            )
            .map(cl => {
              return {
                codigo: cl.codigo,
                titulo: cl.titulo,
                id: cl.id
              };
            });
          // Adicionar entidades relacionadas com a criação legislação
          leg["entidadesSel"] = this.RADA.entRes.map(entidade => {
            let ent = entidade.split(" - ");

            let nova_entidade = this.pedidos_novas_entidades.find(
              e => e.id == "ent_" + ent[0]
            );

            if (nova_entidade != undefined) {
              despacho =
                despacho +
                "[" +
                nova_entidade.codigo +
                "] " +
                ent[0] +
                " - " +
                ent[1] +
                " (entidade);\n";
            }

            return {
              designacao: ent[1],
              sigla: ent[0],
              id: "ent_" + ent[0]
            };
          });

          return leg;
        });

      for (let i = 0; i < legislacao.length; i++) {
        let pedidoLegis = {
          tipoPedido: "Criação",
          tipoObjeto: "Legislação",
          novoObjeto: legislacao[i],
          user: {
            email: this.userEmail
          },
          token: this.$store.state.token,
          criadoPor: this.userEmail,
          entidade: this.user_entidade,
          despacho: !!despacho
            ? "Submissão inicial. Este pedido está dependente da aprovação dos seguintes pedidos:\n" +
              despacho
            : "Submissão inicial"
        };

        let response = await this.$request("post", "/pedidos", pedidoLegis);

        this.despacho =
          this.despacho +
          "[" +
          response.data +
          "] " +
          legislacao[i].tipo +
          " - " +
          legislacao[i].numero +
          " (legislação);\n";
      }
    },
    descobrir_datas_extremas(series_subseries) {
      for (let i = 0; i < series_subseries.length; i++) {
        let data_inicial = null;
        let data_final = null;

        if (
          !!series_subseries[i].dataInicial &&
          !!series_subseries[i].dataFinal
        ) {
          data_inicial = new Date(series_subseries[i].dataInicial);
          data_final = new Date(series_subseries[i].dataFinal);
        } else {
          let ui = this.RADA.tsRada.UIs.find(
            e => e.codigo == series_subseries[i].UIs[0]
          );

          data_inicial = new Date(ui.dataInicial);
          data_final = new Date(ui.dataFinal);

          for (let z = 1; z < series_subseries[i].UIs.length; z++) {
            ui = this.RADA.tsRada.UIs.find(
              e => e.codigo == series_subseries[i].UIs[z]
            );

            let aux_data_inicial = new Date(ui.dataInicial);
            let aux_data_final = new Date(ui.dataFinal);

            if (aux_data_inicial < data_inicial) {
              data_inicial = aux_data_inicial;
            }

            if (aux_data_final > data_final) {
              data_final = aux_data_final;
            }
          }
        }

        this.datas_extremas_classes.push({
          codigo: series_subseries[i].codigo,
          dataInicial: data_inicial,
          dataFinal: data_final
        });
      }
    },
    validar_relacoes(series_subseries) {
      this.erros_relacoes = [];

      for (let i = 0; i < series_subseries.length; i++) {
        for (let j = 0; j < series_subseries[i].relacoes.length; j++) {
          // perante uma relacao series_subseries[i].relacoes[j]
          let a = this.datas_extremas_classes.find(
            e => e.codigo == series_subseries[i].codigo
          );
          let b = this.datas_extremas_classes.find(
            e =>
              e.codigo ==
              series_subseries[i].relacoes[j].serieRelacionada.codigo
          );

          switch (series_subseries[i].relacoes[j].relacao) {
            case "Complementar de":
              if (
                !(
                  (a.dataInicial <= b.dataInicial &&
                    b.dataInicial <= a.dataFinal) ||
                  (b.dataInicial <= a.dataInicial &&
                    a.dataInicial <= b.dataFinal)
                )
              ) {
                this.erros_relacoes.push([
                  a.codigo,
                  b.codigo,
                  series_subseries[i].relacoes[j].relacao
                ]);
              }
              break;
            case "Síntese de":
              if (
                !(a.dataInicial <= b.dataInicial && a.dataFinal >= b.dataFinal)
              ) {
                this.erros_relacoes.push([
                  a.codigo,
                  b.codigo,
                  series_subseries[i].relacoes[j].relacao
                ]);
              }
              break;
            case "Sucessora de":
              if (a.dataInicial <= b.dataInicial) {
                this.erros_relacoes.push([
                  a.codigo,
                  b.codigo,
                  series_subseries[i].relacoes[j].relacao
                ]);
              }
              break;
          }
        }
      }
    },
    async concluir(id_remocao_pendente) {
      // // verificar a validade das relações!
      // let series_subseries = this.RADA.tsRada.classes.filter(
      //   e => e.tipo == "Série" || e.tipo == "Subsérie"
      // );

      // this.descobrir_datas_extremas(series_subseries);
      // this.validar_relacoes(series_subseries);

      //Filtrar as entidades produtoras ou tipologias produtoras para verificar o invariante
      //em que as produtoras tem que estar associadas pelo menos a uma série ou ui
      this.erroProdutoras = [];

      if (!!this.RADA.RE.entidadesProd[0]) {
        let entidades_selecionadas = this.entidadesProcessadas
          .filter(e => e.disabled == true)
          .map(e => e.entidade);

        this.RADA.RE.entidadesProd.forEach(ent => {
          if (!entidades_selecionadas.some(e => e == ent)) {
            this.erroProdutoras.push(ent);
          }
        });
      } else {
        let tipologias_selecionadas = this.tipologias
          .filter(t => t.disabled == true)
          .map(t => t.tipologia);

        this.RADA.RE.tipologiasProd.forEach(tip => {
          if (!tipologias_selecionadas.some(e == tip)) {
            this.erroProdutoras.push(tip);
          }
        });
      }

      if (!!this.erroProdutoras[0] || !!this.erros_relacoes[0]) {
        this.loading_circle_ts = false;
      } else {
        let series = this.RADA.tsRada.classes
          // adicionar os IDS a todas as classes
          .map(e => {
            let tipo = null;
            switch (e.tipo) {
              case "Série":
                tipo = "serie";
                break;
              case "Subsérie":
                tipo = "subserie";
                break;
              default:
                tipo = "organico_funcional";
                break;
            }
            e["id"] = "rada_" + this.RADA.id + "_" + tipo + "_" + e.codigo;
            return e;
          })
          .filter(e => e.tipo == "Série");

        // Nesta função será removida a zona de decisões de avaliação respeitando o invariante;
        this.removerDecisoesAvaliacao(series);

        // Calcular os valores de dimensão e suporte no relatório expositivo
        this.calcular_dimensao_suporte(series);

        // Tratar dos pedidos da novas entidades
        await this.fazer_pedidos_entidades(series);

        // Tratar dos pedidos das novas legislações
        await this.fazer_pedidos_legislacao(series);

        // Fazer pedido do RADA
        let pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "RADA",
          novoObjeto: this.RADA,
          user: {
            email: this.userEmail
          },
          token: this.$store.state.token,
          criadoPor: this.userEmail,
          entidade: this.user_entidade,
          despacho: !!this.despacho
            ? "Submissão inicial. Este pedido está dependente da aprovação dos seguintes pedidos:\n" +
              this.despacho
            : "Submissão inicial"
        };
        let response = await this.$request("post", "/pedidos", pedidoParams);
        if (id_remocao_pendente != null) {
          // ELIMINAR O PENDENTE DEPOIS DE FAZER O PEDIDO
          await this.$request("delete", "/pendentes/" + id_remocao_pendente);
        }
        this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
        this.dialogRADACriado = true;
      }
    }
  },
  async created() {
    // Pedido para a legislação e processamento para formulários!
    let l = await this.$request("get", "/legislacao");
    this.legislacao = l.data;

    this.legislacaoProcessada = l.data.map(item => {
      return {
        id: item.id,
        legislacao: item.tipo + " " + item.numero + " - " + item.sumario
      };
    });

    // Pedido para as entidades e processamento para formulários!
    let response = await this.$request("get", "/entidades");
    this.entidades = response.data;

    this.entidadesProcessadas = response.data.map(item => {
      return {
        entidade: item.sigla + " - " + item.designacao,
        disabled: false
      };
    });

    // Pedido para tipologias e seu processamento para formulários!
    response = await this.$request("get", "/tipologias");
    this.tipologias = response.data.map(item => {
      return {
        tipologia: item.sigla + " - " + item.designacao,
        disabled: false
      };
    });

    let userBD = this.$verifyTokenUser();
    this.userEmail = userBD.email;
    this.user_entidade = userBD.entidade;
  }
};

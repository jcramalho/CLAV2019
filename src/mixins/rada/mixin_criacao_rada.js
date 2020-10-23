import { criarHistorico } from "@/utils/utils";

export default {
  data: () => ({
    alert_guardar: false,
    user_entidade: null,
    loading_circle_ts: false,
    erroProdutoras: [],
    toDelete: false,
    toSave: false,
    dialogRADAPendente: false,
    entidades: [],
    tipologias: [],
    legislacao: [],
    legislacaoProcessada: [],
    entidadesProcessadas: [],
    e1: 1,
    userEmail: "",
    guardar: false,
    datas_extremas_classes: [],
    erros_relacoes: [],
    erros_datas_uis: [],
    erros_em_falta: [],
    existe_serie: true,
    alert_valido: false,
    pedidos_dependentes: []
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

      this.RADA.RE.dimSuporte.medicaoUI_papel = 0;
      this.RADA.RE.dimSuporte.medicaoUI_digital = 0;
      this.RADA.RE.dimSuporte.medicaoUI_outros = 0;

      for (let i = 0; i < series.length; i++) {
        for (let j = 0; j < series[i].suporte_e_medicao.length; j++) {
          switch (series[i].suporte_e_medicao[j].suporte) {
            case "Papel":
              this.RADA.RE.dimSuporte.medicaoUI_papel +=
                Number(series[i].suporte_e_medicao[j].medicao);
              break;
            case "Eletrónico Digitalizado": case "Eletrónico Nativo":
              this.RADA.RE.dimSuporte.medicaoUI_digital +=
                Number(series[i].suporte_e_medicao[j].medicao);
              break;
            case "Outro":
              this.RADA.RE.dimSuporte.medicaoUI_outros +=
                Number(series[i].suporte_e_medicao[j].medicao);

              break;
          }
        }
      }
    },
    // Fazer pedidos para as entidades
    async fazer_pedidos_entidades(series) {
      //  filtrar as novas entidaaddes criadas e que estão associadas a classes ou UIs
      let entidades = this.entidades.filter(
        e =>
          e.estado_no_sistema == "Nova" &&
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
        this.pedidos_dependentes.push(entidades[i]);
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
          leg["diplomaFonte"] = "RADA";
          leg["estado"] = "Ativo";
          if (leg.link == null) {
            leg["link"] = "";
          }
          // Adicionar série à qual está relacionada;
          leg["processosSel"] = [];
          // series.filter(cl =>
          //     cl.legislacao.some(
          //       legis =>
          //         legis.legislacao ==
          //         leg.tipo + " " + leg.numero + " - " + leg.sumario
          //     )
          //   )
          //   .map(cl => {
          //     return {
          //       codigo: cl.codigo,
          //       titulo: cl.titulo,
          //       id: cl.id
          //     };
          //   });
          // Adicionar entidades relacionadas com a criação legislação
          leg["entidadesSel"] = this.RADA.entRes.map(entidade => {
            let ent = entidade.split(" - ");

            return {
              designacao: ent[1],
              sigla: ent[0],
              id: "ent_" + ent[0]
            };
          });

          return leg;
        });

      for (let i = 0; i < legislacao.length; i++) {
        this.pedidos_dependentes.push(legislacao[i]);
      }
    },
    descobrir_datas_extremas(series_subseries) {
      // verificar se UIs estão dentro das datas extremas
      this.erros_datas_uis = [];

      for (let i = 0; i < series_subseries.length; i++) {
        let classe_data_inicial = new Date(series_subseries[i].dataInicial);
        let classe_data_final = new Date(series_subseries[i].dataFinal);

        for (let j = 0; j < series_subseries[i].UIs.length; j++) {
          let ui = this.RADA.tsRada.UIs.find(
            e => e.codigo == series_subseries[i].UIs[j]
          );

          if (
            new Date(ui.dataInicial) < classe_data_inicial ||
            new Date(ui.dataFinal) > classe_data_final
          ) {
            this.erros_datas_uis.push({
              codigoClasse: series_subseries[i].codigo,
              codigoUI: ui.codigo
            });
          }
        }

        this.datas_extremas_classes.push({
          codigo: series_subseries[i].codigo,
          dataInicial: classe_data_inicial,
          dataFinal: classe_data_final
        });
      }
    },
    validar_relacoes(series_subseries) {
      try {

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
      } catch (e) {
        return err;
      }
    },
    async validarRADA() {
      this.erros_em_falta = [];

      // erros que impedem o botão de submissão de ficar disponivel
      if (!Boolean(this.RADA.tsRada.titulo)) {
        this.erros_em_falta.push("É obrigatório inserir o título da tabela de seleção;");
      }

      if (!Boolean(this.RADA.tsRada.classes[0])) {
        this.erros_em_falta.push("É obrigatório inserir classes;");
      }

      for (let i = 0; i < this.RADA.tsRada.UIs.length; i++) {
        if (this.RADA.tsRada.UIs[i].classesAssociadas.length == 0 || this.RADA.tsRada.UIs[i].titulo == "") {
          this.erros_em_falta.push("Unidade de instalação com código " + this.RADA.tsRada.UIs[i].codigo + " está incompleta;");
        }
      }

      for (let j = 0; j < this.RADA.tsRada.classes.length; j++) {
        if (

          (this.RADA.tsRada.classes[j].tipo == "Série" &&
            ((!this.RADA.tsRada.classes.some((cl) => cl.eFilhoDe == this.RADA.tsRada.classes[j].codigo) &&
              ((!Boolean(this.RADA.tsRada.classes[j].df) && !Boolean(this.RADA.tsRada.classes[j].notaDF)) ||
                (!Boolean(this.RADA.tsRada.classes[j].pca) && !Boolean(this.RADA.tsRada.classes[j].notaPCA)) ||
                this.RADA.tsRada.classes[j].formaContagem.forma == null)) ||
              this.RADA.tsRada.classes[j].eFilhoDe == null)) ||
          (this.RADA.tsRada.classes[j].tipo == "Subsérie" &&
            ((!Boolean(this.RADA.tsRada.classes[j].df) && !Boolean(this.RADA.tsRada.classes[j].notaDF)) || this.RADA.tsRada.classes[j].eFilhoDe == null)) ||
          (this.RADA.tsRada.classes[j].eFilhoDe == null && (this.RADA.tsRada.classes[j].tipo == "N2" || this.RADA.tsRada.classes[j].tipo == "N3"))
        ) {
          this.erros_em_falta.push("Classe com código " + this.RADA.tsRada.classes[j].codigo + " está incompleta;");
        }
      }

      // erros que impedem a submissão do pedido de criação
      if (!this.RADA.tsRada.classes.some(e => e.tipo == "Série")) {
        this.existe_serie = false;
      } else {
        this.existe_serie = true;
      }

      let series_subseries = this.RADA.tsRada.classes.filter(
        e => e.tipo == "Série" || e.tipo == "Subsérie"
      );

      await this.descobrir_datas_extremas(series_subseries);
      await this.validar_relacoes(series_subseries);
      await this.validar_produtoras();

      if (!(!!this.erroProdutoras[0] ||
        !!this.erros_relacoes[0] ||
        !!this.erros_datas_uis[0] || !this.existe_serie || !!this.erros_em_falta[0])) {
        this.alert_valido = true;

        setTimeout(() => {
          this.alert_valido = false;
        }, 4000)
      }
    },
    validar_produtoras() {
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
        if (!this.RADA.tsRada.classes.some(e => e.tipologiasProdutoras && e.tipologiasProdutoras == this.RADA.RE.tipologiasProd)) {
          this.erroProdutoras.push(this.RADA.RE.tipologiasProd);
        }
      }
    },
    criarHistoricoRADA() {
      let historico = [
        {
          titulo: {
            cor: "verde",
            dados: this.RADA.titulo,
            nota: null
          },
          entRes: {
            cor: "verde",
            dados: this.RADA.entRes,
            nota: null
          },
          RE: {
            entidadesProd: {
              cor: "verde",
              dados: this.RADA.RE.entidadesProd,
              nota: null
            },
            tipologiasProd: {
              cor: "verde",
              dados: this.RADA.RE.tipologiasProd,
              nota: null
            },
            dataInicial: {
              cor: "verde",
              dados: this.RADA.RE.dataInicial,
              nota: null
            },
            dataFinal: {
              cor: "verde",
              dados: this.RADA.RE.dataFinal,
              nota: null
            },
            hist_admin: {
              cor: "verde",
              dados: this.RADA.RE.hist_admin,
              nota: null
            },
            hist_cust: {
              cor: "verde",
              dados: this.RADA.RE.hist_cust,
              nota: null
            },
            sist_org: {
              cor: "verde",
              dados: this.RADA.RE.sist_org,
              nota: null
            },
            localizacao: {
              cor: "verde",
              dados: this.RADA.RE.localizacao,
              nota: null
            },
            est_conser: {
              cor: "verde",
              dados: this.RADA.RE.est_conser,
              nota: null
            }
          },
          tsRada: {
            titulo: {
              cor: "verde",
              dados: this.RADA.tsRada.titulo,
              nota: null
            },
            classes: {
              cor: "verde",
              dados: this.RADA.tsRada.classes.map(e => {
                return {
                  cor: "verde",
                  dados: JSON.parse(JSON.stringify(e)),
                  nota: null
                }
              }),
              nota: null
            },
            UIs: {
              cor: "verde",
              dados: this.RADA.tsRada.UIs.map(e => {
                return {
                  cor: "verde",
                  dados: JSON.parse(JSON.stringify(e)),
                  nota: null
                }
              }),
              nota: null
            }
          }
        }
      ];


      // criar histórico para as classes;
      for (let i = 0; i < historico[0].tsRada.classes.dados.length; i++) {
        Object.keys(historico[0].tsRada.classes.dados[i].dados).map(e => {
          if (e == 'formaContagem') {
            historico[0].tsRada.classes.dados[i].dados[e] = {
              forma: {
                cor: 'verde',
                dados: historico[0].tsRada.classes.dados[i].dados[e].forma,
                nota: null
              },
              subforma: {
                cor: 'verde',
                dados: !!historico[0].tsRada.classes.dados[i].dados[e].subforma ? historico[0].tsRada.classes.dados[i].dados[e].subforma : null,
                nota: null
              }
            }

          } else {
            historico[0].tsRada.classes.dados[i].dados[e] = {
              cor: "verde",
              dados: historico[0].tsRada.classes.dados[i].dados[e],
              nota: null
            }
          }

        })
      }

      // criar histórico para as uis;
      for (let j = 0; j < historico[0].tsRada.UIs.dados.length; j++) {
        Object.keys(historico[0].tsRada.UIs.dados[j].dados).map(e => {
          historico[0].tsRada.UIs.dados[j].dados[e] = {
            cor: "verde",
            dados: historico[0].tsRada.UIs.dados[j].dados[e],
            nota: null
          }
        })
      }


      return historico;
    },
    async concluir(id_remocao_pendente) {
      if (!this.RADA.tsRada.classes.some(e => e.tipo == "Série")) {
        this.existe_serie = false;
        this.loading_circle_ts = false;
      } else {
        this.existe_serie = true;
        // verificar a validade das UIs e das relações!
        let series_subseries = this.RADA.tsRada.classes.filter(
          e => e.tipo == "Série" || e.tipo == "Subsérie"
        );

        await this.descobrir_datas_extremas(series_subseries);
        await this.validar_relacoes(series_subseries);
        await this.validar_produtoras();

        if (
          !!this.erroProdutoras[0] ||
          !!this.erros_relacoes[0] ||
          !!this.erros_datas_uis[0]
        ) {
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
          await this.removerDecisoesAvaliacao(series);

          // Calcular os valores de dimensão e suporte no relatório expositivo
          await this.calcular_dimensao_suporte(series);

          // Tratar dos pedidos da novas entidades
          await this.fazer_pedidos_entidades(series);

          // Tratar dos pedidos das novas legislações
          await this.fazer_pedidos_legislacao(series);

          // Fazer pedido do RADA
          let pedidoParams = {
            tipoPedido: "Criação",
            tipoObjeto: "RADA",
            novoObjeto: this.RADA,
            historico: await this.criarHistoricoRADA(),
            user: {
              email: this.userEmail
            },
            token: this.$store.state.token,
            pedidos_dependentes: this.pedidos_dependentes,
            criadoPor: this.userEmail,
            entidade: this.user_entidade,
            despacho: "Submissão inicial"
          };
          let response = await this.$request("post", "/pedidos", pedidoParams);
          if (id_remocao_pendente != null) {
            // ELIMINAR O PENDENTE DEPOIS DE FAZER O PEDIDO
            await this.$request("delete", "/pendentes/" + id_remocao_pendente);
          }
          this.$router.push(`/pedidos/submissao/${response.data}`);

        }
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
        tipologia: item.sigla + " - " + item.designacao
      };
    });

    let userBD = this.$verifyTokenUser();
    this.userEmail = userBD.email;
    this.user_entidade = userBD.entidade;

    // Se for pendente
    if (!!this.obj) {
      this.obj.objeto.entidades.forEach(ent => {
        this.entidades.push(ent);
        this.entidadesProcessadas.push({
          entidade: ent.sigla + " - " + ent.designacao,
          disabled: false
        });
      });

      this.obj.objeto.legislacao.forEach(leg => {
        this.legislacao.push(leg);
        this.legislacaoProcessada.push({
          id: leg.id,
          legislacao: leg.tipo + " " + leg.numero + " - " + leg.sumario
        });
      });
    }
  }
};

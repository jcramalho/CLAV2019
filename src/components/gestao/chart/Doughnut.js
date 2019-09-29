import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "Administrador de Perfil Tecnológico",
          "Administrador de Perfil Funcional",
          "Utilizador Validador",
          "Utilizador Avançado",
          "Utilizador Decisor",
          "Utilizador Simples",
          "Representante Entidade",
          "Utilizador desativado"
        ],
        datasets: [
          {
            backgroundColor: [
              "#00876c",
              "#63b179",
              "#aed987",
              "#ffff9d",
              "#fcc267",
              "#ef8250",
              "#d43d5",
              "#00aba9"
            ],
            data: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  async mounted() {
    await this.$request("get", "/api/users?formato=normalizado")
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          var index = this.info.labels.indexOf(res.data[i].level);
          this.info.datasets[0].data[index] += 1;
        }
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};

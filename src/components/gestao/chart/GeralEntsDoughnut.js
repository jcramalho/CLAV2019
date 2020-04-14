import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "Ativas",
          "Inativas",
        ],
        datasets: [
          {
            backgroundColor: [
              "#43A047",
              "#D32F2F",
            ],
            data: [0, 0]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Entidades'
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/stats/entativas")
      .then(res => {
        this.info.datasets[0].data[0] = res.data[0].valor;
        this.info.datasets[0].data[1] = res.data[1].valor;
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};

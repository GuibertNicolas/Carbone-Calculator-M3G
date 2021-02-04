import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: Pie,
  props: ['testprop', 'resdata'],
  data () {
    return {
      chartdata: {
        // catégories du graphique
        labels: ['Transports', 'Énergies', 'Alimentations', 'Objets du quotidien'],
        datasets: [
          {
            backgroundColor: ['#006a9e', '#dd0061', '#ff4814', '#fecd33'],
            data: [
              this.$store.state.resultTransport,
              this.$store.state.resultEnergie,
              this.$store.state.resultAlimentation,
              this.$store.state.resultDivers
            ]
          }
        ]
      },
      plugins: [ChartDataLabels],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        // ajout des label dans le graph
        plugins: {
          datalabels: {
            color: 'white',
            // Si la valeur est = 0 alors on affiche pas le label
            opacity (context) {
              return context.dataset.data[context.dataIndex] === 0 ? 0 : 1
            },
            font: {
              weight: 'bold',
              size: 16
            }
          }
        }
      }
    }
  },

  methods: {
    // update chart values
    updateChart () {
      this.chartdata.datasets[0].data[0] = this.$store.state.resultTransport
      this.chartdata.datasets[0].data[1] = this.$store.state.resultEnergie
      this.chartdata.datasets[0].data[2] = this.$store.state.resultAlimentation
      this.chartdata.datasets[0].data[3] = this.$store.state.resultDivers
      this.renderChart(this.chartdata, this.chartOptions)
    }
  },

  watch: {
    testprop () {
      this.updateChart()
    }
  },

  mounted () {
    this.renderChart(this.chartdata, this.chartOptions)
  }
}

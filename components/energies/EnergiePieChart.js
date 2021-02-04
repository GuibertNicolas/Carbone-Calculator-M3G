import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: Pie,
  props: ['testprop', 'resdata'],
  data () {
    return {
      chartdata: {
        // catégories du graphique
        labels: ['Gaz', 'Électricité'],
        datasets: [
          {
            backgroundColor: ['#006a9e', '#dd0061'],
            data: [localStorage.gazResultat, localStorage.elecResultat]
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
      this.chartdata.datasets[0].data[0] = this.resdata.resGaz
      this.chartdata.datasets[0].data[1] = this.resdata.resElec
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

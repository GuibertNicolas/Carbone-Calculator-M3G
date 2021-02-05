<template>
  <v-row class="mb-12" justify="center">
    <v-col class="test-center" lg="7">
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('transport')">
        <v-card-title style="background-color: #006a9e; color: white">
          <v-row>
            <v-col class="text-left">
              Transports
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultTransport }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à vos
          transports
        </v-card-text>
      </v-card>
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('energies')">
        <v-card-title style="background-color: #dd0061; color: white">
          <v-row>
            <v-col class="text-left">
              Énergies
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultEnergie }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à votre
          consomation de gaz et d'électricité
        </v-card-text>
      </v-card>
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('alimentations')">
        <v-card-title style="background-color: #ff4814; color: white">
          <v-row>
            <v-col class="text-left">
              Alimentations
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultAlimentation }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à votre
          alimentation
        </v-card-text>
      </v-card>
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('objetsduquotidien')">
        <v-card-title style="background-color: #fecd33; color: white">
          <v-row>
            <v-col class="text-left">
              Objets du quotidien
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultDivers }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à vos objets du quotidien
        </v-card-text>
      </v-card>
      <v-btn
        @click="clearValue()"
      >
        <v-icon>
          mdi-delete
        </v-icon>
        Effacer
      </v-btn>
    </v-col>
    <v-col lg="5">
      <div ref="content">
        <FinalPieChart />
      </div>
      <v-card-actions
        class="justify-center"
        style="margin-top: 15px"
      >
        <v-btn
          @click="exportPDF()"
        >
          <v-icon>
            mdi-download
          </v-icon>
          Mes résultats
        </v-btn>
      </v-card-actions>
    </v-col>
  </v-row>
</template>
<script>
import FinalPieChart from '@/components/FinalPieChart.js'
import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs
export default {
  components: {
    FinalPieChart
  },

  data () {
    return {
      scoreEnergie: 0
    }
  },
  methods: {
    redirectTo (link) {
      this.$router.push(link)
    },
    clearValue () {
      localStorage.clear()
      window.location.reload()
    },
    exportPDF () {
      const total = this.$store.state.resultTransport + this.$store.state.resultEnergie + this.$store.state.resultDivers + this.$store.state.resultAlimentation
      const docDefinition = {
        footer: {
          columns: [
            {
              text: '© ' + new Date().getFullYear() + ' - mc2i / M3G ',
              alignment: 'center'
            }
          ]
        },
        content: [
          {
            text: 'Mon bilan carbone en ' + new Date().getFullYear(),
            alignment: 'center',
            fontSize: 24
          },
          {
            text: '\n'
          },
          {
            layout: 'lightHorizontalLines',
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                table: {
                  headerRows: 1,
                  widths: [175, 175],
                  body: [
                    ['Catégories', 'Empreinte carbone'],
                    ['Transports', this.$store.state.resultTransport + ' KgCO2'],
                    ['Energies', this.$store.state.resultEnergie + ' KgCO2'],
                    ['Alimentaion', this.$store.state.resultAlimentation + ' KgCO2'],
                    ['Objets du quotidien', this.$store.state.resultDivers + ' KgCO2'],
                    [{ text: 'Total', bold: true },
                      {
                        text: total + ' KgCO2',
                        bold: true
                      }
                    ]
                  ]
                }
              },
              { width: '*', text: '' }
            ]
          }
        ]
      }
      const moyenne = 11000
      if (total > moyenne) {
        docDefinition.content.push({
          text: '\nMon empreinte carbone est supérieure de ' + parseInt((total - moyenne) / 1000) + ' tonnes à la moyenne française*'
        })
      } else {
        docDefinition.content.push({
          text: '\nMon empreinte carbone est inférieure de ' + parseInt((moyenne - total) / 1000) + ' tonnes à la moyenne française*'
        })
      }
      docDefinition.content.push({
        text: '\n\n\n(*) Selon le ministère de la transition écologique, l’empreinte carbone des Français représente ' + parseInt(moyenne / 1000) + ' tonnes de CO2 par an en 2018',
        fontSize: 7,
        color: '#707070'
      })
      const pdf = pdfMake.createPdf(docDefinition)
      pdf.download('M3G-Résultats.pdf')
    }
  }
}
</script>

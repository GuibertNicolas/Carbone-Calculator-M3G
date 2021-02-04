<template>
  <v-card>
    <v-row class="mb-13">
      <v-col class="text-center" cols="8">
        <div
          label="test"
          :class="`rounded`"
          class="pa-4 text-left text-no-wrap outlined"
          outlined
        >
          <div class="text-left">
            Repas pour la semaine
          </div>
          <v-row>
            <div v-for="e in repas" :key="`${e.name}-content`">
              <v-col class="text-center">
                <v-row>
                  <v-card
                    class="justify-center"
                    width="123px"
                    height="123px"
                    color="#ff4814"
                    style="margin-right: 5px"
                  >
                    <v-row>
                      <v-col>
                        <v-row class="text-left mx-2">
                          <v-icon
                            color="white"
                            @click="redirectInfo()"
                          >
                            mdi-alert-circle
                          </v-icon>
                        </v-row>
                        <div class="justify-center" style="color: white">
                          {{ e.name }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-row>
                <v-row>
                  <v-col>
                    <v-icon
                      @click="scoreMinus(e.name)"
                    >
                      mdi-minus-circle
                    </v-icon>
                    {{ e.score }}
                    <v-icon
                      @click="scorePlus(e.name)"
                    >
                      mdi-plus-circle
                    </v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </div>
          </v-row>
          <v-row>
            <v-col class="text-right">
              <v-btn
                class="white--text"
                color="#ff4814"
                @click="calculRepas()"
              >
                Calcul
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col>
        <div
          class="fill-height"
          style="color: #ff4814"
        >
          <v-row class="h-75">
            <v-col class="text-center">
              <h1 class="display-4 font-weight-medium">
                {{ resultat }}
              </h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="text-center"
            >
              KgCO<sub>2</sub>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Repas',
  data: () => ({
    kWh: 0,
    repas: [
      {
        id: 20687,
        name: 'Repas classique Bœuf',
        score: 0
      },
      {
        id: 20686,
        name: 'Repas classique Poulet',
        score: 0
      },
      {
        id: 20689,
        name: 'Repas à dominante animale boeuf',
        score: 0
      },
      {
        id: 20688,
        name: 'Repas à dominante animale poulet',
        score: 0
      },
      {
        id: 20685,
        name: 'Repas à dominante végétale boeuf',
        score: 0
      },
      {
        id: 20684,
        name: 'Repas à dominante végétale poulet',
        score: 0
      },
      {
        id: 20683,
        name: 'Végétarien',
        score: 0
      }
    ],
    resultat: 0,
    results: undefined,
    id: 15591
  }),

  mounted () {
    if (localStorage.repas) {
      this.repas = JSON.parse(localStorage.repas)
    }
    if (localStorage.repasResultat) {
      this.resultat = localStorage.repasResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    redirectInfo () {
      window.open('https://www.bilans-ges.ademe.fr/documentation/UPLOAD_DOC_FR/index.htm?repas.htm')
    },
    scoreMinus (s) {
      const index = this.repas.findIndex(o => o.name === s)
      if ((this.repas[index].score - 1) >= 0) {
        this.repas[index].score--
      }
    },
    scorePlus (s) {
      const index = this.repas.findIndex(o => o.name === s)
      this.repas[index].score++
    },
    async calculRepas () {
      this.resultat = 0
      let i = 0
      for (i = 0; i < this.repas.length; i++) {
        if (this.repas[i].score !== 0) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.repas[i].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
          this.resultat += parseInt(this.repas[i].score * 52 * co2)
        }
      }
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('repasEvent', r, 'repas')
    },
    saveToLocal () {
      localStorage.repasResultat = this.resultat
      localStorage.repas = JSON.stringify(this.repas)
    }
  }
}
</script>

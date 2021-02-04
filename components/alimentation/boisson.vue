<template>
  <v-card>
    <v-row class="mb-13">
      <v-col class="text-center" cols="8">
        <div
          label="test"
          :class="`rounded`"
          class="pa-4 text-center text-no-wrap outlined"
          outlined
        >
          <div class="text-left">
            Boissons pour la semaine
          </div>
          <v-row>
            <div v-for="e in boissons" :key="`${e.name}-content`">
              <v-col class="text-center">
                <v-row>
                  <v-card
                    height="123px"
                    width="123px"
                    color="#ff4814"
                    style="margin-right: 5px"
                  >
                    <v-row justify="center">
                      <v-col class="text-center">
                        <img
                          :src="e.src"
                          :alt="e.alt"
                          height="55px"
                          width="55px"
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center">
                        <span style="color: white">{{ e.name }}</span>
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
                    {{ e.score }} L
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
  name: 'Boisson',
  data: () => ({
    kWh: 0,
    boissons: [
      {
        id: 24684,
        name: 'Eau du robinet',
        src: '/icon/boissons/tap-water.png',
        alt: 'Icone eau du robinet',
        score: 0
      },
      {
        id: 24685,
        name: 'Eau en bouteille',
        src: '/icon/boissons/water-bottle.png',
        alt: 'Icone Eau en bouteille',
        score: 0
      },
      {
        id: 24682,
        name: 'Soda',
        src: '/icon/boissons/soda.png',
        alt: 'Icone soda',
        score: 0
      },
      {
        id: 24683,
        name: 'Jus d\'orange',
        src: '/icon/boissons/orange-juice.png',
        alt: 'Icone Jus d\'orange',
        score: 0
      },
      {
        id: 24680,
        name: 'Vin',
        src: '/icon/boissons/wine.png',
        alt: 'Icone vin',
        score: 0
      },
      {
        id: 24681,
        name: 'Bière',
        src: '/icon/boissons/beer.png',
        alt: 'Icone Bière',
        score: 0
      }
    ],
    resultat: 0,
    results: undefined,
    id: 15591
  }),

  mounted () {
    if (localStorage.boissons) {
      this.boissons = JSON.parse(localStorage.boissons)
    }
    if (localStorage.boissonResultat) {
      this.resultat = localStorage.boissonResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    scoreMinus (s) {
      const index = this.boissons.findIndex(o => o.name === s)
      if ((this.boissons[index].score - 1) >= 0) {
        this.boissons[index].score--
      }
    },
    scorePlus (s) {
      const index = this.boissons.findIndex(o => o.name === s)
      this.boissons[index].score++
    },
    async calculRepas () {
      this.resultat = 0
      let i = 0
      for (i = 0; i < this.boissons.length; i++) {
        if (this.boissons[i].score !== 0) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.boissons[i].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
          this.resultat += parseInt(this.boissons[i].score * 52 * co2)
        }
      }
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('boissonEvent', r, 'boisson')
    },
    saveToLocal () {
      localStorage.boissonResultat = this.resultat
      localStorage.boissons = JSON.stringify(this.boissons)
    }
  }
}
</script>

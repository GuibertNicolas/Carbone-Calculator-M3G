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
            Petit déjeuner pour la semaine
          </div>
          <v-row>
            <div v-for="e in dej" :key="`${e.name}-content`">
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
                @click="calculDej()"
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
  name: 'Dejeuner',
  data: () => ({
    kWh: 0,
    dej: [
      {
        id: 25733,
        name: 'Pain au chocolat',
        src: '/icon/dej/choco.png',
        alt: 'Icone pain au chocolat',
        score: 0
      },
      {
        id: 25734,
        name: 'Brioche',
        src: '/icon/dej/brioche.png',
        alt: 'Icone brioche',
        score: 0
      },
      {
        id: 25739,
        name: 'Pain',
        src: '/icon/dej/bread.png',
        alt: 'Icone pain',
        score: 0
      },
      {
        id: 25743,
        name: 'Bol de céréales',
        src: '/icon/dej/cereal.png',
        alt: 'Icone bol de céréales',
        score: 0
      },
      {
        id: 25737,
        name: 'Café',
        src: '/icon/dej/coffee.png',
        alt: 'Icone café',
        score: 0
      },
      {
        id: 25738,
        name: 'Thé',
        src: '/icon/dej/tea-cup.png',
        alt: 'Icone thé',
        score: 0
      },
      {
        id: 25745,
        name: 'Chocolat chaud',
        src: '/icon/dej/hot-chocolate.png',
        alt: 'Icone chocolat chaud',
        score: 0
      },
      {
        id: 25736,
        name: 'Lait',
        src: '/icon/dej/milk.png',
        alt: 'Icone lait',
        score: 0
      }
    ],
    resultat: 0,
    results: undefined,
    id: 15591
  }),

  mounted () {
    if (localStorage.dej) {
      this.dej = JSON.parse(localStorage.dej)
    }
    if (localStorage.dejResultat) {
      this.resultat = localStorage.dejResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    scoreMinus (s) {
      const index = this.dej.findIndex(o => o.name === s)
      if ((this.dej[index].score - 1) >= 0) {
        this.dej[index].score--
      }
    },
    scorePlus (s) {
      const index = this.dej.findIndex(o => o.name === s)
      this.dej[index].score++
    },
    async calculDej () {
      this.resultat = 0
      let i = 0
      for (i = 0; i < this.dej.length; i++) {
        if (this.dej[i].score !== 0) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.dej[i].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
          this.resultat += parseInt(this.dej[i].score * 52 * co2)
        }
      }
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('dejEvent', r, 'dej')
    },
    saveToLocal () {
      localStorage.dejResultat = this.resultat
      localStorage.dej = JSON.stringify(this.dej)
    }
  }
}
</script>

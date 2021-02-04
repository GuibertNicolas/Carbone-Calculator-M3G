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
          <v-row>
            <div v-for="e in vet" :key="`${e.name}-content`">
              <v-col class="text-center">
                <v-row>
                  <v-card
                    height="123px"
                    width="123px"
                    color="#fecd33"
                    style="margin-right: 5px"
                  >
                    <v-row justify="center">
                      <v-col class="text-center" style="padding-bottom: 0px">
                        <img
                          :src="e.src"
                          :alt="e.alt"
                          height="55px"
                          width="55px"
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center" style="padding-top: 0px">
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
                color="#fecd33"
                @click="calculvet()"
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
          style="color: #fecd33"
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
  name: 'Vetement',
  data: () => ({
    kWh: 0,
    vet: [
      {
        id: 27060,
        name: 'Chaussures de sport',
        src: '/icon/clothes/running-shoes.png',
        alt: 'Icone chaussures de sport',
        score: 0
      },
      {
        id: 27058,
        name: 'Chaussures en cuir',
        src: '/icon/clothes/shoe.png',
        alt: 'Icone chaussures en cuire',
        score: 0
      },
      {
        id: 27059,
        name: 'Chaussures en tissus',
        src: '/icon/clothes/sneakers.png',
        alt: 'Icone chaussures en tissus',
        score: 0
      },
      {
        id: 27043,
        name: 'Jean',
        src: '/icon/clothes/jeans.png',
        alt: 'Icone jean',
        score: 0
      },
      {
        id: 27045,
        name: 'T-Shirt',
        src: '/icon/clothes/tshirt.png',
        alt: 'Icone T-Shirt',
        score: 0
      },
      {
        id: 27041,
        name: 'Chemise',
        src: '/icon/clothes/shirts.png',
        alt: 'Icone chemise',
        score: 0
      },
      {
        id: 27050,
        name: 'Pull',
        src: '/icon/clothes/sweater.png',
        alt: 'Icone Pull',
        score: 0
      },
      {
        id: 27049,
        name: 'Sweat',
        src: '/icon/clothes/sweatshirt.png',
        alt: 'Icone Sweat',
        score: 0
      },
      {
        id: 27055,
        name: 'Robe',
        src: '/icon/clothes/dress.png',
        alt: 'Icone Robe',
        score: 0
      },
      {
        id: 27052,
        name: 'Manteau',
        src: '/icon/clothes/coat.png',
        alt: 'Icone Manteau',
        score: 0
      }
    ],
    resultat: 0,
    results: undefined
  }),

  mounted () {
    if (localStorage.vet) {
      this.vet = JSON.parse(localStorage.vet)
    }
    if (localStorage.vetResultat) {
      this.resultat = localStorage.vetResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    scoreMinus (s) {
      const index = this.vet.findIndex(o => o.name === s)
      if ((this.vet[index].score - 1) >= 0) {
        this.vet[index].score--
        this.trigScore = !this.trigScore
      }
    },
    scorePlus (s) {
      const index = this.vet.findIndex(o => o.name === s)
      this.vet[index].score++
      this.trigScore = !this.trigScore
    },
    async calculvet () {
      this.resultat = 0
      let i = 0
      for (i = 0; i < this.vet.length; i++) {
        if (this.vet[i].score !== 0) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.vet[i].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
          this.resultat += parseInt(this.vet[i].score * co2)
        }
      }
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('vetEvent', r, 'vet')
    },
    saveToLocal () {
      localStorage.vetResultat = this.resultat
      localStorage.vet = JSON.stringify(this.vet)
    }
  }
}
</script>

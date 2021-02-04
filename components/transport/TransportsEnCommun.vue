<template>
  <v-card class="mb-12">
    <v-row>
      <v-col class="text-center">
        <div
          label="test"
          :class="`rounded`"
          class="pa-4 text-center text-no-wrap outlined"
          outlined
        >
          <v-text-field
            v-model="rer"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="RER - Heures / Semaine"
            required
          />
          <v-text-field
            v-model="metro"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="Métro - Heures / Semaine"
            required
          />
          <v-text-field
            v-model="tram"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="Tramway - Heures / Semaine"
            required
          />
          <v-text-field
            v-model="bus"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="Bus - Heures / Semaine"
            required
          />
          <v-row>
            <v-col class="text-right">
              <v-btn color="#006a9e" style="color: white" @click="calculTransportEnCommun()">
                Calcul
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col>
        <div class="fill-height" style="color: #006a9e">
          <v-row class="h-75">
            <v-col class="text-center">
              <h1 class="display-4 font-weight-medium">
                {{ resultat }}
              </h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center">
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
  name: 'TransportsEnCommun',
  data: () => ({
    rer: 0,
    metro: 0,
    tram: 0,
    bus: 0,
    tecs: [
      {
        name: 'rer',
        vitesse: 49.6,
        resultat: 0,
        id: 21715
      },
      {
        name: 'metro',
        vitesse: 25.1,
        resultat: 0,
        id: 28147
      },
      {
        name: 'tram',
        vitesse: 17.5,
        resultat: 0,
        id: 28148
      },
      {
        name: 'bus',
        vitesse: 9.8,
        resultat: 0,
        id: 27085
      }
    ],
    resultat: 0,
    results: undefined,
    id: 21737
  }),

  mounted () {
    if (localStorage.rer) {
      this.rer = localStorage.rer
    }
    if (localStorage.metro) {
      this.metro = localStorage.metro
    }
    if (localStorage.tram) {
      this.tram = localStorage.tram
    }
    if (localStorage.bus) {
      this.bus = localStorage.bus
    }
    if (localStorage.tecResultat) {
      this.resultat = localStorage.tecResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    async calculTransportEnCommun () {
      let co2 = 0
      if (this.rer !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[0].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[0].resultat = parseInt((this.tecs[0].vitesse * this.rer * co2 * 52).toFixed(0))
      }
      if (this.metro !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[1].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[1].resultat = parseInt((this.tecs[1].vitesse * this.metro * co2 * 52).toFixed(0))
      }
      if (this.tram !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[2].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[2].resultat = parseInt((this.tecs[2].vitesse * this.tram * co2 * 52).toFixed(0))
      }
      if (this.bus !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[3].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[3].resultat = parseInt((this.tecs[3].vitesse * this.bus * co2 * 52).toFixed(0))
      }
      this.resultat = 0
      this.tecs.forEach((tec) => {
        this.resultat += tec.resultat
      })
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('tecEvent', r, 'tec')
    },
    saveToLocal () {
      localStorage.rer = this.rer
      localStorage.metro = this.metro
      localStorage.tram = this.tram
      localStorage.bus = this.bus
      localStorage.tecResultat = this.resultat
    }
  }
}
</script>

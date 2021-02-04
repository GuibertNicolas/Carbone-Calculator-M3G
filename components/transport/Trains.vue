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
            v-model="tgvH"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="TGV - Heures"
            required
          />
          <v-row>
            <v-col class="text-right">
              <v-btn color="#006a9e" style="color: white" @click="calculTrain()">
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
  name: 'Trains',
  data: () => ({
    tgvH: 0,
    tgvVit: 320,
    resultat: 0,
    results: undefined,
    id: 21737
  }),

  mounted () {
    if (localStorage.tgvH) {
      this.tgvH = localStorage.tgvH
    }
    if (localStorage.trainResultat) {
      this.resultat = localStorage.trainResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    async calculTrain () {
      this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
      const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
      this.resultat = (this.tgvVit * this.tgvH * co2).toFixed(0)
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('trainEvent', r, 'train')
    },
    saveToLocal () {
      localStorage.tgvH = this.tgvH
      localStorage.trainResultat = this.resultat
    }
  }
}
</script>

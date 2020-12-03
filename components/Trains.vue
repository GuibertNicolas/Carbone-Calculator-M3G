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
            label="TGV - Heures de vol"
            required
          />
          <v-row>
            <v-col class="text-right">
              <v-btn color="primary" @click="calculTrain()">
                Calcul
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col>
        <div class="primary--text fill-height">
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

  methods: {
    async calculTrain () {
      this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
      const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
      this.resultat = (this.tgvVit * this.tgvH * co2).toFixed(0)
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.$emit('trainEvent', r, 'train')
    }
  }
}
</script>

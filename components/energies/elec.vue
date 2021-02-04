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
            v-model="kWh"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="kWh / an"
            color="#dd0061"
            required
          />
          <v-row>
            <v-col class="text-right">
              <v-btn color="#dd0061" style="color: white" @click="calculElec()">
                Calcul
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col>
        <div class="fill-height" style="color: #dd0061">
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
  name: 'Elec',
  data: () => ({
    kWh: 0,
    resultat: 0,
    results: undefined,
    id: 15591
  }),

  mounted () {
    if (localStorage.kWh) {
      this.kWh = localStorage.kWh
    }
    if (localStorage.elecResultat) {
      this.resultat = localStorage.elecResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    async calculElec () {
      this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
      const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
      this.resultat = (this.kWh * co2).toFixed(0)
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('elecEvent', r, 'elec')
    },
    saveToLocal () {
      localStorage.kWh = this.kWh
      localStorage.elecResultat = this.resultat
    }
  }
}
</script>

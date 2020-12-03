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
            v-model="ccHv"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="Court-courrier - Heures de vol"
            required
          />
          <v-text-field
            v-model="mcHv"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="Moyen-courrier - Heures de vol"
            required
          />
          <v-text-field
            v-model="lcHv"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            label="Long-courrier - Heures de vol"
            required
          />
          <v-row>
            <v-col class="text-right">
              <v-btn color="primary" @click="calculAvion()">
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
  name: 'Avions',
  data: () => ({
    ccHv: 0,
    mcHv: 0,
    lcHv: 0,
    resultat: 0,
    results: undefined
  }),

  methods: {
    async calculVoiture () {
      this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.idVoiture + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
      const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
      this.resultat = (this.km * co2).toFixed(0)
    }
  }
}
</script>

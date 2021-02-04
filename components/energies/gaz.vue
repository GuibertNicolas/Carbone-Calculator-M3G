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
          <v-row>
            <v-col>
              <v-switch
                v-model="cuissonSw"
                flat
                color="#dd0061"
                :label="`Cuisson`"
              />
              <v-switch
                v-model="chauffageSw"
                flat
                color="#dd0061"
                :label="`Chauffage`"
              />
              <v-switch
                v-model="eauSw"
                flat
                color="#dd0061"
                :label="`Eau chaude`"
              />
            </v-col>
            <v-col class="text-center">
              <template v-if="cuissonSw || chauffageSw || eauSw">
                <v-text-field
                  v-model="gazKwh"
                  type="number"
                  min="0"
                  oninput="validity.valid||(value='');"
                  label="kWh de gaz naturel / an"
                  color="#dd0061"
                  required
                />
              </template>
            </v-col>
          </v-row>
          <v-row>
            <template v-if="cuissonSw || chauffageSw || eauSw">
              <v-col class="text-right">
                <v-btn color="#dd0061" style="color: white" @click="calculGaz()">
                  Calcul
                </v-btn>
              </v-col>
            </template>
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
  name: 'Gaz',
  data: () => ({
    ids: [
      {
        id: 26622
      },
      {
        id: 26623
      },
      {
        id: 26624
      }
    ],
    cuissonTaux: 0,
    chauffageTaux: 0,
    eautaux: 0,
    cuissonSw: false,
    chauffageSw: false,
    eauSw: false,
    gazKwh: 0,
    resultat: 0,
    results: undefined,
    moyTaux: 0,
    divid: 0
  }),

  mounted () {
    if (localStorage.cuissonSw !== undefined) {
      this.cuissonSw = (localStorage.cuissonSw === 'true')
    }
    if (localStorage.chauffageSw !== undefined) {
      this.chauffageSw = (localStorage.chauffageSw === 'true')
    }
    if (localStorage.eauSw !== undefined) {
      this.eauSw = (localStorage.eauSw === 'true')
    }
    if (localStorage.gazKwh) {
      this.gazKwh = localStorage.gazKwh
    }
    if (localStorage.gazResultat) {
      this.resultat = localStorage.gazResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    async calculGaz () {
      if (this.cuissonSw || this.chauffageSw || this.eauSw) {
        if (this.cuissonSw) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.ids[0].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          this.cuissonTaux = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        } else {
          this.cuissonTaux = 0
        }
        if (this.chauffageSw) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.ids[1].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          this.chauffageTaux = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        } else {
          this.chauffageTaux = 0
        }
        if (this.eauSw) {
          this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.ids[2].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
          this.eautaux = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        } else {
          this.eautaux = 0
        }
        this.moyTaux = ((this.cuissonTaux + this.chauffageTaux + this.eautaux) / (this.cuissonSw + this.chauffageSw + this.eauSw)).toFixed(3)
        this.resultat = (this.gazKwh * this.moyTaux).toFixed(0)
      } else {
        this.resultat = 0
      }
      this.saveToLocal()
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.$emit('gazEvent', r, 'gaz')
    },
    saveToLocal () {
      localStorage.cuissonSw = this.cuissonSw
      localStorage.chauffageSw = this.chauffageSw
      localStorage.eauSw = this.eauSw
      localStorage.gazKwh = this.gazKwh
      localStorage.gazResultat = this.resultat
    }
  }
}
</script>

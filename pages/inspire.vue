<template>
  <v-row>
    <v-col class="text-center">
      <div
        label="test"
        :class="`rounded`"
        class="pa-4 text-center text-no-wrap outlined"
        outlined
      >
        <v-text-field
          v-model="km"
          type="number"
          label="Nombre de kilomètres"
        />
        <v-combobox
          v-model="motorisation"
          :items="motorisations"
          item-text="name"
          label="Motorisation"
          return-object
          @input="displayPF()"
        />
        <v-combobox
          v-show="showPF"
          v-model="puissance"
          :items="puissances"
          item-text="name"
          label="Puissance Fiscale"
          return-object
        />
        <v-btn
          color="primary"
          @click="calcul()"
        >
          Calcul
        </v-btn>
        <div v-if="resultat">
          {{ resultat }}
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Inspire',
  data: () => ({
    showPF: false,
    km: '',
    id: '',
    results: undefined,
    resultat: undefined,
    puissances: undefined,
    puissance: undefined,
    motorisation: undefined,
    motorisations: [
      { name: 'Essence' },
      { name: 'Diesel' },
      { name: 'Essence / Diesel' },
      { name: 'Electrique' },
      { name: 'Hybride' }
    ],
    puissances_essence: [
      {
        name: '0 - 5 CV',
        id: '21615'
      },
      {
        name: '6 - 10 CV',
        id: '21613'
      },
      {
        name: '> 11 CV',
        id: '21607'
      }
    ],
    puissances_diesel: [
      {
        name: '0 - 5 CV',
        id: '21608'
      },
      {
        name: '6 - 10 CV',
        id: '21612'
      },
      {
        name: '> 11 CV',
        id: '21616'
      }
    ],
    puissances_mixte: [
      {
        name: '0 - 5 CV',
        id: '21606'
      },
      {
        name: '6 - 10 CV',
        id: '21605'
      },
      {
        name: '> 11 CV',
        id: '21614'
      }
    ]
  }),

  methods: {
    async calcul () {
      if (this.puissance !== null) {
        this.id = this.puissance.id
      }
      this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
      const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
      this.resultat = (this.km * co2).toFixed(2) + ' kgCO2'
    },
    displayPF () {
      this.puissance = null
      if (this.motorisation.name === 'Essence') {
        this.showPF = true
        this.puissances = this.puissances_essence
      } else if (this.motorisation.name === 'Diesel') {
        this.showPF = true
        this.puissances = this.puissances_diesel
      } else if (this.motorisation.name === 'Essence / Diesel') {
        this.showPF = true
        this.puissances = this.puissances_mixte
      } else if (this.motorisation.name === 'Hybride') {
        this.showPF = false
        this.id = '28009'
      } else if (this.motorisation.name === 'Electrique') {
        this.showPF = false
        this.id = '28007'
      }
    }
  }
}
</script>

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
          <v-form v-model="isValid">
            <v-text-field
              v-model="km"
              type="number"
              min="0"
              oninput="validity.valid||(value='');"
              label="Nombre de kilomètres"
              required
            />
            <v-combobox
              v-model="motorisation"
              :items="motorisations"
              item-text="name"
              label="Motorisation"
              return-object
              required
              @input="displayPF()"
            />
            <v-combobox
              v-show="showPF"
              v-model="puissance"
              :items="puissances"
              item-text="name"
              label="Puissance Fiscale"
              return-object
              required
            />
          </v-form>
          <v-row>
            <v-col class="text-right">
              <v-btn
                color="primary"
                :disabled="!isValid"
                @click="calculVoiture()"
              >
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
  name: 'Voitures',
  data: () => ({
    isValid: true,
    showPF: false,
    km: '',
    idVoiture: '',
    results: undefined,
    resultat: 0,
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
    async calculVoiture () {
      if (this.puissance !== null) {
        this.idVoiture = this.puissance.id
      }
      this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.idVoiture + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
      const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
      this.resultat = (this.km * co2).toFixed(0)
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.$emit('carEvent', r, 'voiture')
    },
    displayPF () {
      this.puissance = null
      if (this.motorisation !== null) {
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
          this.idVoiture = '28009'
        } else if (this.motorisation.name === 'Electrique') {
          this.showPF = false
          this.idVoiture = '28007'
        }
      }
    }
  }
}
</script>

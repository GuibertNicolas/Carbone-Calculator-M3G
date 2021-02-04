<template>
  
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

  methods: {
    async calculTransportEnCommun () {
      let co2 = 0
      if (this.rer !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[0].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[0].resultat = parseInt((this.tecs[0].vitesse * this.rer * co2).toFixed(0))
      }
      if (this.metro !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[1].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[1].resultat = parseInt((this.tecs[1].vitesse * this.metro * co2).toFixed(0))
      }
      if (this.tram !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[2].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[2].resultat = parseInt((this.tecs[2].vitesse * this.tram * co2).toFixed(0))
      }
      if (this.bus !== 0) {
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.tecs[3].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.tecs[3].resultat = parseInt((this.tecs[3].vitesse * this.bus * co2).toFixed(0))
      }
      this.resultat = 0
      this.tecs.forEach((tec) => {
        this.resultat += tec.resultat
      })
      this.resultat = this.resultat * 52
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.$emit('tecEvent', r, 'tec')
    }
  }
}
</script>

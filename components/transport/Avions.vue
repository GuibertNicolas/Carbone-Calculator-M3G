<template>
  <v-card class="mb-12">
    <v-row>
      <v-col class="text-center">
        <div
          label="test"
          :class="`rounded`"
          class="pa-4 text-left text-no-wrap outlined"
          outlined
        >
          <!-- -->
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="text-left mx-2"
                color="#006a9e"
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-alert-circle</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title
                class="headline white--text text-center"
                style="background-color: #006a9e"
              >
                Informations - Avions
              </v-card-title>

              <v-card-text>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Catégories
                      </th>
                      <th class="text-left">
                        Distance
                      </th>
                      <th class="text-left">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in informations" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.distance }}</td>
                      <td>{{ item.durée }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- -->
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
              <v-btn color="#006a9e" style="color: white" @click="calculAvion()">
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
export default {
  name: 'Avions',
  data: () => ({
    ccHv: 0,
    mcHv: 0,
    lcHv: 0,
    resultat: 0,
    ccres: 0,
    mcres: 0,
    lcres: 0,
    dialog: '',
    results: undefined,
    informations: [
      {
        name: 'Court-Courrier',
        distance: '[0 - 1000 km]',
        durée: ' < 2h',
        taux: 0.169,
        vitesse: 478
      },
      {
        name: 'Moyen-Courrier',
        distance: '[1000 - 4000 km]',
        durée: ' Entre 2 et 5h',
        taux: 0.132,
        vitesse: 689
      },
      {
        name: 'Long-Courrier',
        distance: '> 4000 km',
        durée: ' > 5h',
        taux: 0.156,
        vitesse: 744
      }
    ]
  }),

  mounted () {
    if (localStorage.ccHv) {
      this.ccHv = localStorage.ccHv
    }
    if (localStorage.mcHv) {
      this.mcHv = localStorage.mcHv
    }
    if (localStorage.lcHv) {
      this.lcHv = localStorage.lcHv
    }
    if (localStorage.avionResultat) {
      this.resultat = localStorage.avionResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    calculAvion () {
      this.ccres = parseInt(this.informations[0].taux * this.informations[0].vitesse * this.ccHv).toFixed(0)
      this.mcres = parseInt(this.informations[1].taux * this.informations[1].vitesse * this.mcHv).toFixed(0)
      this.lcres = parseInt(this.informations[2].taux * this.informations[2].vitesse * this.lcHv).toFixed(0)
      this.resultat = parseInt(this.ccres) + parseInt(this.mcres) + parseInt(this.lcres)
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('planeEvent', r, 'avion')
    },
    saveToLocal () {
      localStorage.ccHv = this.ccHv
      localStorage.mcHv = this.mcHv
      localStorage.lcHv = this.lcHv
      localStorage.avionResultat = this.resultat
    }
  }
}
</script>

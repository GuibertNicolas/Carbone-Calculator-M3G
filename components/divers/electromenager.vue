<template>
  <v-card>
    <v-row class="mb-13">
      <v-col class="text-center" cols="8">
        <div
          label="test"
          :class="`rounded`"
          class="pa-4 text-center text-no-wrap outlined"
          outlined
        >
          <v-row>
            <div v-for="e in electromenager" :key="`${e.name}-content`">
              <v-col class="text-center">
                <v-row>
                  <v-card
                    height="123px"
                    width="123px"
                    color="#fecd33"
                    style="margin-right: 5px"
                    @click="
                      dialog = true;
                      itemValue = e.name;
                    "
                  >
                    <v-row justify="center">
                      <v-col class="text-center" style="padding-bottom: 0px">
                        <img
                          :src="e.src"
                          :alt="e.alt"
                          height="55px"
                          width="55px"
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center" style="padding-top: 0px">
                        <span style="color: white">{{ e.name }}</span>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-row>
              </v-col>
            </div>
          </v-row>
          <v-row>
            <div>Liste de mes produits :</div>
          </v-row>
          <v-row class="mb-10">
            <v-col cols="8">
              <v-virtual-scroll
                :items="listElectro"
                height="270"
                item-height="64"
              >
                <template #default="{ item }" fluid>
                  <v-list-item :key="listElectro.indexOf(item)">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.age }}
                        <template v-if="item.age === 0 || item.age === 1">
                          an
                        </template>
                        <template v-else>
                          ans
                        </template>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        small
                        @click="
                          removeToList(item.name, listElectro.indexOf(item))
                        "
                      >
                        mdi-delete
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider />
                </template>
              </v-virtual-scroll>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col>
        <div class="fill-height" style="color: #fecd33">
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
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title
          class="headline white--text text-center"
          style="background-color: #fecd33"
        >
          Informations complémentaires
        </v-card-title>
        <v-spacer />
        <v-select
          v-model="age"
          style="width: 75%; padding-left: 25%"
          :items="years"
          label="Année d'achat"
        />
        <v-card-actions>
          <v-btn
            class="white--text"
            color="#fecd33"
            :disabled="btnAvaible"
            @click="addToList(itemValue, age)"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Electromenager',
  data: () => ({
    dialog: false,
    years: [],
    year: undefined,
    age: 0,
    itemValue: '',
    btnAvaible: true,
    electromenager: [
      {
        id: 26984,
        name: 'Lave-Vaisselle',
        src: '/icon/electromenager/dishwasher.png',
        alt: 'Icone chaussures en cuire',
        score: 0
      },
      {
        id: 26983,
        name: 'Lave-Linge',
        src: '/icon/electromenager/washing-machine.png',
        alt: 'Icone chaussures en tissus',
        score: 0
      },
      {
        id: 26986,
        name: 'Four',
        src: '/icon/electromenager/oven.png',
        alt: 'Icone jean',
        score: 0
      },
      {
        id: 26989,
        name: 'Micro Onde',
        src: '/icon/electromenager/microwave.png',
        alt: 'Icone T-Shirt',
        score: 0
      },
      {
        id: 26990,
        name: 'Aspirateur',
        src: '/icon/electromenager/vaccum-cleaner.png',
        alt: 'Icone chemise',
        score: 0
      }
    ],
    listElectro: [],
    resultat: 0,
    results: undefined
  }),

  watch: {
    age () {
      if (this.age) {
        this.btnAvaible = false
      }
    },
    listElectro () {
      this.calculElectromenager()
    }
  },

  created () {
    this.year = parseInt(new Date().toISOString().substr(0, 10))
    for (let i = this.year; i >= 1950; i--) {
      this.years.push(i)
    }
  },

  mounted () {
    if (localStorage.menager) {
      this.listElectro = JSON.parse(localStorage.menager)
    }
    if (localStorage.menagerResultat) {
      this.resultat = localStorage.menagerResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    addToList (s, a) {
      this.listElectro.push({ name: s, age: this.year - a })
      this.dialog = false
      this.itemValue = ''
      this.btnAvaible = true
      this.age = 0
    },
    removeToList (s, index) {
      this.listElectro.splice(index, 1)
    },
    async calculElectromenager () {
      this.resultat = 0
      let i = 0
      for (i = 0; i < this.listElectro.length; i++) {
        const index = this.electromenager.findIndex(o => o.name === this.listElectro[i].name)
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.electromenager[index].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.resultat += parseInt(co2 / (this.listElectro[i].age + 1))
      }
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('menagerEvent', r, 'menager')
    },
    saveToLocal () {
      localStorage.menagerResultat = this.resultat
      localStorage.menager = JSON.stringify(this.listElectro)
    }
  }
}
</script>

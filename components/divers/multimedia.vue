<template>
  <v-card>
    <v-row class="mb-13">
      <v-col class="text-center" cols="8">
        <div
          label="test"
          :class="`rounded`"
          class="pa-4 text-left text-no-wrap outlined"
          outlined
        >
          <v-dialog v-model="dialogInfo" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="text-left mx-2"
                color="#fecd33"
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
                style="background-color: #fecd33"
              >
                Informations de calcul
              </v-card-title>
              <v-spacer />
              <v-card-text class="subtitle-1 text-center">
                <br>
                Résultat = Impact carbone / (Age de l'appareil + 1)
              </v-card-text>
              <v-spacer />
              <v-card-subtitle class="text-center">
                Exemple : Si vous achetez une enceinte en {{ year - 1 }} le résultat sera :
                <v-spacer />
                impact carbone (= 8) / ( 1 + 1) = 4 KgCO<sub>2</sub>
              </v-card-subtitle>
            </v-card>
          </v-dialog>
          <v-row>
            <div v-for="e in multimedia" :key="`${e.name}-content`">
              <v-col class="text-center">
                <v-row>
                  <v-card
                    height="123px"
                    width="123px"
                    color="#fecd33"
                    style="margin-right: 5px"
                    @click="
                      displayDialog(e.name)
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
          <v-row class="mb-10 text-center">
            <v-col cols="8">
              <v-virtual-scroll
                :items="listMultimedia"
                height="270"
                item-height="64"
              >
                <template #default="{ item }" fluid>
                  <v-list-item :key="listMultimedia.indexOf(item)">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }} {{ item.option.size }}
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
                          removeToList(item.name, listMultimedia.indexOf(item))
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
    <v-dialog
      v-model="dialog"
      width="500"
      @input="
        btnAvaible = true;
        itemValue = '';
        age = 0;
        option = '';"
    >
      <v-card>
        <v-card-title
          class="headline white--text text-center"
          style="background-color: #fecd33"
        >
          Informations complémentaires :
        </v-card-title>
        <v-spacer />
        <v-select
          v-model="age"
          style="width: 75%; padding-left: 25%"
          :items="years"
          label="Année d'achat"
        />
        <template v-if="displayOption">
          <v-select
            v-model="option"
            style="width: 75%; padding-left: 25%"
            :items="options"
            return-object
            item-text="size"
            label="Catégorie"
          />
        </template>
        <v-card-actions>
          <v-btn
            class="white--text"
            color="#fecd33"
            :disabled="btnAvaible"
            @click="addToList(itemValue, option, age)"
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
  name: 'Multimedia',
  data: () => ({
    dialog: false,
    displayOption: false,
    years: [],
    year: undefined,
    age: 0,
    itemValue: '',
    btnAvaible: true,
    options: [],
    option: '',
    multimedia: [
      {
        name: 'Smartphone',
        src: '/icon/multimédias/mobile-phone.png',
        alt: 'Icone Smartphone',
        score: 0,
        cat: [
          {
            id: 27011,
            size: '< 4.5 pouces'
          },
          {
            id: 27012,
            size: '= 5 pouces'
          },
          {
            id: 27013,
            size: '> 5.5 pouces'
          }
        ]
      },
      {
        name: 'Télévision',
        src: '/icon/multimédias/monitor.png',
        alt: 'Icone Télévision',
        score: 0,
        cat: [
          {
            id: 26999,
            size: '30 - 40 pouces'
          },
          {
            id: 27000,
            size: '40 - 49 pouces'
          },
          {
            id: 27001,
            size: '> 50 pouces'
          }
        ]
      },
      {
        name: 'Ordianteurs',
        src: '/icon/multimédias/laptop.png',
        alt: 'Icone Pc',
        score: 0,
        cat: [
          {
            id: 27002,
            size: 'Portable'
          },
          {
            id: 27003,
            size: 'Fixe'
          },
          {
            id: 27004,
            size: 'Haute performance'
          }
        ]
      },
      {
        name: 'Tablette',
        src: '/icon/multimédias/tablet.png',
        alt: 'Icone Tablette',
        score: 0,
        cat: [
          {
            id: 27007,
            size: 'Classique'
          },
          {
            id: 27008,
            size: 'Mini'
          },
          {
            id: 27009,
            size: 'Détachable'
          }
        ]
      },
      {
        name: 'Console',
        src: '/icon/multimédias/playstation.png',
        alt: 'Icone Console',
        score: 0,
        cat: [
          {
            id: 27024,
            size: 'Portable'
          },
          {
            id: 27023,
            size: 'Fixe'
          }
        ]
      },
      {
        name: 'Enceinte',
        src: '/icon/multimédias/speaker.png',
        alt: 'Icone Enceinte',
        score: 0,
        cat: [
          {
            id: 27017
          }
        ]
      },
      {
        name: 'Montre Connectée',
        src: '/icon/multimédias/smart-watch.png',
        alt: 'Icone Montre Connectée',
        score: 0,
        cat: [
          {
            id: 27031
          }
        ]
      },
      {
        name: 'Imprimante',
        src: '/icon/electromenager/printer.png',
        alt: 'Icone Imprimante',
        score: 0,
        cat: [
          {
            id: 27027
          }
        ]
      }
    ],
    listMultimedia: [],
    resultat: 0,
    results: undefined
  }),

  watch: {
    age () {
      if (this.options.length === 1 && this.age) {
        this.btnAvaible = false
      } else if (this.options.length >= 1 && this.age && this.option) {
        this.btnAvaible = false
      }
    },
    option () {
      if (this.options.length >= 1 && this.age && this.option) {
        this.btnAvaible = false
      }
    },
    listMultimedia () {
      this.calculMultimedia()
    }
  },

  created () {
    this.year = parseInt(new Date().toISOString().substr(0, 10))
    for (let i = this.year; i >= 1950; i--) {
      this.years.push(i)
    }
  },

  mounted () {
    if (localStorage.media) {
      this.listMultimedia = JSON.parse(localStorage.media)
    }
    if (localStorage.mediaResultat) {
      this.resultat = localStorage.mediaResultat
      this.fireEvent(this.resultat)
    }
  },

  methods: {
    displayDialog (s) {
      const index = this.multimedia.findIndex(o => o.name === s)
      this.displayOption = this.multimedia[index].cat.length > 1
      this.options = this.multimedia[index].cat
      this.dialog = true
      this.itemValue = s
    },
    addToList (s, o, a) {
      this.listMultimedia.push({ name: s, option: o, age: this.year - a })
      this.dialog = false
      this.itemValue = ''
      this.age = 0
      this.option = ''
      this.btnAvaible = true
    },
    removeToList (s, index) {
      this.listMultimedia.splice(index, 1)
    },
    async calculMultimedia () {
      this.resultat = 0
      let i = 0
      for (i = 0; i < this.listMultimedia.length; i++) {
        const indexCat = this.multimedia.findIndex(o => o.name === this.listMultimedia[i].name)
        let indexOption = this.multimedia[indexCat].cat.findIndex(o => o.id === this.listMultimedia[i].option.id)
        if (indexOption === -1) {
          indexOption = 0
        }
        this.results = await axios.get('https://koumoul.com/s/data-fair/api/v1/datasets/base-carbone(r)/lines?format=json&q=' + this.multimedia[indexCat].cat[indexOption].id + '&q_mode=simple').then(response => (this.results = response.data.results[0]))
        const co2 = parseFloat(this.results.Total_poste_non_décomposé.replace(',', '.'))
        this.resultat += parseInt(co2 / (this.listMultimedia[i].age + 1))
      }
      this.fireEvent(this.resultat)
    },
    fireEvent (r) {
      this.saveToLocal()
      this.$emit('mediaEvent', r, 'media')
    },
    saveToLocal () {
      localStorage.mediaResultat = this.resultat
      localStorage.media = JSON.stringify(this.listMultimedia)
    }
  }
}
</script>

<template lang="pug">
    v-container(
      fluid
      fill-height
      px-0
      py-0
    )
      v-row(
        style="height: 100%;"
        no-gutters
      )
        v-col(cols="3")
          v-list()
              v-list-item(
                v-for="(item, i) in lists"
                :key="i"
                @click=""
              )
                v-list-item-content
                  v-list-item-title(class="text-center")
                    | {{ item.name }}
        v-col(cols="9" style="z-index: 1;")
            l-map(
              :zoom="zoom"
              :center="center"
              style="height: 100%; width: 100%"
            )
              l-tile-layer(
                :url="url"
              )
              v-marker-cluster(:options="clusterOptions")
                l-marker(v-for="(item, i) in address" :lat-lng="[item.lat, item.lon]" :key="i")
                  l-popup(style="margin:0;")
                    v-list(max-height="400px" dense class="overflow-y-auto")
                      v-subheader Ответы
                      v-list-item-group
                        v-list-item(v-for="(point, i) in item.points" v-text="point.name" :to="`/response/${point.response}`" :key="i")
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'
import { latLng, Icon, icon } from 'leaflet'
import Vue2LeafletMarkercluster from '@/components/Vue2LeafletMarkercluster'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Checklists',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    'v-marker-cluster': Vue2LeafletMarkercluster
  },
  data: () => ({
    icon: icon(Object.assign({},
      Icon.Default.prototype.options,
      { iconUrl, shadowUrl }
    )),
    zoom: 13,
    center: latLng(53.764315, 87.1142745),
    url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    withPopup: latLng(47.41322, -1.219482),
    withTooltip: latLng(47.41422, -1.250482),
    currentZoom: 11.5,
    currentCenter: latLng(47.41322, -1.219482),
    showParagraph: false,
    mapOptions: {
      zoomSnap: 0.5
    },
    showMap: true,
    clusterOptions: {}
  }),
  computed: {
    ...mapState({
      filledLists: state => state.filledChecklists.filledLists,
      lists: state => state.checklists.lists,
      address: state => state.filledChecklists.address
    }),
    getFilledListsByChecklistId (checklistId) {
      return this.filledLists
        .filter(item => item.id === checklistId)
        .reduce((accumulator, currentValue, i, arr) => {
          this.FETCH_FILLED_CHECKLIST(currentValue.id)
          accumulator.push()
        }, [])
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit('SET_LOADING_STATUS', false)
      this.clusterOptions = { disableClusteringAtZoom: 11 }
    })
  },
  created () {
    // this.$store.commit('SET_LOADING_STATUS', true)
    this.FETCH_CHECKLISTS()
    this.FETCH_MAP()
  },
  methods: {
    ...mapActions({
      FETCH_MAP: 'filledChecklists/FETCH_MAP',
      FETCH_CHECKLISTS: 'checklists/FETCH_CHECKLISTS',
      FETCH_FILLED_CHECKLISTS: 'filledChecklists/FETCH_FILLED_CHECKLISTS'
    })
  }
}
</script>

<style scoped>
  @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
  .leaflet-popup-content {
    margin: 0;
    background: blue;
  }
</style>

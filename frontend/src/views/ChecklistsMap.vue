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
              l-marker(v-for="(item, i) in address" :lat-lng="item")
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet';
import { latLng } from 'leaflet'

import { mapState, mapGetters, mapActions } from 'vuex'
import types from '@/store/types'

export default {
  name: 'Checklists',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data() {
    return {
      zoom: 13,
      center: latLng(53.764315, 87.1142745),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
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
      showMap: true
    };
  },
  computed: {
    ...mapState({
      filledLists: state => state.filledChecklists.filledLists,
      lists: state => state.checklists.lists,
      address: state => state.filledChecklists.address,
    }),
    getFilledListsByChecklistId(checklistId) {
      this.filledLists
        .filter(item => item.id === checklistId)
        .reduce((accumulator, currentValue, i, arr) => {
          this.FETCH_FILLED_CHECKLIST(currentValue.id)
          accumulator.push()
      }, [])
    }
  },
  created () {
    this.FETCH_CHECKLISTS()
    this.FETCH_FILLED_CHECKLISTS()
  },
  methods: {
    ...mapActions([
      types.FETCH_FILLED_CHECKLISTS,
      types.FETCH_CHECKLISTS,
      types.FETCH_FILLED_CHECKLISTS
    ]),
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    }
  }
}
</script>
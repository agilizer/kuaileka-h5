<template>
  <div :id="meid" class="mescroll">
    <div>
      <div id="data-empty"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import MeScroll from 'mescroll.js/mescroll.min'
  import 'mescroll.js/mescroll.min.css'

  export default {
    name: 'MeScroll',
    data: function() {
      return {
        _me: {},
      }
    },
    props: {
      meid: {
        type: String,
        default: 'mescroll'
      },
      up: {
        default: () => {
          return {
            use: true,
            //          clearEmptyId: 'data-empty'
          }
        },
        type: Object
      },
      down: {
        default: () => {
          return {
            use: true,
            auto: false
          }
        },
        type: Object
      }
    },
    mounted: function() {
      var up = null
      var down = null
      if(this.up) {
        up = Object.assign({}, this.up)
        up.callback = this.callUp
      } else {
        up = {}
        up.callback = this.callUp
      }
      if(this.down) {
        down = Object.assign({}, this.down)
        down.callback = this.callDown
      } else {
        down = {}
        down.callback = this.callDown
      }

      var _me = new MeScroll(this.meid, {
        up: up,
        down: down
      });
      this._me = _me
      this.$emit('init', _me)
    },
    methods: {
      callUp: function(page, mescroll) {
        this.$emit('up', page, mescroll)
      },
      callDown: function(mescroll) {
        this.$emit('down', mescroll)
      }
    }
  }
</script>
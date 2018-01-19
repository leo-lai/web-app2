<template>
  <transition name="slideUp">
    <div class="l-keyboard" v-show="isShow" @click="hide">
      <div class="_inner" @click.stop>
        <div class="l-keyboard-bar">
          <span style="color:#666;" @click="clear">清除输入</span>
          <a class="l-keyboard-bar-done" @click="done">完成</a>
        </div>
        <table>
          <tbody>
            <tr v-for="n in Math.ceil(keys.length / 3)">
              <td v-for="m in 3" class="l-keyboard-key" :class="keys[(n-1) * 3 + (m-1)].cls" @touchstart="clickKey(keys[(n-1) * 3 + (m-1)].value)">
                <span > {{ keys[(n-1) * 3 + (m-1)].label }} </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </transition>
</template>
<script>
module.exports = {
  props: {
    nkType: {
      type: String,
      default: 'digit' // number idcard digit
    },

    nkLength: {
      type: Number,
      default: 18
    }
  },
  data: function() {
    return {
      isShow: false,
      inputValue: '',

      keys: [
        {
          label: '1',
          value: '1'
        }, {
          label: '2',
          value: '2'
        }, {
          label: '3',
          value: '3'
        }, {
          label: '4',
          value: '4'
        }, {
          label: '5',
          value: '5'
        }, {
          label: '6',
          value: '6'
        }, {
          label: '7',
          value: '7'
        }, {
          label: '8',
          value: '8'
        }, {
          label: '9',
          value: '9'
        }, {
          cls: '_dot',
          label: '·',
          value: '.'
        }, {
          label: '0',
          value: '0'
        }, {
          cls: '_del',
          label: '删除',
          value: '-'
        }
      ]
    };
  },
  methods: {
    clickKey: function(val) {
      let valArr = this.inputValue.split('.')

      if(val === '-'){ // 删除键
        this.inputValue = this.inputValue.substring(0, this.inputValue.length - 1)
      }else{
        if(this.inputValue.length < this.nkLength){
          switch(val){
            case '':
              break
            case '.': // 小数点
              if(this.inputValue === ''){
                this.inputValue = '0.'
              }else if(valArr.length === 1){
                this.inputValue += val
              }
              break
            case 'X': // 身份证号的x
              this.inputValue += val  
              break
            default:
              if(valArr.length > 1){
                if(valArr[1].length < 2){
                  this.inputValue += val  
                }
              }else{
                this.inputValue += val
              }
              break
          }
        }
      }
      this.inputEvent()
    },

    show() {
      switch(this.nkType){
        case 'digit':
          this.keys[9].label = '.'
          this.keys[9].value = '.'
          break
        case 'number':
          this.keys[9].label = ''
          this.keys[9].value = ''
          break
        case 'idcard':
          this.nkLength = 18
          this.keys[9].label = 'X'
          this.keys[9].value = 'X'
          break
      }

      this.isShow = true
      if(this.input && this.input.tagName){
        this.inputValue = this.input.value || this.input.innerText
      }
    },

    hide() {
      this.isShow = false
      this.inputEvent()
    },

    done() {
      if(this.inputValue){
        this.inputEvent(Number(this.inputValue).toFixed(2))
      }
      this.hide()
    },

    clear() {
      this.inputValue = ''
      this.inputEvent()
    },
    inputEvent(val) {
      this.$emit('$keyboard:input', val || this.inputValue, this.input, this.data)
    }
  },
  mounted() {
    this.$on('$keyboard:show', (input, data) => {
      this.input = input
      this.data = data
      this.show()
    })
  },
  beforeDestroy() {
    this.hide()
  },
  beforeRouteLeave(to, from, next) {
    this.hide()
    next()
  }
};
</script>
<style scoped lang="less">
.l-keyboard {
  user-select: none;  position: fixed; bottom: 0; left: 0; width: 100%; z-index: 9000;
  ._inner{ position: relative; z-index: 1; background: #fff; } 
  &:before{
    width: 100%; height: 300%; background: rgba(0, 0, 0, 0);
    content: ''; position: absolute; top: -300%; left: 0; z-index: 0; 
  }
  &-bar {
    overflow: hidden;
    background: #f0f1f3;
    border-top: 1px solid #9a9a9c;
    padding: 0.5rem; position: relative; z-index: 1;
    &-done{
      float: right; font-size: 0.75rem; font-weight: 500; padding: 0.5rem; margin: -0.5rem;
    }
  }
  table {
    width: 100%; table-layout: fixed; border: none; margin-top: -0.05rem; border-collapse: collapse;
    td {
      font-size: 1.2rem;
      border-top: 0.05rem solid #ccc; text-align: center; vertical-align: middle; height: 2.6rem; color: #000;
    }
    td + td {
      border-left: 0.05rem solid #ccc;
    }
  }
  &-key:active {
    background: #d1d4dd;
  }

  &-key._dot{
    background: #d1d4dd;
    &:active{
      background: #fff;
    }
  }
  &-key._del{
    background: #d1d4dd url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAABTCAYAAABDLVPuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJDM0NFRkVFNjJEQjExRTdBQ0ZCQ0IzOEU4RkVBRDExIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJDM0NFRkVGNjJEQjExRTdBQ0ZCQ0IzOEU4RkVBRDExIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkMzQ0VGRUM2MkRCMTFFN0FDRkJDQjM4RThGRUFEMTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkMzQ0VGRUQ2MkRCMTFFN0FDRkJDQjM4RThGRUFEMTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4pTkFBAAADxElEQVR42uzdi23bMBAA0HMm8AjuBtkg3qDZIOwE9QjaoN3A6gT2Bk0msDuBtYHdCVQJodA4II/U9+7IO+CAADISmi+SSJ4+q7quQUN+rBi2ad3k1yaf7c/bjH1em6yaPDb51uTN9SFuO+OmyX3bLk1nXpp84Q75vcmrYkXlniuk7oX988ANUhGHZ/ERckWMaJDtv+xJ/pbxYGdj++jJs/1LOxii3COxPfFov4DG/yg8ffWT8tC6QxBLNfPG0TOSJYE0ijjqMOvqt83SkIo4PipH322XhDSBc6JG/EoPGeQjgni2y3AazCEfkRUbRRQCqYgJQGKIlSLKgFzb+Y0L8WaRNZhDtognRZQNqYgJQGKItSLKgTwgiEb7XwbkXhHlQ3JDXNs2UU5vDDgux+AMiSHuiBC78/SJCNMAcm0NR0huNUXXYGtpTAMRF0pxgjTArxzlGzEvhYn1ScERkiNiqF1zY2J/e+o15UkgsQZzqClSYC6JOAmklJrikpiGoE9GQUorRy2BaYj+sQdDSq0pzolpCI9OgyCl1xTnwKREHASZSk1xSkxqxN6QqZWjpsDkgNgLMtWa4hhMLojRkKnXFIdgckKMhsyhptgHkxtiFGQB+dQUYzA5IgYh18g0IzXEGMwL41UsFNL3pXaQdmCYXBdAUEjXfXevkEcYQYgo5IOngbncIVU2+S3wmT/w/qwf1rfAP4BGKMQ8Gsx1aP2th1bSy0Z0sDPjYIcDZnD6cdPpx11lhyumLgj0XLExTDGDkL5zZU5LdJ+nGBwxoyDX9svkuGjumydyw4yCDGFeIc0yVmiyzwkzGjJFzDGI3DB7QXaYVQKYUyBywuwNCRbLNy25gOyLr4aunVJjDoIMYZ5A5uWQYxfAKTEHQ0rEnBORGnMUZIdZC8BcApESczRkqOGHzBCpMCeBDDV8nxkiBeZkkFwxz0Bb2cf6pOAK2caOGaZrEWPpyzNcmCXXQ+vHKIHfwyDOQHuNjYF57+CeBTKEaYgwS6B/PEs50++eDZIjZsoxK2QbR8VMAzL1WmY2kCHMq2LKgVTMhCA7zEox5UMCyK9lKmQk5kkx5UAqZkKQHWatmPIhAfjXMhVyIsy9GkXFhQOkYo6LDTB5EWgXO8UcFK7H57TzddLX15eBc+ZG3e7iBwRelk35+voW8yWwXV9f/3462jq2/bUzAtLX18fsmZp4Fl0ncoBUzGF599QVLpDdAOimQFFZfu48TpDd+UD3TvzZBsbVcdSDHV+0S3bPNtufnzIe7LxZwCMgD7FqIf8JMAB6O3YYZoHArgAAAABJRU5ErkJggg==) no-repeat 50% 50%;
    background-size: 1.6rem; font-size: 0;
    &:active{
      background-color: #fff ;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAABTCAYAAABDLVPuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFGRDI4ODBFNjJEQjExRTc5N0M4QkYzMzM1REI2MzBGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFGRDI4ODBGNjJEQjExRTc5N0M4QkYzMzM1REI2MzBGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUZEMjg4MEM2MkRCMTFFNzk3QzhCRjMzMzVEQjYzMEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUZEMjg4MEQ2MkRCMTFFNzk3QzhCRjMzMzVEQjYzMEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz705o/+AAADvklEQVR42uzdzY4SQRAA4GZ9AHgD8MYN3oD1CfDoDUy8u4kvMG8AbzDj3cQxMdHbjHcTRs8mrAdPe2CIJh7bKTLg6s4MA/RPVXdVUsmuMVnoL91pumqajsAd10XOihwIfyIr812ROeU30ivyVZF3RUrP82eRH4qcluNCImDWhYxXmz/K1Ql1vCxyw1itMsSKyLPw9HzLiO5kwIju5IAR3cilTcQbBlCWd7YQ5zz49JdXRtSTLxjRjXxjCnHMg6014VxWdAwgJpTOCYlGp8OIDMmIeOKxDkjAWwm/aoi248mVBsSEEc3HlQbEMQ8rXUhGdAQyZES78UgR4jObb2I0GonhcLj7ebvdWh/Ufr8vxuOxydfzWgWi1ZONxWIh97HZbORsNrP6euDv34/pdGri716TRux2u7IqbGH+jwixXq9RQ6KoKRbLl6wL05hViPtVAivkXCA6NE6SxDpmHSIELP0YIVEhQvZ6PblaraxhNiGGYWhqHK5JI9rGRIJ4EiT6mqJpTESIrSEBMRcEiqymMJEhtoIkg2gKEyHiUUhyiLoxkSI2QsIh+HdBuJdFNSZixFpIQPwqHGhMUoWJHLES0hlEVZgEEB9AOod4KSYRxAeQ711EPBeTEOI/kIHLiKdiEkM8QMKS+tsHyDaYAEUM8QA59wWxLSYxxANk4hvkqZjIEQ+Qn32EbItJAHEHCV10v3ztPMvzXERR1Ph/0jQl835iX2dk0+4UQw8Qb3YUIhLBPHz8yBnxb7MUQUy/DgTafNi33QOk4ogu9h0RS0OXikPzzHdEopiVZazMd0SCmLWF5cx3RGKYja0et74jEsJ0s/lKRykKOaZ77ZA664mIMd1qUDZRFEaK6c4jAyYr+wgx3XiIx0Z7BjJM+o/V2eyxQYRJ/0FX241SxzAnkwk/en4s6+4QMF3Zb8KEf8cMCRHZhqy7Q8BGe0YdJuY7BFBhwq0ZWHpsqjANvZ6LIa1jDgYDGcexTNNUBkGAoqEriqLd61kul7vfTUCquuYTaplTwWErlF3zCTvZLzye9kIVZF6u04xpKVTfoAzlL2gEHfHQGg1tV2FDYbrP42tuQuq8nB5mZpfHmOTKSr+WSTAzlZudqsjKDdCWJ4zW+KYb8j4mh774aAJyj/mcx5v2jNxHxJhuxZw3J/S/CHQf/NW86vLW9syMGEFJLjEss4x5WeYC0XeQMeb5GWDbADHm6Rlj3c3e8HFe64ywfzQZ8Ow8ukOdWzk1PzOgDPa0TPh54vHn7k8lYNy0nEopxR8BBgDcqVjZKIcWCAAAAABJRU5ErkJggg==); 
    }
  }
}

.slideUp-enter-active, .slideUp-leave-active {
  transform: translate3d(0, 0, 0);
  transition: transform cubic-bezier(0.250, 0.460, 0.450, 0.940) 300ms;
  perspective: 1000;
  backface-visibility: hidden;
}
.slideUp-enter, .slideUp-leave-to{
  transform: translate3d(0, 100%, 0);
}
</style>

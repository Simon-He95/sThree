<script lang="ts">
import { useCounter } from '@vueuse/core'
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    initial: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const counter = useCounter(props.initial)
    return () => h('div', [
      counter.count.value,
      h('button', { class: 'inc', onClick: () => counter.inc() }, '+'),
      h('button', { class: 'dec', onClick: () => counter.dec() }, '-'),
    ])
  },
})
</script>

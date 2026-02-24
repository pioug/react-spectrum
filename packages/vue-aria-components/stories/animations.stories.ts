import {VuePopover} from 'vue-aria-components';
import {ref} from 'vue';

export default {
  title: 'React Aria Components - Animations'
};

export let ModalAnimation = {
  render: () => ({
    components: {
      VuePopover
    },
    setup() {
      let open = ref(false);
      return {
        open
      };
    },
    template: `
      <div class="App">
        <button type="button" @click="open = true">Open modal</button>
        <VuePopover
          :open="open"
          placement="bottom"
          @close="open = false">
          <div style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 20px; min-width: 280px;">
            <h3 style="margin: 0 0 8px 0;">Notice</h3>
            <p style="margin: 0 0 12px 0;">This is a modal with a custom modal overlay.</p>
            <button type="button" @click="open = false">Close</button>
          </div>
        </VuePopover>
      </div>
    `
  })
};

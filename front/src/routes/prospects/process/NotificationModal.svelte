<!-- Modal de notificación -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let show: boolean = false;
  export let message: string = '';
  export let type: 'success' | 'error' = 'success';
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }
</script>

{#if show}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        {type === 'error' ? 'Error' : 'Notificación'}
      </h3>
      <p>{message}</p>
      <div class="modal-action">
        <button class="btn btn-primary" on:click={closeModal}>Cerrar</button>
      </div>
    </div>
  </div>
{/if}

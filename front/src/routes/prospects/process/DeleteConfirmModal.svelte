<!-- Modal de confirmación para eliminar -->
<script lang="ts">
  type Prospect = {
    id: number;
    name: string;
    email: string;
    company: string;
    status: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    identification?: string;
  };

  import { createEventDispatcher } from 'svelte';
  export let show: boolean;
  export let prospect: Prospect | null;
  const dispatch = createEventDispatcher();

  function close(): void {
    dispatch('close');
  }
  function confirm(): void {
    dispatch('confirm', { prospect });
  }
</script>

{#if show && prospect}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirmar Eliminación</h3>
      <p>¿Estás seguro de eliminar el prospecto <strong>{prospect.name}</strong>? La eliminación es de tipo soft delete.</p>
      <div class="modal-action">
        <button class="btn btn-error" on:click={confirm}>Eliminar</button>
        <button class="btn" on:click={close}>Cancelar</button>
      </div>
    </div>
  </div>
{/if}


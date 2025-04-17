<!-- Modal para editar prospecto -->
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

  export let show: boolean;
  export let prospect: Prospect | undefined;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Siempre inicializa localProspect con un valor válido si hay prospect
  let localProspect: Prospect;
  $: localProspect = prospect ? { ...prospect } : {
    id: 0,
    name: '',
    email: '',
    company: '',
    status: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    identification: ''
  };

  function close(): void {
    dispatch('close');
  }
  function save(): void {
    if (prospect) {
      dispatch('save', { prospect: localProspect });
    }
  }
</script>

{#if show && prospect}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Editar Prospecto</h3>
      <div class="py-2">
        <label for="name" class="label">Nombre</label>
        <input id="name" type="text" class="input input-bordered w-full" bind:value={localProspect.name} />
      </div>
      <div class="py-2">
        <label for="email" class="label">Email</label>
        <input id="email" type="email" class="input input-bordered w-full" bind:value={localProspect.email} />
      </div>
      <div class="py-2">
        <label for="phone" class="label">Teléfono</label>
        <input id="phone" type="text" class="input input-bordered w-full" bind:value={localProspect.phone} />
      </div>
      <div class="py-2">
        <label for="country" class="label">País</label>
        <input id="country" type="text" class="input input-bordered w-full" bind:value={localProspect.country} />
      </div>
      <div class="py-2">
        <label for="state" class="label">Estado</label>
        <input id="state" type="text" class="input input-bordered w-full" bind:value={localProspect.state} />
      </div>
      <div class="py-2">
        <label for="city" class="label">Ciudad</label>
        <input id="city" type="text" class="input input-bordered w-full" bind:value={localProspect.city} />
      </div>
      <div class="py-2">
        <label for="identification" class="label">Identificación</label>
        <input id="identification" type="text" class="input input-bordered w-full" bind:value={localProspect.identification} />
      </div>
      <div class="modal-action">
        <button class="btn btn-primary" on:click={save}>Guardar</button>
        <button class="btn" on:click={close}>Cancelar</button>
      </div>
    </div>
  </div>
{/if}

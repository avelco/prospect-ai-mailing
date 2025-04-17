<!-- Tabla de prospectos con selección y acciones -->
<script lang="ts">
  // Tipos explícitos
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
  export let prospects: Prospect[];
  export let selectedProspects: Prospect[];
  export let isLoading: boolean;

  const dispatch = createEventDispatcher();

  function isSelected(prospect: Prospect): boolean {
    return selectedProspects.some((p: Prospect) => p.id === prospect.id);
  }
  function handleToggleSelection(prospect: Prospect) {
    dispatch('toggleSelection', { prospect });
  }
  function handleToggleSelectAll() {
    dispatch('toggleSelectAll');
  }
  function handleEdit(prospect: Prospect) {
    dispatch('edit', { prospect });
  }
  function handleDelete(prospect: Prospect) {
    dispatch('delete', { prospect });
  }
</script>

<div class="card bg-base-200 shadow-xl mb-6">
  <div class="card-body">
    <h2 class="card-title flex justify-between">
      <span>Prospectos disponibles</span>
      <span class="badge badge-primary">{selectedProspects.length} seleccionados</span>
    </h2>
    {#if isLoading}
      <div class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if prospects.length === 0}
      <div class="flex flex-col items-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>No hay prospectos disponibles. Por favor, importe algunos primero.</span>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead class="bg-base-300">
            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" 
                    checked={selectedProspects.length === prospects.length} 
                    onchange={handleToggleSelectAll} 
                  />
                </label>
              </th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Compañía</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each prospects as prospect}
              <tr class="hover">
                <td>
                  <label>
                    <input type="checkbox" class="checkbox"
                      checked={isSelected(prospect)} 
                      onchange={() => handleToggleSelection(prospect)}
                    />
                  </label>
                </td>
                <td>{prospect.name}</td>
                <td>{prospect.email}</td>
                <td>{prospect.company}</td>
                <td>
                  <div class="badge {prospect.status === 'Nuevo' ? 'badge-accent' : 'badge-success'}">
                    {prospect.status}
                  </div>
                </td>
                <td>
                  <button aria-label="Editar prospecto" onclick={() => handleEdit(prospect)} title="Editar"></button>
                  <button aria-label="Eliminar prospecto" onclick={() => handleDelete(prospect)} title="Eliminar"></button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>


<!-- Panel de estado de procesamiento (opcional) -->
<script lang="ts">
  export let processStatus = { status: 'idle', message: '', completedCount: 0, totalCount: 0 };

</script>

{#if processStatus.status === 'idle'}
  <div class="py-4 flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-base-content/60">Seleccione prospectos y presione 'Procesar' para iniciar</p>
  </div>
{:else if processStatus.status === 'processing'}
  <div class="py-4">
    <p class="mb-3">{processStatus.message}</p>
    <progress class="progress progress-primary w-full" value={processStatus.completedCount} max={processStatus.totalCount}></progress>
    <p class="text-sm text-right mt-1">{processStatus.completedCount}/{processStatus.totalCount} completados</p>
  </div>
{:else if processStatus.status === 'completed'}
  <div class="alert alert-success">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{processStatus.message}</span>
  </div>
  <p class="text-sm mt-2">Se procesaron {processStatus.totalCount} prospectos exitosamente.</p>
{/if}


<script lang="ts">
	type Prospect = {
		id: number;
		name: string;
		email: string;
		company: string;
		status: string;
	};

	type PageData = {
		prospects: Prospect[];
		title: string;
		meta: {
			description: string;
		};
	};

	type ProcessStatus = {
		status: string;
		message: string;
		completedCount: number;
		totalCount: number;
	};

	const { data } = $props<{data: PageData}>();
	console.log(data)
	const prospects = data.prospects;
	let selectedProspects = $state<Prospect[]>([]);
	let isLoading = $state(false);
	let processStatus = $state<ProcessStatus>({ 
		status: 'idle', 
		message: '', 
		completedCount: 0, 
		totalCount: 0 
	});

	// Toggle selection of a prospect
	function toggleSelection(prospect: Prospect) {
		const index = selectedProspects.findIndex((p: Prospect) => p.id === prospect.id);
		if (index === -1) {
			$effect(() => {
				selectedProspects = [...selectedProspects, prospect];
			});
		} else {
			$effect(() => {
				selectedProspects = selectedProspects.filter((p: Prospect) => p.id !== prospect.id);
			});
		}
	}

	// Check if a prospect is selected
	function isSelected(prospect: Prospect): boolean {
		return selectedProspects.some((p: Prospect) => p.id === prospect.id);
	}

	// Toggle selection of all prospects
	function toggleSelectAll(): void {
		if (selectedProspects.length === prospects.length) {
			$effect(() => {
				selectedProspects = [];
			});
		} else {
			$effect(() => {
				selectedProspects = [...prospects];
			});
		}
	}

	// Process the selected prospects
	async function processProspects(): Promise<void> {
		if (selectedProspects.length === 0) {
			alert('Por favor, seleccione al menos un prospecto para procesar');
			return;
		}

		// Reset and start processing
		$effect(() => {
			processStatus = {
				status: 'processing',
				message: 'Iniciando procesamiento...',
				completedCount: 0,
				totalCount: selectedProspects.length
			};
		});

		// Simulate processing each prospect
		for (let i = 0; i < selectedProspects.length; i++) {
			const prospect = selectedProspects[i];
			
			// Update status
			$effect(() => {
				processStatus = {
					...processStatus,
					message: `Procesando ${prospect.name} (${i + 1}/${selectedProspects.length})`,
					completedCount: i
				};
			});

			// Simulate API call delay
			await new Promise<void>(resolve => setTimeout(resolve, 1000));
		}

		// Update completed status
		$effect(() => {
			processStatus = {
				status: 'completed',
				message: '¡Procesamiento completado con éxito!',
				completedCount: selectedProspects.length,
				totalCount: selectedProspects.length
			};
		});
		


		// Clear selection
		$effect(() => {
			selectedProspects = [];
		});
	}
</script>

<svelte:head>
	<title>Procesar Prospectos</title>
</svelte:head>

<div class="p-4 container mx-auto max-w-6xl">
	<h1 class="text-3xl font-bold mb-6">Procesar Prospectos</h1>

	<!-- Prospects List Card -->
	<div class="card bg-base-200 shadow-xl mb-6">
		<div class="card-body">
			<h2 class="card-title flex justify-between">
				<span>Prospectos disponibles</span>
				<span class="badge badge-primary">{selectedProspects.length} seleccionados</span>
			</h2>

			{#if isLoading}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:else if prospects.length === 0}
				<div class="alert alert-info">
					<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
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
											onchange={toggleSelectAll} 
										/>
									</label>
								</th>
								<th>Nombre</th>
								<th>Email</th>
								<th>Compañía</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							{#each prospects as prospect}
								<tr class="hover">
									<td>
										<label>
											<input type="checkbox" class="checkbox" 
												checked={isSelected(prospect)} 
												onchange={() => toggleSelection(prospect)}
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
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="card-actions justify-end mt-4">
					<button 
						class="btn btn-primary" 
						onclick={processProspects}
						disabled={selectedProspects.length === 0 || processStatus.status === 'processing'}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Procesar seleccionados
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Processing Status Card -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Estado del procesamiento</h2>
			<div class="divider"></div>

			{#if processStatus.status === 'idle'}
				<div class="py-4 text-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="text-base-content/60">Seleccione prospectos y presione 'Procesar' para iniciar</p>
				</div>
			{:else if processStatus.status === 'processing'}
				<div class="py-4">
					<p class="mb-3">{processStatus.message}</p>
					<progress 
						class="progress progress-primary w-full" 
						value={processStatus.completedCount} 
						max={processStatus.totalCount}
					></progress>
					<p class="text-sm text-right mt-1">
						{processStatus.completedCount}/{processStatus.totalCount} completados
					</p>
				</div>
			{:else if processStatus.status === 'completed'}
				<div class="alert alert-success">
					<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>{processStatus.message}</span>
				</div>
				<p class="text-sm mt-2">
					Se procesaron {processStatus.totalCount} prospectos exitosamente.
				</p>
			{/if}
		</div>
	</div>
</div>

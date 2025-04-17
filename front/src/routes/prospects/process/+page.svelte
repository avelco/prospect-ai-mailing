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

	// --- Props y estados ---
	const { data } = $props<{ data: PageData }>();
	let prospects = $state<Prospect[]>(data.prospects);
	let selectedProspects = $state<Prospect[]>([]);
	let isLoading = $state(false);
	let processStatus = $state<ProcessStatus>({
		status: 'idle',
		message: '',
		completedCount: 0,
		totalCount: 0
	});

	// Estados para editar y eliminar
	let showEditModal = $state(false);
	let showDeleteConfirm = $state(false);
	let prospectToEdit = $state<Prospect | null>(null);
	let prospectToDelete = $state<Prospect | null>(null);

	// Estados para notificaciones (en lugar de alert)
	let showNotificationModal = $state(false);
	let notificationMessage = $state("");
	let notificationType = $state(""); // "success" o "error"

	// --- Funciones de selección ---
	function toggleSelection(prospect: Prospect) {
	const index = selectedProspects.findIndex((p: Prospect) => p.id === prospect.id);
	if (index === -1) {
		selectedProspects = [...selectedProspects, prospect];
	} else {
		selectedProspects = selectedProspects.filter((p: Prospect) => p.id !== prospect.id);
	}
}

function isSelected(prospect: Prospect): boolean {
	return selectedProspects.some((p: Prospect) => p.id === prospect.id);
}

function toggleSelectAll(): void {
	if (selectedProspects.length === prospects.length) {
		selectedProspects = [];
	} else {
		selectedProspects = [...prospects];
	}
}

	// --- Funciones de procesamiento ---
	async function processProspects(): Promise<void> {
		if (selectedProspects.length === 0) {
			notificationMessage = 'Por favor, seleccione al menos un prospecto para procesar';
			notificationType = 'error';
			showNotificationModal = true;
			return;
		}

		$effect(() => {
			processStatus = {
				status: 'processing',
				message: 'Iniciando procesamiento...',
				completedCount: 0,
				totalCount: selectedProspects.length
			};
		});

		for (let i = 0; i < selectedProspects.length; i++) {
			const prospect = selectedProspects[i];
			$effect(() => {
				processStatus = {
					...processStatus,
					message: `Procesando ${prospect.name} (${i + 1}/${selectedProspects.length})`,
					completedCount: i
				};
			});
			await new Promise<void>(resolve => setTimeout(resolve, 1000));
		}

		$effect(() => {
			processStatus = {
				status: 'completed',
				message: '¡Procesamiento completado con éxito!',
				completedCount: selectedProspects.length,
				totalCount: selectedProspects.length
			};
		});
		
		$effect(() => {
			selectedProspects = [];
		});
	}

	// --- Funciones para editar ---
	function openEditModal(prospect: Prospect) {
		prospectToEdit = { ...prospect };
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		prospectToEdit = null;
	}

	async function saveEdit() {
		if (!prospectToEdit) return;
		try {
			const response = await fetch(`http://localhost:8000/prospects/${prospectToEdit.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(prospectToEdit)
			});
			if (!response.ok) throw new Error('Error al actualizar prospecto');
			notificationMessage = 'Prospecto actualizado correctamente';
			notificationType = 'success';
			// Cerrar los modales de edición antes de mostrar la notificación
			showEditModal = false;
			showNotificationModal = true;
		} catch (error) {
			console.error(error);
			notificationMessage = 'Error al actualizar prospecto';
			notificationType = 'error';
			showEditModal = false;
			showNotificationModal = true;
		}
	}

	// --- Funciones para eliminar (soft delete) ---
	function openDeleteConfirm(prospect: Prospect) {
		prospectToDelete = prospect;
		showDeleteConfirm = true;
	}

	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		prospectToDelete = null;
	}

	async function confirmDelete() {
		if (!prospectToDelete) return;
		try {
			const response = await fetch(`http://localhost:8000/prospects/${prospectToDelete.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) throw new Error('Error al eliminar prospecto');
			notificationMessage = 'Prospecto eliminado (soft delete)';
			notificationType = 'success';
			// Cerrar el modal de confirmación antes de mostrar la notificación
			showDeleteConfirm = false;
			showNotificationModal = true;
			prospects = prospects.filter(p => p.id !== prospectToDelete?.id);
		} catch (error) {
			console.error(error);
			notificationMessage = 'Error al eliminar prospecto';
			notificationType = 'error';
			showDeleteConfirm = false;
			showNotificationModal = true;
		}
	}
</script>

<svelte:head>
	<title>Procesar Prospectos</title>
</svelte:head>

<div class="p-4 container mx-auto max-w-6xl">
	<h1 class="text-3xl font-bold mb-6">Procesar Prospectos</h1>

	<!-- Lista de Prospectos -->
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
									<td class="flex justify-around pt-4">
										<!-- Botón Editar -->
										<button aria-label="Editar prospecto" onclick={() => openEditModal(prospect)} title="Editar">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7 21H3v-4L16.732 3.732z" />
											</svg>
										</button>
										<!-- Botón Eliminar -->
										<button aria-label="Eliminar prospecto" onclick={() => openDeleteConfirm(prospect)} title="Eliminar">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 012 2v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1a2 2 0 012-2h10z" />
											</svg>
										</button>
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

	<!-- Estado del procesamiento -->
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

<!-- Modal para Editar Prospecto -->
{#if showEditModal && prospectToEdit && !showNotificationModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Editar Prospecto</h3>
			<div class="py-2">
				<label for="name" class="label">Nombre</label>
				<input id="name" type="text" class="input input-bordered w-full" bind:value={prospectToEdit.name} />
			</div>
			<div class="py-2">
				<label for="email" class="label">Email</label>
				<input id="email" type="email" class="input input-bordered w-full" bind:value={prospectToEdit.email} />
			</div>
			<div class="py-2">
				<label for="phone" class="label">Teléfono</label>
				<input id="phone" type="text" class="input input-bordered w-full" bind:value={prospectToEdit.phone} />
			</div>
			<div class="py-2">
				<label for="country" class="label">País</label>
				<input id="country" type="text" class="input input-bordered w-full" bind:value={prospectToEdit.country} />
			</div>
			<div class="py-2">
				<label for="state" class="label">Estado</label>
				<input id="state" type="text" class="input input-bordered w-full" bind:value={prospectToEdit.state} />
			</div>
			<div class="py-2">
				<label for="city" class="label">Ciudad</label>
				<input id="city" type="text" class="input input-bordered w-full" bind:value={prospectToEdit.city} />
			</div>
			<div class="py-2">
				<label for="identification" class="label">Identificación</label>
				<input id="identification" type="text" class="input input-bordered w-full" bind:value={prospectToEdit.identification} />
			</div>
			<div class="modal-action">
				<button class="btn btn-primary" onclick={saveEdit}>Guardar</button>
				<button class="btn" onclick={closeEditModal}>Cancelar</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal de Confirmación para Eliminar -->
{#if showDeleteConfirm && prospectToDelete && !showNotificationModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirmar Eliminación</h3>
			<p>¿Estás seguro de eliminar el prospecto <strong>{prospectToDelete.name}</strong>? La eliminación es de tipo soft delete.</p>
			<div class="modal-action">
				<button class="btn btn-error" onclick={confirmDelete}>Eliminar</button>
				<button class="btn" onclick={closeDeleteConfirm}>Cancelar</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal de Notificación -->
{#if showNotificationModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">
				{notificationType === 'error' ? 'Error' : 'Notificación'}
			</h3>
			<p>{notificationMessage}</p>
			<div class="modal-action">
				<button class="btn btn-primary" onclick={() => showNotificationModal = false}>Cerrar</button>
			</div>
		</div>
	</div>
{/if}

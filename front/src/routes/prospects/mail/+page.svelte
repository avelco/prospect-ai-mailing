<script lang="ts">
	import EmailDraftModal from '$lib/components/EmailDraftModal.svelte';

	let clients = $state<Record<string, any>[]>([]);
	let selectedClients = $state<Record<string, any>[]>([]);
	let isLoading = $state(false);
	let showEmailModal = $state(false);
	let currentClient = $state<Record<string, any> | null>(null);

	// Mock data for demonstration
	function loadMockData() {
		isLoading = true;
		// Simulate API call delay
		setTimeout(() => {
			clients = [
				{ 
					id: 1, 
					name: 'Juan Pérez', 
					email: 'juan@example.com', 
					company: 'Tecnologías XYZ', 
					status: 'Procesado',
					lastContact: '2025-03-20'
				},
				{ 
					id: 2, 
					name: 'María García', 
					email: 'maria@example.com', 
					company: 'Innovación ABC', 
					status: 'Procesado',
					lastContact: null
				},
				{ 
					id: 3, 
					name: 'Carlos López', 
					email: 'carlos@example.com', 
					company: 'Soluciones Tech', 
					status: 'Procesado',
					lastContact: '2025-03-15'
				},
			];
			isLoading = false;
		}, 800);
	}

	// Load data when component mounts
	$effect(() => {
		if (clients.length === 0) {
			loadMockData();
		}
	});

	// Toggle selection of a client
	function toggleSelection(client: Record<string, any>) {
		const index = selectedClients.findIndex(p => p.id === client.id);
		if (index === -1) {
			selectedClients = [...selectedClients, client];
		} else {
			selectedClients = selectedClients.filter(p => p.id !== client.id);
		}
	}

	// Check if a client is selected
	function isSelected(client: Record<string, any>) {
		return selectedClients.some(p => p.id === client.id);
	}

	// Toggle selection of all clients
	function toggleSelectAll() {
		if (selectedClients.length === clients.length) {
			selectedClients = [];
		} else {
			selectedClients = [...clients];
		}
	}

	// Format date to local string or return placeholder
	function formatDate(date: string | null): string {
		if (!date) return 'Sin contacto previo';
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Open email modal for a client
	function openEmailModal(client: Record<string, any>) {
		currentClient = client;
		showEmailModal = true;
	}

	// Close email modal
	function closeEmailModal() {
		showEmailModal = false;
		currentClient = null;
	}

	// Handle email draft save
	async function handleEmailDraftSave(draft: { subject: string; body: string }) {
		// Here you would typically save to your backend
		// For now, we'll just show a success message
		const toast = document.getElementById('toast-success');
		if (toast) {
			toast.classList.remove('hidden');
			setTimeout(() => {
				toast.classList.add('hidden');
			}, 3000);
		}

		// Close the modal
		closeEmailModal();
	}
</script>

<svelte:head>
	<title>Enviar Correos</title>
</svelte:head>

<div class="p-4 container mx-auto max-w-6xl">
	<h1 class="text-3xl font-bold mb-6">Enviar Correos</h1>

	<!-- Clients List Card -->
	<div class="card bg-base-200 shadow-xl">
		<div class="card-body">
			<h2 class="card-title flex justify-between">
				<span>Clientes disponibles</span>
				<span class="badge badge-primary">{selectedClients.length} seleccionados</span>
			</h2>

			{#if isLoading}
				<div class="flex justify-center py-8">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:else if clients.length === 0}
				<div class="alert alert-info">
					<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>No hay clientes disponibles para enviar correos.</span>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="table table-zebra w-full">
						<thead class="bg-base-300">
							<tr>
								<th>
									<label>
										<input type="checkbox" class="checkbox" 
											checked={selectedClients.length === clients.length} 
											onchange={toggleSelectAll} 
										/>
									</label>
								</th>
								<th>Nombre</th>
								<th>Email</th>
								<th>Compañía</th>
								<th>Último Contacto</th>
								<th>Estado</th>
								<th>Ver Borrador</th>
							</tr>
						</thead>
						<tbody>
							{#each clients as client}
								<tr class="hover">
									<td>
										<label>
											<input type="checkbox" class="checkbox" 
												checked={isSelected(client)} 
												onchange={() => toggleSelection(client)}
											/>
										</label>
									</td>
									<td>{client.name}</td>
									<td>{client.email}</td>
									<td>{client.company}</td>
									<td>
										<span class="text-sm {client.lastContact ? '' : 'opacity-70'}">
											{formatDate(client.lastContact)}
										</span>
									</td>
									<td>
										<div class="badge badge-success">
											{client.status}
										</div>
									</td>
									<td>
										<button 
											class="btn btn-sm btn-ghost" 
											onclick={() => openEmailModal(client)}
											aria-label={`Editar correo para ${client.name}`}
										>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
						disabled={selectedClients.length === 0}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						Redactar correo
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<EmailDraftModal 
	client={currentClient}
	show={showEmailModal}
	onClose={closeEmailModal}
	onSave={handleEmailDraftSave}
/>

<!-- Success Toast -->
<div id="toast-success" class="toast toast-end hidden">
	<div class="alert alert-success">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		<span>Borrador guardado exitosamente</span>
	</div>
</div>

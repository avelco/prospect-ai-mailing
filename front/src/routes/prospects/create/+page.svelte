<script lang="ts">
	let isLoading = $state(false);
	let error = $state('');
	let success = $state(false);
	let csvData = $state<Record<string, string>[]>([]);
	let dragOver = $state(false);
	// Variable para guardar el archivo cargado
	let csvFile: File | null = null;
	// Variable para almacenar la respuesta del endpoint
	let backendResponse = $state('');

	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;
		await processFile(input.files[0]);
		input.value = ''; // Reinicia el input para nueva carga
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		const file = event.dataTransfer?.files[0];
		if (!file) return;

		if (!file.name.endsWith('.csv')) {
			error = 'Please upload a CSV file';
			return;
		}

		await processFile(file);
	}

	async function processFile(file: File) {
		try {
			isLoading = true;
			error = '';
			success = false;
			backendResponse = '';
			csvData = [];

			// Leemos el contenido del archivo para previsualizarlo
			const text = await file.text();
			const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');

			if (rows.length === 0) {
				error = 'CSV file is empty';
				return;
			}

			// Parsear cabeceras
			const headerRow = rows[0];
			const headers = headerRow.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(header => {
				let h = header.trim();
				if (h.startsWith('"') && h.endsWith('"')) {
					h = h.slice(1, -1).replace(/""/g, '"');
				}
				return h;
			});

			if (headers.some(header => header === '')) {
				error = 'CSV headers cannot be empty';
				return;
			}

			const data = [];
			for (let i = 1; i < rows.length; i++) {
				const row = rows[i];
				const values = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(value => {
					let v = value.trim();
					if (v.startsWith('"') && v.endsWith('"')) {
						v = v.slice(1, -1).replace(/""/g, '"');
					}
					return v;
				});

				if (values.length !== headers.length) {
					error = `Row ${i + 1} has ${values.length} columns (expected ${headers.length})`;
					data.length = 0;
					break;
				}

				const obj: Record<string, string> = {};
				headers.forEach((header, index) => {
					obj[header] = values[index] || '-';
				});
				data.push(obj);
			}

			if (data.length === 0 && error === '') {
				error = 'No valid data rows found';
			}

			if (error) return;

			// Se muestran los datos previsualizados
			csvData = data;
			success = true;
			// Se guarda el archivo para luego subirlo al backend
			csvFile = file;
		} catch (e) {
			error = 'Error processing CSV file';
			console.error(e);
		} finally {
			isLoading = false;
		}
	}

	// Función para subir el CSV al endpoint
	async function processUpload() {
		if (!csvFile) {
			error = "No CSV file loaded";
			return;
		}
		try {
			isLoading = true;
			error = '';
			success = false;
			backendResponse = '';

			const formData = new FormData();
			formData.append("file", csvFile);

			const response = await fetch("http://localhost:8000/upload-csv/", {
				method: "POST",
				body: formData
			});

			// Intentamos obtener la respuesta en JSON; si no, leemos como texto
			let result;
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				result = await response.json();
			} else {
				result = { message: await response.text() };
			}

			if (!response.ok) {
				// Si hay error, asignamos el mensaje al error (esto incluye 500)
				error = result.detail || result.message || "Error uploading CSV file";
				return;
			}

			// Limpiamos las variables de estado
			csvFile = null;
			csvData = [];
			error = '';
			success = false;
			// Mostramos la respuesta del endpoint
			backendResponse = result.message;
		} catch (e) {
			error = "Error uploading CSV file";
			console.error(e);
		} finally {
			isLoading = false;
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}
</script>

<svelte:head>
	<title>Crear Prospectos</title>
</svelte:head>

<div class="p-4 container mx-auto max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">Importar prospectos</h1>
	<div class="card bg-base-200 shadow-xl mb-6">
		<div class="card-body">
			<div
				class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
				class:border-primary={dragOver}
				class:border-base-300={!dragOver}
				class:bg-primary={dragOver}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				role="button"
				aria-label="Upload CSV file"
				tabindex="0"
			>
				<input
					type="file"
					accept=".csv"
					class="hidden"
					id="fileInput"
					onchange={handleFileSelect}
				/>
				<label
					for="fileInput"
					class="flex flex-col items-center justify-center cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-12 h-12 mb-3 text-base-content"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
					<p class="mb-2 text-lg">
						<span class="font-semibold">Click para subir</span> o arrastra y suelta
					</p>
					<p class="text-sm text-base-content/70">Archivos CSV únicamente</p>
				</label>
			</div>

			{#if isLoading}
				<div class="my-4 flex justify-center">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{/if}

			{#if error}
				<div class="alert alert-error mt-4 mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{error}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Si hay respuesta del endpoint, se muestra aquí -->
	{#if backendResponse}
		<div class="alert alert-success mb-6">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{backendResponse}</span>
		</div>
	{:else}
		{#if success && csvData.length > 0}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Preview Data</h2>
					<div class="divider"></div>
					
					<div class="overflow-x-auto">
						<table class="table table-zebra w-full">
							<thead class="bg-base-200">
								<tr>
									{#each Object.keys(csvData[0]) as header}
										<th class="px-4 py-2">{header}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each csvData.slice(0, 5) as row, i}
									<tr class="hover">
										{#each Object.values(row) as cell}
											<td class="px-4 py-2">{cell || '-'}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					
					{#if csvData.length > 5}
						<p class="text-sm text-base-content/70 mt-2">
							Mostrando las 5 primeras filas de {csvData.length} filas totales
						</p>
					{/if}
					
					<div class="card-actions justify-end mt-4">
						<!-- Botón para subir el CSV -->
						<button class="btn btn-primary" onclick={processUpload}>
							Procesar datos
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

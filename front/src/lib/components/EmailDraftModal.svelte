<script lang="ts">
	const { client = null, show = false, onClose, onSave } = $props<{
		client: Record<string, any> | null;
		show: boolean;
		onClose: () => void;
		onSave: (draft: { subject: string; body: string }) => void;
	}>();

	let emailDraft = $state({
		subject: '',
		body: ''
	});

	// Default email template
	const defaultEmailTemplate = {
		subject: 'Seguimiento de su interés en nuestros servicios',
		body: `Estimado/a [nombre],

Espero que este correo le encuentre bien. Me dirijo a usted en seguimiento a su interés en nuestros servicios.

Nos gustaría programar una reunión para discutir cómo podemos ayudar a [empresa] a alcanzar sus objetivos.

¿Tendría disponibilidad para una breve llamada esta semana?

Quedo atento a sus comentarios.

Saludos cordiales,
[Tu nombre]`
	};

	// Initialize draft when client changes
	$effect(() => {
		if (client) {
			emailDraft = {
				subject: defaultEmailTemplate.subject,
				body: defaultEmailTemplate.body
					.replace('[nombre]', client.name)
					.replace('[empresa]', client.company)
			};
		}
	});

	function handleSave() {
		onSave(emailDraft);
	}
</script>

{#if show && client}
	<div class="modal modal-open">
		<div class="modal-box w-11/12 max-w-4xl">
			<h3 class="font-bold text-lg mb-4">Redactar correo para {client.name}</h3>
			
			<div class="form-control w-full mb-4">
				<label class="label" for="email-subject">
					<span class="label-text">Asunto</span>
				</label>
				<input 
					id="email-subject"
					type="text" 
					class="input input-bordered w-full" 
					bind:value={emailDraft.subject}
				/>
			</div>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Cuerpo del correo</legend>
				<textarea class="textarea h-64 w-full" bind:value={emailDraft.body} placeholder="Cuerpo del correo"></textarea>
			  </fieldset>

			<div class="modal-action">
				<button class="btn" onclick={onClose}>Cancelar</button>
				<button class="btn btn-primary" onclick={handleSave}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
					</svg>
					Guardar borrador
				</button>
			</div>
		</div>
	</div>
{/if}

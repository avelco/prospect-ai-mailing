import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('http://localhost:8000/prospects', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const prospects = await response.json();

		console.log(prospects)
		return {
			prospects,
			title: 'Procesar Prospectos',
			meta: {
				description: 'Seleccionar y procesar prospectos importados'
			}
		};
	} catch (error) {
		console.error('Error fetching prospects:', error);
		return {
			prospects: [],
			error: 'Error al cargar los prospectos',
			title: 'Procesar Prospectos',
			meta: {
				description: 'Seleccionar y procesar prospectos importados'
			}
		};
	}
};
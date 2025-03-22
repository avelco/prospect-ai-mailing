import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Here you would normally fetch data from your API
	// For now, we'll return a simple metadata object
	return {
		title: 'Procesar Prospectos',
		meta: {
			description: 'Seleccionar y procesar prospectos importados'
		}
	};
};
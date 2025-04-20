import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router";
import './index.css'
import { HomePage } from './features/home/pages/HomePage';
import { PrivateLayout } from './layouts/PrivateLayout';
import { SuspectsPage } from './features/suspects/pages/SuspectsPage';
import LoginPage from './features/auth/pages/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SettingsPage from './features/settings/pages/SettingsPage';
import DealsPage from './features/deals/pages/DealsPage';
import ParticipantPage from './features/participants/pages/ParticipantPage';
import { ToastContainer } from 'react-toastify';
const queryClient = new QueryClient({
	defaultOptions: {
	  queries: {
		refetchOnWindowFocus: false,
	  },
	},
  });

const router = createBrowserRouter([

	{
		path: "/",
		children: [
			{ path: "/login", Component: LoginPage },
			{
				Component: PrivateLayout,
				children: [
					{ path: "/home", Component: HomePage },
					{ path: "/suspects", Component: SuspectsPage },
					{ path: "/settings", Component: SettingsPage },
					{ path: "/deals", Component: DealsPage },
					{ path: "/participants", Component: ParticipantPage },
				],
			}
		]
	}]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
			<ToastContainer />
		</QueryClientProvider>
	</StrictMode>,
)

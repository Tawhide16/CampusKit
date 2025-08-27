import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';

import AuthProvider from './Provider/AuthProvider.jsx';
import { router } from './Router/Routes.jsx';


const rootEl = document.getElementById('root');
if (!rootEl) {
	// quick guard to make the error clearer if index.html is missing the root element
	throw new Error("Root element with id 'root' not found in index.html");
}

const root = createRoot(rootEl);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
);

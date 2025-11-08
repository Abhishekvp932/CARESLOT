import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store,persistor } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
     <Provider store={store}>
      <PersistGate loading = {null} persistor={persistor}>
    <App/>
    </PersistGate>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.log("Service Worker failed:", err));
  });
}


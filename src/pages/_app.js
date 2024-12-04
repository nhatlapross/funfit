import Layout from '../components/Layout/layout';
import 'tailwindcss/tailwind.css';
import { MeshProvider } from '@martifylabs/mesh-react';

export default function MyApp({ Component, pageProps }) {
  return (
    <MeshProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MeshProvider>
  )
}
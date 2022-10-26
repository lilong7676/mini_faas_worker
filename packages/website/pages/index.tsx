import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import WorkersOverview from 'components/workers/overview';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <WorkersOverview />
    </Layout>
  );
}

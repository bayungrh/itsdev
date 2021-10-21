import MainComponent from '../components/Main';
import ConfigHelper from '../lib/configHelper';

function Home({ domains }) {
  return <MainComponent domains={domains} />
}

Home.getInitialProps = async () => {
  const config = new ConfigHelper();
  const domains = config.domainList();
  return { domains: domains }
}

export default Home;

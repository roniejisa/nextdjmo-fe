import HomePage from "./HomePage";
import SearchPage from "./SearchPage";

const Home = async ({searchParams}) => {
  const storeSearchParams = await searchParams
  if(storeSearchParams.q){
    return <SearchPage q={storeSearchParams.q} />
  }else{
    return <HomePage />
  }
};

export default Home;

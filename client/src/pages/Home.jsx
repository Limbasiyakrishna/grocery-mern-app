import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import Features from "../components/Features";
import SpecialOffer from "../components/SpecialOffer";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";

import MysteryBox from "../components/MysteryBox";

const Home = () => {
  return (
    <div className="mt-10">
      <Banner />
      <Features />
      <Category />
      <MysteryBox />
      <SpecialOffer />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  );
};
export default Home;

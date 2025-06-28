import { getSliders } from "@/lib/actions/actions";
import HeaderSlider from "./HeaderSlider";

const HeaderSliderWrapper = async () => {
  const sliders = await getSliders();
  return <HeaderSlider sliders={sliders} />;
};

export default HeaderSliderWrapper;

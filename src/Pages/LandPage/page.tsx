import "./style.css";
import LandPageHeader from "Pages/LandPage/LandPageHeader/page.tsx";
import LandPageBody from "Pages/LandPage/LandPageBody/page.tsx";
import LandPageFooter from "Pages/LandPage/LandPageFooter/page.tsx";

const LandPage = () => {
  return (
    <>
      <LandPageHeader />
      <LandPageBody />
      <LandPageFooter />
    </>
  )
}

export default LandPage;
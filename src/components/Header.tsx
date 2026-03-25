import logo from "@/assets/logo.webp";

const Header = () => {
  return (
    <>
      <header className="text-white px-4 py-3 sm:px-6 sm:py-4 bg-brand">
        <div className="flex items-center gap-0.5">
          <img
            src={logo}
            alt="Pomux logo"
            loading="eager"
            fetchPriority="high"
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[Outfit]">
            POMUX
          </h1>
        </div>
      </header>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full block h-20 -mt-px"
        preserveAspectRatio="none"
      >
        <path
          fill="#4021a9"
          fillOpacity="1"
          d="M0,96L48,128C96,160,192,224,288,229.3C384,235,480,181,576,165.3C672,149,768,171,864,181.3C960,192,1056,192,1152,202.7C1248,213,1344,235,1392,245.3L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
    </>
  );
};

export default Header;

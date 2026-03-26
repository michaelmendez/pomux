import logo from "@/assets/logo.webp";

const Header = () => {
  return (
    <header>
      <div className="flex items-center gap-0.5">
        <img
          src={logo}
          alt="Pomux logo"
          loading="eager"
          fetchPriority="high"
          className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[Outfit]">POMUX</h1>
      </div>
    </header>
  );
};

export default Header;

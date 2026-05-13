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
          className="size-12 object-contain sm:size-16"
        />
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight font-[Outfit]">POMUX</h1>
      </div>
    </header>
  );
};

export default Header;

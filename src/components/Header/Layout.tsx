import Header from "@/components/Header/Header";
import Settings from "@/components/Header/Settings";
import WaveDivider from "@/components/Header/WaveDivider";

export default function HeaderLayout() {
  return (
    <>
      <div className="text-white px-4 py-2.25 sm:px-6 sm:py-4 bg-brand">
        <div className="flex items-center justify-between gap-4">
          <Header />
          <Settings />
        </div>
      </div>
      <WaveDivider />
    </>
  );
}

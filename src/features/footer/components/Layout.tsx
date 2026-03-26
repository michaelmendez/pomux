import Footer from "@/features/footer/components/Footer";
import Station from "@/features/radio/components/Station";

export default function FooterLayout() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <Station />
      <Footer />
    </div>
  );
}

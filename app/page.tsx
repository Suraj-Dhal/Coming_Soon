import { Backdrop } from "@/components/backdrop";
import { StatusBar } from "@/components/status-bar";
import { Spinner } from "@/components/spinner";
import { ContactLauncher } from "@/components/contact-launcher";
import { Parallax } from "@/components/parallax";

export default function ComingSoonPage() {
  return (
    <main className="stage">
      <Backdrop />
      <StatusBar />

      <section className="hero" aria-labelledby="hero-name">
        <Spinner />
        <div className="identity">
          <h1 id="hero-name" className="identity__name">
            Suraj Dhal
          </h1>
          <p className="identity__role">Tech &amp; Management Professional</p>
        </div>
        <ContactLauncher />
        <p className="whereabouts">
          You are at <span className="whereabouts__domain">surajdhal.com</span>
        </p>
      </section>

      <Parallax />
    </main>
  );
}

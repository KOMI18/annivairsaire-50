import { useEffect } from "react";
import { useAudio }  from "../hooks/useAudio";
import AudioBtn      from "../components/AudioBtn";
import Hero          from "../sections/Hero";
import Chapter       from "../sections/Chapter";
import Today         from "../sections/Today";
import Footer        from "../sections/Footer";
import { GALLERIES } from "../data/galleries";
import LifeGallery from "../sections/LifeGallery";

const MUSIC_SRC = "/music.mp3";

export default function Home() {
  const audio = useAudio(MUSIC_SRC);

  // Lance la musique au premier scroll
  useEffect(() => {
    const once = () => { audio.start(); window.removeEventListener("scroll", once); };
    window.addEventListener("scroll", once, { passive: true });
    return () => window.removeEventListener("scroll", once);
  }, []); // eslint-disable-line

  return (
    <div>
      {audio.ready && <AudioBtn playing={audio.playing} onToggle={audio.toggle} />}

      <Hero />

      <Chapter dark
        era="Les premières années"
        title={"L'enfance,\nlà où tout commence"}
        desc="Tchuente bouffo Hubert ,  Né de Bouffo Pascal et de BOUTCHUENG Agnès Un 21 mars 1976 à Yaoundé"
         img="/photo-bebe.jpeg"
        gallery={GALLERIES.enfance}
      />

      <Chapter dark={false} rev
        era="La jeunesse "
        title={"Les années de\nconstruction"}
        desc="L'adolescence, les amis, les passions qui se dessinent. Ces années qui forgent le caractère et les convictions. Les premières grandes aventures de la vie."
        img="/jeune-6.jpeg"
        gallery={GALLERIES.jeunesse}
      />

      <Chapter dark
        era="L'amour · ~2000"
        title={"La rencontre\nqui a tout changé"}
        desc="L'histoire d'une rencontre, d'un coup de cœur devenu une vie partagée.  Aujourd'hui sa femme, sa complice, son roc."
        img="/femme-0.jpeg"
        portrait
        gallery={GALLERIES.femme}
      />

      <Chapter dark={false} rev
        era="La famille · 2000s"
        title={"La plus belle\ndes aventures"}
        desc="Devenir père — un tournant, une responsabilité, une fierté infinie. Ses enfants, son héritage vivant, la preuve que l'amour se multiplie sans jamais se diviser."
         img="/kids-1.jpeg"
        gallery={GALLERIES.enfants}
      />

      <Today />
      <LifeGallery/>
      <Footer />
    </div>
  );
}
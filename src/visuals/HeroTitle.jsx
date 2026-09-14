import BlurText from "../components/BlurText.jsx";
import DecryptedText from "../components/DecryptedText.jsx";

// Runes stand in for the unread record until each character resolves.
const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";

export default function HeroTitle({ title, lede, still }) {
  if (still)
    return (
      <>
        <h1>{title}</h1>
        <p className="hero-lede">{lede}</p>
      </>
    );
  return (
    <>
      <h1 className="visually-hidden">{title}</h1>
      <div aria-hidden="true">
        <BlurText
          text={title}
          animateBy="letters"
          delay={70}
          direction="top"
          className="hero-title-text"
        />
      </div>
      <p className="hero-lede">
        <DecryptedText
          text={lede}
          speed={28}
          characters={RUNES}
          encryptedClassName="hero-lede-rune"
        />
      </p>
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RELAȚIA 360 - De la conflict la conectare | Mini-curs practic",
  description: "Învață cum să comunici astfel încât orice conflict să vă apropie, nu să vă îndepărteze. Mini-curs practic de comunicare în relații cu Lilia Dubița, psiholog cu peste 13 ani de experiență.",
};

export default function Relatia360Page() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce)" }}>
      {/* Hero Section - Full Background Image */}
      <section className="relative overflow-hidden pt-8 pb-20 md:py-32 min-h-screen md:min-h-[700px] flex items-start md:items-center">
        {/* Background Image - Mobile */}
        <div className="absolute inset-0 z-0 md:hidden">
          <Image
            src="/images/mobile hero 2.png"
            alt="Lilia Dubița - Background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>
        {/* Background Image - Desktop */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <Image
            src="/images/hero.jpg"
            alt="Lilia Dubița - Background"
            fill
            className="object-cover object-right"
            priority
            quality={90}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto px-4 sm:px-6 max-w-7xl w-full h-full flex items-start md:items-center pt-4 md:pt-0">
          <div className="max-w-2xl w-full md:w-auto md:max-w-2xl">
            {/* Mobile: Center content above person */}
            <div className="md:hidden text-center">
              {/* Badge */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#E56B6F" }}
                  ></div>
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#1F2933" }}>
                    Mini-curs practic
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 
                className="text-3xl sm:text-4xl font-bold leading-tight uppercase mb-4"
                style={{ 
                  color: "#1F2933",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1",
                  textShadow: "0 2px 4px rgba(255, 255, 255, 0.3)",
                }}
              >
                RELAȚIA NU SE<br />
                RUPE DIN LIPSA<br />
                DE IUBIRE
              </h1>

              {/* Sub-headline */}
              <p 
                className="text-base sm:text-lg leading-relaxed mb-6 px-4"
                style={{ 
                  color: "#1F2933",
                  lineHeight: "1.6",
                  textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
                }}
              >
                Descoperă ce se întâmplă <strong>DE FAPT</strong> în comunicare când apare conflictul — și de ce tot ce ai încercat până acum nu a funcționat.
              </p>

              {/* CTA Button */}
              <div>
                <a
                  href="#"
                  className="inline-block px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
                  }}
                >
                  Vreau acces la mini-curs
                </a>
              </div>
            </div>

            {/* Desktop: Left-aligned content */}
            <div className="hidden md:block w-full">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#E56B6F" }}
                  ></div>
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#1F2933" }}>
                    Mini-curs practic
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight uppercase mb-6"
                style={{ 
                  color: "#1F2933",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1",
                  textShadow: "0 2px 4px rgba(255, 255, 255, 0.3)",
                }}
              >
                RELAȚIA NU SE<br />
                RUPE DIN LIPSA<br />
                DE IUBIRE
              </h1>

              {/* Sub-headline */}
              <p 
                className="text-lg md:text-xl leading-relaxed mb-8"
                style={{ 
                  color: "#1F2933",
                  lineHeight: "1.6",
                  textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
                }}
              >
                Descoperă ce se întâmplă <strong>DE FAPT</strong> în comunicare când apare conflictul — și de ce tot ce ai încercat până acum nu a funcționat.
              </p>

              {/* CTA Button */}
              <div>
                <a
                  href="#"
                  className="inline-block px-8 py-4 rounded-lg text-base font-semibold uppercase tracking-wide transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
                  }}
                >
                  Vreau acces la mini-curs
                </a>
              </div>
            </div>

            {/* Author info - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block mt-8">
              <p 
                className="text-sm font-medium mb-1"
                style={{ 
                  fontFamily: "var(--font-heading)",
                  color: "#1F2933",
                  textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
                }}
              >
                Lilia Dubița
              </p>
              <p className="text-xs" style={{ color: "#6B7280", textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)" }}>
                Psiholog, Fondatoarea Relația 360
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Author info - Mobile only */}
      <div className="md:hidden text-center py-6" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce)" }}>
        <p 
          className="text-base font-medium mb-1"
          style={{ 
            fontFamily: "var(--font-heading)",
            color: "#1F2933",
          }}
        >
          Lilia Dubița
        </p>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Psiholog, Fondatoarea Relația 360
        </p>
      </div>

      {/* Core Message */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #FFFFFF, #faf8f5)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-4xl w-full">
          <div className="space-y-12 text-center">
            <div className="space-y-6">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight uppercase"
                style={{ 
                  color: "#1F2933",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1",
                }}
              >
                RELAȚIA NU SE<br />
                RUPE DIN LIPSA<br />
                DE IUBIRE
              </h2>
              <p 
                className="text-xl md:text-2xl font-normal leading-relaxed"
                style={{ 
                  color: "#1F2933",
                }}
              >
                Se rupe din felul în care comunicăm zi de zi.
              </p>
            </div>
            <div className="pt-8 space-y-4 text-lg max-w-3xl mx-auto" style={{ color: "#6B7280" }}>
              <p>Uneori comunicăm prea agresiv, pe emoții.</p>
              <p>Alteori tăcem, evităm discuțiile sau le amânăm la nesfârșit.</p>
              <p>Uneori vorbim mult, dar tot nu ne auzim.</p>
            </div>
            <div 
              className="pt-8 p-8 rounded-2xl text-left max-w-3xl mx-auto"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <p className="text-lg font-semibold mb-3" style={{ color: "#1F2933" }}>
                👉 Problema nu este că vorbiți prea mult sau că evitați conflictele.
              </p>
              <p className="text-lg" style={{ color: "#6B7280" }}>
                Problema este cum comunicați, astfel încât iubirea să fie transmisă, nu blocată.
              </p>
            </div>
            <div className="pt-8 max-w-3xl mx-auto">
              <p className="text-xl leading-relaxed" style={{ color: "#1F2933" }}>
                Acest mini-curs este creat exact pentru asta:<br />
                <span className="font-semibold">să înveți cum să comunici astfel încât orice conflict să vă apropie, nu să vă îndepărteze.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Is This For You */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce, #e5d9c8)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase"
            style={{ 
              color: "#1F2933",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            DACĂ ÎN RELAȚIA TA<br />
            SE ÎNTÂMPLĂ URMĂTOARELE…
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              "Vorbiți mult, dar ajungeți mereu la ceartă",
              "Orice conflict te epuizează și te face să vrei să renunți",
              'El tace, evită, spune „nu știu", „vedem", „mai târziu"',
              "Vă întoarceți mereu la aceleași conflicte, fără rezolvare",
              "Simți că nu ești auzit/ă, deși te explici",
              "Se depășesc limite verbale și apoi rămâne vinovăție sau distanță",
              "Vreți soluții, dar nu ajungeți la un compromis real"
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-6 rounded-2xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <span className="font-medium mt-1 text-xl" style={{ color: "#E56B6F" }}>•</span>
                <p style={{ color: "#1F2933" }}>{item}</p>
              </div>
            ))}
          </div>
          <div 
            className="text-center p-8 rounded-2xl"
            style={{ 
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <p className="text-xl font-semibold" style={{ color: "#1F2933" }}>
              👉 Acest mini-curs este pentru tine.
            </p>
          </div>
        </div>
      </section>

      {/* What This Course Solves */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #FFFFFF, #faf8f5)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <div className="mb-16 text-center">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 uppercase"
              style={{ 
                color: "#1F2933",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
              }}
            >
              CE REZOLVĂ<br />
              ACEST MINI-CURS
            </h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto" style={{ color: "#6B7280" }}>
              Nu te învață ce să spui „corect".<br />
              Te învață cum să comunici astfel încât mesajul tău să fie auzit și primit.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "cum să exprimi nevoile fără presiune",
              "cum să asculți fără să te pierzi pe tine",
              "cum să transformați conflictele în conectare",
              "cum să transmiteți iubirea prin comunicare matură"
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-6 rounded-2xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg"
                  style={{
                    background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  ✓
                </div>
                <p className="text-lg font-medium" style={{ color: "#1F2933" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Instructor */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce, #e5d9c8)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-6xl w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden order-2 md:order-1" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              <Image
                src="/images/IMG_0646.JPG"
                alt="Lilia Dubița - Psiholog"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase"
                style={{ 
                  color: "#1F2933",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1",
                }}
              >
                CINE SUNT EU
              </h2>
              <p className="text-xl font-semibold" style={{ color: "#1F2933" }}>
                Sunt Lilia Dubița, psiholog, cu practică privată de peste 13 ani.
              </p>
              <div className="space-y-4" style={{ color: "#6B7280" }}>
                <p className="flex items-start gap-3">
                  <span className="font-medium text-xl" style={{ color: "#E56B6F" }}>✔️</span>
                  <span>mai mult de 3.000 de cupluri au trecut prin procese terapeutice cu mine</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-medium text-xl" style={{ color: "#E56B6F" }}>✔️</span>
                  <span>oameni care se iubeau, dar se răneau prin comunicare</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-medium text-xl" style={{ color: "#E56B6F" }}>✔️</span>
                  <span>parteneri care au învățat să rămână conectați folosind instrumente simple</span>
                </p>
              </div>
              <div className="pt-6 border-t" style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}>
                <p className="text-lg" style={{ color: "#6B7280" }}>
                  Am observat un adevăr clar:<br />
                  <span className="font-semibold" style={{ color: "#1F2933" }}>baza oricărei relații este comunicarea.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why You Need This Course */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #FFFFFF, #faf8f5)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <div className="mb-8 text-center">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 uppercase"
              style={{ 
                color: "#1F2933",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
              }}
            >
              DE CE SUNT SIGURĂ<br />
              CĂ AI NEVOIE DE<br />
              ACEST CURS
            </h2>
          </div>
          <div className="space-y-8 text-lg leading-relaxed" style={{ color: "#6B7280" }}>
            <p>
              În urma multiplelor terapii de cuplu, am observat un adevăr clar:
            </p>
            <p className="text-xl font-semibold text-center py-4" style={{ color: "#1F2933" }}>
              Baza oricărei relații este calitatea comunicării.
            </p>
            <p>
              Am văzut cupluri care conflictau ani de zile și care, după câteva exerciții practice corecte, au început să se audă, să se înțeleagă și să se valorizeze reciproc.
            </p>
            <p className="font-semibold" style={{ color: "#1F2933" }}>
              Nu pentru că s-au schimbat ca oameni.<br />
              Ci pentru că au schimbat modul în care comunică.
            </p>
            <div 
              className="rounded-2xl p-8 mt-8"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <p className="font-semibold mb-2" style={{ color: "#1F2933" }}>
                Acest mini-curs este mai mult decât informație
              </p>
              <p className="mb-4" style={{ color: "#6B7280" }}>
                Este un ghid practic, în care:
              </p>
              <ul className="space-y-2" style={{ color: "#6B7280" }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#E56B6F" }}>•</span>
                  <span>înțelegi ce se întâmplă între voi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#E56B6F" }}>•</span>
                  <span>aplici exerciții concrete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#E56B6F" }}>•</span>
                  <span>vezi schimbarea în timp real, în relația ta.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce, #e5d9c8)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase"
            style={{ 
              color: "#1F2933",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            PENTRU CINE ESTE<br />
            ACEST MINI-CURS
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6 p-8 rounded-2xl" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 className="text-2xl font-semibold" style={{ color: "#1F2933" }}>Este pentru:</h3>
              <div className="space-y-4">
                {[
                  "cei care își doresc o relație sănătoasă și conștientă",
                  "cei care sunt deja într-o relație, dar trăiesc tensiuni în comunicare",
                  "cei care vor să înțeleagă dinamica relației lor",
                  "cei care vor să crească împreună, nu să se lupte unul cu altul"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-medium text-xl" style={{ color: "#E56B6F" }}>✔️</span>
                    <p style={{ color: "#1F2933" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 p-8 rounded-2xl" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 className="text-2xl font-semibold" style={{ color: "#1F2933" }}>NU este pentru:</h3>
              <div className="space-y-4">
                {[
                  "cei care vor să-și schimbe partenerul",
                  "cei care caută vinovați",
                  'cei care vor să aibă „dreptate"'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-medium text-xl" style={{ color: "#6B7280" }}>✖️</span>
                    <p style={{ color: "#1F2933" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div 
            className="text-center p-8 rounded-2xl"
            style={{ 
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <p className="text-lg font-semibold" style={{ color: "#1F2933" }}>
              👉 Este pentru cei care înțeleg că relațiile fericite se construiesc prin comunicare conștientă.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #FFFFFF, #faf8f5)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase"
            style={{ 
              color: "#1F2933",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            CE OBȚII SIGUR<br />
            DIN ACEST MINI-CURS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "înțelegi clar la ce nivel se află relația voastră",
              "primești instrumente practice pe care le aplici imediat",
              "îți conștientizezi limbajul tău al iubirii și pe al partenerului",
              "înveți cum să-ți exprimi nevoile fără reproș",
              "știi cum să comunici astfel încât să fii auzită",
              "creați creștere și congruență în relație, nu distanță"
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-6 rounded-2xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  {idx + 1}
                </div>
                <p style={{ color: "#1F2933" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce, #e5d9c8)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase"
            style={{ 
              color: "#1F2933",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            STRUCTURA<br />
            MINI-CURSULUI
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              "5 lecții practice, ușor de parcurs",
              "exerciții aplicate, nu teorie",
              "caiet practic PDF",
              "acces online imediat",
              "acces pe viață"
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-6 rounded-2xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <span className="font-medium text-xl" style={{ color: "#E56B6F" }}>✔️</span>
                <p style={{ color: "#1F2933" }}>{item}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg" style={{ color: "#6B7280" }}>
            Transformarea apare atunci când parcurgi și aplici exercițiile din cele 5 lecții.
          </p>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #FFFFFF, #faf8f5)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase"
            style={{ 
              color: "#1F2933",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            CONȚINUTUL<br />
            MINI-CURSULUI
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "Lecția 1 – Unde sunteți cu adevărat ca relație",
                items: [
                  "identifici tiparul vostru de comunicare",
                  "înțelegi de ce apar conflictele repetate"
                ]
              },
              {
                title: "Lecția 2 – De ce nu vă auziți, chiar dacă vorbiți mult",
                items: [
                  "diferența dintre a vorbi și a comunica",
                  "ce blochează mesajul tău"
                ]
              },
              {
                title: "Lecția 3 – Cum să exprimi nevoile fără să provoci defensivă",
                items: [
                  "formule care apropie, nu atacă",
                  "exercițiu practic de exprimare matură"
                ]
              },
              {
                title: "Lecția 4 – Conflictologia relației",
                items: [
                  "de ce apar conflictele și ce semnal real transmit",
                  "cum identifici cauza profundă a conflictelor repetitive",
                  "cum să rămâi prezent(ă) în conflict fără să te pierzi pe tine",
                  "cum să nu comunici din impuls emoțional și să nu regreți ulterior"
                ]
              },
              {
                title: "Lecția 5 – Comunicarea care crește iubirea",
                items: [
                  "diferențele dintre comunicarea masculină și feminină",
                  "cum motivezi și creezi cooperare prin cuvinte",
                  "cum planificați și luați decizii fără lupte de putere",
                  "cum transformați comunicarea zilnică în flirt și pasiune"
                ]
              }
            ].map((lesson, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl p-8"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3 
                  className="text-xl font-semibold mb-4"
                  style={{ 
                    color: "#1F2933",
                  }}
                >
                  {lesson.title}
                </h3>
                <ul className="space-y-2">
                  {lesson.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3" style={{ color: "#6B7280" }}>
                      <span className="font-medium mt-1 text-lg" style={{ color: "#E56B6F" }}>✔️</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32" style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce, #e5d9c8)" }}>
        <div className="mx-auto px-4 sm:px-6 max-w-4xl w-full text-center">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 uppercase"
            style={{ 
              color: "#1F2933",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            EȘTI GATA SĂ SCHIMBI<br />
            FELUL ÎN CARE<br />
            COMUNICAȚI?
          </h2>
          <div className="mt-12">
            <a
              href="#"
              className="inline-block px-10 py-5 rounded-lg text-lg font-semibold uppercase tracking-wide transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
              }}
            >
              👉 Vreau mini-cursul „Relația 360<br />
              De la conflict la conectare"
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

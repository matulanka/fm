import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Bug,
  ChevronDown,
  HeartHandshake,
  Landmark,
  LifeBuoy,
  Menu,
  PiggyBank,
  Shield,
  Target,
  Trees,
  X,
} from 'lucide-react';

type SupportOption = {
  id: number;
  label: string;
  amount: number;
  description: string;
  highlighted: boolean;
  sort_order: number;
};

type Pillar = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  image_url: string;
  icon: string;
  sort_order: number;
};

type ImpactPath = {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  sort_order: number;
};

const iconMap = {
  support: HeartHandshake,
  shield: Shield,
  bee: Bug,
  target: Target,
  trees: Trees,
  legal: Landmark,
  care: LifeBuoy,
  donation: PiggyBank,
  verified: BadgeCheck,
} as const;

const navigation = [
  { label: 'Start', href: '#start' },
  { label: 'Misja', href: '#misja' },
  { label: 'Filary', href: '#filary' },
  { label: 'Jak pomagamy', href: '#jak-pomagamy' },
  { label: 'Wspieraj', href: '#wspieraj' },
  { label: 'Kontakt', href: '#kontakt' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOptions, setSupportOptions] = useState<SupportOption[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [impactPaths, setImpactPaths] = useState<ImpactPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const fetchData = async () => {
    try {
      const [supportRes, pillarsRes, impactRes] = await Promise.all([
        fetch('/api/support-options'),
        fetch('/api/pillars'),
        fetch('/api/impact-paths'),
      ]);

      const [supportData, pillarsData, impactData] = await Promise.all([
        supportRes.json(),
        pillarsRes.json(),
        impactRes.json(),
      ]);

      setSupportOptions(supportData);
      setPillars(pillarsData);
      setImpactPaths(impactData);

      if (supportData?.length && selectedAmount === null) {
        const highlighted = supportData.find((item: SupportOption) => item.highlighted);
        setSelectedAmount(highlighted ? highlighted.amount : supportData[0].amount);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.18 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [loading]);

  const finalAmount = useMemo(() => {
    const custom = Number(customAmount);
    if (!Number.isNaN(custom) && custom > 0) return custom;
    return selectedAmount ?? 0;
  }, [customAmount, selectedAmount]);

  const handleSupportSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!donorName.trim()) {
      setFormMessage('Wpisz imię i nazwisko lub nazwę darczyńcy.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail);
    if (!emailValid) {
      setFormMessage('Podaj poprawny adres e-mail, aby otrzymać potwierdzenie kontaktu.');
      return;
    }

    if (finalAmount < 10) {
      setFormMessage('Minimalna sugerowana kwota wsparcia to 10 zł.');
      return;
    }

    if (!consent) {
      setFormMessage('Aby kontynuować, zaznacz zgodę na kontakt zwrotny.');
      return;
    }

    setFormMessage(`Dziękujemy, ${donorName.split(' ')[0]}! Zgłoszenie wsparcia na kwotę ${finalAmount} zł jest gotowe do dalszego kontaktu.`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,176,55,0.18),transparent_35%),linear-gradient(180deg,#fffaf0_0%,#f7f8fc_45%,#edf2f7_100%)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#start" className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-emerald-500 text-slate-950 shadow-lg shadow-amber-400/25">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Fundacja</div>
              <div className="text-sm font-semibold sm:text-base">Matulanka</div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-200 transition hover:text-amber-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#wspieraj"
            className="hidden rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] md:inline-flex"
          >
            Wspieraj nas
          </a>

          <button
            type="button"
            className="inline-flex rounded-full border border-white/10 p-2 text-white md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Przełącz menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-amber-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="start" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80"
              alt="Rodzina i wsparcie społeczne"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.88),rgba(15,23,42,0.78),rgba(20,83,45,0.55))]" />
          </div>

          <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
            <div className="reveal max-w-3xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                <BadgeCheck className="h-4 w-4" /> Ustanowiona 14.04.2026 r.
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                Tradycja, bezpieczeństwo i wsparcie <span className="text-amber-300">dla pokoleń</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                FUNDACJA MATULANKA łączy opiekę społeczną, edukację proobronną, rozwój rodzin i szacunek do natury,
                tworząc nowoczesne centrum pomocy dla dzieci, młodzieży, seniorów, osób chorych i z niepełnosprawnościami.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#filary"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-7 py-4 text-sm font-bold text-slate-950 transition hover:translate-y-[-1px]"
                >
                  Poznaj nasze cele <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#wspieraj"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Wspieraj nas
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ['Rodzina i opieka', 'Wsparcie społeczne i opieka wytchnieniowa'],
                  ['Bezpieczeństwo', 'Pierwsza pomoc, cyberbezpieczeństwo, survival'],
                  ['Rozwój lokalny', 'Pszczelarstwo, edukacja i aktywizacja społeczno-zawodowa'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-amber-300">{title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-200">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal rounded-[2rem] border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">Profil instytucji</div>
                  <h2 className="mt-2 text-2xl font-bold">Fundacja z misją wielowymiarowego wsparcia</h2>
                </div>
                <Shield className="h-10 w-10 text-amber-300" />
              </div>
              <div className="mt-6 space-y-4">
                {[
                  'Pomoc społeczna, charytatywna i humanitarna dla osób w potrzebie.',
                  'Edukacja praktyczna: bezpieczeństwo, pierwsza pomoc, strzelectwo sportowe i cyberhigiena.',
                  'Rozwój społeczności lokalnych poprzez pszczelarstwo, ekologię i programy aktywizacji.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-slate-950/35 p-4">
                    <BadgeCheck className="mt-0.5 h-5 w-5 flex-none text-amber-300" />
                    <p className="text-sm leading-6 text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
              <a
                href="#misja"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-200 transition hover:text-white"
              >
                Zobacz misję i nadzór fundacji <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="misja" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="reveal">
              <span className="section-kicker">O nas / misja</span>
              <h2 className="section-title">Fundacja tworzona z myślą o realnym wsparciu, edukacji i odpowiedzialnym rozwoju.</h2>
              <p className="section-text">
                FUNDACJA MATULANKA powstała w Białej Niżnej, w Gminie Grybów, aby odpowiadać na potrzeby rodzin i osób wymagających codziennego wsparcia. Łączy działania społeczne,
                opiekuńcze i edukacyjne z unikalnymi obszarami: pszczelarstwem, bezpieczeństwem i aktywnością sportową. Dzięki temu tworzy przestrzeń, w której troska o człowieka spotyka się z kompetencją, sprawczością i zakorzenieniem w lokalnej wspólnocie.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ['Siedziba', 'Biała Niżna, Gmina Grybów, woj. małopolskie'],
                  ['Zakres działań', 'Rodziny, dzieci, młodzież, seniorzy, osoby chore i z niepełnosprawnościami'],
                  ['Formy pomocy', 'Warsztaty, szkolenia, kolonie, placówki i punkty wsparcia'],
                  ['Wyróżniki', 'Pszczelarstwo, strzelectwo sportowe, survival, cyberbezpieczeństwo'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50">
                    <div className="text-sm font-semibold text-slate-500">{label}</div>
                    <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal rounded-[2rem] border border-emerald-900/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/10">
              <div className="inline-flex rounded-full bg-amber-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                Status prawny i nadzór
              </div>
              <h3 className="mt-5 text-2xl font-bold">Działamy transparentnie, zgodnie ze statutem i pod nadzorem państwowym.</h3>
              <div className="mt-6 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3 text-amber-300">
                    <Landmark className="h-5 w-5" />
                    <span className="font-semibold">Organ nadzorujący</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-200">Minister Rodziny, Pracy i Polityki Społecznej.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3 text-amber-300">
                    <BadgeCheck className="h-5 w-5" />
                    <span className="font-semibold">Podstawa ustanowienia</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-200">Akt notarialny z dnia 14.04.2026 r. oraz statut określający cele społeczne, edukacyjne i humanitarne fundacji.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="filary" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-kicker">Filary działania</span>
              <h2 className="section-title max-w-3xl">Trzy strategiczne obszary, które definiują charakter Fundacji Matulanka.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Każdy filar odpowiada na realne potrzeby społeczne i buduje trwałą wartość: od opieki i pomocy społecznej, przez bezpieczeństwo i edukację, po naturę oraz rozwój lokalny.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-[420px] animate-pulse rounded-[2rem] bg-white/60" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? HeartHandshake;
                return (
                  <article
                    key={pillar.id}
                    className="reveal group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={pillar.image_url}
                        alt={pillar.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
                      <div className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-950 shadow-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">{pillar.subtitle}</div>
                        <h3 className="mt-2 text-2xl font-bold">{pillar.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm leading-7 text-slate-600">{pillar.description}</p>
                      <ul className="mt-5 space-y-3">
                        {pillar.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm leading-6 text-slate-700">
                            <span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section id="jak-pomagamy" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="reveal text-center">
            <span className="section-kicker justify-center">Jak pomagamy</span>
            <h2 className="section-title mx-auto max-w-3xl text-center">Od diagnozy potrzeb po długofalowe wsparcie — działamy w sposób praktyczny i systemowy.</h2>
          </div>

          {loading ? (
            <div className="mt-10 space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-[2rem] bg-white/60" />
              ))}
            </div>
          ) : (
            <div className="relative mt-14">
              <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-amber-400 via-emerald-500 to-slate-300 md:block" />
              <div className="space-y-6">
                {impactPaths.map((item, index) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Shield;
                  return (
                    <div key={item.id} className="reveal grid gap-4 md:grid-cols-[64px_1fr] md:gap-6">
                      <div className="hidden md:flex">
                        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-amber-300 shadow-lg">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 md:hidden">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Etap {index + 1}</span>
                        </div>
                        <h3 className="mt-3 text-xl font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.details.map((detail) => (
                            <span key={detail} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section id="wspieraj" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="reveal rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/10">
              <span className="section-kicker text-amber-300">Jak możesz pomóc</span>
              <h2 className="mt-4 text-3xl font-bold">Darowizny, dotacje i zbiórki tworzą realne możliwości działania.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Zgodnie ze statutem fundacja może finansować działania poprzez darowizny, dotacje i zbiórki. Twoje wsparcie pomaga uruchamiać warsztaty, opiekę wytchnieniową,
                programy edukacyjne, działania humanitarne oraz rozwój infrastruktury pomocowej.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ['Darowizny', 'Elastyczne wsparcie bieżących działań społecznych i edukacyjnych.'],
                  ['Dotacje', 'Finansowanie projektów długofalowych i specjalistycznych programów.'],
                  ['Zbiórki', 'Zaangażowanie społeczności wokół konkretnych potrzeb i inicjatyw.'],
                  ['Partnerstwa', 'Wsparcie rzeczowe, eksperckie i organizacyjne dla lokalnych działań.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-base font-semibold text-white">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="section-kicker">Formularz wsparcia</span>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Wybierz kwotę i zostaw kontakt</h3>
                </div>
                <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  Sugerowane min. 10 zł
                </div>
              </div>

              {loading ? (
                <div className="mt-8 h-64 animate-pulse rounded-[2rem] bg-slate-100" />
              ) : (
                <>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {supportOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(option.amount);
                          setCustomAmount('');
                        }}
                        className={`rounded-[1.5rem] border p-4 text-left transition ${
                          finalAmount === option.amount && customAmount === ''
                            ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-100'
                            : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/60'
                        } ${option.highlighted ? 'ring-2 ring-emerald-500/20' : ''}`}
                      >
                        <div className="text-sm font-semibold text-slate-500">{option.label}</div>
                        <div className="mt-2 text-3xl font-black text-slate-950">{option.amount} zł</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{option.description}</div>
                      </button>
                    ))}
                  </div>

                  <form className="mt-8 space-y-5" onSubmit={handleSupportSubmit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Imię i nazwisko / nazwa</span>
                        <input
                          value={donorName}
                          onChange={(event) => setDonorName(event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                          placeholder="Np. Anna Kowalska"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Adres e-mail</span>
                        <input
                          value={donorEmail}
                          onChange={(event) => setDonorEmail(event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                          placeholder="kontakt@twojadomena.pl"
                        />
                      </label>
                    </div>

                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Własna kwota wsparcia</span>
                      <input
                        type="number"
                        min="0"
                        value={customAmount}
                        onChange={(event) => setCustomAmount(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Wpisz kwotę, jeśli chcesz wesprzeć inaczej"
                      />
                    </label>

                    <div className="rounded-[1.5rem] bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-500">Deklarowana kwota wsparcia</div>
                          <div className="mt-1 text-3xl font-black text-slate-950">{finalAmount || 0} zł</div>
                        </div>
                        <PiggyBank className="h-10 w-10 text-amber-500" />
                      </div>
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500"
                      />
                      <span>Wyrażam zgodę na kontakt zwrotny w sprawie wsparcia Fundacji Matulanka oraz otrzymanie informacji organizacyjnych.</span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-950 to-emerald-900 px-7 py-4 text-sm font-bold text-white transition hover:opacity-95"
                    >
                      Deklaruję wsparcie <ArrowRight className="h-4 w-4" />
                    </button>

                    {formMessage && (
                      <div className={`rounded-2xl p-4 text-sm font-medium ${formMessage.startsWith('Dziękujemy') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {formMessage}
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer id="kontakt" className="mt-20 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-emerald-500 text-slate-950">
                <Bug className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Fundacja</div>
                <div className="text-lg font-semibold">Matulanka</div>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Nowa fundacja z Białej Niżnej wspierająca rodziny, osoby w potrzebie i rozwój bezpiecznej, aktywnej społeczności lokalnej.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <p><strong className="text-white">Siedziba:</strong> Biała Niżna, Gmina Grybów, woj. małopolskie</p>
              <p><strong className="text-white">Nadzór:</strong> Minister Rodziny, Pracy i Polityki Społecznej</p>
              <p><strong className="text-white">Data ustanowienia:</strong> 14.04.2026 r.</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Nawigacja</h3>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              {navigation.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              ))}
              <a href="#" className="transition hover:text-white">Polityka prywatności</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Dane rejestrowe</h3>
            <div className="mt-5 space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p><strong className="text-white">KRS:</strong> 0000 0000 000</p>
              <p><strong className="text-white">NIP:</strong> 000-000-00-00</p>
              <p><strong className="text-white">REGON:</strong> 000000000</p>
              <p className="pt-2 text-xs leading-6 text-slate-400">Miejsce przygotowane na oficjalne numery identyfikacyjne do uzupełnienia po rejestracji.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
          © 2026 FUNDACJA MATULANKA — strona prototypowa przygotowana do prezentacji fundatorom.
        </div>
      </footer>
    </div>
  );
}

export default App;

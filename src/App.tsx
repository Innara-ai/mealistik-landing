/* Updated: Added Contact modal button */
import React, { useEffect, useMemo, useRef, useState } from 'react';

type Utms = { utm_source?: string; utm_medium?: string; utm_campaign?: string };
type View = 'home' | 'waitlist' | 'investor' | 'waitlist_success' | 'investor_success' | 'contact';

export default function App() {
  const [utms, setUtms] = useState<Utms>({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u: Utms = {};
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => {
      const v = params.get(k);
      if (v) (u as any)[k] = v;
    });
    setUtms(u);
  }, []);

  const appendUTM = (url: string) => {
    const qp = new URLSearchParams(utms as any).toString();
    if (!qp) return url;
    return url + (url.includes('?') ? '&' : '?') + qp;
  };

  const [view, setView] = useState<View>('home');
  const [waitlist, setWaitlist] = useState({ firstName: '', email: '', condition: '', consent: false });
  const [investor, setInvestor] = useState({ fullName: '', email: '', phone: '', notes: '', consent: false });
  const [error, setError] = useState<string>('');
  const firstFieldRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  useEffect(() => {
    if (view === 'waitlist' || view === 'investor') setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [view]);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, []);

  const submitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!waitlist.firstName.trim()) return setError('First name is required.');
    if (!waitlist.email || !emailRegex.test(waitlist.email)) return setError('Please enter a valid email.');
    if (!waitlist.condition) return setError('Please select a condition.');
    if (!waitlist.consent) return setError('Please consent to receive updates.');
    setView('waitlist_success');
  };

  const submitInvestor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!investor.fullName.trim()) return setError('Full name is required.');
    if (!investor.email || !emailRegex.test(investor.email)) return setError('Please enter a valid email.');
    if (!investor.consent) return setError('Please consent to be contacted.');
    setView('investor_success');
  };

  const websiteHref = appendUTM('https://mealistik.com');
  const instaHref = appendUTM('https://www.instagram.com/mealistik/');

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1d1a31 0%, #3e3e7a 100%)' }}>
      <style>{`
        :root { --primary:#9999cc; --accent:#c1c1f9; --deep:#3e3e7a; --white:#ffffff; --text-dark:#1d1a31; }
        * { box-sizing: border-box; }
        body, button, input, select, textarea { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, 'Helvetica Neue', Arial, system-ui, sans-serif; }
        .wrap { display:grid; place-items:center; padding:24px; }
        .card { width:100%; max-width:480px; background:var(--white); border-radius:16px; padding:20px; box-shadow:0 10px 30px rgba(0,0,0,0.25); position:relative; }
        .logo-bar { display:flex; align-items:center; gap:8px; }
        .back-arrow { cursor:pointer; font-size:20px; color:var(--deep); border:none; background:none; line-height:1; }
        .logo { font-weight:800; font-size:20px; color:var(--deep); }
        h1 { font-size:24px; margin:8px 0 6px; color:var(--text-dark); }
        .sub { font-size:16px; color:#333; }
        .btns { display:grid; gap:12px; margin:18px 0 8px; }
        button.primary, a.primary { background:var(--primary); color:var(--text-dark); border:0; border-radius:12px; padding:14px 16px; font-size:16px; font-weight:700; text-align:center; text-decoration:none; cursor:pointer; }
        button.primary:hover, a.primary:hover { background:var(--accent); }
        .contact-btn { background:none; border:1px solid var(--deep); border-radius:8px; color:var(--deep); font-size:12px; padding:6px 10px; cursor:pointer; margin-top:8px; }
        .contact-card { background:#f8f8ff; border-radius:10px; padding:16px; margin-top:12px; color:#222; font-size:14px; }
        .contact-card a { color:var(--deep); text-decoration:none; }
        .contact-card a:hover { text-decoration:underline; }
      `}</style>

      <div className="wrap">
        <section className="card" aria-labelledby="welcome-title">
          <div className="logo-bar">
            {view !== 'home' && <button className="back-arrow" onClick={() => setView('home')} aria-label="Back">←</button>}
            <div className="logo">Mealistik</div>
          </div>
          <h1 id="welcome-title">Welcome to Mealistik</h1>
          <p className="sub">Mealistik is a personalised meal-planning app that helps women with chronic condition eat well, shop smart, and stay consistent.</p>

          {view === 'home' && (
            <>
              <div className="btns">
                <button className="primary" onClick={() => setView('waitlist')}>Join early waitlist</button>
                <button className="primary" onClick={() => setView('investor')}>Investor or partner</button>
                <a className="primary" href={websiteHref}>Visit website</a>
              </div>
              <button className="contact-btn" onClick={() => setView('contact')}>Contact</button>
            </>
          )}

          {view === 'contact' && (
            <div className="contact-card">
              <p><strong>Founder</strong></p>
              <p>Sowmiya Yoganathan</p>
              <p><a href="https://www.linkedin.com/in/sowmiya-yoganathan-668430136/" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></p>
              <p>Contact email: <a href="mailto:hello@innara.com">hello@innara.com</a></p>
              <button className="contact-btn" onClick={() => setView('home')}>Back</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

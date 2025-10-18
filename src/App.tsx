import { useEffect, useMemo, useRef, useState } from 'react';
// App.tsx (add these imports at the top)
import { db } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

type Utms = { utm_source?: string; utm_medium?: string; utm_campaign?: string };
type View = 'home' | 'waitlist' | 'investor' | 'waitlist_success' | 'investor_success' | 'contact';

export default function ShowcasePage() {
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

    try {
      await addDoc(collection(db, 'waitlist_early'), {
        ...waitlist,
        utms,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      setView('waitlist_success');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  };

  const submitInvestor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!investor.fullName.trim()) return setError('Full name is required.');
    if (!investor.email || !emailRegex.test(investor.email)) return setError('Please enter a valid email.');
    if (!investor.consent) return setError('Please consent to be contacted.');

    try {
      await addDoc(collection(db, 'investor_partners'), {
        ...investor,
        utms,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      setView('investor_success');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  };


  const websiteHref = appendUTM('https://mealistik.com');
  const instaHref = appendUTM('https://www.instagram.com/mealistik/');

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>
      <style>{`
        :root { --primary:#9999cc; --accent:#c1c1f9; --deep:#3e3e7a; --white:#ffffff; --text-dark:#1d1a31; }
        * { box-sizing: border-box; }
        html, body, #root, main { background: var(--white); }
         * { box-sizing: border-box; }
        .wrap { display:grid; place-items:center; padding:24px; }
        .card { width:100%; max-width:480px; background:var(--white); border-radius:16px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.25); position:relative; }
        .logo-bar { display:flex; align-items:center; gap:8px; }
        .back-arrow { cursor:pointer; font-size:20px; color:var(--deep); border:none; background:none; line-height:1; }
        .back-arrow:focus { outline:3px solid var(--deep); outline-offset:2px; }
        .logo { font-weight:800; font-size:20px; color:var(--deep); }
        h1 { font-size:24px; margin:8px 0 6px; color:var(--text-dark); }
        .sub { font-size:16px; color:#333; margin-bottom:16px; }
        .btns { display:grid; gap:12px; margin:18px 0 8px; }
        button.primary, a.primary { background:var(--primary); color:var(--text-dark); border:0; border-radius:12px; padding:14px 16px; font-size:16px; font-weight:700; text-align:center; text-decoration:none; cursor:pointer; width:100%; }
        button.primary:hover, a.primary:hover { background:var(--accent); }
        .contact-btn { background:var(--deep); color:var(--white); border:0; border-radius:8px; padding:10px 14px; font-size:14px; margin-top:12px; cursor:pointer; font-weight:600; width:100%; }
        .contact-card { margin-top:16px; background:#f8f8ff; border-radius:12px; padding:20px; text-align:center; color:#222; }
        .contact-card a { color:var(--deep); text-decoration:none; }
        .contact-card a:hover { text-decoration:underline; }
        form { display:flex; flex-direction:column; gap:14px; margin-top:10px; }
        label { font-size:14px; font-weight:600; color:#1d1a31; }
        /* Ensure form controls use white background and dark text */
        input, select, textarea { width:100%; padding:12px; border:1.5px solid #ccc; border-radius:10px; font-size:15px; background: var(--white); color: var(--text-dark); caret-color: var(--deep); }
        input::placeholder, textarea::placeholder { color: #8a8a8a; }
        input:focus, select:focus, textarea:focus { border-color:var(--deep); box-shadow:0 0 0 2px rgba(62,62,122,0.15); outline:none; }
        
        .check { display:flex; align-items:flex-start; gap:8px; }
        .check input[type="checkbox"] {
          width:18px;
          height:18px;
          margin-top:2px;
          accent-color:var(--deep);
          background: var(--white);
          border:1.5px solid #ccc;
          border-radius:4px;
          box-shadow:none;
          -webkit-appearance:checkbox;
          appearance:checkbox;
        }
        .check input[type="checkbox"]:focus {
          outline:3px solid rgba(62,62,122,0.15);
          outline-offset:2px;
        }
        .check span { font-size:14px; line-height:1.4; }
        .hint { text-align:center; font-size:13px; color:#555; margin-top:8px; }
        .error { color:#b00020; background:#fde7ea; padding:10px; border-radius:8px; font-size:14px; }
        .success { color:#0e6f2f; background:#e6f6ea; padding:20px; border-radius:12px; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; }
        .success p { font-size:16px; margin:0; color:#0b5d25; font-weight:600; }
        .success .primary { width:auto; min-width:160px; }
        .link-big { display:inline-block; font-size:18px; font-weight:700; color:var(--deep); margin-top:10px; text-decoration:none; }
      `}</style>

      <div className="wrap">
        <section className="card" aria-labelledby="welcome-title">
          <div className="logo-bar">
            {view !== 'home' && (
              <button className="back-arrow" onClick={() => setView('home')} aria-label="Back">←</button>
            )}
            <div className="logo" aria-label="Mealistik logo">Mealistik</div>
          </div>

          <h1 id="welcome-title">Welcome to Mealistik</h1>
          <p className="sub">We are rethinking meal planning for women with PCOS, thyroid and diabetes. Choose what fits you.</p>

          {view === 'home' && (
            <>
              <div className="btns">
                <button className="primary" onClick={() => setView('waitlist')}>Join early waitlist</button>
                <button className="primary" onClick={() => setView('investor')}>Investor or partner</button>
                <a className="primary" href={websiteHref}>Visit website</a>
              </div>
              <div className="hint">Takes 15 seconds.</div>
              <button className="contact-btn" onClick={() => setView('contact')}>Contact</button>
            </>
          )}

          {view === 'contact' && (
            <div className="contact-card">
              <p><strong>Founder</strong></p>
              <p>Sowmiya Yoganathan</p>
              <p>LinkedIn: <a href="https://www.linkedin.com/in/sowmiya-yoganathan-668430136/" target="_blank" rel="noopener noreferrer">sowmiya-yoganathan</a></p>
              <p>Contact email: <a href="mailto:hello@innara.com">hello@innara.com</a></p>
              <button className="contact-btn" onClick={() => setView('home')}>Back</button>
            </div>
          )}

          {view === 'waitlist' && (
            <form onSubmit={submitWaitlist}>
              {error && <div className="error">{error}</div>}
              <label htmlFor="wl-first">First name</label>
              <input id="wl-first" ref={(el) => { if (!firstFieldRef.current) firstFieldRef.current = el; }} value={waitlist.firstName} onChange={(e) => setWaitlist({ ...waitlist, firstName: e.target.value })} required />
              <label htmlFor="wl-email">Email</label>
              <input id="wl-email" type="email" value={waitlist.email} onChange={(e) => setWaitlist({ ...waitlist, email: e.target.value })} required />
              <label htmlFor="wl-cond">Condition</label>
              <select id="wl-cond" value={waitlist.condition} onChange={(e) => setWaitlist({ ...waitlist, condition: e.target.value })} required>
                <option value="">Select</option>
                <option value="PCOS">PCOS</option>
                <option value="thyroid">Thyroid</option>
                <option value="diabetes">Diabetes</option>
                <option value="other">Other</option>
              </select>
              <label className="check">
                <input type="checkbox" checked={waitlist.consent} onChange={(e) => setWaitlist({ ...waitlist, consent: e.target.checked })} required />
                <span>I agree to receive updates and understand I can unsubscribe at any time.</span>
              </label>
              <button className="primary" type="submit">Join the waitlist</button>
            </form>
          )}

          {view === 'investor' && (
            <form onSubmit={submitInvestor}>
              {error && <div className="error">{error}</div>}
              <label htmlFor="inv-name">Full name</label>
              <input id="inv-name" ref={(el) => { if (!firstFieldRef.current) firstFieldRef.current = el; }} value={investor.fullName} onChange={(e) => setInvestor({ ...investor, fullName: e.target.value })} required />
              <label htmlFor="inv-email">Email</label>
              <input id="inv-email" type="email" value={investor.email} onChange={(e) => setInvestor({ ...investor, email: e.target.value })} required />
              <label htmlFor="inv-phone">Phone number</label>
              <input id="inv-phone" type="tel" value={investor.phone} onChange={(e) => setInvestor({ ...investor, phone: e.target.value })} placeholder="+61 4xx xxx xxx" />
              <label htmlFor="inv-notes">Notes</label>
              <textarea id="inv-notes" value={investor.notes} onChange={(e) => setInvestor({ ...investor, notes: e.target.value })} />
              <label className="check">
                <input type="checkbox" checked={investor.consent} onChange={(e) => setInvestor({ ...investor, consent: e.target.checked })} required />
                <span>I agree to be contacted about partnerships and investment.</span>
              </label>
              <button className="primary" type="submit">Submit</button>
            </form>
          )}

          {view === 'waitlist_success' && (
            <div className="success">
              <p>You are in! Check your email soon.</p>
              <a className="link-big" href={instaHref}>Follow us on Instagram</a>
            </div>
          )}

          {view === 'investor_success' && (
            <div className="success" role="status" aria-live="polite">
              <p>Thanks! We will reach out soon.</p>
              <a className="primary" href={websiteHref}>Visit website</a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

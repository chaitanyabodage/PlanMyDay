import { useState, useEffect, FormEvent } from 'react';
import { Lock, User, Eye, EyeOff, Key, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import { sha256, playCyberChime } from '../lib/crypto';
import { User as UserType, DesignTheme } from '../types';
import { THEMES } from '../lib/themes';

interface AuthProps {
  onAuthSuccess: (username: string) => void;
  addSecurityEvent: (action: string, details: string, type?: 'info' | 'success' | 'warning') => void;
  currentTheme?: DesignTheme;
}

export default function Auth({ onAuthSuccess, addSecurityEvent, currentTheme = 'solar' }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength check for sign-up
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  useEffect(() => {
    if (isLogin) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      setError('');
      return;
    }

    if (!password) {
      setPasswordStrength({ score: 0, label: 'Empty', color: 'bg-neutral-800' });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['Weak', 'Moderate', 'Good', 'Excellent'];
    const colors = ['bg-rose-500/10 text-rose-400 border border-rose-500/20', 'bg-amber-500/10 text-amber-400 border border-amber-500/20', 'bg-blue-500/10 text-blue-400 border border-blue-500/20', 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'];

    setPasswordStrength({
      score,
      label: labels[score - 1] || 'Weak',
      color: colors[score - 1] || 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    });
  }, [password, isLogin]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);

    try {
      // Simulate quick processing delay for high-fidelity visual interaction
      await new Promise((r) => setTimeout(r, 450));

      // Retrieve users list
      const accountsRaw = localStorage.getItem('planmyday_accounts');
      const accounts: UserType[] = accountsRaw ? JSON.parse(accountsRaw) : [];

      // Convert password to a SHA-256 hash for secure offline matching
      const passwordHash = await sha256(password);

      if (isLogin) {
        // --- LOGIN FLOW ---
        const matchedUser = accounts.find((u) => u.username.toLowerCase() === username.toLowerCase().trim());

        if (!matchedUser) {
          throw new Error('User not found. Please verify your credentials or register a new account.');
        }

        if (matchedUser.passwordHash !== passwordHash) {
          throw new Error('Incorrect password. Please try again.');
        }

        addSecurityEvent(
          'User Signed In',
          `Successfully signed in as ${username}`,
          'success'
        );

        playCyberChime('unlock');
        onAuthSuccess(matchedUser.username);
      } else {
        // --- REGISTRATION FLOW ---
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }

        const userExists = accounts.some((u) => u.username.toLowerCase() === username.toLowerCase().trim());
        if (userExists) {
          throw new Error('This username is already taken.');
        }

        const newUser: UserType = {
          username: username.trim(),
          passwordHash,
          createdAt: new Date().toISOString(),
        };

        accounts.push(newUser);
        localStorage.setItem('planmyday_accounts', JSON.stringify(accounts));

        addSecurityEvent(
          'Account Created',
          `Created a new account with username: ${newUser.username}`,
          'success'
        );

        playCyberChime('success');
        onAuthSuccess(newUser.username);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      playCyberChime('lock');
    } finally {
      setLoading(false);
    }
  };

  const activeTheme = THEMES[currentTheme];

  return (
    <div className={`min-h-[85vh] flex flex-col items-center justify-center py-20 ${activeTheme.bg} relative px-4 transition-colors duration-500 font-sans`}>
      {/* Soft Accent Glow Orbs */}
      <div 
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[110px] pointer-events-none opacity-30"
        style={{ backgroundColor: `${activeTheme.accent1}12` }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Auth Glassmorphic Card */}
        <div className="rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 p-8 shadow-2xl relative">
          
          {/* Card Top Icon & Title */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl border bg-neutral-950 shadow-sm mb-4"
              style={{ 
                borderColor: `${activeTheme.accent1}30`,
                color: activeTheme.accent1 
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">
              {isLogin ? 'Sign in to PlanMyDay' : 'Create an account'}
            </h2>
            <p className="text-neutral-400 font-normal text-xs mt-1.5 leading-relaxed font-sans">
              {isLogin
                ? 'Access your customized personal daily checklists.'
                : 'Initialize your secure, local todo-list workspace.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-neutral-700 rounded-lg text-white text-xs font-sans focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                  Password
                </label>
                {!isLogin && password && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                  <Lock size={14} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isLogin ? 'Enter password' : 'Create 8+ character password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-neutral-700 rounded-lg text-white text-xs font-sans focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-sans">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-neutral-950 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 font-sans"
              style={{ 
                backgroundImage: `linear-gradient(to r, ${activeTheme.accent1}, ${activeTheme.accent2})`,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-neutral-950" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Key size={13} className="text-neutral-950" />
                  {isLogin ? 'Sign In' : 'Create Workspace'}
                </>
              )}
            </button>
          </form>

          {/* Form Switch Button */}
          <div className="mt-6 text-center border-t border-neutral-800 pt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setPassword('');
                setUsername('');
              }}
              disabled={loading}
              className="text-xs text-neutral-400 hover:text-white font-semibold transition-colors duration-200 cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Sign up now →"
                : "Already have an account? Sign in →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

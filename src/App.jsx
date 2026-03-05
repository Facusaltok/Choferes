import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Fuel, 
  AlertTriangle, 
  LogOut, 
  User, 
  History,
  ShieldAlert,
  FileText,
  Loader2,
  Droplets,
  Gauge,
  Briefcase,
  FileBadge,
  Plus,
  Settings,
  UserCircle,
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  Lock,
  Mail,
  LogIn
} from 'lucide-react';

// --- CONFIGURACIÓN ---
// En un entorno local de Vite usarías import.meta.env
// Para esta previsualización, definimos las constantes directamente o mediante una carga segura
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// --- COMPONENTES DE UI ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-200',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100',
    admin: 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`px-4 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-5 ${className}`}>{children}</div>
);

const Label = ({ children }) => <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{children}</label>;

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
    <input 
      {...props} 
      className={`w-full p-4 ${Icon ? 'pl-12' : 'pl-4'} rounded-2xl border border-gray-200 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
    />
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [view, setView] = useState('dashboard'); 
  const [activeShift, setActiveShift] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [profileData, setProfileData] = useState({ nombre: '', legajo: '', contacto: '' });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [reportRange, setReportRange] = useState('mensual');

  const isAdmin = profileData.legajo?.toUpperCase() === 'ADMIN';

  // Carga dinámica del SDK de Supabase para evitar errores de resolución de módulos
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      setSupabase(client);
    };
    document.body.appendChild(script);
  }, []);

  // Manejo de Autenticación
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle();
    if (data) setProfileData(data);
  };

  // Carga de Datos y Tiempo Real
  useEffect(() => {
    if (!user || !supabase) return;

    const fetchData = async () => {
      const { data: vData } = await supabase.from('vehiculos').select('*');
      if (vData) setVehicles(vData);

      const { data: sData } = await supabase
        .from('jornadas')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('cerrado', false)
        .maybeSingle();
      setActiveShift(sData);

      const { data: hData } = await supabase
        .from('jornadas')
        .select('*')
        .eq('cerrado', true)
        .order('creado_at', { ascending: false });
      if (hData) setHistoryData(hData);
    };

    fetchData();

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehiculos' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jornadas' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, supabase]);

  // Manejadores de Autenticación
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const form = new FormData(e.target);
    const email = form.get('email');
    const password = form.get('password');

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg('Error: Usuario o contraseña incorrectos');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMsg('Error al registrar usuario');
    }
  };

  if (loading || !supabase) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-black">SAN ISIDRO</h1>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Gestión de Flota</p>
          </div>
          <Card className="p-8">
            <form onSubmit={handleAuth} className="space-y-5">
              <Input name="email" type="email" placeholder="Email" icon={Mail} required />
              <Input name="password" type="password" placeholder="Contraseña" icon={Lock} required />
              {errorMsg && <div className="text-red-500 text-xs text-center">{errorMsg}</div>}
              <Button type="submit" className="w-full py-4">{authMode === 'login' ? 'Ingresar' : 'Registrarse'}</Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      <header className="bg-white border-b p-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-blue-600" size={24} />
          <h1 className="font-black text-sm tracking-tighter uppercase">San Isidro</h1>
        </div>
        <button onClick={() => setView('profile')} className="p-1 border-2 border-blue-500 rounded-full">
           <UserCircle size={24} className="text-blue-500" />
        </button>
      </header>

      <main className="p-5 max-w-lg mx-auto">
        {view === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Móviles Disponibles</h2>
            {vehicles.length > 0 ? (
              vehicles.map(v => (
                <Card key={v.id} className="flex justify-between items-center border-l-4 border-l-blue-500">
                  <div>
                    <p className="font-black">{v.marca} {v.modelo}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">{v.dominio}</p>
                  </div>
                  <Button onClick={() => setView('dashboard')}>Seleccionar</Button>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">No hay vehículos registrados.</p>
            )}
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Mi Perfil</h2>
            <Card className="space-y-4">
              <p className="font-bold text-gray-700">Email: {user.email}</p>
              <Button onClick={() => supabase.auth.signOut()} variant="danger" className="w-full">Cerrar Sesión</Button>
            </Card>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around items-center z-50">
        <button onClick={() => setView('dashboard')} className={`p-3 rounded-2xl ${view === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}><LayoutDashboard /></button>
        <button onClick={() => setView('profile')} className={`p-3 rounded-2xl ${view === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}><Settings /></button>
      </nav>
    </div>
  );
}

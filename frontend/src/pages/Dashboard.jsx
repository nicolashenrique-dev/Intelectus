import React, { useEffect, useState } from 'react'
import { LayoutDashboard, BookOpen, TrendingUp, Settings, Plus, LogOut, Bell } from 'lucide-react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate()
    const [roadmap, setRoadmap] = useState(null)
    const [loadingRoadmap, setLoadingRoadmap] = useState(true)
    const [destaques, setDestaques] = useState([])
    const [loadingDestaques, setLoadingDestaques] = useState(true)
    const [abaAtual, setAbaAtual] = useState('Dashboard')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login')
                return
            }
            fetchRoadmap(user.uid)
            fetchHighlights()
        })

        return () => unsubscribe()
    }, [navigate])

    const fetchRoadmap = async (uid) => {
        setLoadingRoadmap(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
            const response = await fetch(`${apiUrl}/roadmap/user/${uid}`)
            const data = await response.json()

            if (data.success && data.roadmap) {
                setRoadmap(data.roadmap)
            } else {
                setRoadmap(null)
            }
        } catch (err) {
            console.error('Erro ao carregar trilha da API:', err)
            setRoadmap(null)
        } finally {
            setLoadingRoadmap(false)
        }
    }

    const fetchHighlights = async () => {
        setLoadingDestaques(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
            const response = await fetch(`${apiUrl}/itens/destaques`)
            const data = await response.json()

            if (data.success && data.destaques) {
                setDestaques(data.destaques)
            }
        } catch (err) {
            console.error('Erro ao carregar destaques:', err)
        } finally {
            setLoadingDestaques(false)
        }
    }

    const handleAdoptHighlight = async (id) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
            const response = await fetch(`${apiUrl}/roadmap/${id}`)
            const data = await response.json()

            if (data.success && data.roadmap) {
                // Fetch to generate but passing the hardcoded profile/nodes
                // Since our backend doesn't have an "adopt" route yet, and the web app 
                // is restricted, we'll navigate to the quiz instead to let them create a new one.
                navigate('/quiz')
            }
        } catch (err) {
            console.error('Erro ao adotar destaque:', err)
        }
    }

    const handleLogout = async () => {
        await signOut(auth)
        navigate('/login')
    }

    return (
        <div className="dashboard-layout relative bg-[#050810] text-white overflow-hidden min-h-screen">
            {/* Ambient Backgrounds */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Sidebar */}
            <aside className="dashboard-sidebar relative z-10 bg-[#0f172a]/60 backdrop-blur-2xl border-r border-white/5 shadow-2xl flex flex-col p-6 h-screen sticky top-0">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Intelectus</span>
                </div>

                <nav className="flex-1 space-y-3 pb-8">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={abaAtual === 'Dashboard'} onClick={() => setAbaAtual('Dashboard')} />
                    <NavItem icon={<BookOpen size={20} />} label="Minhas Trilhas" active={abaAtual === 'Minhas Trilhas'} onClick={() => setAbaAtual('Minhas Trilhas')} />
                    <NavItem icon={<TrendingUp size={20} />} label="Progresso" active={abaAtual === 'Progresso'} onClick={() => setAbaAtual('Progresso')} />
                    <NavItem icon={<Settings size={20} />} label="Configurações" active={abaAtual === 'Configurações'} onClick={() => setAbaAtual('Configurações')} />
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white/[0.03] hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all font-semibold"
                >
                    <LogOut size={20} />
                    <span>Sair</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main relative z-10 p-6 md:p-10 overflow-y-auto flex-1">
                <div className="flex flex-col gap-10 mb-12">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">Bem-vindo de volta!</h1>
                            <p className="text-slate-400 text-lg">Continue sua jornada de aprendizado personalizada.</p>
                        </div>
                        <button
                            type="button"
                            className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative"
                            aria-label="Notificações"
                        >
                            <Bell size={20} className="text-slate-300" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
                        </button>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-6">
                        <div className="flex flex-col justify-center items-start bg-indigo-600/10 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-8 xl:w-1/3 shadow-lg hover:border-indigo-500/40 transition-all">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                                <Plus size={30} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Criar Nova Trilha</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">A inteligência artificial analisa seu perfil e cria uma jornada de estudos sob medida.</p>
                            <button
                                onClick={() => navigate('/quiz')}
                                className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all"
                            >
                                Iniciar Assistente
                            </button>
                        </div>

                        <div className="bg-[#1e293b]/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex-1 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all group">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Sua Trilha Atual</p>
                                    {roadmap && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{roadmap.level}</span>}
                                </div>

                                {loadingRoadmap ? (
                                    <div className="py-10 flex text-slate-500 font-medium items-center gap-3">
                                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                        Carregando seu progresso...
                                    </div>
                                ) : roadmap ? (
                                    <>
                                        <h2 className="text-3xl font-extrabold mb-6 text-white group-hover:text-indigo-50 transition-colors">{roadmap.title}</h2>
                                        <div className="space-y-3">
                                            {roadmap.nodes?.slice(0, 3).map((node, i) => (
                                                <div key={node.id} className="flex items-center justify-between bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.06] transition-colors">
                                                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-3">
                                                        <span className="text-indigo-400/50 w-4">{i + 1}.</span>
                                                        {node.label}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${node.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                                        {node.status === 'completed' ? 'Ok' : node.status === 'locked' ? 'Locked' : 'Doing'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-10">
                                        <h2 className="text-2xl font-semibold mb-3 text-white">Nenhuma trilha ativa</h2>
                                        <p className="text-slate-400 leading-relaxed max-w-md">Parece que você ainda não gerou seu roteiro. Utilize o assistente ao lado para criar o seu currículo inteligente.</p>
                                    </div>
                                )}
                            </div>

                            {roadmap && abaAtual === 'Dashboard' && (
                                <button
                                    onClick={() => navigate('/roadmap')}
                                    className="mt-8 py-4 w-full rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:border-indigo-500/30"
                                >
                                    Continuar Estudando
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {abaAtual === 'Dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <StatCard title="Concluído" value="45%" color="bg-indigo-500" />
                            <StatCard title="Tempo de Estudo" value="12h" color="bg-emerald-500" />
                            <StatCard title="Habilidades" value="8" color="bg-purple-500" />
                        </div>

                        {/* Recent Trilhas */}
                        <section>
                            <h2 className="text-xl font-semibold mb-6 text-white">Trilhas em destaque</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {loadingDestaques ? (
                                    <p className="text-slate-400 col-span-2">Carregando destaques...</p>
                                ) : destaques.length > 0 ? (
                                    destaques.map((destaque) => (
                                        <TrilhaCard
                                            key={destaque.id}
                                            title={destaque.name}
                                            progress={destaque.progress || 0}
                                            tags={destaque.tags || []}
                                            onClick={() => handleAdoptHighlight(destaque.id)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-slate-400 col-span-2">Nenhum destaque disponível no momento.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {abaAtual !== 'Dashboard' && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                            <Settings size={32} className="text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Página em Construção</h2>
                        <p className="text-slate-400 max-w-sm">A aba {abaAtual} será liberada nas próximas atualizações do Intelectus.</p>
                    </div>
                )}
            </main>
        </div>
    )
}

const NavItem = ({ icon, label, active = false, onClick }) => (
    <div onClick={onClick} className={`
    flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border font-semibold
    ${active
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-lg shadow-indigo-500/5'
            : 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]'
        }
  `}>
        {icon}
        <span>{label}</span>
    </div>
)

const StatCard = ({ title, value, color }) => (
    <div className="relative overflow-hidden bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:-translate-y-1 transition-all hover:bg-white/[0.04] group">
        <div className={`absolute top-0 left-0 w-full h-1 ${color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
        <p className="text-slate-400 font-medium mb-3">{title}</p>
        <h3 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 tracking-tight">{value}</h3>
    </div>
)

const TrilhaCard = ({ title, progress, tags, onClick }) => (
    <div onClick={onClick} className="bg-white/[0.02] backdrop-blur-lg border border-white/5 rounded-3xl p-7 hover:-translate-y-1.5 hover:bg-white/[0.04] transition-all cursor-pointer group shadow-lg hover:shadow-2xl hover:border-indigo-500/30">
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-extrabold text-slate-200 group-hover:text-indigo-50 transition-colors leading-tight pr-4">{title}</h3>
            <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                {tags.map(t => <span key={t} className="text-xs font-bold px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400">{t}</span>)}
            </div>
        </div>
        <div className="w-full bg-[#0f172a] inset-shadow-sm h-3 rounded-full mb-3 border border-white/5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{progress}% CONCLUÍDO</p>
    </div>
)

export default Dashboard

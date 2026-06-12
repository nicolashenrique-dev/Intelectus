import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCircle2, Play, ExternalLink, Loader2, Lock, AlertCircle, X, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'

const statusConfig = {
    completed: { label: 'Concluído', dot: 'bg-emerald-400', bar: 'bg-emerald-500', border: 'border-emerald-500/30 bg-emerald-500/5' },
    'in-progress': { label: 'Em andamento', dot: 'bg-blue-400', bar: 'bg-blue-500', border: 'border-blue-500/30 bg-blue-500/5' },
    locked: { label: 'Bloqueado', dot: 'bg-slate-600', bar: 'bg-slate-600', border: 'border-white/5 opacity-50' }
}

const Roadmap = () => {
    const navegar = useNavigate()
    const [roadmap, setRoadmap] = useState(null)
    const [noSelecionado, setNoSelecionado] = useState(null)
    const [videos, setVideos] = useState([])
    const [carregandoVideos, setCarregandoVideos] = useState(false)
    const [erroVideos, setErroVideos] = useState(false)
    const [carregandoRoadmap, setCarregandoRoadmap] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) fetchRoadmap(currentUser.uid)
            else navegar('/login')
        })
        return () => unsubscribe()
    }, [navegar])

    const fetchRoadmap = async (uid) => {
        setCarregandoRoadmap(true)
        try {
            const r = await fetch(`http://localhost:3000/roadmap/user/${uid}`)
            const d = await r.json()
            if (d.success && d.roadmap) {
                setRoadmap(d.roadmap)
            } else {
                setRoadmap(null)
            }
        } catch (e) {
            console.error("Erro ao carregar roadmap:", e)
        } finally {
            setCarregandoRoadmap(false)
        }
    }


    const buscarVideos = async (tema, nivel) => {
        setCarregandoVideos(true)
        setErroVideos(false)
        setVideos([])
        try {
            const r = await fetch(`http://localhost:3000/ia/videos?tema=${encodeURIComponent(tema)}&nivel=${encodeURIComponent(nivel || '')}`)
            if (!r.ok) throw new Error()
            const d = await r.json()
            if (d.success) setVideos(d.videos)
            else setErroVideos(true)
        } catch {
            setErroVideos(true)
        } finally {
            setCarregandoVideos(false)
        }
    }

    const toggleStatus = async (nodeId, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
        try {
            const r = await fetch(`http://localhost:3000/roadmap/node/${nodeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, uid: auth.currentUser?.uid || 'mock-user-uid' })
            });
            const d = await r.json();
            if (d.success) {
                if (auth.currentUser) fetchRoadmap(auth.currentUser.uid);
                if (noSelecionado && noSelecionado.id === nodeId) {
                    setNoSelecionado({ ...noSelecionado, status: newStatus });
                }
            }
        } catch (e) {
            console.error("Erro ao atualizar status:", e);
        }
    };

    const abrirNo = (no) => {
        if (no.status === 'locked') return
        setNoSelecionado(no)
        buscarVideos(no.label, roadmap?.level || '')
    }

    const fecharModal = () => {
        setNoSelecionado(null)
        setVideos([])
    }

    if (carregandoRoadmap) {
        return (
            <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                    <p className="text-slate-400">Carregando sua trilha...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#070b14] p-6 md:p-10 relative overflow-x-hidden">
            {/* Ambient Base Gradients */}
            <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <header className="flex items-center gap-5 mb-12">
                    <button
                        onClick={() => navegar('/dashboard')}
                        className="p-3 bg-white/[0.04] border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all flex-shrink-0"
                    >
                        <ChevronLeft size={22} className="text-white" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{roadmap?.title || 'Sua Trilha'}</h1>
                        <p className="text-slate-400 mt-1 text-sm">{roadmap?.description || 'Clique em um módulo para ver os conteúdos'}</p>
                    </div>
                </header>

                {!roadmap ? (
                    /* Empty State */
                    <div className="glass p-12 text-center max-w-lg mx-auto rounded-3xl">
                        <AlertCircle className="mx-auto mb-4 text-slate-500" size={40} />
                        <h2 className="text-2xl font-bold mb-2">Nenhuma trilha encontrada</h2>
                        <p className="text-slate-400 mb-8">Complete o quiz para que a IA monte sua trilha personalizada.</p>
                        <button onClick={() => navegar('/quiz')} className="btn-primary">
                            Ir para o Quiz
                        </button>
                    </div>
                ) : (
                    /* Trail Nodes */
                    <div className="max-w-5xl mx-auto">
                        {/* Trail info badge */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-xs px-3 py-1 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">
                                {roadmap.nodes?.length || 0} módulos
                            </span>
                            {roadmap.fonte === 'ollama' && (
                                <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-purple-500/30 text-purple-400 bg-purple-500/5">
                                    <Bot size={14} /> Gerado por IA
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roadmap.nodes?.map((no, idx) => {
                                const cfg = statusConfig[no.status] || statusConfig['in-progress']
                                return (
                                    <motion.div
                                        key={no.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={no.status !== 'locked' ? { scale: 1.02, y: -4 } : {}}
                                        onClick={() => abrirNo(no)}
                                        className={`
                                        bg-[#0f172a]/60 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300
                                        ${cfg.border} shadow-lg shadow-black/20
                                        ${no.status !== 'locked' ? 'cursor-pointer hover:shadow-2xl hover:border-indigo-500/30' : 'cursor-not-allowed grayscale bg-[#0f172a]/30'}
                                    `}
                                    >
                                        {/* Step number */}
                                        <div className="flex items-center justify-between mb-5">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                Módulo {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            {no.status === 'completed' && <CheckCircle2 size={18} className="text-emerald-400" />}
                                            {no.status === 'locked' && <Lock size={16} className="text-slate-600" />}
                                            {no.status === 'in-progress' && (
                                                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 leading-snug">{no.label}</h3>
                                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                            {no.description}
                                        </p>

                                        {no.status !== 'locked' && (
                                            <div className="mt-5 flex items-center gap-2 text-xs text-blue-400 font-semibold">
                                                <Play size={12} fill="currentColor" />
                                                Ver conteúdo
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ─── Module Detail Modal ─── */}
                {noSelecionado && (
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) fecharModal() }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 60 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="glass w-full sm:max-w-2xl flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
                            style={{ maxHeight: '90vh' }}
                        >
                            {/* Color accent top */}
                            <div className={`h-1 w-full flex-shrink-0 ${statusConfig[noSelecionado.status]?.bar || 'bg-blue-500'}`} />

                            {/* Modal Header */}
                            <div className="flex items-start justify-between p-6 pb-4 flex-shrink-0">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                                        {statusConfig[noSelecionado.status]?.label}
                                    </p>
                                    <h2 className="text-2xl font-bold pr-4">{noSelecionado.label}</h2>
                                </div>
                                <button
                                    onClick={fecharModal}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 flex-shrink-0 mt-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Description */}
                            <div className="px-6 pb-5 flex-shrink-0">
                                <p className="text-slate-300 text-sm leading-relaxed">{noSelecionado.description}</p>
                            </div>

                            {/* ── Videos Section (scrollable) ── */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Play size={14} className="text-blue-400" fill="currentColor" />
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Conteúdo Recomendado</h4>
                                </div>

                                {carregandoVideos ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                                        <Loader2 className="animate-spin text-blue-400" size={32} />
                                        <p className="text-sm">Buscando tutoriais no YouTube...</p>
                                    </div>
                                ) : erroVideos ? (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400">
                                        <AlertCircle size={18} />
                                        <p className="text-sm">Erro ao carregar vídeos. Verifique sua conexão.</p>
                                    </div>
                                ) : videos.length > 0 ? (
                                    <div className="space-y-3">
                                        {videos.map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative w-32 h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-black">
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.titulo}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play className="text-white" size={18} fill="white" />
                                                    </div>
                                                </div>
                                                {/* Info */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                                        {video.titulo}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1.5">
                                                        <p className="text-xs text-slate-500 truncate">{video.canal}</p>
                                                        <ExternalLink size={10} className="text-slate-600 flex-shrink-0" />
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-500 text-sm">
                                        Nenhum vídeo encontrado para este módulo.
                                    </div>
                                )}
                            </div>

                            {/* ── Footer: actions ── */}
                            <div className="flex-shrink-0 border-t border-white/5 p-5 flex gap-3">
                                <button
                                    onClick={fecharModal}
                                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => toggleStatus(noSelecionado.id, noSelecionado.status)}
                                    className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 ${noSelecionado.status === 'completed' ? 'bg-slate-700 hover:bg-slate-600 shadow-black/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'}`}
                                >
                                    {noSelecionado.status === 'completed' ? 'Desmarcar' : 'Concluir Módulo'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Roadmap

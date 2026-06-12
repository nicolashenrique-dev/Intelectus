import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { Brain, Target, Briefcase, ArrowRight, Loader2, CheckCircle2, Monitor, Palette, BarChart, PieChart, Sprout, Rocket, Star, ArrowRightLeft, Cpu } from 'lucide-react'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'


const questions = [
    {
        id: 1,
        title: "Qual sua área de interesse?",
        subtitle: "Escolha o campo em que você deseja se aprofundar.",
        icon: <Brain size={22} className="text-blue-400" />,
        color: "blue",
        options: [
            { label: "Tecnologia e Programação", value: "TI", icon: Monitor },
            { label: "Design e Criatividade", value: "DESIGN", icon: Palette },
            { label: "Negócios e Marketing", value: "MARKETING", icon: BarChart },
            { label: "Ciência de Dados", value: "DATA", icon: PieChart }
        ]
    },
    {
        id: 2,
        title: "Qual seu nível atual?",
        subtitle: "Seja honesto — isso define o ponto de partida da sua trilha.",
        icon: <Target size={22} className="text-emerald-400" />,
        color: "emerald",
        options: [
            { label: "Iniciante Total", value: "BEGINNER", icon: Sprout },
            { label: "Tenho alguma base", value: "INTERMEDIATE", icon: Rocket },
            { label: "Já atuo na área", value: "ADVANCED", icon: Star }
        ]
    },
    {
        id: 3,
        title: "Qual seu objetivo?",
        subtitle: "Seu objetivo molda os conteúdos e projetos recomendados.",
        icon: <Briefcase size={22} className="text-purple-400" />,
        color: "purple",
        options: [
            { label: "Conseguir o primeiro emprego", value: "JOB", icon: Target },
            { label: "Transição de carreira", value: "TRANSITION", icon: ArrowRightLeft },
            { label: "Especialização técnica", value: "SPECIALIZATION", icon: Cpu }
        ]
    }
]

const colorMap = {
    blue: { bar: 'bg-blue-500', icon: 'bg-blue-500/10 border-blue-500/20', hover: 'hover:border-blue-500/60 hover:bg-blue-500/5' },
    emerald: { bar: 'bg-emerald-500', icon: 'bg-emerald-500/10 border-emerald-500/20', hover: 'hover:border-emerald-500/60 hover:bg-emerald-500/5' },
    purple: { bar: 'bg-purple-500', icon: 'bg-purple-500/10 border-purple-500/20', hover: 'hover:border-purple-500/60 hover:bg-purpleald-500/5' }
}

const Quiz = () => {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState({})
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                setUser(null)
                setError('Você precisa estar logado para realizar o quiz.')
                return
            }
            setUser(currentUser)
            setError('')
        })
        return () => unsubscribe()
    }, [])

    const handleOption = (value) => {
        if (loading) return
        const newAnswers = { ...answers, [questions[step].id]: value }
        setAnswers(newAnswers)
        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 120)
        } else {
            completeQuiz(newAnswers)
        }
    }

    const completeQuiz = async (finalAnswers) => {
        if (!user?.uid) {
            navigate('/login')
            return
        }
        setLoading(true)
        try {
            const profile = {
                interest: questions[0].options.find(o => o.value === finalAnswers[1])?.label,
                experience: questions[1].options.find(o => o.value === finalAnswers[2])?.label,
                goal: questions[2].options.find(o => o.value === finalAnswers[3])?.label
            }
            const response = await fetch('http://localhost:3000/roadmap/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile, uid: user.uid })
            })
            const data = await response.json()
            if (data.success && data.roadmap) {
                await setDoc(doc(db, "users", user.uid), {
                    trilha: { ...data.roadmap, userId: user.uid, profileAtTime: profile }
                }, { merge: true })
                navigate('/roadmap')
            } else {
                throw new Error(data.message || 'Erro ao gerar sua trilha.')
            }
        } catch (err) {
            console.error('Error completing quiz:', err)
            setError('Falha ao gerar sua trilha. Verifique sua conexão.')
        } finally {
            setLoading(false)
        }
    }

    const currentQ = questions[step]
    const colors = colorMap[currentQ.color]

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-blue-500/20 flex items-center justify-center">
                        <Loader2 className="animate-spin text-blue-500" size={36} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping" />
                </div>
                <div className="text-center">
                    <p className="text-xl font-semibold text-white mb-2">Criando sua trilha personalizada</p>
                    <p className="text-slate-400">A IA está analisando seu perfil e montando seu roteiro de estudos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-6">
            <div className="absolute top-0 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-xl relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm text-blue-400 font-semibold uppercase tracking-widest mb-3">
                        Passo {step + 1} de {questions.length}
                    </p>
                    <h1 className="text-4xl font-bold text-white mb-2">{currentQ.title}</h1>
                    <p className="text-slate-400">{currentQ.subtitle}</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-10">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? colors.bar :
                                i === step ? colors.bar + ' opacity-100' :
                                    'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                {/* Options */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        {currentQ.options.map((opt, i) => (
                            <motion.button
                                key={opt.value}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => handleOption(opt.value)}
                                disabled={loading}
                                className={`
                                    w-full p-5 text-left border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-xl shadow-lg shadow-black/20
                                    ${colors.hover} transition-all duration-300 group
                                    flex items-center gap-5 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-500/30
                                `}
                            >
                                <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-400 transition-colors`}>
                                    <opt.icon size={24} />
                                </div>
                                <span className="flex-1 font-semibold text-slate-200 group-hover:text-white text-lg transition-colors">{opt.label}</span>
                                <ArrowRight
                                    size={18}
                                    className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0"
                                />
                            </motion.button>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {error && (
                    <p className="mt-6 text-sm text-red-400 text-center">{error}</p>
                )}
            </div>
        </div>
    )
}
export default Quiz 
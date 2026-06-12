import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Brain } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [nome, setNome] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)
    const navegar = useNavigate()

    const lidarComCadastro = async (e) => {
        e.preventDefault()
        setCarregando(true)
        setErro('')
        try {
            const credenciaisUsuario = await createUserWithEmailAndPassword(auth, email, senha)
            const usuario = credenciaisUsuario.user
            try {
                await setDoc(doc(db, 'users', usuario.uid), { name: nome, email, createdAt: new Date().toISOString() })
            } catch (erroBanco) {
                console.error('Erro ao salvar dados:', erroBanco)
            }
            navegar('/quiz')
        } catch (err) {
            const mensagens = {
                'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
                'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
                'auth/invalid-email': 'E-mail inválido.'
            }
            setErro(mensagens[err.code] || 'Erro ao criar conta. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    const campoStyle = {
        width: '100%', padding: '14px 14px 14px 48px',
        background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14,
        fontSize: 15, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease'
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Painel Esquerdo */}
            <div style={{
                flex: 1, background: 'linear-gradient(145deg, #7c3aed 0%, #4f46e5 60%, #3730a3 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '80px', color: 'white', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <Brain size={40} color="white" />
                </motion.div>

                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: 52, fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>
                    IntelectusIA
                </motion.h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', maxWidth: 380, marginBottom: 48, lineHeight: 1.6 }}>
                    Junte-se à revolução do aprendizado personalizado e impulsione sua carreira com IA.
                </motion.p>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={20} color="white" />
                    </div>
                    <div>
                        <p style={{ fontWeight: 600, fontSize: 15 }}>Perfil Inteligente</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Mapeamos suas habilidades e objetivos</p>
                    </div>
                </motion.div>
            </div>

            {/* Painel Direito */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', background: 'white', color: '#1e293b', minWidth: 0 }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 30, fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>Criar conta</h2>
                    <p style={{ color: '#94a3b8', marginBottom: 40, fontSize: 15 }}>Comece seu aprendizado hoje mesmo</p>

                    <form onSubmit={lidarComCadastro}>
                        {[
                            { label: 'Nome Completo', tipo: 'text', valor: nome, onChange: e => setNome(e.target.value), placeholder: 'Seu nome completo', icon: <User size={18} /> },
                            { label: 'E-mail', tipo: 'email', valor: email, onChange: e => setEmail(e.target.value), placeholder: 'seu@email.com', icon: <Mail size={18} /> },
                        ].map(({ label, tipo, valor, onChange, placeholder, icon }) => (
                            <div key={label} style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', pointerEvents: 'none' }}>
                                        {icon}
                                    </span>
                                    <input type={tipo} placeholder={placeholder} value={valor} onChange={onChange} required
                                        style={campoStyle}
                                        onFocus={e => { e.target.style.borderColor = '#5849ff'; e.target.style.boxShadow = '0 0 0 4px rgba(88,73,255,0.08)' }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Senha</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', pointerEvents: 'none' }}>
                                    <Lock size={18} />
                                </span>
                                <input type={mostrarSenha ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} required
                                    style={{ ...campoStyle, paddingRight: 48 }}
                                    onFocus={e => { e.target.style.borderColor = '#5849ff'; e.target.style.boxShadow = '0 0 0 4px rgba(88,73,255,0.08)' }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }}
                                />
                                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {erro && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
                                {erro}
                            </div>
                        )}

                        <button type="submit" disabled={carregando} style={{
                            width: '100%', padding: '15px', background: carregando ? '#a5b4fc' : '#5849ff',
                            color: 'white', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700,
                            cursor: carregando ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
                            boxShadow: '0 8px 20px rgba(88,73,255,0.25)', transition: 'all 0.3s ease'
                        }}>
                            {carregando ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#64748b' }}>
                        Já tem uma conta?{' '}
                        <Link to="/login" style={{ color: '#5849ff', fontWeight: 700, textDecoration: 'none' }}>Entrar agora</Link>
                    </p>
                </div>

                <footer style={{ marginTop: 'auto', textAlign: 'center', fontSize: 11, color: '#cbd5e1', paddingTop: 32 }}>
                    <p>Grupo: Fellipe, Miguel e Nicolas</p>
                    <p>Professores: Douglas e Ricardo | 3º ano B</p>
                </footer>
            </div>
        </div>
    )
}

export default Register

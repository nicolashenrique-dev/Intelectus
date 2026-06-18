import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Brain } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Save additional user info to Firestore
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    name,
                    email,
                    createdAt: new Date().toISOString()
                })
            } catch (dbErr) {
                console.error('Error saving user data:', dbErr)
                // If Auth worked but DB failed, we still have a user.
                // We'll proceed but notify that profile setup might be incomplete.
            }

            navigate('/quiz')
        } catch (err) {
            console.error('Auth error:', err)
            setError(err.message || 'Erro ao criar conta. Verifique os dados.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            {/* Left Pane - Hero */}
            <div className="hero-pane">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="brain-card"
                >
                    <Brain size={48} color="white" />
                </motion.div>

                <h1 className="hero-title">IntelectusIA</h1>
                <p className="hero-desc">
                    Junte-se à revolução do aprendizado personalizado e impulsione sua carreira com IA.
                </p>

                <div className="features">
                    <div className="hero-feature">
                        <div className="feature-icon-wrapper"><Brain size={18} color="white" /></div>
                        <div className="feature-text">
                            <h4>Perfil Inteligente</h4>
                            <p>Mapeamos suas habilidades e objetivos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="form-pane">
                <div className="form-wrapper">
                    <h2 className="login-welcome">Criar conta</h2>

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label className="input-label">Nome Completo</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">E-mail</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    className="login-input"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Senha</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="login-input"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{error}</p>}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </form>

                    <p className="register-prompt">
                        Já tem uma conta? <Link to="/login" className="register-link">Entrar agora</Link>
                    </p>
                </div>

                <footer className="login-footer">
                    <p>Grupo: Fellipe, Miguel e Nicolas</p>
                    <p>Professores: Douglas e Ricardo | 3º ano B</p>
                </footer>
            </div>
        </div>
    )
}

export default Register

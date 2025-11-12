import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PhishGuard() {
  const [url, setUrl] = useState('')
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [flaws, setFlaws] = useState([])
  const [particles, setParticles] = useState([])
  const [suggestions] = useState([
    'https://google.com',
    'https://bit.ly/3example',
    'https://192.168.0.1/login',
    'https://free-prize-now.com',
    'https://github.com'
  ])

  useEffect(() => {
    const dots = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 1,
      speed: Math.random() * 0.4 + 0.2,
    }))
    setParticles(dots)
  }, [])

  const analyze = () => {
    setLoading(true)
    setScore(null)
    setFlaws([])

    setTimeout(() => {
      const trustedKeywords = ['google', 'amazon', 'microsoft', 'github', 'apple', 'openai', 'cloudflare']
      const suspiciousPatterns = ['192.168', 'login', 'verify', 'update', 'free', 'bit.ly', 'tinyurl', 'prize', 'secure', 'confirm']
      let trustScore = 5
      let detectedFlaws = []

      if (url.startsWith('https://')) trustScore += 3
      else detectedFlaws.push('Insecure connection — HTTPS not used.')

      trustedKeywords.forEach(k => {
        if (url.toLowerCase().includes(k)) trustScore = 10
      })

      suspiciousPatterns.forEach(p => {
        if (url.toLowerCase().includes(p)) {
          trustScore = 2
          detectedFlaws.push(`Suspicious keyword found: ${p}`)
        }
      })

      trustScore = Math.max(1, Math.min(10, trustScore))
      setScore(trustScore)
      setFlaws(detectedFlaws.length ? detectedFlaws : ['No flaws detected — looks safe!'])
      setLoading(false)
    }, 2500)
  }

  const getStatus = () => {
    if (score >= 9) return { text: 'Highly Trustworthy Site', icon: <ShieldCheck className='text-green-400 w-8 h-8' /> }
    if (score >= 7) return { text: 'Trustworthy Site', icon: <ShieldCheck className='text-emerald-400 w-8 h-8' /> }
    if (score >= 5) return { text: 'Moderately Suspicious', icon: <ShieldAlert className='text-orange-400 w-8 h-8' /> }
    if (score >= 3) return { text: 'Suspicious Site', icon: <ShieldAlert className='text-yellow-400 w-8 h-8' /> }
    return { text: 'Phishing Suspected', icon: <ShieldAlert className='text-red-500 w-8 h-8' /> }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white px-6 text-center overflow-hidden relative'>
      {particles.map(dot => (
        <motion.div
          key={dot.id}
          className='absolute rounded-full bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600'
          style={{ width: dot.size, height: dot.size, left: dot.x, top: dot.y }}
          animate={{
            y: [dot.y, dot.y - 60, dot.y],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.6, 1],
            rotate: [0, 360],
          }}
          transition={{ repeat: Infinity, duration: 14 + Math.random() * 4, ease: 'easeInOut' }}
        />
      ))}

      <motion.h1 className='text-3xl md:text-4xl font-extrabold mb-10 tracking-widest bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(200,200,200,0.4)]'>
        PHISHGUARD
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className='w-full max-w-3xl bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_0_70px_rgba(120,120,120,0.3)] border border-gray-700 hover:border-gray-400 transition-all duration-700'>
        <Input
          type='text'
          placeholder='Enter a website URL (e.g., https://example.com)'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className='w-full p-4 rounded-2xl bg-gray-950 border border-gray-700 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 text-lg mb-6 transition-all duration-300'
        />

        <div className='flex flex-wrap justify-center gap-3 mb-6'>
          {suggestions.map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.15, backgroundColor: 'rgba(150,150,150,0.2)', boxShadow: '0 0 10px rgba(200,200,200,0.4)' }} className='px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/70 cursor-pointer text-sm' onClick={() => setUrl(s)}>
              {s}
            </motion.div>
          ))}
        </div>

        <div className='flex justify-center'>
          <Button onClick={analyze} disabled={loading} className='relative overflow-hidden w-56 h-14 rounded-2xl text-lg font-semibold bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:scale-110 transition-transform duration-500 shadow-[0_0_40px_rgba(180,180,180,0.4)]'>
            {loading ? (
              <motion.div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600' animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
                <Loader2 className='w-7 h-7 animate-spin text-white' />
              </motion.div>
            ) : (
              'SCAN URL'
            )}
          </Button>
        </div>

        {score !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='mt-10'>
            <div className='text-2xl font-bold mb-4 flex items-center justify-center gap-3'>
              {getStatus().icon}
              {getStatus().text}
            </div>

            <motion.div className='w-44 h-44 rounded-full border-4 border-gray-700 mx-auto flex items-center justify-center text-6xl font-bold' animate={{ scale: [1, 1.05, 1], boxShadow: `0 0 ${score * 6}px ${score >= 7 ? 'rgba(0,255,150,0.9)' : score >= 5 ? 'rgba(255,140,0,0.9)' : 'rgba(255,50,50,0.9)'}` }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
              {score}
            </motion.div>

            <div className='mt-8 text-left bg-gray-800/70 p-6 rounded-2xl border border-gray-700 shadow-[0_0_30px_rgba(150,150,150,0.3)]'>
              <h2 className='text-2xl font-semibold mb-3 flex items-center gap-2'><AlertTriangle className='text-yellow-400' /> Detected Flaws</h2>
              <ul className='space-y-2 text-sm md:text-base text-gray-300'>
                {flaws.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

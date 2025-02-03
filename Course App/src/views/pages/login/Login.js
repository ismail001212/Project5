import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilArrowRight } from '@coreui/icons'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalLink, setModalLink] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/DefaultLayout')
    }
  }, [navigate])

  // Language Rotator (Optional)
  const languageOptions = {
    en: { text: 'Learn AI in English', flag: 'fa-solid fa-flag-usa' },
    fr: { text: 'Apprenez l\'IA en Français', flag: 'fa-solid fa-flag-fr' },
    ar: { text: 'تعلم الذكاء الاصطناعي بالعربية', flag: 'fa-solid fa-flag' },
  }
  const languages = Object.keys(languageOptions)
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0)
  const languageRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguageIndex((prevIndex) => (prevIndex + 1) % languages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [languages.length])

  const currentLanguage = languages[currentLanguageIndex]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isSubscriptionExpired = (expiration_date) => {
    if (!expiration_date) return true
    const currentDate = new Date()
    const expiry = new Date(expiration_date)
    return currentDate > expiry
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData)
      const { token, user } = response.data
      setUser(user)

      if (!user?.emailVerifiedAt) {
        setError('Please verify your email before logging in.')
        setLoading(false)
        return
      }
      if (user.status === 'waiting') {
        setShowModal(true)
        setModalMessage('Your account is under review. Please wait while we verify your details.')
        setModalLink('')
        setLoading(false)
        return
      }
      if (user.status === 'rejected' || isSubscriptionExpired(user.expiration_date)) {
        setShowModal(true)
        setModalMessage('Access denied due to expired subscription or unpaid status. Please visit Teachable.')
        setModalLink('https://teachable.com')
        setLoading(false)
        return
      }
      if (user.Actif === true) {
        setShowModal(true)
        setModalMessage('You are already logged in on another browser. Please log out from that session.')
        setLoading(false)
        return
      }
      if (user.status === 'accepted') {
        localStorage.setItem('token', token)
        sessionStorage.setItem('token', token)

        await axios.post('http://localhost:5000/api/auth/updateActif', {
          userId: user.id,
          Actif: true,
        })
        if (user.role === 'admin' || user.role === 'Advanced_user') {
          navigate('/DefaultLayout')
        } else if (user.role === 'user') {
          navigate('/Categories')
        }
      }
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in. Please try again later.')
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      setLoading(false)
    }
  }

  const closeModal = () => setShowModal(false)

  const handleResendVerification = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email: formData.email,
      })
      if (response.status === 200) {
        setError('Verification email sent. Please check your inbox.')
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again later.')
    }
  }

  // بيانات وهمية للعرض
  const statistics = [
    { label: 'AI Courses', value: '50+' },
    { label: 'Students', value: '12,000+' },
    { label: 'AI Projects', value: '300+' },
    { label: 'Mentors', value: '150+' },
  ]
  const companyLogos = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Adobe_Corporate_Logo.svg/2560px-Adobe_Corporate_Logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
  ]

  return (
    <div className="login-container">
      <div className="login-content">
        {/* SECTION #1: FORM SECTION (first => on mobile) */}
        <div className="form-section">
          <div className="ai-network-bg"></div>

          {/* بانر الأشكال العائمة */}
          <div className="creative-banner">
            <div className="floating-shapes">
              <span className="shape shape-1"></span>
              <span className="shape shape-2"></span>
              <span className="shape shape-3"></span>
              <span className="shape shape-4"></span>
              <span className="shape shape-5"></span>
              <span className="shape shape-6"></span>
            </div>
            {/* عنوان بالعربية - RTL */}
            <h2 className="banner-heading ar-text">تعلّم الذكاء الاصطناعي بلغتك!</h2>
          </div>

          {/* دوائر اللهجات */}
          <div className="language-circles">
            <div className="circle circle-1 ar-text">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg"
                alt="Morocco Flag"
                className="circle-flag"
              />
              <div className="circle-text">دارجة مغربية</div>
            </div>
            <div className="circle circle-2 ar-text">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg"
                alt="Egypt Flag"
                className="circle-flag"
              />
              <div className="circle-text">مصري</div>
            </div>
            <div className="circle circle-3 ar-text">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg"
                alt="Saudi Flag"
                className="circle-flag"
              />
              <div className="circle-text">سعودي</div>
            </div>
            <div className="circle circle-4 ar-text">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/74/Arabic_Calligraphy.png"
                alt="Arabic General Logo"
                className="circle-flag"
              />
              <div className="circle-text">عربي عام</div>
            </div>
            <div className="circle circle-5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"
                alt="France Flag"
                className="circle-flag"
              />
              <div className="circle-text">Français</div>
            </div>
            <div className="circle circle-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
                alt="US Flag"
                className="circle-flag"
              />
              <div className="circle-text">English</div>
            </div>
          </div>

          {/* لائحة اللغات الدوّارة (اختياري) */}
          <div className="language-rotator" ref={languageRef}>
            <i className={`language-flag ${languageOptions[currentLanguage].flag}`}></i>
            <span>{languageOptions[currentLanguage].text}</span>
          </div>

          {/* نموذج تسجيل الدخول */}
          <CCardGroup className="card-group">
            <CCard className="login-card">
              <CCardBody className="card-body">
                <CForm onSubmit={handleSubmit} className="login-form">
                  <h1 className="form-title">Welcome Back</h1>
                  <p className="form-subtitle">Log in to continue your AI journey</p>

                  <CInputGroup className="input-group">
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </CInputGroup>

                  <CInputGroup className="input-group">
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </CInputGroup>

                  {error && <p className="form-error">{error}</p>}
                  {error === 'Please verify your email before logging in.' && (
                    <div className="resend-container">
                      <CButton color="link" onClick={handleResendVerification} className="resend-link">
                        Resend Email Verification
                      </CButton>
                    </div>
                  )}

                  <CRow>
                    <CCol xs={12}>
                      <CButton type="submit" color="primary" className="form-button" disabled={loading}>
                        {loading ? <CSpinner size="sm" /> : 'Login'}
                      </CButton>
                    </CCol>
                  </CRow>

                  <CRow className="extra-links">
                    <CCol xs={12} className="text-center">
                      <Link to="/forgetpassword">
                        <CButton color="link" className="forgot-link">
                          Forgot password?
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>

                  <CRow className="extra-links">
                    <CCol xs={12} className="text-center">
                      <p className="signup-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="signup-link">
                          Sign up
                        </Link>
                      </p>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>

          {/* سعر مختصر على الجوال بعد تسجيل الدخول */}
          <div className="mobile-price">
            <span className="promo-label">Special Launch Offer</span>
            <span className="old-price">$299</span>
            <span className="new-price">
              $<span className="price-main">19</span>
              <span className="price-decimal">.99</span>
            </span>
          </div>
        </div>

        {/* SECTION #2: LANDING SECTION (second => last on mobile) */}
        <div className="landing-section">
          <div className="landing-overlay"></div>
          <div className="landing-inner">
            <h1 className="landing-title">Master AI with Our Platform</h1>
            <p className="landing-tagline">
              Gain cutting-edge knowledge and build real-world AI projects to shape the future.
            </p>

            {/* عنوان جديد بالعربية يؤكد أهمية تعلم تطوير AI (RTL) */}
            <div className="ar-text" style={{ margin: '25px 0' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-light)', marginBottom: '10px' }}>
                تعلُّم تطوير الذكاء الاصطناعي هو ما سيُحدث التغيير لكَ ولوطنك.
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-light)' }}>
                لا تقف عند حد استخدام الأدوات فقط—كن جزءًا من صُنّاع المستقبل 
                وارتقِ بمهاراتك لتقود التغيير في عالم الذكاء الاصطناعي.
              </p>
            </div>

            {/* جملة الفرق الشاسع */}
            <div className="landing-difference ar-text">
              <h2 className="difference-title">
                الفرق شاسع بين من يطوّر الذكاء الاصطناعي… ومن يكتفي باستخدام أدواته.
              </h2>
              <p className="difference-subtitle">
                كن أنت الشخص الذي يتحكّم بالقوة الكاملة للذكاء الاصطناعي، ولا تكتفِ بمجرد المشاهدة.
              </p>
            </div>

            {/* جُمل مستوحاة من Apple (بالعربية) */}
            <div className="landing-apple-sentences ar-text">
              <h2 className="section-heading">إلهام من تجربة Apple</h2>
              <ul className="apple-list">
                <li>تعليم يغيّر كل شيء.</li>
                <li>الذكاء الاصطناعي… بكل بساطة.</li>
                <li>لأن التفاصيل تصنع الفارق.</li>
                <li>التعلّم… بحلّة أجمل.</li>
                <li>تحدَّ نفسك. تقدَّم للأمام.</li>
                <li>مستقبلٌ يبدأ من الآن.</li>
                <li>مهارات اليوم… لفرص الغد.</li>
                <li>التقنية للجميع.</li>
                <li>تعلّم بلهجتك. نافس عالميًا.</li>
                <li>تجربة فريدة… بدعم 24/7.</li>
              </ul>
            </div>

            {/* السعر الرئيسي لسطح المكتب */}
            <div className="landing-price">
              <span className="promo-label">Special Launch Offer</span>
              <span className="old-price">$299</span>
              <span className="new-price">
                $<span className="price-main">19</span>
                <span className="price-decimal">.99</span>
              </span>
            </div>

            <CButton color="primary" className="landing-cta" onClick={() => navigate('/register')}>
              Get Started <CIcon icon={cilArrowRight} />
            </CButton>

            {/* Countdown */}
            <div className="landing-countdown">
              <p className="countdown-text">
                Limited time only! Offer ends in <span id="countdown">02:15:30</span>
              </p>
            </div>

            {/* Statistics */}
            <div className="landing-stats">
              {statistics.map((stat, index) => (
                <div key={index} className="stat-card">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* AI Features */}
            <div className="landing-ai ar-text">
              <h2>Featured AI Technologies</h2>
              <ul>
                <li><span>Deep Learning with TensorFlow &amp; PyTorch</span></li>
                <li><span>Natural Language Processing (NLP) &amp; LLMs</span></li>
                <li><span>Computer Vision &amp; Image Processing</span></li>
                <li><span>Generative AI &amp; ChatGPT-based Models</span></li>
              </ul>
            </div>

            {/* Testimonials (What Our Learners Say) */}
            <div className="landing-testimonials">
              <h2 className="section-heading">What Our Learners Say</h2>
              <div className="testimonial ar-text">
                <p className="testimonial-text">
                  «تخيّل منهج تعليمي مبتكر لا يحتاج لمساعدة من ChatGPT أو Google. 
                  بقليل من الاستثمار، يمكنك تغيير حياتك أو حياة شخص تعرفه. 
                  لا داعي لاتصالٍ دائم بالإنترنت؛ فقد صممنا طريقة تعلم إبداعية 
                  يمكنك الوصول إليها من هاتفك، مما يعزز إنتاجيتك بنسبة 95%. 
                  إنها فرصتك للالتحاق بوظائف عالية الراتب، مهما كان عملك أو عمرك 
                  أو تخصصك. نقدم تحديثات مستمرة تبقيك في الطليعة، 
                  وتنضم إلى مجتمعٍ ثري بالدعم 24/7، 
                  فلا تدع أي عائق يقف في طريقك. والأهمّ أنك تتعلم بلهجتك الخاصة 
                  بكل سهولة وسلاسة!»
                </p>
                <p className="testimonial-author">– طموح يتطلع للمستقبل</p>
              </div>
            </div>

            {/* Partners */}
            <div className="landing-partners">
              <h2 className="section-heading">Trusted By</h2>
              <div className="partners">
                {companyLogos.map((logo, index) => (
                  <img key={index} src={logo} alt="Partner Logo" className="partner-logo" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for review or error */}
      <CModal visible={showModal} onClose={closeModal} className="login-modal">
        <CModalHeader className="login-modal-header">
          <h5 className="modal-title text-center">
            <b>
              {user?.status === 'rejected' || user?.Actif === true
                ? 'Access Denied'
                : 'Account Under Review'}
            </b>
          </h5>
        </CModalHeader>
        <CModalBody
          className="login-modal-body"
          style={{ color: user?.status === 'rejected' || user?.Actif === true ? 'red' : 'green' }}
        >
          <p className="text-center">
            {modalMessage}
            {modalLink && (
              <p className="mt-3">
                <a href={modalLink} target="_blank" rel="noopener noreferrer" className="login-modal-link">
                  Click here to resolve the issue.
                </a>
              </p>
            )}
          </p>
        </CModalBody>
        <CModalFooter className="login-modal-footer">
          <CButton color="primary" onClick={closeModal} className="login-modal-button">
            Got it!
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Login

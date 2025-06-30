import { useState, useRef, useEffect } from 'react'
import './App.css'
import GrainOverlay from './GrainOverlay.jsx'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faMoon, faSun, faEye, faCloudUploadAlt, faTrash, faEdit, faRocket, faSearchPlus, faSearchMinus, faStar, faPen, faImage } from '@fortawesome/free-solid-svg-icons'
import StarRating from './StarRating.jsx'

function App() {
  const [theme, setTheme] = useState('dark')
  const [screenshot, setScreenshot] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [mode, setMode] = useState('edit')
  const [showDeploy, setShowDeploy] = useState(false)
  const [lambdaUrl, setLambdaUrl] = useState('')
  const [deployStatus, setDeployStatus] = useState('idle')
  const [zoom, setZoom] = useState(1)
  const [addingHotspot, setAddingHotspot] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [showHotspotModal, setShowHotspotModal] = useState(false)
  const [hotspotDraft, setHotspotDraft] = useState({ title: '', desc: '' })
  const imgRef = useRef()

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  const handleThemeToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleScreenshotUpload = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setScreenshot(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Prevent adding hotspots too close to each other
  const isTooClose = (x, y) => {
    return hotspots.some(pt => {
      const dx = pt.x - x
      const dy = pt.y - y
      return Math.sqrt(dx * dx + dy * dy) < 5
    })
  }

  const handleImageClick = e => {
    if (!addingHotspot || !imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    if (!isTooClose(x, y)) {
      setHotspotDraft({ title: '', desc: '' })
      setShowHotspotModal({ x, y })
    }
  }

  const handleRemoveHotspot = idx => {
    setHotspots(hotspots.filter((_, i) => i !== idx))
    if (activeHotspot === idx) setActiveHotspot(null)
  }

  const handleDeploy = async () => {
    setDeployStatus('deploying')
    const pollData = {
      screenshot,
      hotspots: hotspots.map(pt => ({ ...pt, ratings: [] })),
      created: Date.now(),
    }
    const polls = JSON.parse(localStorage.getItem('quix_polls') || '[]')
    localStorage.setItem('quix_polls', JSON.stringify([...polls, pollData]))
    if (lambdaUrl.startsWith('http')) {
      try {
        await fetch(lambdaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pollData),
        })
        setDeployStatus('success')
      } catch {
        setDeployStatus('error')
      }
    } else {
      setDeployStatus('error')
    }
  }

  const handlePreview = () => {
    const pollData = {
      screenshot,
      hotspots: hotspots.map(pt => ({ ...pt, ratings: [] })),
      created: Date.now(),
    }
    localStorage.setItem('quix_preview_poll', JSON.stringify(pollData))
    window.open('/poll-preview', '_blank')
  }

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5))
  const handleResetZoom = () => setZoom(1)

  const handleHotspotModalSave = () => {
    setHotspots([...hotspots, { x: showHotspotModal.x, y: showHotspotModal.y, title: hotspotDraft.title, desc: hotspotDraft.desc }])
    setShowHotspotModal(false)
    setHotspotDraft({ title: '', desc: '' })
  }

  const handleHotspotEdit = idx => {
    setHotspotDraft({ title: hotspots[idx].title || '', desc: hotspots[idx].desc || '' })
    setShowHotspotModal({ edit: idx })
  }

  const handleHotspotModalEditSave = () => {
    setHotspots(hotspots.map((pt, i) => i === showHotspotModal.edit ? { ...pt, title: hotspotDraft.title, desc: hotspotDraft.desc } : pt))
    setShowHotspotModal(false)
    setHotspotDraft({ title: '', desc: '' })
  }

  return (
    <div className="quix-app">
      <GrainOverlay />
      <div className="bento-layout">
        <div className="bento-left">
          <div className="bento-card">
            <div className="app-logo" style={{display: 'flex', justifyContent: 'center', marginBottom: '1.2rem'}}>
              <svg width="56" height="56" viewBox="0 0 3426 3426" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(0 2px 12px #0008)'}}>
                <path d="M1506.78 1533.33L2482.97 1767.92C2482.97 1767.92 2202.66 1751.71 2033.19 1795.36C1661.5 1891.12 2627.56 2467.07 2627.56 2467.07L3426 3066.66L0 43.5878L2856.51 3426L2506.48 2953.59C2506.48 2953.59 1975.36 1667.04 1745.13 1971.91C1649.53 2098.5 1662.22 2349.55 1662.22 2349.55L1506.78 1533.33ZM3426 1533.33C3426 1848.16 3358.49 2120.23 3223.47 2349.55C3088.46 2578.87 2903.24 2755.72 2667.83 2880.1C2432.41 3004.47 2163.54 3066.66 1861.19 3066.66C1558.85 3066.66 1289.97 3004.47 1054.55 2880.1C819.138 2755.72 633.923 2578.87 498.906 2349.55C363.889 2120.23 296.381 1848.16 296.381 1533.33C296.381 1218.5 363.889 946.428 498.906 717.109C633.923 487.79 819.138 310.942 1054.55 186.565C1289.97 62.1884 1558.85 0 1861.19 0C2163.54 0 2432.41 62.1884 2667.83 186.565C2903.24 310.942 3088.46 487.79 3223.47 717.109C3358.49 946.428 3426 1218.5 3426 1533.33ZM3010.56 1533.33C3010.56 1274.86 2959.21 1056.72 2856.51 878.896C2754.96 701.076 2617.05 566.497 2442.8 475.158C2269.7 383.818 2075.83 338.149 1861.19 338.149C1646.55 338.149 1452.1 383.818 1277.85 475.158C1104.75 566.497 966.849 701.076 864.144 878.896C762.593 1056.72 711.817 1274.86 711.817 1533.33C711.817 1791.8 762.593 2009.95 864.144 2187.77C966.849 2365.59 1104.75 2500.16 1277.85 2591.5C1452.1 2682.84 1646.55 2728.51 1861.19 2728.51C2075.83 2728.51 2269.7 2682.84 2442.8 2591.5C2617.05 2500.16 2754.96 2365.59 2856.51 2187.77C2959.21 2009.95 3010.56 1791.8 3010.56 1533.33Z" fill="white"/>
              </svg>
            </div>
            <header className="header" style={{marginBottom: '1.2rem'}}>
              <h1 style={{fontSize: '2rem', margin: 0}}>Quix UI Rater</h1>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <Link to="/dashboard" className="icon-btn" title="Dashboard">
                  <FontAwesomeIcon icon={faChartBar} />
                </Link>
                <button className="icon-btn" onClick={handleThemeToggle} title="Toggle theme">
                  <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
                </button>
              </div>
            </header>
            <label className="upload-label" title="Upload a screenshot to start">
              <input type="file" accept="image/*" onChange={handleScreenshotUpload} />
              <span><FontAwesomeIcon icon={faCloudUploadAlt} style={{marginRight: '0.5rem'}} />Upload Screenshot</span>
            </label>
            {screenshot && (
              <>
                <div className="screenshot-toolbar">
                  <button onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')} title="Edit Hotspots">
                    <FontAwesomeIcon icon={faEdit} /> Edit Hotspots
                  </button>
                  <button onClick={handlePreview} title="Preview">
                    <FontAwesomeIcon icon={faEye} /> Preview
                  </button>
                  <button onClick={() => setShowDeploy(true)} title="Deploy">
                    <FontAwesomeIcon icon={faRocket} /> Deploy
                  </button>
                  <button onClick={() => { setScreenshot(null); setHotspots([]); setActiveHotspot(null); }} title="Remove Screenshot">
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                </div>
                <div className="screenshot-toolbar">
                  <button className="icon-btn" onClick={handleZoomIn} title="Zoom In"><FontAwesomeIcon icon={faSearchPlus} /></button>
                  <button className="icon-btn" onClick={handleZoomOut} title="Zoom Out"><FontAwesomeIcon icon={faSearchMinus} /></button>
                  <button className="icon-btn" onClick={handleResetZoom} title="Reset Zoom">1x</button>
                </div>
                <button className={`add-hotspot-btn${addingHotspot ? ' active' : ''}`} onClick={() => setAddingHotspot(a => !a)}>
                  <FontAwesomeIcon icon={faStar} style={{marginRight: '0.5rem'}} />
                  {addingHotspot ? 'Click screenshot to add rating point' : 'Add Rating Point'}
                </button>
                <div className="hotspot-list">
                  {hotspots.map((pt, idx) => (
                    <div key={idx} className={`hotspot-list-item${activeHotspot === idx ? ' active' : ''}`}> 
                      <button className="icon-btn" onClick={() => setActiveHotspot(idx)} title="Show/Rate Hotspot"><FontAwesomeIcon icon={faStar} /></button>
                      <span className="hotspot-title">{pt.title || `Point ${idx + 1}`}</span>
                      <button className="icon-btn" onClick={() => handleHotspotEdit(idx)} title="Edit Hotspot Info"><FontAwesomeIcon icon={faPen} /></button>
                      <button className="remove-hotspot" onClick={() => handleRemoveHotspot(idx)} title="Remove Hotspot">×</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {!screenshot && (
              <div className="bento-empty">
                <div className="bento-empty-illustration"><FontAwesomeIcon icon={faImage} /></div>
                <div>
                  Upload a screenshot of any app or website UI to start.<br/>
                  Click anywhere on the screenshot to add a rating point.<br/>
                  Use the toolbar to preview, deploy, or remove.
                </div>
              </div>
            )}
          </div>
          <footer>Quix © {new Date().getFullYear()} | Modern UI Rater</footer>
        </div>
        <div className="bento-right">
          <div className="bento-card screenshot-panel">
            {!screenshot ? (
              <div className="bento-empty">
                <div className="bento-empty-illustration"><FontAwesomeIcon icon={faImage} /></div>
                <div>
                  Upload a screenshot to see it here.<br/>
                  All rating points will appear on your screenshot.
                </div>
              </div>
            ) : (
              <div className="screenshot-container right-pane" style={{transform: `scale(${zoom})`, transition: 'transform 0.2s', margin: '0 auto'}}>
                <img
                  src={screenshot}
                  alt="Screenshot"
                  ref={imgRef}
                  className="screenshot-img"
                  onClick={handleImageClick}
                  style={{ cursor: addingHotspot ? 'crosshair' : 'default' }}
                />
                {hotspots.map((pt, idx) => (
                  <div
                    key={idx}
                    className={`hotspot${activeHotspot === idx ? ' active' : ''}`}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  >
                    <button className="icon-btn minimal-hotspot" onClick={() => setActiveHotspot(idx)} title="Show/Rate Hotspot"><FontAwesomeIcon icon={faStar} /></button>
                    {activeHotspot === idx && (
                      <div className="bento-hotspot-card">
                        <div className="hotspot-details-title">{pt.title || `Point ${idx + 1}`}</div>
                        <div className="hotspot-details-desc">{pt.desc}</div>
                        <StarRating />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showHotspotModal && (
        <Modal onClose={() => setShowHotspotModal(false)}>
          <div className="hotspot-modal">
            <h2>{showHotspotModal.edit !== undefined ? 'Edit Hotspot' : 'Add Hotspot'}</h2>
            <label>Title
              <input type="text" value={hotspotDraft.title} onChange={e => setHotspotDraft({...hotspotDraft, title: e.target.value})} placeholder="Hotspot title" />
            </label>
            <label>Description
              <textarea value={hotspotDraft.desc} onChange={e => setHotspotDraft({...hotspotDraft, desc: e.target.value})} placeholder="Hotspot description" />
            </label>
            <div style={{marginTop: '1.2rem'}}>
              {showHotspotModal.edit !== undefined ? (
                <button onClick={handleHotspotModalEditSave}>Save</button>
              ) : (
                <button onClick={handleHotspotModalSave}>Add</button>
              )}
              <button onClick={() => setShowHotspotModal(false)} style={{marginLeft: '1rem'}}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
      {showDeploy && (
        <Modal onClose={() => { setShowDeploy(false); setDeployStatus('idle'); }}>
          <div className="deploy-modal">
            <h2>Deploy Poll</h2>
            <label style={{display: 'block', marginBottom: '1rem'}}>
              Lambda API URL:
              <input
                type="text"
                value={lambdaUrl}
                onChange={e => setLambdaUrl(e.target.value)}
                placeholder="https://your-lambda-api-url"
                style={{width: '100%', marginTop: '0.5rem'}}
              />
            </label>
            <button onClick={handleDeploy} disabled={deployStatus === 'deploying'}>
              {deployStatus === 'deploying' ? 'Deploying...' : 'Deploy'}
            </button>
            {deployStatus === 'success' && <div className="result-msg">Poll deployed successfully!</div>}
            {deployStatus === 'error' && <div className="result-msg" style={{color: 'red'}}>Invalid Lambda URL.</div>}
            <button onClick={() => { setShowDeploy(false); setDeployStatus('idle'); }} style={{marginTop: '1rem'}}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default App

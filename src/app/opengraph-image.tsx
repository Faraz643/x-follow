import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'X Follow — Follow for follow. Same category, real connections.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '54px 64px',
          background: 'linear-gradient(120deg, #17194a 0%, #10162d 48%, #102e43 100%)',
          color: '#f7f7ff',
          fontFamily: 'Arial, Helvetica, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: 999, background: '#6d55ff', opacity: 0.22, filter: 'blur(90px)', top: -180, left: -100 }} />
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: 999, background: '#29c8ff', opacity: 0.18, filter: 'blur(90px)', right: -120, top: 70 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
          <div style={{ width: 54, height: 54, borderRadius: 999, background: '#f5f5f8', color: '#10142b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800 }}>𝕏</div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>X Follow</div>
        </div>

        <div style={{ marginTop: 42, display: 'flex', flexDirection: 'column', zIndex: 1, width: 760 }}>
          <div style={{ fontSize: 18, letterSpacing: 4, fontWeight: 800, color: '#9d8cff', marginBottom: 18 }}>COMMUNITY-POWERED X DIRECTORY</div>
          <div style={{ fontSize: 64, lineHeight: 1.02, fontWeight: 850, letterSpacing: -2 }}>
            Follow for follow.<br />
            Same category, real<br />
            connections.
          </div>
          <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.35, color: '#bfc3dc', maxWidth: 760 }}>
            Find people in your category, follow them on X, and get discovered by others building in the same space.
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '18px 28px', borderRadius: 16, background: 'linear-gradient(100deg, #8b78ff, #48d8f2)', fontSize: 22, fontWeight: 800, boxShadow: '0 12px 35px rgba(88,118,255,.3)' }}>
              List my account →
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '18px 28px', borderRadius: 16, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', fontSize: 22, fontWeight: 800 }}>
              Browse accounts ↓
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', right: 54, bottom: 48, width: 310, padding: 24, borderRadius: 24, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(18,25,55,.58)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 16, color: '#a9aeca', letterSpacing: 1 }}>DISCOVER BY CATEGORY</div>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {['Technology', 'AI', 'Design', 'Sports'].map((item) => (
              <div key={item} style={{ padding: '8px 13px', borderRadius: 999, background: 'rgba(139,120,255,.2)', border: '1px solid rgba(139,120,255,.3)', fontSize: 15 }}>{item}</div>
            ))}
          </div>
          <div style={{ fontSize: 17, color: '#d9dced', marginTop: 3 }}>Real people. Same interests. Better connections.</div>
        </div>
      </div>
    ),
    { ...size }
  )
}

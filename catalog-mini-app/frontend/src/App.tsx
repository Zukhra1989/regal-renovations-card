import { useState } from 'react'
import './index.css'

// ─── Mock Data ───────────────────────────────────────────────
const MASTER = {
  name: 'Елена Смирнова',
  city: 'Амстердам',
  specialty: 'Ногтевой сервис',
  experience: 'с 2018',
  clients: '400+',
  rating: '4.9',
  reviews: 85,
  bio: 'Делаю маникюр, педикюр и nail-art. Работаю с гель-лаком, акрилом и биогелем. Каждый клиент — особенный, подхожу индивидуально.',
  photo: 'https://i.pravatar.cc/150?img=47',
  workHours: 'Пн–Сб, 10:00–20:00',
  nextSlot: 'Завтра, 14:00',
}

const CATEGORIES = [
  { id: 1, name: 'Маникюр', photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
  { id: 2, name: 'Педикюр', photo: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=400&q=80' },
  { id: 3, name: 'Дизайн', photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
  { id: 4, name: 'Наращивание', photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
]

const SERVICES: Record<number, { id: number; name: string; desc: string; price: number; duration: number; photo: string }[]> = {
  1: [
    { id: 1, name: 'Маникюр классический', desc: 'Обработка кутикулы, форма, покрытие', price: 1800, duration: 60, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
    { id: 2, name: 'Маникюр гель-лак', desc: 'Гель-лак на 2–3 недели, 100+ оттенков', price: 2200, duration: 75, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
    { id: 3, name: 'Маникюр + дизайн', desc: 'Гель-лак + авторский дизайн', price: 2800, duration: 90, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
  ],
  2: [
    { id: 4, name: 'Педикюр классический', desc: 'Уход за стопами, форма, покрытие', price: 2500, duration: 90, photo: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=300&q=80' },
    { id: 5, name: 'Педикюр гель-лак', desc: 'Гель-лак на ногти ног', price: 2800, duration: 105, photo: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=300&q=80' },
  ],
  3: [
    { id: 6, name: 'Nail-art (1 ноготь)', desc: 'Авторский дизайн на один ноготь', price: 300, duration: 20, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
    { id: 7, name: 'Nail-art (все ногти)', desc: 'Единый дизайн на все ногти', price: 1500, duration: 60, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
  ],
  4: [
    { id: 8, name: 'Наращивание гель', desc: 'Длина до 10мм, любая форма', price: 4500, duration: 150, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
    { id: 9, name: 'Коррекция нарощенных', desc: 'Коррекция отросших ногтей', price: 2800, duration: 100, photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80' },
  ],
}

const PORTFOLIO = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  url: `https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80&sig=${i}`,
}))

const TIME_SLOTS = ['10:00', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30']
const BUSY_SLOTS = ['11:00', '15:30']

type Screen = 'home' | 'services' | 'service' | 'date' | 'time' | 'confirm' | 'success' | 'bookings' | 'portfolio' | 'about'

// ─── Components ──────────────────────────────────────────────

function BottomNav({ active, onChange }: { active: string; onChange: (s: Screen) => void }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Главная' },
    { id: 'bookings', icon: '📋', label: 'Записи' },
    { id: 'portfolio', icon: '📸', label: 'Портфолио' },
    { id: 'about', icon: '👤', label: 'Мастер' },
  ]
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: 'var(--tg-bottom-bar)',
      borderTop: '1px solid #e5e7eb', display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id as Screen)}
          style={{
            flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: active === tab.id ? 'var(--tg-button)' : 'var(--tg-hint)',
            fontSize: 10, fontWeight: active === tab.id ? 600 : 400, cursor: 'pointer',
            minHeight: 56,
          }}>
          <span style={{ fontSize: 22 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

function MainButton({ text, onClick, disabled }: { text: string; onClick: () => void; disabled?: boolean }) {
  return (
    <div style={{ position: 'fixed', bottom: 70, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '0 16px', zIndex: 99 }}>
      <button onClick={onClick} disabled={disabled} style={{
        width: '100%', padding: '16px', borderRadius: 12, border: 'none',
        background: disabled ? '#ccc' : 'var(--tg-button)',
        color: 'var(--tg-button-text)', fontSize: 16, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 52,
      }}>{text}</button>
    </div>
  )
}

// ─── Screens ─────────────────────────────────────────────────

function HomeScreen({ onCategory, onBook }: { onCategory: (id: number) => void; onBook: () => void }) {
  return (
    <div style={{ paddingBottom: 140 }}>
      {/* Header */}
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={MASTER.photo} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{MASTER.name}</div>
          <div style={{ color: 'var(--tg-hint)', fontSize: 13 }}>{MASTER.city} · {MASTER.specialty}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 22, cursor: 'pointer' }}>📷</span>
          <span style={{ fontSize: 22, cursor: 'pointer' }}>ℹ️</span>
        </div>
      </div>

      {/* Next slot */}
      <div style={{ margin: '12px 16px', background: 'var(--tg-section-bg)', borderRadius: 16, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 13, color: 'var(--tg-hint)', marginBottom: 8 }}>⚡ Ближайшее свободное время</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{MASTER.nextSlot}</div>
        <button onClick={onBook} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: 'var(--tg-button)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>Записаться сейчас</button>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Услуги</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} onClick={() => onCategory(cat.id)} style={{
              borderRadius: 16, overflow: 'hidden', height: 120,
              position: 'relative', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <img src={cat.photo} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                display: 'flex', alignItems: 'flex-end', padding: '12px',
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServicesScreen({ categoryId, onService, onBack }: { categoryId: number; onService: (id: number) => void; onBack: () => void }) {
  const cat = CATEGORIES.find(c => c.id === categoryId)
  const services = SERVICES[categoryId] || []
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{cat?.name}</div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {services.map(s => (
          <div key={s.id} onClick={() => onService(s.id)} style={{
            background: 'var(--tg-section-bg)', borderRadius: 16, padding: '14px',
            display: 'flex', gap: 12, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <img src={s.photo} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
              <div style={{ color: 'var(--tg-hint)', fontSize: 13 }}>{s.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ color: 'var(--tg-accent)', fontWeight: 700, fontSize: 16 }}>{s.price.toLocaleString()} ₽</span>
                <span style={{ color: 'var(--tg-hint)', fontSize: 13 }}>⏱ {s.duration} мин</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServiceScreen({ serviceId, onBook, onBack }: { serviceId: number; onBook: (id: number) => void; onBack: () => void }) {
  const service = Object.values(SERVICES).flat().find(s => s.id === serviceId)
  if (!service) return null
  return (
    <div style={{ paddingBottom: 140 }}>
      <div style={{ position: 'relative' }}>
        <img src={service.photo} alt="" style={{ width: '100%', height: 260, objectFit: 'cover' }} />
        <button onClick={onBack} style={{
          position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.4)',
          border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: 18, cursor: 'pointer',
        }}>←</button>
      </div>
      <div style={{ padding: '20px 16px', background: 'var(--tg-section-bg)', marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{service.name}</div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <span style={{ color: 'var(--tg-accent)', fontWeight: 700, fontSize: 20 }}>{service.price.toLocaleString()} ₽</span>
          <span style={{ color: 'var(--tg-hint)', fontSize: 16 }}>⏱ {service.duration} мин</span>
        </div>
        <div style={{ color: 'var(--tg-hint)', fontSize: 15, lineHeight: 1.5 }}>{service.desc}</div>
      </div>
      <div style={{ padding: '16px', background: 'var(--tg-section-bg)' }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Мастер</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={MASTER.photo} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{MASTER.name}</div>
            <div style={{ color: 'var(--tg-hint)', fontSize: 13 }}>{MASTER.specialty}</div>
          </div>
        </div>
      </div>
      <MainButton text={`Записаться — ${service.price.toLocaleString()} ₽`} onClick={() => onBook(serviceId)} />
    </div>
  )
}

function DateScreen({ onNext, onBack }: { onNext: (date: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { day: i + 1, label: d.toLocaleDateString('ru', { day: 'numeric', month: 'short' }), available: i % 3 !== 0 }
  })
  return (
    <div style={{ paddingBottom: 140 }}>
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Выберите дату</div>
          <div style={{ color: 'var(--tg-hint)', fontSize: 12 }}>Шаг 2 из 4</div>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ background: 'var(--tg-section-bg)', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>Май 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {days.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--tg-hint)', padding: '4px 0' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {dates.slice(0, 28).map(d => (
              <button key={d.day} disabled={!d.available} onClick={() => setSelected(d.label)}
                style={{
                  minHeight: 44, borderRadius: 10, border: 'none', cursor: d.available ? 'pointer' : 'not-allowed',
                  background: selected === d.label ? 'var(--tg-button)' : d.available ? 'var(--tg-secondary-bg)' : 'transparent',
                  color: selected === d.label ? '#fff' : d.available ? 'var(--tg-text)' : 'var(--tg-hint)',
                  fontSize: 14, fontWeight: selected === d.label ? 700 : 400,
                }}>{d.day}</button>
            ))}
          </div>
        </div>
      </div>
      <MainButton text={selected ? `Выбрать время →` : 'Выберите дату'} onClick={() => selected && onNext(selected)} disabled={!selected} />
    </div>
  )
}

function TimeScreen({ date, onNext, onBack }: { date: string; onNext: (time: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div style={{ paddingBottom: 140 }}>
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Выберите время</div>
          <div style={{ color: 'var(--tg-hint)', fontSize: 12 }}>Шаг 3 из 4 · {date}</div>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ color: 'var(--tg-destructive)', fontSize: 13, marginBottom: 12 }}>⚡ Осталось 5 свободных слотов</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {TIME_SLOTS.map(t => {
            const busy = BUSY_SLOTS.includes(t)
            return (
              <button key={t} disabled={busy} onClick={() => !busy && setSelected(t)}
                style={{
                  minHeight: 52, borderRadius: 12, border: '2px solid',
                  borderColor: selected === t ? 'var(--tg-button)' : busy ? '#e5e7eb' : '#e5e7eb',
                  background: selected === t ? 'var(--tg-button)' : busy ? '#f9fafb' : 'var(--tg-section-bg)',
                  color: selected === t ? '#fff' : busy ? 'var(--tg-hint)' : 'var(--tg-text)',
                  fontSize: 16, fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer',
                }}>
                {busy ? <span style={{ fontSize: 12 }}>занято</span> : t}
              </button>
            )
          })}
        </div>
      </div>
      <MainButton text={selected ? `Продолжить · ${selected}` : 'Выберите время'} onClick={() => selected && onNext(selected)} disabled={!selected} />
    </div>
  )
}

function ConfirmScreen({ serviceId, date, time, onConfirm, onBack }: { serviceId: number; date: string; time: string; onConfirm: () => void; onBack: () => void }) {
  const service = Object.values(SERVICES).flat().find(s => s.id === serviceId)
  if (!service) return null
  const deposit = Math.round(service.price * 0.25)
  return (
    <div style={{ paddingBottom: 140 }}>
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Подтвердите запись</div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--tg-section-bg)', borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <img src={MASTER.photo} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
            <div><div style={{ fontWeight: 700 }}>{MASTER.name}</div><div style={{ color: 'var(--tg-hint)', fontSize: 13 }}>{MASTER.specialty}</div></div>
          </div>
          {[
            { label: '💅 Услуга', value: service.name },
            { label: '📅 Дата', value: date },
            { label: '🕐 Время', value: time },
            { label: '⏱ Длительность', value: `${service.duration} мин` },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f4f4f5' }}>
              <span style={{ color: 'var(--tg-hint)' }}>{row.label}</span>
              <span style={{ fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 8px' }}>
            <span style={{ fontWeight: 600 }}>Итого</span>
            <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--tg-accent)' }}>{service.price.toLocaleString()} ₽</span>
          </div>
          <div style={{ background: 'var(--tg-secondary-bg)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>
            Депозит сейчас: <b>{deposit.toLocaleString()} ₽</b> · Остаток на месте: <b>{(service.price - deposit).toLocaleString()} ₽</b>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--tg-hint)', textAlign: 'center' }}>
          Отмена бесплатна за 24 часа до визита
        </div>
      </div>
      <MainButton text={`Оплатить депозит ${deposit.toLocaleString()} ₽`} onClick={onConfirm} />
    </div>
  )
}

function SuccessScreen({ onHome }: { onHome: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
      <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Вы записаны!</div>
      <div style={{ color: 'var(--tg-hint)', fontSize: 15, marginBottom: 32 }}>Детали отправлены в Telegram-чат с мастером</div>
      <div style={{ background: 'var(--tg-section-bg)', borderRadius: 16, padding: '20px', width: '100%', maxWidth: 320, marginBottom: 24 }}>
        {['💅 Маникюр гель-лак', '📅 Завтра, 14 мая', '🕐 14:00', '📍 Амстердам'].map(item => (
          <div key={item} style={{ padding: '8px 0', fontSize: 15, borderBottom: '1px solid #f4f4f5' }}>{item}</div>
        ))}
      </div>
      <button onClick={onHome} style={{
        width: '100%', maxWidth: 320, padding: '16px', borderRadius: 12, border: 'none',
        background: 'var(--tg-button)', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
      }}>На главную</button>
    </div>
  )
}

function BookingsScreen() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', fontWeight: 700, fontSize: 18, borderBottom: '1px solid #f0f0f0' }}>Мои записи</div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { service: 'Маникюр гель-лак', date: '14 мая, 14:00', status: 'Подтверждена', color: '#22c55e' },
          { service: 'Педикюр классический', date: '28 мая, 11:00', status: 'Ожидает', color: '#f59e0b' },
        ].map((b, i) => (
          <div key={i} style={{ background: 'var(--tg-section-bg)', borderRadius: 16, padding: '16px', display: 'flex', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 4, borderRadius: 4, background: b.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.service}</div>
              <div style={{ color: 'var(--tg-hint)', fontSize: 14, marginBottom: 8 }}>{b.date}</div>
              <span style={{ fontSize: 12, background: b.color + '20', color: b.color, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioScreen() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--tg-header-bg)', padding: '16px', fontWeight: 700, fontSize: 18, borderBottom: '1px solid #f0f0f0' }}>Портфолио</div>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ color: 'var(--tg-hint)', fontSize: 13, marginBottom: 12 }}>12 работ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {PORTFOLIO.map(p => (
            <div key={p.id} style={{ aspectRatio: '1', borderRadius: 8, overflow: 'hidden' }}>
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AboutScreen({ onBook }: { onBook: () => void }) {
  return (
    <div style={{ paddingBottom: 140 }}>
      <div style={{ position: 'relative' }}>
        <img src={MASTER.photo} alt="" style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div style={{ padding: '20px 16px', background: 'var(--tg-section-bg)', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 4 }}>{MASTER.name}</div>
        <div style={{ color: 'var(--tg-hint)', marginBottom: 16 }}>{MASTER.specialty} · {MASTER.city} · {MASTER.workHours}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: MASTER.experience, sub: 'опыт' },
            { label: MASTER.clients, sub: 'клиентов' },
            { label: `${MASTER.rating}★`, sub: `${MASTER.reviews} отзывов` },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: 'var(--tg-secondary-bg)', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{stat.label}</div>
              <div style={{ color: 'var(--tg-hint)', fontSize: 11 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--tg-hint)' }}>{MASTER.bio}</div>
      </div>
      <MainButton text="Записаться" onClick={onBook} />
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedCategory, setSelectedCategory] = useState<number>(1)
  const [selectedService, setSelectedService] = useState<number>(1)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  const navigate = (s: Screen) => setScreen(s)

  if (screen === 'success') return <SuccessScreen onHome={() => navigate('home')} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--tg-secondary-bg)' }}>
      {screen === 'home' && <HomeScreen onCategory={id => { setSelectedCategory(id); navigate('services') }} onBook={() => { setSelectedService(2); navigate('service') }} />}
      {screen === 'services' && <ServicesScreen categoryId={selectedCategory} onService={id => { setSelectedService(id); navigate('service') }} onBack={() => navigate('home')} />}
      {screen === 'service' && <ServiceScreen serviceId={selectedService} onBook={id => { setSelectedService(id); navigate('date') }} onBack={() => navigate('services')} />}
      {screen === 'date' && <DateScreen onNext={d => { setSelectedDate(d); navigate('time') }} onBack={() => navigate('service')} />}
      {screen === 'time' && <TimeScreen date={selectedDate} onNext={t => { setSelectedTime(t); navigate('confirm') }} onBack={() => navigate('date')} />}
      {screen === 'confirm' && <ConfirmScreen serviceId={selectedService} date={selectedDate} time={selectedTime} onConfirm={() => navigate('success')} onBack={() => navigate('time')} />}
      {screen === 'bookings' && <BookingsScreen />}
      {screen === 'portfolio' && <PortfolioScreen />}
      {screen === 'about' && <AboutScreen onBook={() => { setSelectedService(1); navigate('date') }} />}

      {!['date', 'time', 'confirm', 'success'].includes(screen) && (
        <BottomNav active={screen} onChange={navigate} />
      )}
    </div>
  )
}

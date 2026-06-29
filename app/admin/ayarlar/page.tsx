'use client';

import { useState } from 'react';

export default function AyarlarPage() {
  const [channel, setChannel] = useState('mock');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>Sistem Ayarları</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>BerberEskişehir VIP sistem yapılandırması.</p>
      </div>

      <div className="grid-2">
        {/* Bildirim Ayarları */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 className="heading-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Bildirim Entegrasyonu
          </h2>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Aktif Kanal</label>
            <select 
              className="form-input"
              value={channel}
              onChange={e => setChannel(e.target.value)}
            >
              <option value="mock">Geliştirme Modu (Log)</option>
              <option value="sms">Twilio SMS (Anında Aktif)</option>
              <option value="whatsapp" disabled>Twilio WhatsApp (Meta Onayı Gerekli)</option>
            </select>
            {channel === 'mock' && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-info)', marginTop: '0.5rem' }}>
                * Sistem şu an sadece log basıyor. SMS gönderilmiyor.
              </p>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Twilio Account SID</label>
            <input type="password" placeholder="ACXXXXXXXXXXXXXXXXXXXX" className="form-input" disabled={channel === 'mock'} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Twilio Auth Token</label>
            <input type="password" placeholder="••••••••••••••••••••••••" className="form-input" disabled={channel === 'mock'} />
          </div>

          <button className="btn btn-primary" disabled={channel === 'mock'}>
            Bağlantıyı Test Et
          </button>
        </div>

        {/* Çalışma Saatleri */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 className="heading-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Salon Çalışma Saatleri
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'].map(day => (
              <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, width: '100px' }}>{day}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="time" className="form-input" defaultValue="09:00" style={{ width: '120px' }} />
                  <span>-</span>
                  <input type="time" className="form-input" defaultValue={day === 'Cumartesi' ? '17:00' : '19:00'} style={{ width: '120px' }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500, width: '100px' }}>Pazar</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge-error">Kapalı</span>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Saatleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Certification } from '../../types/database'
import FormDialog from '../components/FormDialog'
import DeleteDialog from '../components/DeleteDialog'
import Toast from '../components/Toast'
import { FaAws } from 'react-icons/fa'
import { SiGooglecloud, SiCisco, SiComptia, SiLinuxfoundation, SiHashicorp } from 'react-icons/si'
import { GrOracle } from 'react-icons/gr'
import { MdDelete, MdCheckCircle } from 'react-icons/md'

const certFormats = [
  { name: 'Microsoft', prefix: 'Microsoft Certified:', color: '#0078d4', suggestions: [
    'Azure Fundamentals (AZ-900)', 'Azure Administrator Associate (AZ-104)', 'Azure Solutions Architect Expert (AZ-305)',
    'Azure Developer Associate (AZ-204)', 'Azure DevOps Engineer Expert (AZ-400)', 'Azure Data Engineer Associate (DP-203)',
    'Azure AI Engineer Associate (AI-102)', 'Fabric Analytics Engineer Associate (DP-600)',
    'Fabric Data Engineer Associate (DP-700)', 'SQL AI Developer Associate (DP-800)',
    'Power BI Data Analyst Associate (PL-300)', 'Security Operations Analyst Associate (SC-200)',
  ]},
  { name: 'AWS', prefix: 'AWS Certified:', color: '#FF9900', suggestions: [
    'Cloud Practitioner (CLF-C02)', 'Solutions Architect Associate (SAA-C03)',
    'Developer Associate (DVA-C02)', 'SysOps Administrator Associate (SOA-C02)',
    'Solutions Architect Professional (SAP-C02)', 'DevOps Engineer Professional (DOP-C02)',
    'Data Engineer Associate (DEA-C01)', 'Machine Learning Specialty (MLS-C01)',
    'Security Specialty (SCS-C02)', 'Database Specialty (DBS-C01)',
  ]},
  { name: 'Google Cloud', prefix: 'Google Cloud Certified:', color: '#4285F4', suggestions: [
    'Cloud Digital Leader', 'Associate Cloud Engineer', 'Professional Cloud Architect',
    'Professional Data Engineer', 'Professional ML Engineer', 'Professional Cloud Developer',
    'Professional Cloud DevOps Engineer', 'Professional Cloud Security Engineer',
  ]},
  { name: 'Cisco', prefix: 'Cisco Certified:', color: '#049FD9', suggestions: [
    'CCNA (200-301)', 'CCNP Enterprise', 'CCNP Security', 'CCNP Data Center',
    'CCIE Enterprise Infrastructure', 'DevNet Associate', 'DevNet Professional',
  ]},
  { name: 'CompTIA', prefix: 'CompTIA:', color: '#E8112D', suggestions: [
    'A+', 'Network+', 'Security+', 'Cloud+', 'CySA+', 'PenTest+', 'Linux+', 'Server+', 'CASP+',
  ]},
  { name: 'Oracle', prefix: 'Oracle Certified:', color: '#C74634', suggestions: [
    'Oracle Cloud Infrastructure Foundations Associate', 'Oracle Cloud Infrastructure Architect Associate',
    'Oracle Cloud Infrastructure Architect Professional', 'Oracle Database SQL Certified Associate',
  ]},
  { name: 'Linux Foundation', prefix: 'Linux Foundation:', color: '#FCC624', suggestions: [
    'Certified Kubernetes Administrator (CKA)', 'Certified Kubernetes Application Developer (CKAD)',
    'Certified Kubernetes Security Specialist (CKS)', 'Linux Foundation Certified System Administrator (LFCS)',
  ]},
  { name: 'HashiCorp', prefix: 'HashiCorp:', color: '#000000', suggestions: [
    'HashiCorp Certified: Terraform Associate', 'HashiCorp Certified: Vault Associate',
    'HashiCorp Certified: Consul Associate', 'HashiCorp Certified: Nomad Associate',
  ]},
]

// Exact Microsoft badge from Education.tsx
function MicrosoftBadge() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <path d="M283.38 118.47a16.44 16.44 0 00-10.75-6.69q-11.26-1.95-22.56-3.52V54.43A21.54 21.54 0 00235.49 34l-.16-.05h-.17l-74.74-22.61A32.63 32.63 0 00150 9.64a32.58 32.58 0 00-10.41 1.7L64.84 33.93h-.17l-.16.05a21.54 21.54 0 00-14.58 20.4v53.83q-11.3 1.58-22.56 3.52a16.44 16.44 0 00-10.75 6.69 13.48 13.48 0 00-2.25 10.25l11 57.39a14.64 14.64 0 0016.82 11.47c2.6-.45 5.2-.87 7.81-1.29.15 14.32 5.62 28.23 16.3 41.36 8.15 10 19.37 19.62 33.34 28.52a244.66 244.66 0 0047.18 23.07l3.28 1.12 3.27-1.15a250.23 250.23 0 0047.12-23.35c14-9 25.17-18.56 33.3-28.53 10.68-13.09 16.16-26.9 16.31-41 2.61.42 5.21.84 7.81 1.29a14.92 14.92 0 002.48.21 14.62 14.62 0 0014.34-11.69l10.95-57.37a13.49 13.49 0 00-2.3-10.25z" fill="#002050"/>
      <path d="M60 194.35v1.34c0 53.33 90 84.06 90 84.06s90-31.52 90-84.06v-.91a633.88 633.88 0 00-180-.43z" fill="#0064b5"/>
      <path d="M240 106.93V54.8a11.52 11.52 0 00-7.78-10.91l-74.85-22.63a22.81 22.81 0 00-14.72 0L67.74 43.89A11.52 11.52 0 0060 54.8v52.13a720.59 720.59 0 01180 0z" fill="#505050"/>
      <path d="M104 88.53a7.62 7.62 0 01-3.63.77 5.89 5.89 0 01-4.5-1.8 6.71 6.71 0 01-1.69-4.74 7 7 0 011.9-5.1 6.46 6.46 0 014.82-2 7.73 7.73 0 013.1.54v1.64a6.34 6.34 0 00-3.12-.78 4.77 4.77 0 00-3.67 1.51 5.7 5.7 0 00-1.41 4 5.4 5.4 0 001.32 3.83 4.47 4.47 0 003.45 1.43A6.44 6.44 0 00104 87zm13.43.55h-7V75.93h6.68v1.4H112v4.37h4.75v1.39H112v4.6h5.43zm15.72 0h-1.83l-2.2-3.68a8.35 8.35 0 00-.59-.88 3.62 3.62 0 00-.58-.59 2.38 2.38 0 00-.65-.34 2.61 2.61 0 00-.77-.1h-1.27v5.59h-1.54V75.93h3.93a5.41 5.41 0 011.59.22 3.55 3.55 0 011.27.65 3.29 3.29 0 01.84 1.1 4 4 0 01.09 2.8 3.24 3.24 0 01-.59 1 3.54 3.54 0 01-.91.76 4.53 4.53 0 01-1.21.5 2.61 2.61 0 01.57.34 2.76 2.76 0 01.47.44c.14.17.29.37.43.58s.31.47.48.76zm-7.89-11.75v4.76h2.09a3 3 0 001.07-.17 2.48 2.48 0 00.85-.5 2.18 2.18 0 00.56-.8 2.54 2.54 0 00.2-1.06 2 2 0 00-.68-1.64 2.93 2.93 0 00-2-.59zm20.4 0h-3.8v11.75h-1.54V77.33h-3.79v-1.4h9.13zM153 89.08h-1.55V75.93H153zm13.92-11.75h-5.13v4.55h4.75v1.38h-4.75v5.82h-1.55V75.93h6.68zm7.8 11.75h-1.54V75.93h1.54zm14.2 0h-7V75.93h6.68v1.4h-5.14v4.37h4.76v1.39h-4.76v4.6h5.44zm6.29 0V75.93h3.63q7 0 7 6.41a6.48 6.48 0 01-1.93 4.9 7.17 7.17 0 01-5.17 1.84zm1.54-11.75v10.36h2a5.54 5.54 0 004-1.39 5.18 5.18 0 001.44-3.92q0-5.05-5.37-5zm-82.67-12.67h-3.94V54.08q0-1.71.15-3.78h-.1a18.93 18.93 0 01-.55 2.34l-4.14 12h-3.26L98 52.76a22.63 22.63 0 01-.56-2.46h-.11c.11 1.74.16 3.27.16 4.58v9.78h-3.56V47h5.83l3.62 10.48A15.3 15.3 0 01104 60h.08c.22-1 .46-1.83.7-2.56L108.39 47h5.69zM119.69 50a2.29 2.29 0 01-1.62-.59 1.88 1.88 0 01-.63-1.43 1.81 1.81 0 01.63-1.43 2.62 2.62 0 013.24 0 1.83 1.83 0 01.62 1.43 1.89 1.89 0 01-.62 1.45 2.32 2.32 0 01-1.62.57zm1.92 14.62h-3.9V52h3.9zm12.84-.42a7.7 7.7 0 01-3.81.77 6.42 6.42 0 01-4.7-1.77 6.08 6.08 0 01-1.8-4.55 6.73 6.73 0 011.92-5.07 7.13 7.13 0 015.16-1.85 6.54 6.54 0 013.23.59v3.3a4.41 4.41 0 00-2.72-.91 3.62 3.62 0 00-2.66 1 3.68 3.68 0 00-1 2.71A3.63 3.63 0 00129 61a3.42 3.42 0 002.58.95 5.08 5.08 0 002.84-.91zm10.79-8.65a3.31 3.31 0 00-1.64-.38 2.34 2.34 0 00-2 .93 4 4 0 00-.72 2.53v6H137V52h3.89v2.35a3.38 3.38 0 013.33-2.57 2.47 2.47 0 011 .15zM153 65a6.78 6.78 0 01-5-1.77 6.39 6.39 0 01-1.81-4.8 6.4 6.4 0 011.88-4.9 7.06 7.06 0 015.06-1.77 6.69 6.69 0 014.93 1.77 6.22 6.22 0 011.79 4.67 6.66 6.66 0 01-1.84 5A6.85 6.85 0 01153 65zm.1-10.26a2.62 2.62 0 00-2.15.95 4.18 4.18 0 00-.76 2.69q0 3.63 2.93 3.63t2.8-3.73q-.03-3.57-2.85-3.57zm8.46 9.59v-3.16a8.11 8.11 0 001.92.86 6.37 6.37 0 001.81.29 3.84 3.84 0 001.63-.29.91.91 0 00.6-.86.81.81 0 00-.27-.62 3.1 3.1 0 00-.7-.43 8.34 8.34 0 00-.93-.33c-.34-.1-.66-.21-1-.33a10.28 10.28 0 01-1.32-.61 3.88 3.88 0 01-1-.76 2.88 2.88 0 01-.59-1 3.89 3.89 0 01-.21-1.34 3.46 3.46 0 01.47-1.83 3.59 3.59 0 011.23-1.25A5.66 5.66 0 01165 52a9.32 9.32 0 012.07-.22 11.09 11.09 0 011.7.13 12.58 12.58 0 011.7.37v3a6.18 6.18 0 00-1.59-.65 6.79 6.79 0 00-1.65-.21 4.23 4.23 0 00-.73.06 2.91 2.91 0 00-.59.2 1.15 1.15 0 00-.41.33.78.78 0 00-.15.47.9.9 0 00.22.59 2 2 0 00.58.42 5.33 5.33 0 00.8.32l.87.29a11.54 11.54 0 011.4.6 4.32 4.32 0 011.08.75 2.93 2.93 0 01.69 1 4.08 4.08 0 01-.24 3.3 3.91 3.91 0 01-1.3 1.29 5.93 5.93 0 01-1.86.73 10.42 10.42 0 01-2.19.23 11.49 11.49 0 01-3.84-.67zm17.95.67a6.78 6.78 0 01-5-1.77 6.43 6.43 0 01-1.81-4.8 6.4 6.4 0 011.88-4.9 7.08 7.08 0 015.06-1.77 6.73 6.73 0 014.94 1.77 6.26 6.26 0 011.78 4.67 6.66 6.66 0 01-1.84 5 6.85 6.85 0 01-5.01 1.8zm.1-10.26a2.59 2.59 0 00-2.14.95 4.18 4.18 0 00-.77 2.69q0 3.63 2.93 3.63t2.8-3.73q0-3.57-2.82-3.57zM196.78 49a4.06 4.06 0 00-1.44-.29c-1.25 0-1.87.67-1.87 2V52h2.88v2.88h-2.88v9.75h-3.89v-9.72h-2.12V52h2.12v-1.53A4.54 4.54 0 01191 47a5.36 5.36 0 013.82-1.32 6.8 6.8 0 012 .25zm9.56 15.51a5.84 5.84 0 01-2.6.46q-4.12 0-4.12-4.28v-5.78h-2.05V52h2.05v-2.69l3.88-1.11V52h2.84v2.88h-2.84V60c0 1.32.52 2 1.57 2a2.74 2.74 0 001.27-.35zm-79.19 142.03l4.71 14.49h15.24l-12.33 8.95 4.71 14.49-12.33-8.95-12.33 8.95 4.71-14.49-12.33-8.95h15.24zm45.7 0l4.71 14.49h15.24l-12.33 8.95 4.71 14.49-12.33-8.95-12.33 8.95 4.71-14.49-12.33-8.95h15.24z" fill="#fff"/>
    </svg>
  )
}

// Certification card preview for each provider - consistent sizing
function CertPreview({ format, title, certId }: { format: string; title: string; certId: string }) {
  const fmt = certFormats.find(f => f.name === format) || certFormats[0]

  // Microsoft card design (matches portfolio)
  if (format === 'Microsoft') {
    return (
      <div className="bg-[#f5f5f5] dark:bg-[#141414] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#2a2a2a]">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px]"><MicrosoftBadge /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#0078d4] font-semibold tracking-[0.12em] uppercase">Microsoft Certified</span>
            <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-[#e0e0e8] leading-snug mt-2">{title || 'Certification Title'}</h3>
            <div className="flex items-center justify-center gap-3 mt-2.5">
              {certId && <span className="text-[11px] md:text-xs text-[#6a7a8a] font-mono">{certId}</span>}
              <span className="text-[10px] md:text-[11px] text-[#0078d4]/60 font-medium">Associate</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // AWS card design
  if (format === 'AWS') {
    return (
      <div className="bg-white dark:bg-[#232f3e] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#2a2a2a]">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><FaAws size={64} style={{ color: '#FF9900' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#FF9900] font-semibold tracking-[0.12em] uppercase">AWS Certified</span>
            <h3 className="text-base md:text-lg font-bold text-[#232f3e] dark:text-white leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Google Cloud card design
  if (format === 'Google Cloud') {
    return (
      <div className="bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#2a2a2a]">
        <div className="h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><SiGooglecloud size={64} style={{ color: '#4285F4' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#4285F4] font-semibold tracking-[0.12em] uppercase">Google Cloud Certified</span>
            <h3 className="text-base md:text-lg font-bold text-[#1a1a2a] dark:text-white leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cisco card design
  if (format === 'Cisco') {
    return (
      <div className="bg-white dark:bg-[#0a1628] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#049fd9]/30">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><SiCisco size={64} style={{ color: '#049FD9' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#049FD9] font-semibold tracking-[0.12em] uppercase">Cisco Certified</span>
            <h3 className="text-base md:text-lg font-bold text-[#049FD9] leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // CompTIA card design
  if (format === 'CompTIA') {
    return (
      <div className="bg-white dark:bg-[#1a0a0c] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#e8112d]/30">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><SiComptia size={64} style={{ color: '#E8112D' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#E8112D] font-semibold tracking-[0.12em] uppercase">CompTIA</span>
            <h3 className="text-base md:text-lg font-bold text-[#E8112D] leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Oracle card design
  if (format === 'Oracle') {
    return (
      <div className="bg-white dark:bg-[#1a0e0d] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#c74634]/30">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><GrOracle size={64} style={{ color: '#C74634' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#C74634] font-semibold tracking-[0.12em] uppercase">Oracle Certified</span>
            <h3 className="text-base md:text-lg font-bold text-[#C74634] leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Linux Foundation card design
  if (format === 'Linux Foundation') {
    return (
      <div className="bg-white dark:bg-[#1a1a10] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#fcc624]/30">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><SiLinuxfoundation size={64} style={{ color: '#FCC624' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#FCC624] font-semibold tracking-[0.12em] uppercase">Linux Foundation</span>
            <h3 className="text-base md:text-lg font-bold text-[#333] dark:text-white leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // HashiCorp card design
  if (format === 'HashiCorp') {
    return (
      <div className="bg-white dark:bg-[#1a0f0d] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#e04e39]/30">
        <div className="px-6 md:px-8 py-6 md:py-7 flex flex-col items-center text-center gap-5">
          <div className="w-[92px] h-[92px] flex items-center justify-center"><SiHashicorp size={64} style={{ color: '#e04e39' }} /></div>
          <div>
            <span className="text-[11px] md:text-xs text-[#e04e39] font-semibold tracking-[0.12em] uppercase">HashiCorp</span>
            <h3 className="text-base md:text-lg font-bold text-[#e04e39] leading-snug mt-2">{title || 'Certification Title'}</h3>
            {certId && <p className="text-[11px] md:text-xs text-[#6a7a8a] font-mono mt-2">{certId}</p>}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
              <span className="text-[10px] md:text-[11px] text-[#6a7a8a]">Verified Credential</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden border border-[#d4d4d4] dark:border-[#2a2a2a]">
      <div className="h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />
      <div className="p-5 text-center">
        <h3 className="text-base font-bold text-[#1a1a2a] dark:text-[#e0e0e8]">{title || 'Certification Title'}</h3>
        {certId && <p className="text-xs text-[#6a7a8a] dark:text-[#7a8a9a] mt-1 font-mono">{certId}</p>}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          <MdCheckCircle className="w-3 h-3 text-[#00a84e]" />
          <span className="text-[10px] md:text-[11px] text-[#6a7a8a] dark:text-[#7a8a9a]">Verified Credential</span>
        </div>
      </div>
    </div>
  )
}

export default function CertificationsPage() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Certification | null>(null)
  const [deleting, setDeleting] = useState<Certification | null>(null)
  const [form, setForm] = useState({ format: 'Microsoft', title: '', certId: '' })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-certifications'],
    queryFn: async () => { const { data, error } = await supabase.from('certifications').select('*').order('created_at', { ascending: false }); if (error) throw error; return data as Certification[] },
  })

  const save = useMutation({
    mutationFn: async (d: typeof form) => {
      const fmt = certFormats.find(f => f.name === d.format)
      const fullName = fmt?.prefix ? `${fmt.prefix} ${d.title}${d.certId ? ` (${d.certId})` : ''}`.trim() : `${d.title}${d.certId ? ` (${d.certId})` : ''}`.trim()
      if (editing) { const { error } = await supabase.from('certifications').update({ name: fullName }).eq('id', editing.id); if (error) throw error }
      else { const { error } = await supabase.from('certifications').insert({ name: fullName }); if (error) throw error }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-certifications'] }); setDialogOpen(false); setEditing(null); setToast({ message: editing ? 'Updated' : 'Added', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('certifications').delete().eq('id', id); if (error) throw error },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-certifications'] }); setDeleteOpen(false); setDeleting(null); setToast({ message: 'Deleted', type: 'success' }) },
    onError: (e: any) => setToast({ message: e.message, type: 'error' }),
  })

  const openAdd = () => { setEditing(null); setForm({ format: 'Microsoft', title: '', certId: '' }); setShowSuggestions(true); setDialogOpen(true) }
  const openEdit = (c: Certification) => {
    const match = c.name.match(/^(Microsoft Certified|AWS Certified|Google Cloud Certified|Cisco Certified|CompTIA|Oracle Certified|Linux Foundation|HashiCorp):\s*(.+?)\s*\((.+?)\)$/)
    if (match) setForm({ format: match[1].replace(' Certified', ''), title: match[2], certId: match[3] })
    else setForm({ format: 'Other', title: c.name, certId: '' })
    setShowSuggestions(false)
    setEditing(c); setDialogOpen(true)
  }

  const selectedFormat = certFormats.find(f => f.name === form.format) || certFormats[0]

  return (
    <div className="space-y-6">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Certifications</h1><p className="text-sm text-[var(--text-muted)] mt-1">{items.length} certifications</p></div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25">+ Add Certification</button>
      </div>

      {/* Certifications grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? <div className="text-center py-12 text-[var(--text-muted)] col-span-3">Loading...</div> : items.map(c => {
          const fmt = certFormats.find(f => c.name.startsWith(f.prefix)) || certFormats[0]
          const match = c.name.match(/^(.+?):\s*(.+?)\s*\((.+?)\)$/)
          return (
            <div key={c.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-4 hover:border-primary-500/30 transition-all group cursor-pointer" onClick={() => openEdit(c)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${fmt.color}15` }}>
                  {fmt.name === 'Microsoft' ? <MicrosoftBadge /> : (
                    <div className="w-5 h-5" style={{ color: fmt.color }}>
                      {fmt.name === 'AWS' && <FaAws size={20} />}
                      {fmt.name === 'Google Cloud' && <SiGooglecloud size={20} />}
                      {fmt.name === 'Cisco' && <SiCisco size={20} />}
                      {fmt.name === 'CompTIA' && <SiComptia size={20} />}
                      {fmt.name === 'Oracle' && <GrOracle size={20} />}
                      {fmt.name === 'Linux Foundation' && <SiLinuxfoundation size={20} />}
                      {fmt.name === 'HashiCorp' && <SiHashicorp size={20} />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: fmt.color }}>{fmt.name}</p>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mt-0.5 line-clamp-2">{match ? match[2] : c.name}</h3>
                  {match && <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{match[3]}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); setDeleting(c); setDeleteOpen(true) }} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-all shrink-0">
                  <MdDelete className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <FormDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title={editing ? 'Edit Certification' : 'Add Certification'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.title} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium">{save.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Live Card Preview */}
          <CertPreview format={form.format} title={form.title} certId={form.certId} />

          {/* Provider selector */}
          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Provider</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {certFormats.map(f => (
                <button key={f.name} type="button" onClick={() => { setForm(fm => ({...fm, format: f.name, title: '', certId: ''})); setShowSuggestions(true) }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${form.format === f.name ? 'border-primary-500 bg-primary-500/10' : 'border-[var(--border)] hover:border-primary-500/30'}`}>
                  <div className="w-6 h-6 flex items-center justify-center" style={{ color: f.color }}>
                    {f.name === 'Microsoft' && <MicrosoftBadge />}
                    {f.name === 'AWS' && <FaAws size={18} />}
                    {f.name === 'Google Cloud' && <SiGooglecloud size={18} />}
                    {f.name === 'Cisco' && <SiCisco size={18} />}
                    {f.name === 'CompTIA' && <SiComptia size={18} />}
                    {f.name === 'Oracle' && <GrOracle size={18} />}
                    {f.name === 'Linux Foundation' && <SiLinuxfoundation size={18} />}
                    {f.name === 'HashiCorp' && <SiHashicorp size={18} />}
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] leading-tight text-center">{f.name}</span>
                </button>
              ))}
            </div></div>

          {/* Certification suggestions */}
          {showSuggestions && selectedFormat.suggestions && (
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Popular from {selectedFormat.name}</label>
              <div className="max-h-40 overflow-y-auto space-y-1 bg-[var(--bg-elevated)] rounded-xl p-2">
                {selectedFormat.suggestions.map((s, i) => {
                  const titleMatch = s.match(/(.+?)\s*\((.+?)\)$/)
                  const title = titleMatch ? titleMatch[1] : s
                  const id = titleMatch ? titleMatch[2] : ''
                  return (
                    <button key={i} type="button"
                      onClick={() => { setForm(f => ({...f, title, certId: id})); setShowSuggestions(false) }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-secondary)]">
                      {title} {id && <span className="text-[var(--text-muted)] font-mono text-xs">({id})</span>}
                    </button>
                  )
                })}
              </div></div>
          )}

          <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Certification Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Azure Fundamentals"
              className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          <div className="grid grid-cols-1 gap-4">
            <div><label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Cert ID</label>
              <input value={form.certId} onChange={e => setForm(f => ({...f, certId: e.target.value}))} placeholder="e.g. AZ-900"
                className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:opacity-50 focus:ring-2 focus:ring-primary-500/30" /></div>
          </div>
        </div>
      </FormDialog>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => deleting && del.mutate(deleting.id)} title="Certification" loading={del.isPending} />
    </div>
  )
}

import { useEffect, useState } from 'react'
import type { ComponentType, CSSProperties } from 'react'
import {
  AIBuilderIcon,
  DataverseIcon,
  PowerAppsIcon,
  PowerAutomateIcon,
  PowerBiIcon,
  PowerPagesIcon,
  PowerPlatformIcon,
  SharePointIcon,
} from './powerPlatformIcons'

export type IconComponent = ComponentType<{
  size?: number | string
  color?: string
  style?: CSSProperties
  className?: string
  title?: string
}>

export interface IconCatalogEntry {
  name: string
  label: string
  color: string
}

/** Icons bundled with the app rather than imported from react-icons. */
export const CUSTOM_ICONS: Record<string, IconComponent> = {
  AIBuilder: AIBuilderIcon,
  Dataverse: DataverseIcon,
  PowerApps: PowerAppsIcon,
  PowerAutomate: PowerAutomateIcon,
  PowerBI: PowerBiIcon,
  PowerPages: PowerPagesIcon,
  PowerPlatform: PowerPlatformIcon,
  SharePoint: SharePointIcon,
}

/**
 * Brand colours for icons that can be picked in the admin.
 *
 * The icon picker uses this to fill in the colour field automatically. Values
 * fall back to a neutral grey for icons that aren't listed, so every selection
 * still gets a sensible colour without the admin having to hunt for one.
 */
export const ICON_COLORS: Record<string, string> = {
  // Bundled Power Platform icons
  AIBuilder: '#2764E7',
  Dataverse: '#22918B',
  PowerApps: '#742774',
  PowerAutomate: '#0FAFFF',
  PowerBI: '#E6AD10',
  PowerPages: '#5B2AB5',
  PowerPlatform: '#1A7F7C',
  SharePoint: '#038387',

  // Languages
  SiPython: '#3776AB',
  FaJava: '#ED8B00',
  SiCplusplus: '#00599C',
  SiCsharp: '#239120',
  SiJavascript: '#F7DF1E',
  SiTypescript: '#3178C6',
  SiGo: '#00ADD8',
  SiRust: '#000000',
  SiRuby: '#CC342D',
  SiPhp: '#777BB4',
  SiSwift: '#F05138',
  SiKotlin: '#7F52FF',
  SiDart: '#0175C2',
  SiScala: '#DC322F',
  SiR: '#276DC3',
  SiPerl: '#39457E',
  SiLua: '#2C2D72',
  SiElixir: '#4B275F',
  SiHaskell: '#5D4F85',
  SiSolidity: '#363636',
  SiHtml5: '#E34F26',
  SiCss: '#1572B6',
  SiSass: '#CC6699',
  SiLess: '#1D365D',

  // Frontend
  SiBootstrap: '#7952B3',
  SiTailwindcss: '#06B6D4',
  SiReact: '#61DAFB',
  SiRedux: '#764ABC',
  SiNodedotjs: '#339933',
  SiExpress: '#000000',
  SiNextdotjs: '#000000',
  SiVuedotjs: '#4FC08D',
  SiAngular: '#DD0031',
  SiSvelte: '#FF3E00',
  SiJquery: '#0769AD',
  SiGulp: '#CF4647',
  SiWebpack: '#8DD6F9',
  SiVite: '#646CFF',

  // Backend / tooling
  SiSpringboot: '#6DB33F',
  SiDjango: '#092E20',
  SiFlask: '#000000',
  SiStreamlit: '#FF4B4B',
  SiFastapi: '#009688',
  SiDocker: '#2496ED',
  SiSocketdotio: '#010101',
  SiApachekafka: '#231F20',
  SiRedis: '#FF4438',
  SiKubernetes: '#326CE5',
  SiNginx: '#009639',
  SiYaml: '#CB171E',
  SiJenkins: '#D24939',
  SiGit: '#F05032',
  SiGithub: '#181717',
  SiGitlab: '#FC6D26',
  SiBitbucket: '#0052CC',
  SiGraphql: '#E10098',
  SiApollographql: '#311C87',
  SiRabbitmq: '#FF6600',
  SiElasticsearch: '#005571',
  SiClickhouse: '#FFCC01',
  SiSnowflake: '#29B5E8',
  SiVercel: '#000000',
  SiNetlify: '#00C7B7',
  SiCloudflare: '#F38020',
  SiTerraform: '#7B42BC',
  SiAnsible: '#EE0000',
  SiGithubactions: '#2088FF',
  SiLinux: '#FCC624',
  SiUbuntu: '#E95420',
  SiWindows: '#0078D4',
  SiApple: '#000000',
  SiAndroid: '#34A853',

  // Data / ML
  SiPytorch: '#EE4C2C',
  SiKeras: '#D00000',
  SiTensorflow: '#FF6F00',
  SiNumpy: '#013243',
  SiPandas: '#150458',
  SiDask: '#FC6E6E',
  SiPolars: '#CD792C',
  SiScikitlearn: '#F7931E',
  SiOpencv: '#5C3EE8',
  SiPlotly: '#3F4F75',
  SiTqdm: '#FFC107',
  SiScipy: '#8CAAE6',
  SiMlflow: '#0194E2',
  SiLangchain: '#1C3C3C',
  SiJupyter: '#F37626',
  SiGooglecolab: '#F9AB00',
  SiRstudio: '#75AADB',
  SiKaggle: '#20BEFF',
  SiHuggingface: '#FFD21E',
  SiOpenai: '#412991',
  SiAnthropic: '#191919',
  SiTableau: '#E97627',
  SiPowerbi: '#F2C811',

  // Databases
  SiPostgresql: '#4169E1',
  SiMysql: '#4479A1',
  SiMongodb: '#47A248',
  SiSqlite: '#003B57',
  SiFirebase: '#FFCA28',
  SiSupabase: '#3FCF8E',
  SiPrisma: '#2D3748',
  SiMicrosoftsqlserver: '#CC2927',
  SiOracle: '#F80000',
  SiSqlalchemy: '#D71F00',

  // Cloud / Microsoft
  SiAmazonaws: '#FF9900',
  FaAws: '#FF9900',
  SiGooglecloud: '#4285F4',
  SiMicrosoftazure: '#0078D4',
  SiMicrosoft: '#5E5E5E',
  SiMicrosoftoffice: '#D83B01',
  SiSharepoint: '#038387',
  SiMicrosoftteams: '#6264A7',
  SiDynamics365: '#002050',

  // Design / productivity / social
  SiFigma: '#F24E1E',
  SiCanva: '#00C4CC',
  SiNotion: '#000000',
  SiSlack: '#4A154B',
  SiJira: '#0052CC',
  SiConfluence: '#172B4D',
  SiTrello: '#0052CC',
  SiDiscord: '#5865F2',
  SiTelegram: '#26A5E4',
  SiWhatsapp: '#25D366',
  SiX: '#000000',
  SiLinkedin: '#0A66C2',
  SiInstagram: '#E4405F',
  SiFacebook: '#1877F2',
  SiYoutube: '#FF0000',
  SiGmail: '#EA4335',
  SiGoogle: '#4285F4',
  DiYeoman: '#563E81',
}

/** A short list shown before the admin types anything. */
export const POPULAR_ICONS: IconCatalogEntry[] = [
  // Power Platform
  { name: 'PowerPlatform', label: 'Power Platform', color: '#1A7F7C' },
  { name: 'PowerApps', label: 'Power Apps', color: '#742774' },
  { name: 'PowerAutomate', label: 'Power Automate', color: '#0FAFFF' },
  { name: 'PowerPages', label: 'Power Pages', color: '#5B2AB5' },
  { name: 'PowerBI', label: 'Power BI', color: '#E6AD10' },
  { name: 'Dataverse', label: 'Dataverse', color: '#22918B' },
  { name: 'AIBuilder', label: 'AI Builder', color: '#2764E7' },
  { name: 'SharePoint', label: 'SharePoint', color: '#038387' },
  // Languages
  { name: 'SiPython', label: 'Python', color: '#3776AB' },
  { name: 'FaJava', label: 'Java', color: '#ED8B00' },
  { name: 'SiCplusplus', label: 'C++', color: '#00599C' },
  { name: 'SiJavascript', label: 'JavaScript', color: '#F7DF1E' },
  { name: 'SiTypescript', label: 'TypeScript', color: '#3178C6' },
  // Frontend / backend
  { name: 'SiReact', label: 'React', color: '#61DAFB' },
  { name: 'SiNodedotjs', label: 'Node.js', color: '#339933' },
  { name: 'SiNextdotjs', label: 'Next.js', color: '#000000' },
  { name: 'SiExpress', label: 'Express.js', color: '#000000' },
  { name: 'SiTailwindcss', label: 'TailwindCSS', color: '#06B6D4' },
  { name: 'SiDjango', label: 'Django', color: '#092E20' },
  { name: 'SiFlask', label: 'Flask', color: '#000000' },
  { name: 'SiFastapi', label: 'FastAPI', color: '#009688' },
  { name: 'SiSpringboot', label: 'Spring Boot', color: '#6DB33F' },
  { name: 'SiRedux', label: 'Redux', color: '#764ABC' },
  { name: 'SiHtml5', label: 'HTML5', color: '#E34F26' },
  { name: 'SiCss', label: 'CSS', color: '#1572B6' },
  // Data / ML
  { name: 'SiTensorflow', label: 'TensorFlow', color: '#FF6F00' },
  { name: 'SiPytorch', label: 'PyTorch', color: '#EE4C2C' },
  { name: 'SiKeras', label: 'Keras', color: '#D00000' },
  { name: 'SiOpencv', label: 'OpenCV', color: '#5C3EE8' },
  { name: 'SiScikitlearn', label: 'Scikit-learn', color: '#F7931E' },
  { name: 'SiNumpy', label: 'NumPy', color: '#013243' },
  { name: 'SiPandas', label: 'Pandas', color: '#150458' },
  { name: 'SiPlotly', label: 'Plotly', color: '#3F4F75' },
  { name: 'SiLangchain', label: 'LangChain', color: '#1C3C3C' },
  { name: 'SiMlflow', label: 'MLflow', color: '#0194E2' },
  // Databases / infrastructure
  { name: 'SiPostgresql', label: 'PostgreSQL', color: '#4169E1' },
  { name: 'SiMongodb', label: 'MongoDB', color: '#47A248' },
  { name: 'SiMysql', label: 'MySQL', color: '#4479A1' },
  { name: 'SiRedis', label: 'Redis', color: '#FF4438' },
  { name: 'SiFirebase', label: 'Firebase', color: '#FFCA28' },
  { name: 'SiDocker', label: 'Docker', color: '#2496ED' },
  { name: 'SiKubernetes', label: 'Kubernetes', color: '#326CE5' },
  { name: 'SiGit', label: 'Git', color: '#F05032' },
  { name: 'SiGithub', label: 'GitHub', color: '#181717' },
  { name: 'SiJenkins', label: 'Jenkins', color: '#D24939' },
  { name: 'SiNginx', label: 'nginx', color: '#009639' },
  { name: 'SiSocketdotio', label: 'Socket.io', color: '#010101' },
  { name: 'DiYeoman', label: 'Yeoman', color: '#563E81' },
]

const FALLBACK_ICON_COLOR = '#6B7280'

export function getIconColor(name?: string | null): string | undefined {
  if (!name) return undefined
  return ICON_COLORS[name] ?? POPULAR_ICONS.find(icon => icon.name === name)?.color
}

export function getIconFallbackColor(name?: string | null): string {
  return getIconColor(name) ?? FALLBACK_ICON_COLOR
}

let reactIconCache: Record<string, IconComponent> | null = null
let reactIconPromise: Promise<Record<string, IconComponent>> | null = null

function loadReactIcons(): Promise<Record<string, IconComponent>> {
  if (!reactIconPromise) {
    reactIconPromise = Promise.all([
      import('react-icons/si'),
      import('react-icons/fa'),
      import('react-icons/di'),
    ]).then(([si, fa, di]) => {
      const modules = [si, fa, di] as unknown as Array<Record<string, unknown>>
      const merged: Record<string, IconComponent> = {}
      for (const mod of modules) {
        const icons = (mod.default as Record<string, IconComponent> | undefined) ?? (mod as Record<string, IconComponent>)
        Object.assign(merged, icons)
      }
      reactIconCache = merged
      return merged
    })
  }
  return reactIconPromise
}

/**
 * Loads react-icons once and exposes them together with the bundled icons.
 * `loaded` stays false until react-icons has been resolved, matching the
 * previous behaviour of the skills sections.
 */
export function useIconLibrary() {
  const [icons, setIcons] = useState<Record<string, IconComponent>>(() => ({
    ...CUSTOM_ICONS,
    ...(reactIconCache ?? {}),
  }))
  const [loaded, setLoaded] = useState(Boolean(reactIconCache))

  useEffect(() => {
    if (reactIconCache) {
      setIcons({ ...CUSTOM_ICONS, ...reactIconCache })
      setLoaded(true)
      return
    }

    let cancelled = false
    loadReactIcons()
      .then(reactIcons => {
        if (cancelled) return
        setIcons({ ...CUSTOM_ICONS, ...reactIcons })
        setLoaded(true)
      })
      .catch(error => {
        console.error('Failed to load icons:', error)
      })

    return () => { cancelled = true }
  }, [])

  return { icons, loaded }
}

export function isCustomIcon(name?: string | null): boolean {
  return Boolean(name && CUSTOM_ICONS[name])
}

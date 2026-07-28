import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import './AnimatedStepper.css'

interface StepperItem {
  id: string
  period: string
  role: string
  company: string
  location?: string | null
  logo?: string | null
  points: string[]
  slug: string
}

export default function AnimatedStepper({
  items,
  onItemClick,
}: {
  items: StepperItem[]
  onItemClick: (slug: string) => void
}) {
  return (
    <VerticalTimeline lineColor="var(--border)">
      {items.map((item) => (
        <VerticalTimelineElement
          key={item.id}
          className="vertical-timeline-element--work cursor-pointer"
          date={item.period}
          dateClassName="!text-primary-400 !font-mono !text-xs !opacity-100"
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            boxShadow: 'none',
            padding: '24px',
          }}
          contentArrowStyle={{
            borderRight: '7px solid var(--bg-card)',
          }}
          iconStyle={{
            background: 'var(--bg-card)',
            border: '3px solid #6366f1',
            boxShadow: '0 0 0 4px var(--bg-primary)',
          }}
          icon={
            item.logo ? (
              <img
                src={item.logo}
                alt={item.company}
                className="w-full h-full object-contain rounded-full p-1"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-xs font-bold text-primary-500">
                {item.company.charAt(0)}
              </span>
            )
          }
          onTimelineElementClick={() => onItemClick(item.slug)}
        >
          <div>
            <h3 className="text-xl font-display font-bold text-[var(--text-primary)] mt-0.5">{item.role}</h3>
            <p className="text-accent-400 font-medium text-sm">{item.company}</p>
            {item.location && <p className="text-[var(--text-muted)] text-xs">{item.location}</p>}
          </div>
          <ul className="space-y-2 mt-4 hidden md:block">
            {item.points.map((point, i) => (
              <li key={i} className="text-[var(--text-muted)] text-sm leading-relaxed flex gap-2">
                <span className="text-primary-500 mt-1 shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  )
}

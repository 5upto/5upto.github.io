interface LegacyProps {
  onBack: () => void
  onSelect: (logo: string) => void
}

const items = [
  { file: 'w26.jpeg', num: '26', aspect: '513/531' },
  { file: 'w22.jpeg', num: '22', aspect: '222/230' },
  { file: '21.jpeg', num: '21', aspect: '229/237' },
  { file: '19.jpeg', num: '19', aspect: '235/235' },
  { file: 'w18.jpeg', num: '18', aspect: '240/240' },
]

export default function Legacy({ onBack, onSelect }: LegacyProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative z-10 px-4">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 z-20"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Back</span>
      </button>
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 gradient-text">Legacy Numbers</h2>
      <div className="flex flex-nowrap items-center justify-center gap-2 md:gap-12 max-w-full px-2 md:px-4">
        {items.map((item) => (
          <button key={item.num} onClick={() => onSelect(item.file)} className="flex flex-col items-center gap-1 md:gap-4 group">
            <div className="w-14 md:w-44 overflow-hidden rounded-lg md:rounded-2xl ring-2 ring-transparent hover:ring-primary-400 transition-all" style={{ aspectRatio: item.aspect }}>
              <img src={`/images/logos/${item.file}`} alt={item.num} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] md:text-xl text-white font-bold group-hover:text-primary-400 transition-colors">{item.num}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

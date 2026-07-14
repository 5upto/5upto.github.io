import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const galleryStories = [
  {
    slug: 'mountain-escape',
    title: 'Mountain Escape',
    image: 'https://picsum.photos/seed/mountain/1200/800',
    period: 'Summer 2024',
    story: `There's something about standing at the edge of a mountain trail that makes the world feel both vast and intimate. The air is thinner up here, sharper, carrying the scent of pine and wet stone. Every breath feels deliberate, every step a small act of trust between you and the earth beneath your boots.

The trail wound upward through a corridor of ancient conifers, their trunks scarred by decades of wind and ice. Sunlight filtered through the canopy in shifting patterns, painting the forest floor in gold and shadow. Somewhere ahead, a creek murmured over smooth rocks — a sound so constant it became silence.

At the summit, the valley unfolded like a map drawn by hand. Rivers carved silver lines through patches of emerald and amber. The horizon was a soft blur where sky met distant peaks, each one a slightly different shade of blue. I sat on a flat stone, removed my pack, and simply existed in that space for a while.

No signal. No notifications. Just the sound of wind moving through grass and the quiet satisfaction of having climbed. These are the moments that recalibrate something inside you — a reminder that the world is far larger than the screens we stare at, and far more beautiful than we often allow ourselves to notice.`,
    tags: ['Nature', 'Travel', 'Photography'],
  },
  {
    slug: 'urban-nights',
    title: 'Urban Nights',
    image: 'https://picsum.photos/seed/urban/1200/800',
    period: 'Winter 2024',
    story: `The city transforms after dark. Neon signs flicker to life, casting red and blue reflections across wet pavement. Taxis blur past in streaks of yellow. The sidewalks fill with people — couples holding hands, friends laughing over loud music spilling from open doorways, solo walkers with earbuds in, lost in their own soundtracks.

I walked without a destination, letting the grid of streets guide me. A jazz club on the corner spilled warm saxophone notes into the cold air. A ramen shop glowed from behind fogged windows, steam rising from bowls carried by servers who moved with practiced efficiency. Street performers set up near the bridge — a guitarist tuning strings, a dancer stretching in the amber light of a streetlamp.

There's a rhythm to city nights that daytime doesn't have. The urgency fades. People linger longer, talk louder, laugh more freely. Strangers make eye contact and nod. The anonymity of the crowd becomes a kind of permission — to wander, to observe, to be present without purpose.

I ended up at a rooftop bar I'd never been to before, looking down at the intersection below. Cars moved in patterns, pedestrians crossed in waves, and the whole scene felt like a living organism, breathing and shifting with each passing hour. The city doesn't sleep. It just changes shifts.`,
    tags: ['City', 'Nightlife', 'Street'],
  },
  {
    slug: 'ocean-breeze',
    title: 'Ocean Breeze',
    image: 'https://picsum.photos/seed/ocean/1200/800',
    period: 'Spring 2024',
    story: `The ocean has a way of making you feel small in the best possible way. Standing at the shoreline, waves curling and collapsing at your feet, the horizon stretches so far it curves. The sound is constant — a rhythmic roar that drowns out thought and replaces it with something simpler.

I arrived at dawn, when the beach was still empty. The sand was cool and firm, packed tight by the overnight tide. Footprints from yesterday's visitors had been erased, the shore reset to a blank canvas. Seagulls patrolled the waterline, dipping and rising with the wind.

The water was cold at first — the kind of cold that makes you gasp and then immediately adjust. I waded in up to my waist, letting the current push me gently side to side. Floating on my back, I watched the sky shift from deep indigo to pale gold as the sun cleared the horizon. Clouds caught fire for a few minutes, then softened into white.

Later, I sat on a driftwood log and watched a family build a sandcastle. The kids worked with serious concentration, directing their father to fetch water in a bucket. The castle grew — towers, a moat, a flag made from a stick and a leaf. When a wave finally breached the moat, the kids cheered instead of crying. The destruction was part of the fun.

That's the lesson the ocean teaches, over and over: nothing is permanent, and that's exactly what makes it beautiful.`,
    tags: ['Sea', 'Calm', 'Nature'],
  },
  {
    slug: 'forest-trail',
    title: 'Forest Trail',
    image: 'https://picsum.photos/seed/forest/1200/800',
    period: 'Autumn 2024',
    story: `The trailhead was marked by a wooden post, its paint long faded, the arrow pointing into a tunnel of green. I stepped off the paved path and into the forest, and the temperature dropped five degrees. The canopy overhead was so thick it turned midday into dusk.

Moss covered everything — rocks, fallen logs, the roots of trees that had been standing for centuries. Ferns unfurled from the undergrowth in perfect spirals. A woodpecker hammered somewhere out of sight, its rhythm steady and mechanical. Between the trees, shafts of light cut through the mist like spotlights on an empty stage.

The path was soft with years of decomposed leaves, each step quiet and cushioned. I passed a stream so clear I could count the pebbles on its bed. A frog sat on a rock, perfectly still, watching me with an expression that seemed both ancient and indifferent. I moved on.

Deeper in, the forest grew older. The trees were wider, their bark deeply furrowed. One had fallen across the trail, its root ball exposed like a wall of earth and stone. I climbed over it, running my hand along the moss that carpeted its trunk. Fungi grew in shelves along its side — pale, almost luminous in the dim light.

I emerged hours later at an overlook I hadn't expected. The valley below was a patchwork of green, divided by a river that caught the sunlight and threw it back in flashes. I sat on the edge, legs dangling, and ate an apple I'd packed. It was the best apple I'd ever tasted. Sometimes context is everything.`,
    tags: ['Woods', 'Hiking', 'Peace'],
  },
  {
    slug: 'desert-dunes',
    title: 'Desert Dunes',
    image: 'https://picsum.photos/seed/desert/1200/800',
    period: 'Late Summer 2024',
    story: `The desert is not empty. That's the first thing you learn. It's full of life — just life that has learned to wait, to conserve, to bloom only when the conditions are exactly right.

I arrived at the dunes in the late afternoon, when the sun was low enough to paint the sand in shades of amber and rose. The wind had sculpted the surface into ripples, each one a miniature landscape of peaks and valleys. My footsteps were the only disruption in a pattern that stretched to the horizon.

Walking on sand is exhausting. Each step sinks, slides, demands more effort than flat ground. I learned to follow the ridgelines where the sand was compacted, moving along the spine of each dune like a tightrope walker. From up high, the desert revealed its hidden geography — dry riverbeds, clusters of scrub brush, the dark shapes of rocks peeking through the sand.

At sunset, the colors deepened. The sky turned from gold to burnt orange to a purple so dark it was almost black. Stars appeared one by one, then in clusters, then in such numbers that the sky felt heavy with them. I lay on the sand, which still held the day's warmth, and looked up.

The Milky Way was visible — a smear of light across the darkness, thicker and brighter than I'd ever seen it. A shooting star crossed the sky in a silent arc. I made a wish, then laughed at myself for doing it. But the desert has that effect. It strips away cynicism and replaces it with wonder. You feel small, and you're grateful for it.`,
    tags: ['Arid', 'Stars', 'Adventure'],
  },
]

export default function GalleryStory() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const story = galleryStories.find((s) => s.slug === slug)

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4">Story Not Found</h1>
          <button
            onClick={() => navigate('/gallery')}
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    )
  }

  const paragraphs = story.story.split('\n\n')

  return (
    <div className="min-h-screen relative z-10 bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/gallery')}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <header className="mb-12">
          <div className="mb-6">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-48 md:h-64 object-cover rounded-2xl"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-2">
            {story.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-400 font-mono">{story.period}</span>
          </div>
        </header>

        <article className="mb-12">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-[var(--text-secondary)] text-base leading-relaxed mb-6"
            >
              {paragraph}
            </p>
          ))}
        </article>

        <footer>
          <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                {t}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

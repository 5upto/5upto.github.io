import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

const icons = {
  experience: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  projects: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  skills: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  blog: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  profile: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  education: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  certification: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  publication: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  social: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  gallery: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  nav: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>,
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const [experiences, projects, skills, blogs, gallery, education, certifications, publications, socialLinks, navItems] = await Promise.all([
        supabase.from('experiences').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_stories').select('id', { count: 'exact', head: true }),
        supabase.from('education').select('id', { count: 'exact', head: true }),
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('publications').select('id', { count: 'exact', head: true }),
        supabase.from('social_links').select('id', { count: 'exact', head: true }),
        supabase.from('nav_items').select('id', { count: 'exact', head: true }),
      ])
      return {
        experiences: experiences.count ?? 0,
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        blogs: blogs.count ?? 0,
        gallery: gallery.count ?? 0,
        education: education.count ?? 0,
        certifications: certifications.count ?? 0,
        publications: publications.count ?? 0,
        socialLinks: socialLinks.count ?? 0,
        navItems: navItems.count ?? 0,
      }
    },
  })

  const quickActions = [
    { label: 'Profile', href: '/admin/profile', icon: icons.profile, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Experiences', href: '/admin/experiences', icon: icons.experience, color: 'bg-green-500/10 text-green-400' },
    { label: 'Projects', href: '/admin/projects', icon: icons.projects, color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Skills', href: '/admin/skills', icon: icons.skills, color: 'bg-yellow-500/10 text-yellow-400' },
    { label: 'Blogs', href: '/admin/blogs', icon: icons.blog, color: 'bg-orange-500/10 text-orange-400' },
    { label: 'Gallery', href: '/admin/gallery', icon: icons.gallery, color: 'bg-pink-500/10 text-pink-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-display font-bold text-[var(--text-primary)]">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'Experiences', value: stats?.experiences ?? 0, gradient: 'from-blue-500 to-blue-600', icon: icons.experience },
          { label: 'Projects', value: stats?.projects ?? 0, gradient: 'from-green-500 to-green-600', icon: icons.projects },
          { label: 'Skills', value: stats?.skills ?? 0, gradient: 'from-purple-500 to-purple-600', icon: icons.skills },
          { label: 'Blog Posts', value: stats?.blogs ?? 0, gradient: 'from-orange-500 to-orange-600', icon: icons.blog },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-4 lg:p-5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-[3rem]`} />
            <span className="text-primary-400">{stat.icon}</span>
            <p className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-primary)] mt-2">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {quickActions.map((action) => (
            <button key={action.href} onClick={() => navigate(action.href)}
              className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-3 lg:p-4 text-center hover:border-primary-500/50 hover:shadow-lg transition-all group">
              <div className={`w-10 h-10 mx-auto rounded-xl ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-xs lg:text-sm text-[var(--text-secondary)] font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* About Highlights */}
      <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">About Highlights</h2>
          <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Auto-synced</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Experience', value: `${stats?.experiences ?? 0}+` },
            { label: 'Projects', value: `${stats?.projects ?? 0}+` },
            { label: 'Publications', value: String(stats?.publications ?? 0) },
            { label: 'Certifications', value: String(stats?.certifications ?? 0) },
          ].map((h) => (
            <div key={h.label} className="bg-[var(--glass-bg)] backdrop-blur-sm rounded-lg p-3 text-center border border-white/5">
              <p className="text-xl font-display font-bold gradient-text">{h.value}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">{h.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Overview */}
      <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Content Overview</h2>
        <div className="space-y-3">
          {[
            { label: 'Education', count: stats?.education ?? 0, href: '/admin/education', max: 5, icon: icons.education },
            { label: 'Certifications', count: stats?.certifications ?? 0, href: '/admin/education', max: 10, icon: icons.certification },
            { label: 'Publications', count: stats?.publications ?? 0, href: '/admin/education', max: 5, icon: icons.publication },
            { label: 'Social Links', count: stats?.socialLinks ?? 0, href: '/admin/social-links', max: 10, icon: icons.social },
            { label: 'Gallery Stories', count: stats?.gallery ?? 0, href: '/admin/gallery', max: 10, icon: icons.gallery },
            { label: 'Nav Items', count: stats?.navItems ?? 0, href: '/admin/nav-items', max: 10, icon: icons.nav },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--glass-hover)] transition-colors">
              <span className="text-[var(--text-muted)]">{item.icon}</span>
              <span className="flex-1 text-left text-sm text-[var(--text-secondary)]">{item.label}</span>
              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${Math.min(100, (item.count / item.max) * 100)}%` }} />
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)] w-6 text-right">{item.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

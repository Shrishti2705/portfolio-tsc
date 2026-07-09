'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  X,
  ExternalLink,
  CheckCircle,
  Users,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Media, Portfolio } from '@/payload-types'
import RichText from '@/components/RichText'
import { TSC_PROJECT_DATA } from './tscProjectData'

const getLiveDataForSlug = (slug?: string | null) => {
  if (!slug) return null
  const slugLower = slug.toLowerCase().trim()
  
  // Try exact match first (case-insensitive)
  for (const [key, value] of Object.entries(TSC_PROJECT_DATA)) {
    if (key.toLowerCase().trim() === slugLower) {
      return value
    }
  }

  // Try substring fallback matches (case-insensitive)
  for (const [key, value] of Object.entries(TSC_PROJECT_DATA)) {
    const keyLower = key.toLowerCase().trim()
    if (slugLower.includes(keyLower) || keyLower.includes(slugLower)) {
      return value
    }
  }
  return null
}

// Full (unbitten) Apple logo
const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 814 1000" fill="currentColor" {...props}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49.1 190.5-49.1zM642 110.2c32.1-38.2 54.3-91.2 54.3-144.2 0-7.7-.6-15.4-1.9-22.5-51.6 1.9-112.8 34.5-149.1 78-28.2 32.7-54.9 85.8-54.9 139.5 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.5 1.3 46.4 0 103.1-30.8 136.2-71.3z"/>
  </svg>
)

const AndroidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 140 140" fill="currentColor" {...props}>
    <path d="M19.6596 45.4463C14.8372 45.4463 11 49.2835 11 54.1059V90.1767C11 94.9991 14.8372 98.8364 19.6596 98.8364C24.482 98.8364 28.3193 94.9991 28.3193 90.1767V54.1059C28.3193 49.2835 24.482 45.4463 19.6596 45.4463ZM120.658 45.4463C115.836 45.4463 111.998 49.2835 111.998 54.1059V90.1767C111.998 94.9991 115.836 98.8364 120.658 98.8364C125.48 98.8364 129.318 94.9991 129.318 90.1767V54.1059C129.318 49.2835 125.48 45.4463 120.658 45.4463Z" />
    <path d="M55.7302 86.6104C50.9078 86.6104 47.0706 90.4476 47.0706 95.27V131.341C47.0706 136.163 50.9078 140 55.7302 140C60.5526 140 64.3898 136.163 64.3898 131.341V95.27C64.3898 90.4476 60.5526 86.6104 55.7302 86.6104ZM84.5869 86.6104C79.7645 86.6104 75.9272 90.4476 75.9272 95.27V131.341C75.9272 136.163 79.7645 140 84.5869 140C89.4093 140 93.2465 136.163 93.2465 131.341V95.27C93.2465 90.4476 89.4093 86.6104 84.5869 86.6104Z" />
    <path d="M46.182 6.01106e-05C45.9773 0.00215359 45.7866 0.0549677 45.5985 0.159194C44.981 0.501482 44.778 1.21106 45.1211 1.83013L51.2213 12.8503C39.4848 18.9571 31.5574 30.5626 31.5415 43.8818H108.775C108.76 30.5626 100.832 18.9571 89.0957 12.8503L95.1959 1.83013C95.539 1.21106 95.336 0.501482 94.7185 0.159194C94.5304 0.0549677 94.3397 0.00201123 94.135 6.01106e-05C93.6967 -0.00416872 93.2814 0.214793 93.0475 0.636604L86.8678 11.7761C81.8125 9.53375 76.1422 8.27513 70.1585 8.27513C64.1748 8.27513 58.5045 9.53375 53.4492 11.7761L47.2694 0.636604C47.0356 0.214793 46.6202 -0.00414359 46.182 6.01106e-05ZM31.5415 46.9319V102.908C31.5415 108.08 35.7053 112.244 40.8775 112.244H99.4395C104.612 112.244 108.775 108.08 108.775 102.908V46.9319H31.5415Z" />
    <path d="M52.3351 23.3008C50.5719 23.3008 49.1125 24.7602 49.1125 26.5233C49.1125 28.2864 50.5719 29.7458 52.3351 29.7458C54.0982 29.7458 55.5576 28.2864 55.5576 26.5233C55.5576 24.7602 54.0982 23.3008 52.3351 23.3008ZM87.9815 23.3008C86.2184 23.3008 84.759 24.7602 84.759 26.5233C84.759 28.2864 86.2184 29.7458 87.9815 29.7458C89.7446 29.7458 91.204 28.2864 91.204 26.5233C91.204 24.7602 89.7446 23.3008 87.9815 23.3008Z" />
  </svg>
)

// ─── Utility ─────────────────────────────────────────────────────────────────
const getYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : url
}

const isYouTube = (url: string) =>
  url.includes('youtu.be') || url.includes('youtube.com')

// ─── Block type ───────────────────────────────────────────────────────────────
export interface PortfolioDetailBlock {
  blockType: 'portfolioDetail'
  project: string | Portfolio
}

// ─── Thumbnail Strip Item ─────────────────────────────────────────────────────
interface ThumbItem {
  type: 'image' | 'video'
  url?: string
  alt?: string
  caption?: string
  videoId?: string | null
  localVideoUrl?: string | null
}

interface MergedPortfolio extends Omit<Portfolio, 'screenshots' | 'videoThumbnail' | 'shortVideo' | 'techStack' | 'customTechStack'> {
  shortVideo?: (number | null) | Media | { url?: string | null; mimeType?: string | null } | null
  videoThumbnail?: (number | null) | Media | { url?: string | null } | null
  screenshots?:
    | {
        image: number | Media | { url?: string | null; alt?: string | null }
        caption?: string | null
        id?: string | null
      }[]
    | null
  techStack?: Portfolio['techStack'] | null
  customTechStack?: Portfolio['customTechStack'] | null
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const PortfolioDetailComponent: React.FC<{
  portfolio: Portfolio
  relatedPortfolios?: Portfolio[] | null
}> = ({ portfolio }) => {
  const liveData = getLiveDataForSlug(portfolio.slug)
  
  const mergedPortfolio = useMemo<MergedPortfolio>(() => {
    if (!liveData) return portfolio
    
    // Format screenshots as Media objects
    const mappedScreenshots = liveData.screenshots
      ? liveData.screenshots.map((s: any) => ({
          image: {
            url: s.url,
            alt: s.caption || '',
          },
          caption: s.caption || undefined,
        }))
      : portfolio.screenshots

    // Format videoThumbnail as Media object
    const mappedVideoThumbnail = liveData.videoThumbnail
      ? { url: liveData.videoThumbnail }
      : portfolio.videoThumbnail

    // Format shortVideo as Media object
    const mappedShortVideo = liveData.shortVideo
      ? { url: liveData.shortVideo.url, mimeType: liveData.shortVideo.mimeType }
      : portfolio.shortVideo

    return {
      ...portfolio,
      youtubeVideoUrl: liveData.youtubeVideoUrl || portfolio.youtubeVideoUrl,
      shortVideo: mappedShortVideo,
      videoThumbnail: mappedVideoThumbnail,
      screenshots: mappedScreenshots,
      techStack: (liveData.techStack && liveData.techStack.length > 0) ? liveData.techStack : portfolio.techStack,
      customTechStack: (liveData.customTechStack && liveData.customTechStack.length > 0) ? liveData.customTechStack : portfolio.customTechStack,
      liveProjectUrl: liveData.liveProjectUrl || portfolio.liveProjectUrl,
      androidProjectUrl: liveData.androidProjectUrl || portfolio.androidProjectUrl,
      iosProjectUrl: liveData.iosProjectUrl || portfolio.iosProjectUrl,
    }
  }, [portfolio, liveData])

  const {
    title,
    shortDescription,
    fullDescription,
    youtubeVideoUrl,
    shortVideo,
    screenshots,
    domain,
    customDomain,
    keyFeatures,
    challenges,
    solutions,
    results,
    clientName,
    projectDuration,
    teamSize,
    techStack,
    customTechStack,
    liveProjectUrl,
    androidProjectUrl,
    iosProjectUrl,
    videoThumbnail,
  } = mergedPortfolio

  // ── Derive thumbnails ─────────────────────────────────────────────────────
  const hasVideo = !!youtubeVideoUrl || !!shortVideo
  const videoId = youtubeVideoUrl && isYouTube(youtubeVideoUrl) ? getYouTubeId(youtubeVideoUrl) : null
  const localVideoUrl = shortVideo && typeof shortVideo === 'object' ? (shortVideo as Media).url : null

  const thumbItems = useMemo<ThumbItem[]>(() => {
    const items: ThumbItem[] = []

    // If video exists, add it as the first item
    if (hasVideo && (videoId || localVideoUrl)) {
      const videoThumbUrl = videoThumbnail
        ? (videoThumbnail as Media).url
        : videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : (screenshots?.[0]?.image as Media)?.url
      
      items.push({
        type: 'video',
        url: videoThumbUrl || undefined,
        alt: 'Demo Video',
        videoId: videoId,
        localVideoUrl: localVideoUrl,
      })
    }

    // Add screenshots
    if (screenshots && screenshots.length > 0) {
      screenshots.forEach((s) => {
        const m = s.image as Media
        if (m?.url) {
          items.push({
            type: 'image',
            url: m.url,
            alt: m.alt || s.caption || '',
            caption: s.caption || undefined,
          })
        }
      })
    }

    // Fallback to coverMedia if list is still empty
    if (items.length === 0) {
      const coverMedia = (videoThumbnail || screenshots?.[0]?.image) as Media
      if (coverMedia?.url) {
        items.push({
          type: 'image',
          url: coverMedia.url,
          alt: coverMedia.alt || title || '',
        })
      }
    }

    return items
  }, [hasVideo, videoId, localVideoUrl, screenshots, videoThumbnail, title])

  const [activeThumbIdx, setActiveThumbIdx] = useState(0)
  const [videoOpen, setVideoOpen] = useState(false)
  const [autoplayVideo, setAutoplayVideo] = useState(false)
  const [backUrl, setBackUrl] = useState('/portfolio')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_from_detail', 'true')

      // Prefer document.referrer — it always reflects the actual page the user came from.
      // This avoids stale sessionStorage values from previous visits.
      const referrer = document.referrer
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer)
          // Only use same-origin referrers
          if (referrerUrl.origin === window.location.origin) {
            const referrerPath = referrerUrl.pathname
            // Append #portfolio so the page scrolls to the portfolio/latest-works section
            const targetUrl = referrerPath.includes('#')
              ? referrerPath
              : `${referrerPath}#portfolio`
            setBackUrl(targetUrl)
            // Keep sessionStorage in sync for any other consumers
            sessionStorage.setItem('portfolio_back_url', referrerPath)
            return
          }
        } catch {
          // Invalid referrer URL — fall through to sessionStorage
        }
      }

      // Fallback: use the value saved in sessionStorage when the card was clicked
      const savedBackUrl = sessionStorage.getItem('portfolio_back_url')
      if (savedBackUrl) {
        const targetUrl = savedBackUrl.includes('#') ? savedBackUrl : `${savedBackUrl}#portfolio`
        setBackUrl(targetUrl)
      }
    }
  }, [])

  const currentThumb = thumbItems[activeThumbIdx]
  const categories = (() => {
    const domains = Array.isArray(domain) ? domain : domain ? [domain] : []
    return domains.map((d) => (d === 'Other' && customDomain ? customDomain : d)).filter(Boolean)
  })()

  const handlePlayClick = useCallback(() => {
    const videoIdx = thumbItems.findIndex((item) => item.type === 'video')
    if (videoIdx !== -1) {
      setActiveThumbIdx(videoIdx)
      setAutoplayVideo(true)
      const playerEl = document.getElementById('project-media-player')
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else if (youtubeVideoUrl) {
      window.open(youtubeVideoUrl, '_blank', 'noopener,noreferrer')
    } else if (localVideoUrl) {
      setAutoplayVideo(true)
    }
  }, [thumbItems, youtubeVideoUrl, localVideoUrl])

  const handleCloseVideo = useCallback(() => setVideoOpen(false), [])

  // ── Tech stack names ─────────────────────────────────────────────────────
  const techNames = [
    ...(techStack || []).filter((t) => t !== 'Other'),
    ...(customTechStack || []).map((t) => t.tech).filter(Boolean),
  ]

  return (
    <>
      {/* ── Page wrapper ── */}
      <div className="relative min-h-screen text-foreground">
        {/* Background Color Layer */}
        <div className="absolute -top-[200px] left-0 right-0 bottom-0 -z-20 bg-background" />

        {/* Background Pattern */}
        <div className="absolute -top-[200px] left-0 right-0 h-[calc(100dvh+200px)] -z-10 opacity-80 dark:opacity-40 pointer-events-none">
          <Image
            src="/images/Pattern.png"
            alt="Background pattern"
            title="Background pattern"
            role="presentation"
            fill
            priority
            className="object-cover object-center dark:hidden"
            sizes="100vw"
          />
          <Image
            src="/images/DarkPattern.png"
            alt="Dark background pattern"
            title="Dark background pattern"
            role="presentation"
            fill
            priority
            className="object-cover object-center hidden dark:block"
            sizes="100vw"
          />
        </div>


        {/* ── Main content grid ── */}
        <main className="max-w-[1200px] mx-auto px-6 py-10 pb-20 space-y-12">
          {/* Back Link */}
          <div className="flex justify-start">
            <Link
              href={backUrl}
              className="group inline-flex items-center gap-2.5 text-base md:text-lg font-bold text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 h-6 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Portfolio
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-16 items-start">

            {/* ══════════════════════════════════════════
                LEFT — Media showcase (60%)
            ══════════════════════════════════════════ */}
            <motion.section
              className="w-full md:w-[60%] flex flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
            {/* Hero media / video player */}
            <div
              id="project-media-player"
              className="relative group rounded-xl overflow-hidden aspect-video bg-white dark:bg-[rgba(28,27,27,0.4)] backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
            >
              {currentThumb?.type === 'video' && (currentThumb.videoId || currentThumb.localVideoUrl) ? (
                currentThumb.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${currentThumb.videoId}?rel=0${autoplayVideo ? '&autoplay=1' : ''}`}
                    title="Project Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 absolute inset-0"
                  />
                ) : (
                  <video
                    src={currentThumb.localVideoUrl!}
                    controls
                    autoPlay={autoplayVideo}
                    className="w-full h-full object-contain absolute inset-0"
                  />
                )
              ) : currentThumb?.url ? (
                <Image
                  src={currentThumb.url}
                  alt={currentThumb.alt || ''}
                  fill
                  className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10" />
              )}

              {/* Slider Arrows */}
              {thumbItems.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveThumbIdx((prev) => {
                        const newIdx = prev === 0 ? thumbItems.length - 1 : prev - 1
                        setAutoplayVideo(false)
                        return newIdx
                      })
                    }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 shadow-lg z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveThumbIdx((prev) => {
                        const newIdx = prev === thumbItems.length - 1 ? 0 : prev + 1
                        setAutoplayVideo(false)
                        return newIdx
                      })
                    }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 shadow-lg z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {thumbItems.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {thumbItems.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveThumbIdx(idx)
                      setAutoplayVideo(thumb.type === 'video')
                    }}
                    className={`min-w-[140px] aspect-video rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      activeThumbIdx === idx
                        ? 'border-2 border-primary shadow-[0_0_12px_rgba(192,193,255,0.4)]'
                        : 'border border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/30 opacity-70 hover:opacity-100'
                    } bg-white dark:bg-[rgba(28,27,27,0.4)] backdrop-blur-md`}
                    aria-label={`Screenshot ${idx + 1}`}
                  >
                    <div className="relative w-full h-full">
                      {thumb.url ? (
                        <Image
                          src={thumb.url}
                          alt={thumb.alt || ''}
                          fill
                          className="object-contain p-1"
                          sizes="140px"
                          unoptimized={thumb.type === 'video' && !videoThumbnail}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white/50" />
                        </div>
                      )}
                      {/* Play badge for video thumbnail in strip */}
                      {thumb.type === 'video' && thumb.url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.section>
          {/* ══════════════════════════════════════════
              RIGHT — Project details (40%)
          ══════════════════════════════════════════ */}
          <motion.section
            className="w-full md:w-[40%] flex flex-col gap-8 mt-10 md:mt-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* ── Header ── */}
            <div className="space-y-3">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => (
                    <span key={idx} className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-[11px] font-bold tracking-widest uppercase">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground font-merriweather">
                {title}
              </h1>
              <p className="text-foreground text-base leading-relaxed max-w-md">
                {shortDescription}
              </p>
            </div>

            {/* ── Stats grid (Client / Duration / Team) ── */}
            {(clientName || projectDuration || teamSize) && (
              <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
              >
                {clientName && (
                  <div className="p-4 rounded-xl bg-[rgba(28,27,27,0.4)] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-foreground/70 flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> CLIENT
                    </p>
                    <p className="text-sm font-bold text-foreground leading-tight">{clientName}</p>
                  </div>
                )}
                {projectDuration && (
                  <div className="p-4 rounded-xl bg-[rgba(28,27,27,0.4)] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-foreground/70 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> DURATION
                    </p>
                    <p className="text-sm font-bold text-foreground leading-tight">{projectDuration}</p>
                  </div>
                )}
                {teamSize && (
                  <div className="p-4 rounded-xl bg-[rgba(28,27,27,0.4)] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-foreground/70 flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> TEAM
                    </p>
                    <p className="text-sm font-bold text-foreground leading-tight">{teamSize}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Tech Stack chips ── */}
            {techNames.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
              >
                <p className="text-[10px] font-bold tracking-widest uppercase text-foreground/70 mb-3">
                  TECHNOLOGIES
                </p>
                <div className="flex flex-wrap gap-2">
                  {techNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-background/80 border border-border text-foreground/80 hover:border-primary/50 transition-colors duration-200"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── CTA Buttons ── */}
            {(() => {
              // Build each button element
              const liveBtn = liveProjectUrl ? (
                <a
                  key="live"
                  href={liveProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-12 rounded-xl font-bold text-xs tracking-widest uppercase text-primary-foreground flex items-center justify-center gap-2 bg-primary-gradient hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 min-h-[44px]"
                >
                  LIVE WEBSITE
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null

              const iosBtn = iosProjectUrl ? (
                <a
                  key="ios"
                  href={iosProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-12 rounded-xl font-bold text-xs tracking-widest uppercase text-primary-foreground flex items-center justify-center gap-2 bg-primary-gradient hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 min-h-[44px]"
                >
                  iOS APP
                  <AppleIcon className="w-4 h-4" />
                </a>
              ) : null

              const androidBtn = androidProjectUrl ? (
                <a
                  key="android"
                  href={androidProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-12 rounded-xl font-bold text-xs tracking-widest uppercase text-primary-foreground flex items-center justify-center gap-2 bg-primary-gradient hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 min-h-[44px]"
                >
                  ANDROID APP
                  <AndroidIcon className="w-4 h-4" />
                </a>
              ) : null

              const videoBtn = hasVideo ? (
                <button
                  key="video"
                  onClick={handlePlayClick}
                  className="flex-1 h-12 rounded-xl font-bold text-xs tracking-widest uppercase text-primary-foreground flex items-center justify-center gap-2 bg-primary-gradient hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 min-h-[44px]"
                >
                  <Play className="w-3.5 h-3.5" />
                  VIEW DEMO
                </button>
              ) : null

              // Collect all active buttons in order
              const allBtns = [liveBtn, iosBtn, androidBtn, videoBtn].filter(Boolean)
              const btnCount = allBtns.length

              return (
                <motion.div
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.34 }}
                >
                  {btnCount === 4 ? (
                    // 4 buttons: 2×2 grid
                    <div className="grid grid-cols-2 gap-3">
                      {allBtns}
                    </div>
                  ) : btnCount === 3 ? (
                    // 3 buttons: live website full-width on top, other two side by side below
                    <>
                      <div className="flex">{liveBtn}</div>
                      <div className="flex gap-3">
                        {[iosBtn, androidBtn, videoBtn].filter(Boolean)}
                      </div>
                    </>
                  ) : btnCount === 2 ? (
                    // 2 buttons: side by side
                    <div className="flex gap-3">
                      {allBtns}
                    </div>
                  ) : (
                    // 1 button: full width
                    <div className="flex">
                      {allBtns}
                    </div>
                  )}
                </motion.div>
              )
            })()}

          </motion.section>
        </div>

        {/* ── Detailed Info ── */}
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Full Description */}
          {fullDescription && (
            <div className="border-t border-white/5 pt-8">
              <RichText
                data={fullDescription}
                enableGutter={false}
                enableProse={false}
                className="prose dark:prose-invert max-w-none text-foreground text-base leading-relaxed"
              />
            </div>
          )}

          {/* Grid for Key Features, Challenges, Solutions, Results */}
          {((keyFeatures && keyFeatures.length > 0) ||
            (challenges && challenges.length > 0) ||
            (solutions && solutions.length > 0) ||
            (results && results.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Key Features */}
              {keyFeatures && keyFeatures.length > 0 && (
                <div className="border-t border-white/5 pt-8 space-y-3">
                  <h3 className="text-base font-bold text-primary">Key Features</h3>
                  <ul className="space-y-2.5">
                    {keyFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#4cd7f6] mt-0.5 flex-shrink-0" />
                        {item.feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {challenges && challenges.length > 0 && (
                <div className="border-t border-white/5 pt-8 space-y-3">
                  <h3 className="text-base font-bold text-primary">Challenges Faced</h3>
                  <ul className="space-y-2.5">
                    {challenges.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#f64c72] mt-0.5 flex-shrink-0" />
                        {item.challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solutions */}
              {solutions && solutions.length > 0 && (
                <div className="border-t border-white/5 pt-8 space-y-3">
                  <h3 className="text-base font-bold text-primary">Solutions Implemented</h3>
                  <ul className="space-y-2.5">
                    {solutions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#4cf6b1] mt-0.5 flex-shrink-0" />
                        {item.solution}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Results */}
              {results && results.length > 0 && (
                <div className="border-t border-white/5 pt-8 space-y-3">
                  <h3 className="text-base font-bold text-primary">Results & Outcomes</h3>
                  <ul className="space-y-2.5">
                    {results.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#4cd7f6] mt-0.5 flex-shrink-0" />
                        {item.result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>


      </div>

      {/* ── YouTube Lightbox ── */}
      <AnimatePresence>
        {videoOpen && videoId && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseVideo}
          >
            <button
              onClick={handleCloseVideo}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all min-h-[44px] z-10"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Project Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


// ─── Block wrapper (for RenderBlocks) ────────────────────────────────────────
export const PortfolioDetail: React.FC<PortfolioDetailBlock> = ({ project }) => {
  if (!project || typeof project === 'string') return null
  return <PortfolioDetailComponent portfolio={project as Portfolio} />
}

'use client'

interface LogoImgProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function LogoImg({ src, alt, className, width, height }: LogoImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  )
}

'use client'

export function Year() {
  const year = new Date().getFullYear()
  return <>{year}</>
}

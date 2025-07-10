export default function Home() {
  return (
    <div className='min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-muted/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-700'></div>
        <div className='absolute top-1/2 left-1/2 w-48 h-48 bg-border/40 rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      {/* Floating particles */}
      <div className='absolute inset-0 overflow-hidden'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}></div>
        ))}
      </div>

      {/* Main content */}
      <div className='relative z-10 text-center px-6 max-w-4xl mx-auto'>
        {/* Logo/Icon */}
        <div className='mb-8 animate-bounce'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-card border border-border rounded-full shadow-2xl'>
            <svg
              className='w-10 h-10 text-foreground animate-spin'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
        </div>

        {/* Arabic text */}
        <h1 className='flex flex-col gap-1 lg:gap-4 text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-up font-tajawal'>
          <span>جاري العمل على تحديث الموقع</span>
          <span>سنعود قريباً</span>
        </h1>

        {/* English text */}
        <h2 className='text-lg md:text-2xl lg:text-3xl font-inter font-semibold text-muted-foreground pt-4 mb-8 animate-fade-in-up animation-delay-300'>
          We will be back soon!
        </h2>

        {/* Animated dots */}
        <div className='flex justify-center space-x-2 mb-8'>
          <div className='w-3 h-3 bg-primary rounded-full animate-bounce'></div>
          <div className='w-3 h-3 bg-accent rounded-full animate-bounce animation-delay-200'></div>
          <div className='w-3 h-3 bg-muted-foreground rounded-full animate-bounce animation-delay-400'></div>
        </div>
      </div>
    </div>
  )
}

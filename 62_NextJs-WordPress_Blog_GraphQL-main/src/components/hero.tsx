import Image from "next/image";

export function Hero(){
  return (
    <div className="mb-4">
      <h1 className="font-bold text-2xl mb-2">Hi, I am Raddy.</h1>
      <p className="mb-4">A freelance web developer and content creator. I make a wide variety of educational content with a primary focus on website development and design.</p>
      <Image src="/hero.webp" width={700} height={102} quality={70} placeholder="blur" blurDataURL="/hero-placeholder.png" loading="eager" alt="Freelance web dev..."/>
    </div>
  )
}
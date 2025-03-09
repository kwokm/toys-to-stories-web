import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center align-center justify-center">
      <Image
        className="mx-auto my-auto"
        src="/ToysToStoriesBanner.svg"
        alt="banner"
        width={1843}
        height={426}
      />
    </div>
  );
}

"use client";

import Image from "next/image";
import {useState} from "react";
import {FigmaIcon} from "@/components/figma-icon";
import type {ItineraryImage} from "@/features/itinerary/model";

const fallbackGalleryImages = [
  {src: "/images/figma/4353112e-ba38-4c14-9336-9799369efbd9.png", alt: "Elephants beneath acacia trees in Tarangire"},
  {src: "/images/figma/cd51dec0-9215-4d8f-988d-5d464ec8c982.png", alt: "Open northern Tanzania safari plains"},
  {src: "/images/figma/627866e6-a863-4800-8f42-0315205e17e2.png", alt: "Zebras on the Serengeti plains"},
  {src: "/images/figma/844cb356-1c6b-427b-a31b-586e7b78c6b6.png", alt: "Hippos resting beside the water"},
  {src: "/images/figma/27096cab-2e77-46b5-9b4f-1aa9fbe1012c.png", alt: "Leopard resting in a tree"},
  {src: "/images/figma/98118ae1-bb7c-432c-b7b1-433d27c59b13.png", alt: "Elephants crossing Tarangire National Park"},
  {src: "/images/figma/8a34ea1e-253b-41f7-8c0c-cac8586c40b4.png", alt: "Wildlife on the Serengeti grasslands"},
  {src: "/images/figma/27222719-4ba9-4724-a440-0fcb7923b931.png", alt: "Ngorongoro wildlife safari scene"},
];

export function TripOverviewGallery({images}: {images?: ItineraryImage[]}) {
  const galleryImages = images?.length ? images : fallbackGalleryImages;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex];

  function move(direction: number) {
    setActiveIndex(current => (current + direction + galleryImages.length) % galleryImages.length);
  }

  return <div className="overview-gallery" aria-label="Trip photo gallery">
    <div className="overview-gallery__main">
      <Image key={activeImage.src} src={activeImage.src} alt={activeImage.alt} fill unoptimized sizes="(max-width: 1180px) 100vw, 600px"/>
      <button type="button" className="overview-gallery__arrow overview-gallery__arrow--previous" aria-label="Previous trip photo" onClick={() => move(-1)}><FigmaIcon name="chevron-prev" width={22}/></button>
      <button type="button" className="overview-gallery__arrow overview-gallery__arrow--next" aria-label="Next trip photo" onClick={() => move(1)}><FigmaIcon name="chevron-next" width={22}/></button>
      <span className="overview-gallery__counter" aria-live="polite">{activeIndex + 1} / {galleryImages.length}</span>
      <div className="overview-gallery__dots" aria-hidden="true">{galleryImages.map((image, index) => <span className={index === activeIndex ? "is-active" : ""} key={image.src}/>)}</div>
    </div>
    <div className="overview-gallery__thumbs">
      {galleryImages.slice(0, 5).map((image, index) => <button type="button" className={index === activeIndex ? "is-active" : ""} aria-label={`Show photo ${index + 1}: ${image.alt}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} key={image.src}>
        <Image src={image.src} alt="" fill quality={90} sizes="120px"/>
        {index === 4 && <span>+4</span>}
      </button>)}
    </div>
  </div>;
}

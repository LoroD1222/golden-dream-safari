"use client";

import Image from "next/image";
import {useState} from "react";
import {guestPhotos, reviews, tripadvisorUrl} from "@/data/site";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";

const filters = ["All reviews", "Safaris", "Kilimanjaro", "With photos"];

export function ReviewsGrid() {
  const [active, setActive] = useState("All reviews");
  const [expanded, setExpanded] = useState(false);
  const filtered = reviews.filter(review => active === "All reviews" || active === "With photos" ? (active !== "With photos" || review.image) : active === "Kilimanjaro" ? /kili|machame/i.test(review.tag) : !/kili|machame/i.test(review.tag));
  const visible = expanded ? filtered : filtered.slice(0, 6);
  return <>
    <section className="review-filters section-shell" aria-label="Filter guest reviews">{filters.map(filter => <button className={active === filter ? "is-active" : ""} type="button" aria-pressed={active === filter} key={filter} onClick={() => {setActive(filter); setExpanded(false);}}>{filter}</button>)}</section>
    <section className="guest-photos section-shell"><h2>Photos from our guests</h2><div>{guestPhotos.map((photo,index) => <span className="guest-photo" key={photo}><Image src={photo} alt={`Golden Dream guest photo ${index+1}`} fill sizes="(max-width: 700px) 50vw, 17vw"/></span>)}</div></section>
    <section className="reviews-content section-shell"><div className="review-masonry">{visible.map(review => <article className={`review-card ${review.image ? "review-card--photo" : ""}`.trim()} key={`${review.author}-${review.title}`}>{review.image && <span className="review-card__image"><Image src={review.image} alt="Guest safari photo" fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"/></span>}<div className="review-card__body"><div className="review-card__top"><RatingStars compact/><small>{review.tag}</small></div><h2>{review.title}</h2><blockquote>“{review.quote}”</blockquote>{review.reply && <div className="victor-reply"><strong>Victor replied</strong><p>“{review.reply}”</p></div>}<div className="review-author"><span>{review.author.charAt(0).toUpperCase()}</span><div><strong>{review.author}</strong><small>{review.meta}</small></div></div><a href={tripadvisorUrl}>Find on Tripadvisor <FigmaIcon name="arrow-card" width={18}/></a></div></article>)}</div>{filtered.length > 6 && <button className="button button--outline show-more" type="button" onClick={() => setExpanded(value => !value)}>{expanded ? "Show fewer reviews" : "Show more reviews"}</button>}</section>
  </>;
}

"use client";

import Image from "next/image";
import {useState} from "react";
import {reviews, tripadvisorUrl} from "@/data/site";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";

const filters = ["All reviews", "Safaris", "Kilimanjaro", "With photos"];

export function ReviewsGrid() {
  const [active, setActive] = useState("All reviews");
  const [expanded, setExpanded] = useState(false);
  const filtered = reviews.filter(review => active === "All reviews" || active === "With photos" ? (active !== "With photos" || review.image) : active === "Kilimanjaro" ? /kili|machame/i.test(review.tag) : !/kili|machame/i.test(review.tag));
  const visible = expanded ? filtered : filtered.slice(0, 6);
  return <section className="reviews-content section-shell"><div className="review-filters">{filters.map(filter => <button className={active === filter ? "is-active" : ""} type="button" aria-pressed={active === filter} key={filter} onClick={() => {setActive(filter); setExpanded(false);}}>{filter}</button>)}</div><div className="review-masonry">{visible.map(review => <article className="review-card" key={`${review.author}-${review.title}`}>{review.image && <span className="review-card__image"><Image src={review.image} alt="Guest safari photo" fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"/></span>}<div className="review-card__top"><RatingStars compact/><small>{review.tag}</small></div><h2>{review.title}</h2><blockquote>“{review.quote}”</blockquote>{review.reply && <div className="victor-reply"><strong>Victor replied</strong><p>“{review.reply}”</p></div>}<div className="review-author"><span>{review.author.charAt(0).toUpperCase()}</span><div><strong>{review.author}</strong><small>{review.meta}</small></div></div><a href={tripadvisorUrl}>Find on Tripadvisor <FigmaIcon name="arrow-card" width={18}/></a></article>)}</div>{filtered.length > 6 && <button className="button button--outline show-more" type="button" onClick={() => setExpanded(value => !value)}>{expanded ? "Show fewer reviews" : "Show more reviews"}</button>}</section>;
}

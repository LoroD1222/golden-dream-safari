"use client";

import Image from "next/image";
import {useMemo, useState} from "react";
import type {Review, ReviewCategory} from "@/features/content/model";
import {FigmaIcon, RatingStars} from "@/components/figma-icon";

const allFilter = "all";
const photosFilter = "photos";

export function ReviewsGrid({reviews, categories, sourceUrl, sourceName}: {reviews: Review[]; categories: ReviewCategory[]; sourceUrl: string; sourceName: string}) {
  const [active, setActive] = useState(allFilter);
  const [expanded, setExpanded] = useState(false);
  const filtered = useMemo(() => reviews.filter(review => active === allFilter || active === photosFilter ? (active !== photosFilter || review.images.length > 0) : review.categoryIds.includes(active)), [active, reviews]);
  const photos = useMemo(() => {
    const seen = new Set<string>();
    return reviews.flatMap(review => review.images).filter(image => {
      if (seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    }).slice(0, 6);
  }, [reviews]);
  const visible = expanded ? filtered : filtered.slice(0, 6);

  function changeFilter(value: string) { setActive(value); setExpanded(false); }

  return <>
    <section className="review-filters section-shell" aria-label="Filter guest reviews">
      <button className={active === allFilter ? "is-active" : ""} type="button" aria-pressed={active === allFilter} onClick={() => changeFilter(allFilter)}>All reviews</button>
      {categories.map(category => <button className={active === category.id ? "is-active" : ""} type="button" aria-pressed={active === category.id} key={category.id} onClick={() => changeFilter(category.id)}>{category.name}</button>)}
      <button className={active === photosFilter ? "is-active" : ""} type="button" aria-pressed={active === photosFilter} onClick={() => changeFilter(photosFilter)}>With photos</button>
    </section>
    {photos.length > 0 && <section className="guest-photos section-shell"><h2>Photos from our guests</h2><div>{photos.map((photo,index) => <span className="guest-photo" key={photo.src}><Image src={photo.src} alt={photo.alt || `Golden Dream guest photo ${index+1}`} fill sizes="(max-width: 700px) 50vw, 17vw"/></span>)}</div></section>}
    <section className="reviews-content section-shell">
      <div className="review-masonry">{visible.map(review => {
        const image = review.images[0];
        return <article className={`review-card ${image ? "review-card--photo" : ""}`.trim()} key={review.id}>
          {image && <span className="review-card__image"><Image src={image.src} alt={image.alt || "Guest safari photo"} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"/></span>}
          <div className="review-card__body"><div className="review-card__top"><span aria-label={`${review.rating} out of 5 stars`}><RatingStars compact/></span><small>{review.meta}</small></div><h2>{review.title}</h2><blockquote>“{review.quote}”</blockquote>{review.reply && <div className="victor-reply"><strong>{review.replyAuthor || "Victor"} replied</strong><p>“{review.reply}”</p></div>}<div className="review-author"><span>{review.author.charAt(0).toUpperCase()}</span><div><strong>{review.author}</strong><small>{review.authorLocation || review.meta}</small></div></div><a href={review.sourceUrl || sourceUrl}>Find on {review.source || sourceName} <FigmaIcon name="arrow-card" width={18}/></a></div>
        </article>;
      })}</div>
      {visible.length === 0 && <p className="reviews-empty">No published reviews in this category yet.</p>}
      {filtered.length > 6 && <button className="button button--outline show-more" type="button" onClick={() => setExpanded(value => !value)}>{expanded ? "Show fewer reviews" : "Show more reviews"}</button>}
    </section>
  </>;
}

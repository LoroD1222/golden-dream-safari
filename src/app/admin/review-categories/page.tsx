import type {Metadata} from "next";
import {ReviewCategoryAdmin} from "@/features/content/admin/review-category-admin";
import {getReviewCategoryRepository} from "@/features/content/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "Review categories · Golden Dream CMS", robots: {index: false, follow: false}};

export default async function ReviewCategoriesAdminPage() {
  const items = await getReviewCategoryRepository().list();
  return <section className="cms-page">
    <header className="cms-page-header"><div><span>Website Content</span><h1>Review Categories</h1><p>Create as many review filters as the business needs. Published categories appear automatically on the reviews page.</p></div><small>{items.length} categor{items.length === 1 ? "y" : "ies"}</small></header>
    <ReviewCategoryAdmin initialItems={items}/>
  </section>;
}

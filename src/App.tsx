import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Analytics } from "@/components/Analytics";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import TestimonialForm from "@/pages/TestimonialForm";

const Admin = lazy(() => import("@/admin/AdminApp"));

export default function App() {
  return (
    <>
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plantillas/:slug" element={<Home />} />
        <Route path="/testimonio/:token" element={<TestimonialForm />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin/*" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

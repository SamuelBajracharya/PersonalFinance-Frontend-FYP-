import { notFound, redirect } from "next/navigation";

export default function CatchAll() {
  redirect("/404");
}

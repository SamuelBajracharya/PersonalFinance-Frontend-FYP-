import { redirect } from "next/navigation";

export default function CatchAllNotFoundRoute() {
    redirect("/404");
}

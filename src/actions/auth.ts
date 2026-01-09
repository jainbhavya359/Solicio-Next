"use server";

import { signIn, signOut } from "@/src/utils/auth";
import { redirect } from "next/navigation";

export async function googleSignInAction() {
  await signIn("google", {
    redirect: false, // prevent automatic redirect
  });

  redirect("/"); // redirect to homepage after success
}


export async function googleSignOutAction() {
  await signOut();
}

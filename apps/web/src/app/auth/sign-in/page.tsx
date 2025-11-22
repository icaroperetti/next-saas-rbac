import githubIcon from "@/assets/github-icon.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { signInWithEmailAndPassword } from "./actions";

export default function SignInPage(){


	return (
		<form action={signInWithEmailAndPassword} className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" type="email" id="email"/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="">Password</Label>
				<Input name="password" type="password" id="password"/>

				<Link href="/auth/forgot-password" className="text-xs font-medium text-foreground">Forgot Your Passowrd?</Link>
			</div>

			<Button type="submit" className="w-full">Sign in with e-mail</Button>

			<Button variant="link" className="w-full cursor-pointer" asChild>
				<Link href="/auth/sign-up">
					Create a new account
				</Link>
			</Button>
			<Separator/>

			<Button variant="outline" type="submit" className="w-full">
				<Image src={githubIcon} className="size-4 mr-2 dark:invert" alt=""/>
				Sign in with github
			</Button>
		</form>
	)
}

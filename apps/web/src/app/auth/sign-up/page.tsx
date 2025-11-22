import githubIcon from "@/assets/github-icon.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
export default function SignUpPage(){
	return (
		<form className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="nome">Nome</Label>
				<Input name="nome"  id="nome"/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" type="email" id="email"/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="password">Password</Label>
				<Input name="password" type="password" id="password"/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="password_confirmation">Confirm Password</Label>
				<Input name="password_confirmation" type="password" id="password_confirmation"/>
			</div>
			<Button type="submit" className="w-full">Create Account</Button>
			<Button variant="link" className="w-full cursor-pointer" asChild>
				<Link href="/auth/sign-in">
					Already registered? Sign In
				</Link>
			</Button>
			<Separator/>

			<Button variant="outline" size="sm" type="submit" className="w-full">
				<Image src={githubIcon} className="size-4 mr-2 dark:invert" alt=""/>
				Sign up with github
			</Button>
		</form>
	)
}

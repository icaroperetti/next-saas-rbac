import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
export default function ForgotPassword(){
	return (
		<form className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" type="email" id="email"/>
			</div>


			<Button type="submit" className="w-full">Recover password</Button>

			<Button variant="link" className="w-full cursor-pointer" asChild>
				<Link href="/auth/sign-in">
					Sign in
				</Link>
			</Button>

		</form>
	)
}

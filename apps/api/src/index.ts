import { defineAbilityFor } from "@saas/auth";

const ability = defineAbilityFor({role:'MEMBER'})


const userCanInviteSomeoneElse = ability.can('invite','User')
const userCanDeleteOtherUsar = ability.can('delete','User')
const userCannotDeleteUser = ability.cannot('delete','User')

console.log(userCanInviteSomeoneElse)
console.log(userCanDeleteOtherUsar)
console.log(userCannotDeleteUser)
